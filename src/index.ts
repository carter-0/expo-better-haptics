import { Platform } from 'react-native'

import { DynamicParameterID, HapticEvent, HapticEventParameterType, HapticEventType } from './ExpoBetterHaptics.types'
import ExpoBetterHapticsModule from './ExpoBetterHapticsModule'

// Reexport types
export { DynamicParameterID, HapticEvent, HapticEventParameterType, HapticEventType }

/**
 * High-level API for ExpoBetterHaptics
 */
class ExpoBetterHaptics {
    /**
     * Whether haptic feedback is supported on this device
     */
    static isSupported = ExpoBetterHapticsModule.isSupported

    private static _initialized = false

    /**
     * Initialize the haptic engine
     * This is automatically called when needed, but can be called manually for pre-initialization
     * @returns Promise that resolves when the haptic engine is initialized
     */
    static async initialize(): Promise<void> {
        if (this._initialized) {
            return
        }

        if (!this.isSupported) {
            console.warn('Haptics are not supported on this device')
            return
        }

        const success = await ExpoBetterHapticsModule.initialize()
        this._initialized = success

        if (!success) {
            console.warn('Failed to initialize haptic engine')
        }
    }

    /**
     * Play a light impact haptic effect
     * Uses native UIImpactFeedbackGenerator with .light style on iOS
     * No-op on non-iOS platforms
     * @returns Promise that resolves when the haptic effect is played
     */
    static async impactLight(): Promise<void> {
        await this.ensureInitialized()

        if (Platform.OS === 'ios') {
            await ExpoBetterHapticsModule.impactLight()
        }
        // No-op on non-iOS platforms
    }

    /**
     * Play a medium impact haptic effect
     * Uses native UIImpactFeedbackGenerator with .medium style on iOS
     * No-op on non-iOS platforms
     * @returns Promise that resolves when the haptic effect is played
     */
    static async impactMedium(): Promise<void> {
        await this.ensureInitialized()

        if (Platform.OS === 'ios') {
            await ExpoBetterHapticsModule.impactMedium()
        }
        // No-op on non-iOS platforms
    }

    /**
     * Play a heavy impact haptic effect
     * Uses native UIImpactFeedbackGenerator with .heavy style on iOS
     * No-op on non-iOS platforms
     * @returns Promise that resolves when the haptic effect is played
     */
    static async impactHeavy(): Promise<void> {
        await this.ensureInitialized()

        if (Platform.OS === 'ios') {
            await ExpoBetterHapticsModule.impactHeavy()
        }
        // No-op on non-iOS platforms
    }

    /**
     * Play a soft impact haptic effect
     * Uses native UIImpactFeedbackGenerator with .soft style on iOS
     * No-op on non-iOS platforms
     * @returns Promise that resolves when the haptic effect is played
     */
    static async impactSoft(): Promise<void> {
        await this.ensureInitialized()

        if (Platform.OS === 'ios') {
            await ExpoBetterHapticsModule.impactSoft()
        }
        // No-op on non-iOS platforms
    }

    /**
     * Play a rigid impact haptic effect
     * Uses native UIImpactFeedbackGenerator with .rigid style on iOS
     * No-op on non-iOS platforms
     * @returns Promise that resolves when the haptic effect is played
     */
    static async impactRigid(): Promise<void> {
        await this.ensureInitialized()

        if (Platform.OS === 'ios') {
            await ExpoBetterHapticsModule.impactRigid()
        }
        // No-op on non-iOS platforms
    }

    /**
     * Play a success notification haptic effect
     * Uses native UINotificationFeedbackGenerator with .success type on iOS
     * No-op on non-iOS platforms
     * @returns Promise that resolves when the haptic effect is played
     */
    static async notificationSuccess(): Promise<void> {
        await this.ensureInitialized()

        if (Platform.OS === 'ios') {
            await ExpoBetterHapticsModule.notificationSuccess()
        }
        // No-op on non-iOS platforms
    }

    /**
     * Play a warning notification haptic effect
     * Uses native UINotificationFeedbackGenerator with .warning type on iOS
     * No-op on non-iOS platforms
     * @returns Promise that resolves when the haptic effect is played
     */
    static async notificationWarning(): Promise<void> {
        await this.ensureInitialized()

        if (Platform.OS === 'ios') {
            await ExpoBetterHapticsModule.notificationWarning()
        }
        // No-op on non-iOS platforms
    }

