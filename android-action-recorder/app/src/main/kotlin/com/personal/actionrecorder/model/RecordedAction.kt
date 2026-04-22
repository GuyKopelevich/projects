package com.personal.actionrecorder.model

enum class ActionType {
    TAP,
    LONG_PRESS,
    SWIPE,
    SCROLL,
    TYPE_TEXT,
    DELAY
}

data class RecordedAction(
    val type: ActionType,
    val timestampOffset: Long,
    val x: Float = 0f,
    val y: Float = 0f,
    val endX: Float = 0f,
    val endY: Float = 0f,
    val duration: Long = 50L,
    val text: String = "",
    val scrollAxis: Int = 0
)
