package com.personal.actionrecorder.model

data class ActionSequence(
    val actions: List<RecordedAction>,
    val recordedAt: Long = System.currentTimeMillis(),
    val durationMs: Long = if (actions.size < 2) 0L
                           else actions.last().timestampOffset - actions.first().timestampOffset
) {
    val isEmpty get() = actions.isEmpty()
    val size get() = actions.size

    fun summary(): Map<String, Int> = actions
        .groupBy { it.type.name }
        .mapValues { it.value.size }
}
