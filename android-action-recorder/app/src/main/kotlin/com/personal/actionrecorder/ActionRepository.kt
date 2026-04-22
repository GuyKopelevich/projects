package com.personal.actionrecorder

import com.personal.actionrecorder.model.ActionSequence
import com.personal.actionrecorder.model.RecordedAction
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow

object ActionRepository {

    enum class AppState {
        IDLE,
        RECORDING,
        REVIEW,
        READY_TO_REPLAY,
        REPLAYING
    }

    private val _state = MutableStateFlow(AppState.IDLE)
    val state: StateFlow<AppState> = _state

    private val _actions = mutableListOf<RecordedAction>()
    private var recordingStartTime = 0L

    var confirmedSequence: ActionSequence? = null
        private set

    fun startRecording() {
        _actions.clear()
        recordingStartTime = System.currentTimeMillis()
        _state.value = AppState.RECORDING
    }

    fun appendAction(action: RecordedAction) {
        if (_state.value == AppState.RECORDING) {
            _actions.add(action)
        }
    }

    fun stopRecording(): ActionSequence {
        val seq = ActionSequence(actions = _actions.toList())
        _state.value = AppState.REVIEW
        return seq
    }

    fun confirmSequence(sequence: ActionSequence) {
        confirmedSequence = sequence
        _state.value = AppState.READY_TO_REPLAY
    }

    fun beginReplay() {
        _state.value = AppState.REPLAYING
    }

    fun endReplay() {
        _state.value = AppState.READY_TO_REPLAY
    }

    fun reset() {
        _actions.clear()
        confirmedSequence = null
        _state.value = AppState.IDLE
    }

    fun timestampOffset(): Long = System.currentTimeMillis() - recordingStartTime
}
