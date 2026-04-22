package com.personal.actionrecorder

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.fragment.app.Fragment
import com.google.android.material.button.MaterialButton
import java.util.concurrent.TimeUnit

class ReviewFragment : Fragment() {

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View = inflater.inflate(R.layout.fragment_review, container, false)

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        val activity = requireActivity() as MainActivity
        val sequence = activity.getPendingSequence()

        val countLabel = view.findViewById<TextView>(R.id.action_count_label)
        val durationLabel = view.findViewById<TextView>(R.id.duration_label)
        val summaryLabel = view.findViewById<TextView>(R.id.summary_label)
        val btnConfirm = view.findViewById<MaterialButton>(R.id.btn_confirm)
        val btnDiscard = view.findViewById<MaterialButton>(R.id.btn_discard)

        if (sequence != null) {
            countLabel.text = getString(R.string.actions_recorded, sequence.size)
            val seconds = TimeUnit.MILLISECONDS.toSeconds(sequence.durationMs)
            durationLabel.text = getString(R.string.duration_label, "${seconds}s")
            summaryLabel.text = sequence.summary()
                .entries
                .joinToString("\n") { "• ${it.key}: ${it.value}" }
        } else {
            countLabel.text = getString(R.string.no_actions)
        }

        btnConfirm.setOnClickListener { activity.confirmSequence() }
        btnDiscard.setOnClickListener { activity.discardSequence() }
    }
}
