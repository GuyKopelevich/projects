package com.personal.actionrecorder

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.fragment.app.Fragment
import com.google.android.material.button.MaterialButton

class PermissionsFragment : Fragment() {

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View = inflater.inflate(R.layout.fragment_permissions, container, false)

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        val activity = requireActivity() as MainActivity

        view.findViewById<MaterialButton>(R.id.btn_accessibility).setOnClickListener {
            activity.openAccessibilitySettings()
        }
        view.findViewById<MaterialButton>(R.id.btn_overlay).setOnClickListener {
            activity.openOverlaySettings()
        }
    }

    override fun onResume() {
        super.onResume()
        updatePermissionStatus()
    }

    private fun updatePermissionStatus() {
        val activity = requireActivity() as MainActivity
        val view = view ?: return

        val accessStatus = view.findViewById<TextView>(R.id.accessibility_status)
        val overlayStatus = view.findViewById<TextView>(R.id.overlay_status)

        if (activity.isAccessibilityServiceEnabled()) {
            accessStatus.text = getString(R.string.granted)
            accessStatus.setTextColor(resources.getColor(R.color.replay_green, null))
        } else {
            accessStatus.text = getString(R.string.not_granted)
            accessStatus.setTextColor(resources.getColor(R.color.recording_red, null))
        }

        if (activity.hasOverlayPermission()) {
            overlayStatus.text = getString(R.string.granted)
            overlayStatus.setTextColor(resources.getColor(R.color.replay_green, null))
        } else {
            overlayStatus.text = getString(R.string.not_granted)
            overlayStatus.setTextColor(resources.getColor(R.color.recording_red, null))
        }
    }
}