    /**
     * Play an error notification haptic effect
     * Uses native UINotificationFeedbackGenerator with .error type on iOS
     * No-op on non-iOS platforms
     * @returns Promise that resolves when the haptic effect is played
     */
    static async notificationError(): Promise<void> {
        await this.ensureInitialized()

        if (Platform.OS === 'ios') {
            await ExpoBetterHapticsModule.notificationError()
        }
        // No-op on non-iOS platforms
    }

    /**
     * Play a selection haptic effect
     * Uses native UISelectionFeedbackGenerator on iOS
     * No-op on non-iOS platforms
     * @returns Promise that resolves when the haptic effect is played
     */
    static async selection(): Promise<void> {
        await this.ensureInitialized()

        if (Platform.OS === 'ios') {
            await ExpoBetterHapticsModule.selection()
        }
        // No-op on non-iOS platforms
    }

    /**
     * Play a continuous haptic effect
     * @param options Options for the continuous effect
     * @returns Promise that resolves when the haptic effect is played
     */
    static async vibrate(
        options: {
            intensity?: number
            sharpness?: number
            duration?: number
        } = {},
    ): Promise<void> {
        await this.ensureInitialized()

        if (Platform.OS === 'ios') {
            await ExpoBetterHapticsModule.playContinuous(
                options.intensity ?? 0.8,
                options.sharpness ?? 0.5,
                options.duration ?? 0.5,
            )
        }
        // No-op on non-iOS platforms
    }

    /**
     * Play a custom haptic pattern
     * @param events Array of haptic events that make up the pattern
     * @returns Promise that resolves when the haptic pattern is played
     */
    static async play(events: HapticEvent[]): Promise<void> {
        await this.ensureInitialized()

        if (Platform.OS === 'ios') {
            await ExpoBetterHapticsModule.playPattern(events)
        }
        // No-op on non-iOS platforms
    }

    /**
     * Play a transient haptic effect directly
     * Useful for custom haptic effects with specific intensity and sharpness
     * @param intensity The intensity of the haptic effect (0.0 to 1.0)
     * @param sharpness The sharpness of the haptic effect (0.0 to 1.0)
     * @returns Promise that resolves when the haptic effect is played
     */
    static async playTransient(intensity: number, sharpness: number): Promise<void> {
        await this.ensureInitialized()

        if (Platform.OS === 'ios') {
            await ExpoBetterHapticsModule.playTransient(intensity, sharpness)
        }
        // No-op on non-iOS platforms
    }

    /**
     * Create a transient haptic event
     * Helper method to simplify creating transient haptic events
     */
    static createTransientEvent(
        options: {
            intensity?: number
            sharpness?: number
            time?: number
        } = {},
    ): HapticEvent {
        return {
            type: 'transient', // Use string type instead of numeric constant
            time: options.time ?? 0,
            parameters: [
                {
                    id: HapticEventParameterType.Intensity,
                    value: options.intensity ?? 0.5,
                },
                {
                    id: HapticEventParameterType.Sharpness,
                    value: options.sharpness ?? 0.5,
                },
            ],
        }
    }

    /**
     * Create a continuous haptic event
     * Helper method to simplify creating continuous haptic events
     */
    static createContinuousEvent(
        options: {
            intensity?: number
            sharpness?: number
            time?: number
            duration?: number
        } = {},
    ): HapticEvent {
        return {
            type: 'continuous', // Use string type instead of numeric constant
            time: options.time ?? 0,
            duration: options.duration ?? 0.5,
            parameters: [
                {
                    id: HapticEventParameterType.Intensity,
                    value: options.intensity ?? 0.5,
                },
                {
                    id: HapticEventParameterType.Sharpness,
                    value: options.sharpness ?? 0.5,
                },
            ],
        }
    }

    /**
     * Ensure the haptic engine is initialized
     * @private
     */
    private static async ensureInitialized(): Promise<void> {
        if (!this._initialized) {
            await this.initialize()
        }
    }
}

export default ExpoBetterHaptics
