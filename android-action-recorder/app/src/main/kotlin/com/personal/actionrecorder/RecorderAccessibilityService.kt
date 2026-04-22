package com.personal.actionrecorder

import android.accessibilityservice.AccessibilityService
import android.accessibilityservice.GestureDescription
import android.graphics.Path
import android.graphics.Rect
import android.os.Bundle
import android.view.accessibility.AccessibilityEvent
import android.view.accessibility.AccessibilityNodeInfo
import com.personal.actionrecorder.model.ActionSequence
import com.personal.actionrecorder.model.ActionType
import com.personal.actionrecorder.model.RecordedAction
import kotlinx.coroutines.*
import kotlin.coroutines.resume
import kotlin.coroutines.suspendCoroutine

class RecorderAccessibilityService : AccessibilityService() {

    companion object {
        var instance: RecorderAccessibilityService? = null
            private set

        private const val DELAY_THRESHOLD_MS = 300L
        private const val TEXT_DEBOUNCE_MS = 200L
    }

    private val serviceScope = CoroutineScope(Dispatchers.Main + SupervisorJob())
    private var lastEventTimestamp = 0L
    private val textDebounceJobs = mutableMapOf<String, Job>()

    override fun onServiceConnected() {
        instance = this
    }

    override fun onDestroy() {
        instance = null
        serviceScope.cancel()
        super.onDestroy()
    }

    override fun onAccessibilityEvent(event: AccessibilityEvent) {
        if (ActionRepository.state.value != ActionRepository.AppState.RECORDING) return

        val offset = ActionRepository.timestampOffset()

        // Insert DELAY action for long pauses between interactions
        if (lastEventTimestamp > 0) {
            val gap = offset - lastEventTimestamp
            if (gap > DELAY_THRESHOLD_MS) {
                ActionRepository.appendAction(
                    RecordedAction(
                        type = ActionType.DELAY,
                        timestampOffset = lastEventTimestamp,
                        duration = gap
                    )
                )
            }
        }
        lastEventTimestamp = offset

        when (event.eventType) {
            AccessibilityEvent.TYPE_VIEW_CLICKED -> {
                val source = event.source ?: return
                val bounds = Rect()
                source.getBoundsInScreen(bounds)
                val cx = bounds.exactCenterX()
                val cy = bounds.exactCenterY()
                source.recycle()

                ActionRepository.appendAction(
                    RecordedAction(
                        type = ActionType.TAP,
                        timestampOffset = offset,
                        x = cx,
                        y = cy,
                        duration = 50L
                    )
                )
            }

            AccessibilityEvent.TYPE_VIEW_SCROLLED -> {
                val source = event.source ?: return
                val bounds = Rect()
                source.getBoundsInScreen(bounds)
                val cx = bounds.exactCenterX()
                val cy = bounds.exactCenterY()
                source.recycle()

                // Heuristic: scroll down → finger moves up, so endY is above startY
                ActionRepository.appendAction(
                    RecordedAction(
                        type = ActionType.SCROLL,
                        timestampOffset = offset,
                        x = cx,
                        y = cy,
                        endX = cx,
                        endY = cy - 400f,
                        duration = 300L
                    )
                )
            }

            AccessibilityEvent.TYPE_VIEW_TEXT_CHANGED -> {
                val text = event.text.joinToString("")
                if (text.isBlank()) return

                val nodeId = event.source?.viewIdResourceName ?: "unknown"
                textDebounceJobs[nodeId]?.cancel()
                textDebounceJobs[nodeId] = serviceScope.launch {
                    delay(TEXT_DEBOUNCE_MS)
                    ActionRepository.appendAction(
                        RecordedAction(
                            type = ActionType.TYPE_TEXT,
                            timestampOffset = offset,
                            text = text
                        )
                    )
                }
            }

            else -> {}
        }
    }

    override fun onInterrupt() {}

    fun replaySequence(sequence: ActionSequence) {
        serviceScope.launch {
            ActionRepository.beginReplay()
            val actions = sequence.actions

            for (i in actions.indices) {
                val action = actions[i]

                if (i > 0) {
                    val gap = action.timestampOffset - actions[i - 1].timestampOffset
                    if (gap > 0) delay(gap)
                }

                dispatchAction(action)
            }

            ActionRepository.endReplay()
        }
    }

    private suspend fun dispatchAction(action: RecordedAction) {
        when (action.type) {
            ActionType.TAP -> dispatchTap(action.x, action.y, action.duration)
            ActionType.LONG_PRESS -> dispatchTap(action.x, action.y, 600L)
            ActionType.SWIPE -> dispatchSwipe(action.x, action.y, action.endX, action.endY, action.duration)
            ActionType.SCROLL -> dispatchSwipe(action.x, action.y, action.endX, action.endY, action.duration)
            ActionType.TYPE_TEXT -> dispatchTextInput(action.text)
            ActionType.DELAY -> delay(action.duration)
        }
    }

    private suspend fun dispatchTap(x: Float, y: Float, duration: Long) {
        val path = Path().apply { moveTo(x, y) }
        val stroke = GestureDescription.StrokeDescription(path, 0L, duration)
        val gesture = GestureDescription.Builder().addStroke(stroke).build()
        dispatchGestureAndWait(gesture)
    }

    private suspend fun dispatchSwipe(
        startX: Float, startY: Float,
        endX: Float, endY: Float,
        duration: Long
    ) {
        val path = Path().apply {
            moveTo(startX, startY)
            lineTo(endX, endY)
        }
        val stroke = GestureDescription.StrokeDescription(path, 0L, duration)
        val gesture = GestureDescription.Builder().addStroke(stroke).build()
        dispatchGestureAndWait(gesture)
    }

    private fun dispatchTextInput(text: String) {
        val focused = findFocus(AccessibilityNodeInfo.FOCUS_INPUT) ?: return
        val args = Bundle().apply {
            putCharSequence(
                AccessibilityNodeInfo.ACTION_ARGUMENT_SET_TEXT_CHARSEQUENCE,
                text
            )
        }
        focused.performAction(AccessibilityNodeInfo.ACTION_SET_TEXT, args)
        focused.recycle()
    }

    private suspend fun dispatchGestureAndWait(gesture: GestureDescription) {
        suspendCoroutine { cont ->
            val dispatched = dispatchGesture(gesture, object : GestureResultCallback() {
                override fun onCompleted(gestureDescription: GestureDescription) {
                    cont.resume(Unit)
                }
                override fun onCancelled(gestureDescription: GestureDescription) {
                    cont.resume(Unit)
                }
            }, null)

            if (!dispatched) cont.resume(Unit)
        }
    }
}
