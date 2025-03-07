package expo.modules.betterhaptics

import android.content.Context
import android.os.Build
import android.os.VibrationEffect
import android.os.Vibrator
import android.os.VibratorManager
import android.util.Log
import android.view.HapticFeedbackConstants
import android.view.View
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.lang.Math.max
import java.lang.Math.min

class ExpoBetterHapticsModule : Module() {
  // Reference to the Android Vibrator service
  private var vibrator: Vibrator? = null
  private var dummyView: View? = null

  // Constants for haptic event types (matching iOS implementation)
  private val HAPTIC_EVENT_TYPE_TRANSIENT = 0
  private val HAPTIC_EVENT_TYPE_CONTINUOUS = 1

  // Constants for haptic parameter types (matching iOS implementation)
  private val HAPTIC_PARAMETER_INTENSITY = 0
  private val HAPTIC_PARAMETER_SHARPNESS = 1
  private val HAPTIC_PARAMETER_ATTACK_TIME = 2
  private val HAPTIC_PARAMETER_DECAY_TIME = 3
  private val HAPTIC_PARAMETER_RELEASE_TIME = 4
  private val HAPTIC_PARAMETER_SUSTAINED = 5

  // Constants for dynamic parameter IDs (matching iOS implementation)
  private val DYNAMIC_PARAMETER_INTENSITY = 0
  private val DYNAMIC_PARAMETER_SHARPNESS = 1

  // Each module class must implement the definition function. The definition consists of components
  // that describes the module's functionality and behavior.
  // See https://docs.expo.dev/modules/module-api for more details about available components.
  override fun definition() = ModuleDefinition {
    // Sets the name of the module that JavaScript code will use to refer to the module. Takes a string as an argument.
    // Can be inferred from module's class name, but it's recommended to set it explicitly for clarity.
    // The module will be accessible from `requireNativeModule('ExpoBetterHaptics')` in JavaScript.
    Name("ExpoBetterHaptics")

    // Sets constant properties on the module. Can take a dictionary or a closure that returns a dictionary.
    Constants {
      mapOf(
        "isSupported" to isHapticsSupported(),
        "HapticEventTypes" to mapOf(
          "transient" to HAPTIC_EVENT_TYPE_TRANSIENT,
          "continuous" to HAPTIC_EVENT_TYPE_CONTINUOUS
        ),
        "HapticEventParameters" to mapOf(
          "intensity" to HAPTIC_PARAMETER_INTENSITY,
          "sharpness" to HAPTIC_PARAMETER_SHARPNESS,
          "attackTime" to HAPTIC_PARAMETER_ATTACK_TIME,
          "decayTime" to HAPTIC_PARAMETER_DECAY_TIME,
          "releaseTime" to HAPTIC_PARAMETER_RELEASE_TIME,
          "sustained" to HAPTIC_PARAMETER_SUSTAINED
        ),
        "DynamicParameterIDs" to mapOf(
          "intensity" to DYNAMIC_PARAMETER_INTENSITY,
          "sharpness" to DYNAMIC_PARAMETER_SHARPNESS
        )
      )
    }

    // Defines event names that the module can send to JavaScript.
    Events("onChange")

    // Defines a JavaScript synchronous function that runs the native code on the JavaScript thread.
    Function("hello") {
      "Hello world! 👋"
    }

    // Defines a JavaScript function that always returns a Promise and whose native code
    // is by default dispatched on the different thread than the JavaScript runtime runs on.
    AsyncFunction("setValueAsync") { value: String ->
      // Send an event to JavaScript.
      sendEvent("onChange", mapOf(
        "value" to value
      ))
    }

    // Initialize the haptic engine
    AsyncFunction("initialize") {
      initializeVibrator()
      true
    }

    // Start the haptic engine
    AsyncFunction("start") {
      // In Android, the vibrator service is always ready, so we just return true
      true
    }

    // Stop the haptic engine
    AsyncFunction("stop") {
      // Cancel any ongoing vibrations
      vibrator?.cancel()
      true
    }

    // Impact haptics
    AsyncFunction("impactLight") {
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
        vibrateWithPrimitive(VibrationEffect.Composition.PRIMITIVE_LOW_TICK, 0.8f)
      } else {
        vibrateOneShot(30, 0.3f)
      }
      true
    }

