package com.personal.actionrecorder

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.view.animation.AlphaAnimation
import android.view.animation.Animation
import androidx.fragment.app.Fragment
import com.google.android.material.button.MaterialButton

class MainControlsFragment : Fragment() {

    private var recordingDot: View? = null
    private var statusLabel: android.widget.TextView? = null
    private var btnRecord: MaterialButton? = null
    private var btnStop: MaterialButton? = null
    private var pulseAnim: Animation? = null

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View = inflater.inflate(R.layout.fragment_main_controls, container, false)

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        recordingDot = view.findViewById(R.id.recording_dot)
        statusLabel = view.findViewById(R.id.status_label)
        btnRecord = view.findViewById(R.id.btn_record)
        btnStop = view.findViewById(R.id.btn_stop)

        pulseAnim = AlphaAnimation(1f, 0.2f).apply {
            duration = 600
            repeatMode = Animation.REVERSE
            repeatCount = Animation.INFINITE
        }

        btnRecord?.setOnClickListener {
            (requireActivity() as MainActivity).startRecording()
        }

        btnStop?.setOnClickListener {
            showIdleState()
            (requireActivity() as MainActivity).stopRecording()
        }

        // Restore recording state if app was backgrounded during recording
        if (ActionRepository.state.value == ActionRepository.AppState.RECORDING) {
            showRecordingState()
        }
    }

    fun showRecordingState() {
        statusLabel?.text = getString(R.string.status_recording)
        btnRecord?.visibility = View.GONE
        btnStop?.visibility = View.VISIBLE
        recordingDot?.visibility = View.VISIBLE
        recordingDot?.startAnimation(pulseAnim)
    }

    private fun showIdleState() {
        statusLabel?.text = getString(R.string.status_idle)
        btnRecord?.visibility = View.VISIBLE
        btnStop?.visibility = View.GONE
        recordingDot?.visibility = View.GONE
        recordingDot?.clearAnimation()
    }

    override fun onDestroyView() {
        recordingDot?.clearAnimation()
        super.onDestroyView()
    }
}
