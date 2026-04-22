package com.personal.actionrecorder

import com.personal.actionrecorder.model.ActionSequence

object ActionReplayer {

    sealed class ReplayResult {
        object Started : ReplayResult()
        data class Error(val reason: String) : ReplayResult()
    }

    fun requestReplay(sequence: ActionSequence): ReplayResult {
        if (sequence.isEmpty) return ReplayResult.Error("No actions recorded")

        val service = RecorderAccessibilityService.instance
            ?: return ReplayResult.Error(
                "Accessibility service not connected. Enable it in Settings → Accessibility."
            )

        if (ActionRepository.state.value == ActionRepository.AppState.REPLAYING) {
            return ReplayResult.Error("Replay already in progress")
        }

        service.replaySequence(sequence)
        return ReplayResult.Started
    }
}