    AsyncFunction("impactMedium") {
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
        vibrateWithPrimitive(VibrationEffect.Composition.PRIMITIVE_TICK)
      } else {
        vibrateOneShot(40, 0.5f)
      }
      true
    }

    AsyncFunction("impactHeavy") {
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
        vibrateWithPrimitive(VibrationEffect.Composition.PRIMITIVE_CLICK)
      } else {
        vibrateOneShot(60, 1.0f)
      }
      true
    }

    AsyncFunction("impactSoft") {
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
        vibrateWithPrimitive(VibrationEffect.Composition.PRIMITIVE_LOW_TICK)
      } else {
        vibrateOneShot(30, 0.3f)
      }
      true
    }

    AsyncFunction("impactRigid") {
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
        vibrateWithPrimitive(VibrationEffect.Composition.PRIMITIVE_CLICK)
      } else {
        vibrateOneShot(50, 0.8f)
      }
      true
    }

    // Notification haptics
    AsyncFunction("notificationSuccess") {
      // Based on iOS UINotificationFeedbackGenerator.success pattern:
      // - 2 distinct pulses
      // - First pulse strong (~0.75), second even stronger (~0.95)
      // - Short precise gap between pulses (~80ms)
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
        // Use primitive effect for better haptic feel that matches iOS experience
        val effect = VibrationEffect.startComposition()
          .addPrimitive(VibrationEffect.Composition.PRIMITIVE_CLICK, 0.75f)
          .addPrimitive(VibrationEffect.Composition.PRIMITIVE_CLICK, 0.95f, 150)
          .compose()
        vibrator?.vibrate(effect)
      } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
        // For Android Q, use precise waveform to match iOS pattern
        // First pulse 10ms, gap 150ms, second pulse 10ms
        val timings = longArrayOf(0, 10, 150, 10)
        // First pulse at 190, second pulse at max 255
        val amplitudes = intArrayOf(0, 190, 0, 255)
        vibrateWaveform(timings, amplitudes, -1)
      } else {
        performHapticFeedback(HapticFeedbackConstants.CONTEXT_CLICK)
      }
      true
    }

    AsyncFunction("notificationWarning") {
      // Based on iOS UINotificationFeedbackGenerator.warning pattern:
      // - 2 distinct pulses, opposite of success haptics with a bigger delay
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
        val effect = VibrationEffect.startComposition()
          .addPrimitive(VibrationEffect.Composition.PRIMITIVE_CLICK, 0.95f)
          // Add 200ms delay between pulses - matching iOS timing
          .addPrimitive(VibrationEffect.Composition.PRIMITIVE_CLICK, 0.75f, 200)
          .compose()
        vibrator?.vibrate(effect)
      } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
        // For Android Q, use precise waveform to match iOS pattern
        val timings = longArrayOf(0, 10, 200, 10)
        val amplitudes = intArrayOf(0, 215, 0, 215)
        vibrateWaveform(timings, amplitudes, -1)
      } else {
        vibrateOneShot(250, 1.0f)
      }
      true
    }

    AsyncFunction("notificationError") {
      // Based on iOS UINotificationFeedbackGenerator.error pattern:
      // - 4 strong pulses as shown in the image
      // - Very strong intensity (max) for all pulses
      // - Precise timing matching iOS pattern
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
        // Use primitive effect with matching pattern to iOS
        val effect = VibrationEffect.startComposition()
          .addPrimitive(VibrationEffect.Composition.PRIMITIVE_CLICK, 0.85f)
          .addPrimitive(VibrationEffect.Composition.PRIMITIVE_CLICK, 0.85f, 100)
          .addPrimitive(VibrationEffect.Composition.PRIMITIVE_CLICK, 1.0f, 100)
          .addPrimitive(VibrationEffect.Composition.PRIMITIVE_CLICK, 0.75f, 100)
          .compose()
        vibrator?.vibrate(effect)
      } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
        val timings = longArrayOf(0, 10, 100, 10, 100, 10, 100, 15)
        val amplitudes = intArrayOf(0, 216, 0, 216, 0, 255, 0, 191)
        vibrateWaveform(timings, amplitudes, -1)
      } else {
        // For older devices, at least get a strong vibration
        vibrateOneShot(400, 1.0f)
      }
      true
    }

    // Selection haptic
    AsyncFunction("selection") {
      // Use a more noticeable haptic effect for selection
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
        // On Android 11+, use a primitive that's more noticeable than keyboard tap
        vibrateWithPrimitive(VibrationEffect.Composition.PRIMITIVE_TICK, 0.5f)
      } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
        // On Android 8-10, use a short vibration with medium amplitude
        vibrateOneShot(20, 0.5f)
      } else {
        // For older versions, use the haptic feedback constant
        performHapticFeedback(HapticFeedbackConstants.VIRTUAL_KEY)
      }
      true
    }

    // Transient haptic effect
    AsyncFunction("playTransient") { intensity: Double, sharpness: Double ->
      val intIntensity = (intensity * 255).toInt().coerceIn(1, 255)
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
        // Use primitive effects if available
        val primitive = when {
          sharpness > 0.7 -> VibrationEffect.Composition.PRIMITIVE_CLICK
          sharpness > 0.4 -> VibrationEffect.Composition.PRIMITIVE_TICK
          else -> VibrationEffect.Composition.PRIMITIVE_LOW_TICK
        }
        vibrateWithPrimitive(primitive, intensity.toFloat())
      } else {
        vibrateOneShot(50, intensity.toFloat())
      }
      true
    }

    // Continuous haptic effect
    AsyncFunction("playContinuous") { intensity: Double, sharpness: Double, duration: Double ->
      // First cancel any ongoing vibration
      vibrator?.cancel()
      
      // Duration is in seconds, convert to milliseconds, with minimum of 1ms
      val durationMs = (duration * 1000).toLong().coerceAtLeast(1)
      val amplitudeInt = (intensity * 255).toInt().coerceIn(1, 255)
      
      Log.d("ExpoBetterHaptics", "playContinuous: duration=$duration, durationMs=$durationMs, intensity=$intensity, amplitude=$amplitudeInt")
      
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
        // On Android 8+, we can use amplitude control
        if (durationMs <= 0) {
          return@AsyncFunction true // No vibration for zero duration
        }
        
        try {
          // For continuous effects, try to create a more persistent and noticeable vibration
          // On newer Android versions like Android 11+, can use a more forceful approach when possible
          if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R && durationMs > 100) {
            // Create a pulsing waveform for more forceful feedback
            val timings = longArrayOf(0, durationMs)
            val amplitudes = intArrayOf(0, amplitudeInt)
            val effect = VibrationEffect.createWaveform(timings, amplitudes, -1)
            vibrator?.vibrate(effect)
          } else {
            // Use one-shot for shorter duration or older devices
            val effect = VibrationEffect.createOneShot(durationMs, amplitudeInt)
            vibrator?.vibrate(effect)
          }
          Log.d("ExpoBetterHaptics", "Vibration started with duration=$durationMs ms")
        } catch (e: Exception) {
          Log.e("ExpoBetterHaptics", "Error starting vibration: ${e.message}", e)
        }
      } else {
        // For older devices, just use the duration
        try {
          @Suppress("DEPRECATION")
          vibrator?.vibrate(durationMs)
          Log.d("ExpoBetterHaptics", "Legacy vibration started with duration=$durationMs ms")
        } catch (e: Exception) {
          Log.e("ExpoBetterHaptics", "Error starting legacy vibration: ${e.message}", e)
        }
      }
      true
    }

    // Play custom haptic pattern
    AsyncFunction("playPattern") { events: List<Map<String, Any>> ->
      if (events.isEmpty()) {
        return@AsyncFunction true
      }
      
      // Cancel any ongoing vibration
      vibrator?.cancel()
      
      // Log incoming events for debugging
      Log.d("ExpoBetterHaptics", "playPattern received ${events.size} events: $events")
      
      // Sort events by time
      val sortedEvents = events.sortedBy { it["time"] as Double }
      
      // For Android, we'll convert the pattern to a series of timings and amplitudes
      val timings = mutableListOf<Long>()
      val amplitudes = mutableListOf<Int>()
      
      // Add initial delay of 0
      timings.add(0L)
      amplitudes.add(0) // No vibration initially
      
      var lastEndTimeMs = 0L
      
      for (event in sortedEvents) {
        // Handle both string type and numeric type
        val eventTypeValue = event["type"] ?: event["eventType"]
        Log.d("ExpoBetterHaptics", "Event type value: $eventTypeValue (${eventTypeValue?.javaClass?.name})")
        
        val eventType = when(eventTypeValue) {
          "continuous" -> HAPTIC_EVENT_TYPE_CONTINUOUS
          "transient" -> HAPTIC_EVENT_TYPE_TRANSIENT
          is Int -> eventTypeValue
          else -> HAPTIC_EVENT_TYPE_TRANSIENT
        }
        
        Log.d("ExpoBetterHaptics", "Interpreted event type: $eventType")
        
        val eventTimeMs = ((event["time"] as Double) * 1000).toLong()
        val parameters = event["parameters"] as? List<Map<String, Any>> ?: listOf()
        
        // Find intensity parameter
        val intensityParam = parameters.find { it["id"] as? Int == HAPTIC_PARAMETER_INTENSITY }
        val intensity = intensityParam?.get("value") as? Double ?: 0.5
        val amplitudeInt = (intensity * 255).toInt().coerceIn(1, 255)
        
        // Calculate gap between last event and this one
        val gapMs = eventTimeMs - lastEndTimeMs
        if (gapMs > 0) {
          timings.add(gapMs)
          amplitudes.add(0) // No vibration in the gap
        }
        
        // Handle different event types
        when (eventType) {
          HAPTIC_EVENT_TYPE_TRANSIENT -> {
            // Transient is a quick pulse
            timings.add(50L) // 50ms duration for transient effects
            amplitudes.add(amplitudeInt)
            lastEndTimeMs = eventTimeMs + 50
          }
          HAPTIC_EVENT_TYPE_CONTINUOUS -> {
            // Find duration parameter
            val durationParam = event["duration"] as? Double ?: 0.0
            val durationMs = (durationParam * 1000).toLong().coerceAtLeast(1) // Ensure at least 1ms
            
            Log.d("ExpoBetterHaptics", "Continuous event: duration=$durationParam, durationMs=$durationMs, amplitude=$amplitudeInt")
            
            if (durationMs > 0) {
              timings.add(durationMs)
              amplitudes.add(amplitudeInt)
              lastEndTimeMs = eventTimeMs + durationMs
            }
          }
        }
      }
      
      // Log the final pattern for debugging
      Log.d("ExpoBetterHaptics", "Pattern timings: $timings")
      Log.d("ExpoBetterHaptics", "Pattern amplitudes: $amplitudes")
      
      // Check if this is just a single continuous event
      if (sortedEvents.size == 1 && 
          (sortedEvents[0]["type"] == "continuous" || sortedEvents[0]["eventType"] == HAPTIC_EVENT_TYPE_CONTINUOUS)) {
        
        val event = sortedEvents[0]
        val parameters = event["parameters"] as? List<Map<String, Any>> ?: listOf()
        val intensityParam = parameters.find { it["id"] as? Int == HAPTIC_PARAMETER_INTENSITY }
        val intensity = intensityParam?.get("value") as? Double ?: 0.5
        val durationParam = event["duration"] as? Double ?: 0.0
        
        Log.d("ExpoBetterHaptics", "Detected single continuous event, forwarding to separate handler")
        
        // Use our dedicated continuous vibration handler
        val durationMs = (durationParam * 1000).toLong().coerceAtLeast(1)
        val amplitudeInt = (intensity * 255).toInt().coerceIn(1, 255)
        
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
          try {
            // For continuous effects, try to create a more persistent and noticeable vibration
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R && durationMs > 100) {
              // Create a pulsing waveform for more forceful feedback
              val timings = longArrayOf(0, durationMs)
              val amplitudes = intArrayOf(0, amplitudeInt)
              val effect = VibrationEffect.createWaveform(timings, amplitudes, -1)
              vibrator?.vibrate(effect)
            } else {
              // Use one-shot for shorter duration or older devices
              val effect = VibrationEffect.createOneShot(durationMs, amplitudeInt)
              vibrator?.vibrate(effect)
            }
            Log.d("ExpoBetterHaptics", "Single continuous vibration started with duration=$durationMs ms")
          } catch (e: Exception) {
            Log.e("ExpoBetterHaptics", "Error starting single continuous vibration: ${e.message}", e)
          }
        } else {
          try {
            @Suppress("DEPRECATION")
            vibrator?.vibrate(durationMs)
            Log.d("ExpoBetterHaptics", "Legacy single continuous vibration started with duration=$durationMs ms")
          } catch (e: Exception) {
            Log.e("ExpoBetterHaptics", "Error starting legacy vibration: ${e.message}", e)
          }
        }
        
        return@AsyncFunction true
      }
      
      // For multiple events or transient events, play as a pattern
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O && timings.isNotEmpty() && amplitudes.isNotEmpty()) {
        try {
          val effect = VibrationEffect.createWaveform(
            timings.toLongArray(),
            amplitudes.toIntArray(),
            -1 // Don't repeat
          )
          vibrator?.vibrate(effect)
          Log.d("ExpoBetterHaptics", "Waveform vibration started")
        } catch (e: Exception) {
          Log.e("ExpoBetterHaptics", "Error playing waveform: ${e.message}", e)
        }
      } else if (timings.size > 1) {
        // Fallback for older Android versions - simplified pattern with just on/off timings
        val simplifiedTimings = mutableListOf<Long>()
        var isOn = false
        for (i in 0 until timings.size) {
          if (amplitudes[i] > 0 && !isOn) {
            // Vibration starts
            simplifiedTimings.add(timings[i])
            isOn = true
          } else if (amplitudes[i] == 0 && isOn) {
            // Vibration stops
            simplifiedTimings.add(timings[i])
            isOn = false
          } else if (i < timings.size - 1) {
            // Add to the next timing
            timings[i+1] += timings[i]
          }
        }
        
        if (simplifiedTimings.isNotEmpty()) {
          @Suppress("DEPRECATION")
          vibrator?.vibrate(simplifiedTimings.toLongArray(), -1)
        }
      }
      
      true
    }

    // Enables the module to be used as a native view. Definition components that are accepted as part of
    // the view definition: Prop, Events.
    View(ExpoBetterHapticsView::class) {
      // Define events that the view can send to JavaScript if needed
      Events("onLoad")
    }
  }

  // Initialize the vibrator service
  private fun initializeVibrator() {
    if (vibrator != null) {
      return
    }

    val context = appContext.reactContext ?: return
    dummyView = View(context)

    vibrator = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
      val vibratorManager = context.getSystemService(Context.VIBRATOR_MANAGER_SERVICE) as? VibratorManager
      vibratorManager?.defaultVibrator
    } else {
      @Suppress("DEPRECATION")
      context.getSystemService(Context.VIBRATOR_SERVICE) as? Vibrator
    }
    
    // Ensure vibrator is actually available
    val hasVibrator = vibrator?.hasVibrator() == true
    if (!hasVibrator) {
      Log.w("ExpoBetterHaptics", "Device reports it has a vibrator, but the vibrator service is not available or has no vibrator.")
    } else {
      // Log vibrator capabilities
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
        val hasAmplitudeControl = vibrator?.hasAmplitudeControl() == true
        Log.d("ExpoBetterHaptics", "Vibrator available. Has amplitude control: $hasAmplitudeControl")
      } else {
        Log.d("ExpoBetterHaptics", "Vibrator available (legacy API)")
      }
    }
  }

  // Check if haptics are supported on this device
  private fun isHapticsSupported(): Boolean {
    val context = appContext.reactContext ?: return false
    val vibrator = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
      val vibratorManager = context.getSystemService(Context.VIBRATOR_MANAGER_SERVICE) as? VibratorManager
      vibratorManager?.defaultVibrator
    } else {
      @Suppress("DEPRECATION")
      context.getSystemService(Context.VIBRATOR_SERVICE) as? Vibrator
    }
    
    return vibrator?.hasVibrator() == true
  }

  // Perform haptic feedback using the View API
  private fun performHapticFeedback(feedbackConstant: Int): Boolean {
    val view = dummyView ?: return false
    return view.performHapticFeedback(feedbackConstant)
  }

  // Vibrate with a one-shot effect
  private fun vibrateOneShot(durationMs: Long, amplitude: Float) {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      val effect = VibrationEffect.createOneShot(
        durationMs,
        (amplitude * 255).toInt().coerceIn(1, 255)
      )
      vibrator?.vibrate(effect)
    } else {
      @Suppress("DEPRECATION")
      vibrator?.vibrate(durationMs)
    }
  }

  // Vibrate with a waveform effect
  private fun vibrateWaveform(timings: LongArray, amplitudes: IntArray, repeat: Int) {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      val effect = VibrationEffect.createWaveform(timings, amplitudes, repeat)
      vibrator?.vibrate(effect)
    } else {
      @Suppress("DEPRECATION")
      vibrator?.vibrate(500) // Simple fallback
    }
  }

  // Vibrate with a primitive effect (Android 11+)
  private fun vibrateWithPrimitive(primitiveId: Int, scale: Float = 1.0f) {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
      val effect = VibrationEffect.startComposition()
        .addPrimitive(primitiveId, scale)
        .compose()
      
      vibrator?.vibrate(effect)
    } else {
      // Fallback for older devices
      vibrateOneShot(50, scale)
    }
  }
}
