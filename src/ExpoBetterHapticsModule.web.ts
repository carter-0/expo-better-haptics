// Detect browser vibration API support
const hasVibrationSupport = typeof navigator !== 'undefined' && 'vibrate' in navigator

// Create web implementation manually without extending NativeModule
const webImplementation = {
    // Required event emitter methods
    addListener: () => {},
    removeListener: () => {},
    removeAllListeners: () => {},
    emit: () => {},
    listenerCount: () => 0,

    // Constants for web implementation
    isSupported: hasVibrationSupport,

    HapticEventTypes: {
        transient: 1,
        continuous: 2,
    },

    HapticEventParameters: {
        intensity: 1,
        sharpness: 2,
        attackTime: 3,
        decayTime: 4,
        releaseTime: 5,
        sustained: 6,
    },

    DynamicParameterIDs: {
        intensity: 1,
        sharpness: 2,
    },

    // Engine methods
    async initialize(): Promise<boolean> {
        return hasVibrationSupport
    },

    async start(): Promise<boolean> {
        return hasVibrationSupport
    },

    async stop(): Promise<boolean> {
        if (hasVibrationSupport) {
            // Stop any ongoing vibration
            navigator.vibrate(0)
            return true
        }
        return false
    },

    // Basic haptic patterns
    async playTransient(intensity: number, sharpness: number): Promise<boolean> {
        if (!hasVibrationSupport) {
            return false
        }

        // Use intensity to determine vibration duration (10-100ms)
        const duration = Math.floor(10 + intensity * 90)
        navigator.vibrate(duration)
        return true
    },

    async playContinuous(intensity: number, sharpness: number, duration: number): Promise<boolean> {
        if (!hasVibrationSupport) {
            return false
        }

        // Convert duration to milliseconds
        const durationMs = Math.floor(duration * 1000)
        navigator.vibrate(durationMs)
        return true
    },

    // Custom pattern playback
    async playPattern(events: any[]): Promise<boolean> {
        if (!hasVibrationSupport || !events.length) {
            return false
        }

        // Convert events to a vibration pattern
        // Web vibration API uses an array of numbers that alternate between
        // vibration time and pause time in milliseconds
        const pattern: number[] = []

        let lastEventTime = 0

        events.forEach((event, index) => {
            const { time, type, parameters, duration } = event

            // Calculate time since last event (for pauses)
            const timeMs = time * 1000
            const timeSinceLastEvent = timeMs - lastEventTime

            // Add pause between events (if this isn't the first event)
            if (index > 0 && timeSinceLastEvent > 0) {
                pattern.push(timeSinceLastEvent)
            }

            // Find intensity parameter if available
            const intensityParam = parameters.find(
                (p: any) => p.id === webImplementation.HapticEventParameters.intensity,
            )
            const intensity = intensityParam ? intensityParam.value : 0.5

            // For transient events, duration is based on intensity
            if (type === webImplementation.HapticEventTypes.transient) {
                const vibrationDuration = Math.floor(10 + intensity * 90)
                pattern.push(vibrationDuration)
            }
            // For continuous events, use the duration parameter
            else if (type === webImplementation.HapticEventTypes.continuous && duration) {
                const vibrationDuration = Math.floor(duration * 1000)
                pattern.push(vibrationDuration)
            }

            // Update last event time
            lastEventTime = timeMs + (duration || 0) * 1000
        })

        // Play the pattern
        navigator.vibrate(pattern)
        return true
    },
}

// Export the web implementation
export default webImplementation
