package com.personal.actionrecorder

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.Intent
import android.graphics.PixelFormat
import android.os.IBinder
import android.view.*
import android.widget.ImageButton
import android.widget.ProgressBar
import android.widget.Toast
import androidx.core.app.NotificationCompat
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.collectLatest

class FloatingButtonService : Service() {

    companion object {
        const val CHANNEL_ID = "floating_button_channel"
        const val NOTIFICATION_ID = 1001
        const val ACTION_DISMISS = "com.personal.actionrecorder.DISMISS_FLOATING"
    }

    private lateinit var windowManager: WindowManager
    private lateinit var floatingView: View
    private val serviceScope = CoroutineScope(Dispatchers.Main + SupervisorJob())

    private var initialX = 0
    private var initialY = 0
    private var initialTouchX = 0f
    private var initialTouchY = 0f
    private var isDragging = false

    override fun onCreate() {
        super.onCreate()
        createNotificationChannel()
        startForeground(NOTIFICATION_ID, buildNotification())
        setupOverlayView()
        observeAppState()
        startHealthCheck()
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        if (intent?.action == ACTION_DISMISS) stopSelf()
        return START_STICKY
    }

    override fun onDestroy() {
        serviceScope.cancel()
        if (::floatingView.isInitialized) {
            try { windowManager.removeView(floatingView) } catch (_: Exception) {}
        }
        ActionRepository.reset()
        super.onDestroy()
    }

    override fun onBind(intent: Intent?): IBinder? = null

    private fun setupOverlayView() {
        windowManager = getSystemService(WINDOW_SERVICE) as WindowManager

        floatingView = LayoutInflater.from(this).inflate(R.layout.overlay_floating_button, null)

        val params = WindowManager.LayoutParams(
            WindowManager.LayoutParams.WRAP_CONTENT,
            WindowManager.LayoutParams.WRAP_CONTENT,
            WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE,
            PixelFormat.TRANSLUCENT
        ).apply {
            gravity = Gravity.TOP or Gravity.START
            x = 50
            y = 300
        }

        try {
            windowManager.addView(floatingView, params)
        } catch (e: WindowManager.BadTokenException) {
            Toast.makeText(this, "Cannot show overlay — grant 'Appear on top' in Settings", Toast.LENGTH_LONG).show()
            stopSelf()
            return
        }

        setupTouchHandler(params)
    }

    private fun setupTouchHandler(params: WindowManager.LayoutParams) {
        floatingView.setOnTouchListener { _, event ->
            when (event.action) {
                MotionEvent.ACTION_DOWN -> {
                    initialX = params.x
                    initialY = params.y
                    initialTouchX = event.rawX
                    initialTouchY = event.rawY
                    isDragging = false
                    true
                }
                MotionEvent.ACTION_MOVE -> {
                    val dx = event.rawX - initialTouchX
                    val dy = event.rawY - initialTouchY
                    if (dx * dx + dy * dy > 100) {
                        isDragging = true
                        params.x = initialX + dx.toInt()
                        params.y = initialY + dy.toInt()
                        windowManager.updateViewLayout(floatingView, params)
                    }
                    true
                }
                MotionEvent.ACTION_UP -> {
                    if (!isDragging) triggerReplay()
                    isDragging = false
                    true
                }
                else -> false
            }
        }

        floatingView.setOnLongClickListener {
            stopSelf()
            true
        }
    }

    private fun observeAppState() {
        serviceScope.launch {
            ActionRepository.state.collectLatest { state ->
                if (!::floatingView.isInitialized) return@collectLatest
                val spinner = floatingView.findViewById<ProgressBar>(R.id.replay_progress)
                val btn = floatingView.findViewById<ImageButton>(R.id.fab_button)
                when (state) {
                    ActionRepository.AppState.REPLAYING -> {
                        btn.isEnabled = false
                        spinner.visibility = View.VISIBLE
                        btn.visibility = View.GONE
                    }
                    ActionRepository.AppState.READY_TO_REPLAY -> {
                        btn.isEnabled = true
                        btn.visibility = View.VISIBLE
                        spinner.visibility = View.GONE
                    }
                    ActionRepository.AppState.IDLE -> stopSelf()
                    else -> {}
                }
            }
        }
    }

    private fun startHealthCheck() {
        serviceScope.launch {
            while (isActive) {
                delay(3000)
                if (RecorderAccessibilityService.instance == null &&
                    ActionRepository.state.value == ActionRepository.AppState.READY_TO_REPLAY
                ) {
                    Toast.makeText(
                        this@FloatingButtonService,
                        getString(R.string.service_disconnected),
                        Toast.LENGTH_SHORT
                    ).show()
                }
            }
        }
    }

    private fun triggerReplay() {
        val state = ActionRepository.state.value
        if (state != ActionRepository.AppState.READY_TO_REPLAY) return

        val sequence = ActionRepository.confirmedSequence ?: return

        when (val result = ActionReplayer.requestReplay(sequence)) {
            is ActionReplayer.ReplayResult.Started -> {}
            is ActionReplayer.ReplayResult.Error -> {
                Toast.makeText(this, result.reason, Toast.LENGTH_LONG).show()
            }
        }
    }

    private fun createNotificationChannel() {
        val channel = NotificationChannel(
            CHANNEL_ID,
            "Action Recorder",
            NotificationManager.IMPORTANCE_LOW
        )
        getSystemService(NotificationManager::class.java).createNotificationChannel(channel)
    }

    private fun buildNotification(): Notification =
        NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("Action Recorder")
            .setContentText("Floating button active — tap to replay, long-press to dismiss")
            .setSmallIcon(android.R.drawable.ic_media_play)
            .setOngoing(true)
            .build()
}
