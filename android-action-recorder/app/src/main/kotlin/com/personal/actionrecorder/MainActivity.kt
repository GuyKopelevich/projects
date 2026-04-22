package com.personal.actionrecorder

import android.accessibilityservice.AccessibilityServiceInfo
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.provider.Settings
import android.view.accessibility.AccessibilityManager
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.fragment.app.Fragment
import androidx.lifecycle.lifecycleScope
import com.personal.actionrecorder.databinding.ActivityMainBinding
import com.personal.actionrecorder.model.ActionSequence
import kotlinx.coroutines.flow.collectLatest
import kotlinx.coroutines.launch

class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding
    private var pendingSequence: ActionSequence? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)
        setSupportActionBar(binding.toolbar)

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            requestPermissions(arrayOf(android.Manifest.permission.POST_NOTIFICATIONS), 100)
        }

        observeState()
        showAppropriateFragment()
    }

    override fun onResume() {
        super.onResume()
        showAppropriateFragment()
    }

    private fun observeState() {
        lifecycleScope.launch {
            ActionRepository.state.collectLatest { state ->
                when (state) {
                    ActionRepository.AppState.RECORDING -> {
                        val current = supportFragmentManager.findFragmentById(R.id.fragment_container)
                        if (current is MainControlsFragment) current.showRecordingState()
                    }
                    ActionRepository.AppState.REVIEW -> showFragment(ReviewFragment())
                    ActionRepository.AppState.READY_TO_REPLAY -> moveTaskToBack(true)
                    else -> {}
                }
            }
        }
    }

    private fun showAppropriateFragment() {
        if (!isAccessibilityServiceEnabled() || !hasOverlayPermission()) {
            showFragment(PermissionsFragment())
        } else {
            if (ActionRepository.state.value == ActionRepository.AppState.IDLE ||
                ActionRepository.state.value == ActionRepository.AppState.RECORDING
            ) {
                showFragment(MainControlsFragment())
            }
        }
    }

    private fun showFragment(fragment: Fragment) {
        val current = supportFragmentManager.findFragmentById(R.id.fragment_container)
        if (current?.javaClass == fragment.javaClass) return
        supportFragmentManager.beginTransaction()
            .replace(R.id.fragment_container, fragment)
            .commit()
    }

    fun isAccessibilityServiceEnabled(): Boolean {
        val am = getSystemService(ACCESSIBILITY_SERVICE) as AccessibilityManager
        return am.getEnabledAccessibilityServiceList(AccessibilityServiceInfo.FEEDBACK_ALL_MASK)
            .any { it.resolveInfo.serviceInfo.packageName == packageName }
    }

    fun hasOverlayPermission(): Boolean = Settings.canDrawOverlays(this)

    fun openAccessibilitySettings() {
        startActivity(Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS))
    }

    fun openOverlaySettings() {
        startActivity(
            Intent(
                Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                Uri.parse("package:$packageName")
            )
        )
    }

    fun startRecording() {
        if (!isAccessibilityServiceEnabled()) {
            Toast.makeText(this, "Enable the Accessibility Service first", Toast.LENGTH_LONG).show()
            return
        }
        ActionRepository.startRecording()
        moveTaskToBack(true)
    }

    fun stopRecording() {
        pendingSequence = ActionRepository.stopRecording()
    }

    fun confirmSequence() {
        val seq = pendingSequence
        if (seq == null || seq.isEmpty) {
            Toast.makeText(this, getString(R.string.no_actions), Toast.LENGTH_LONG).show()
            ActionRepository.reset()
            showFragment(MainControlsFragment())
            return
        }
        ActionRepository.confirmSequence(seq)
        startService(Intent(this, FloatingButtonService::class.java))
    }

    fun discardSequence() {
        stopService(Intent(this, FloatingButtonService::class.java))
        ActionRepository.reset()
        pendingSequence = null
        showFragment(MainControlsFragment())
    }

    fun getPendingSequence(): ActionSequence? = pendingSequence
}
