import { DynamicParameterID, HapticEvent, HapticEventParameterType, HapticEventType } from './ExpoBetterHaptics.types'
import ExpoBetterHapticsModule from './ExpoBetterHapticsModule'

// Reexport types
export { DynamicParameterID, HapticEvent, HapticEventParameterType, HapticEventType }

/**
 * ImpactFeedbackStyle enum for impact feedback styles
 */
export enum ImpactFeedbackStyle {
    Light = 'light',
    Medium = 'medium',
    Heavy = 'heavy',
    Rigid = 'rigid',
    Soft = 'soft',
}

/**
 * NotificationFeedbackType enum for notification feedback types
 */
export enum NotificationFeedbackType {
    Success = 'success',
    Warning = 'warning',
    Error = 'error',
}

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
     * Start the haptic engine explicitly
     */
    static async start(): Promise<void> {
        await this.ensureInitialized()
        await ExpoBetterHapticsModule.start()
    }

    /**
     * Stop the haptic engine explicitly
     */
    static async stop(): Promise<void> {
        if (!this._initialized) {
            return
        }
        await ExpoBetterHapticsModule.stop()
    }

    /**
     * Trigger impact feedback.
     * @param style - Impact feedback style (light, medium, heavy, rigid, or soft)
     * @returns Promise that resolves when the haptic effect is played
     */
    static async impactAsync(style: ImpactFeedbackStyle = ImpactFeedbackStyle.Medium): Promise<void> {
        await this.ensureInitialized()

        switch (style) {
            case ImpactFeedbackStyle.Light:
                await ExpoBetterHapticsModule.impactLight()
                break
            case ImpactFeedbackStyle.Medium:
                await ExpoBetterHapticsModule.impactMedium()
                break
            case ImpactFeedbackStyle.Heavy:
                await ExpoBetterHapticsModule.impactHeavy()
                break
            case ImpactFeedbackStyle.Rigid:
                await ExpoBetterHapticsModule.impactRigid()
                break
            case ImpactFeedbackStyle.Soft:
                await ExpoBetterHapticsModule.impactSoft()
                break
            default:
                await ExpoBetterHapticsModule.impactMedium()
        }
    }

    /**
     * Trigger notification feedback.
     * @param type - Notification feedback type (success, warning, or error)
     * @returns Promise that resolves when the haptic effect is played
     */
    static async notificationAsync(type: NotificationFeedbackType = NotificationFeedbackType.Success): Promise<void> {
        await this.ensureInitialized()

        switch (type) {
            case NotificationFeedbackType.Success:
                await ExpoBetterHapticsModule.notificationSuccess()
                break
            case NotificationFeedbackType.Warning:
                await ExpoBetterHapticsModule.notificationWarning()
                break
            case NotificationFeedbackType.Error:
                await ExpoBetterHapticsModule.notificationError()
                break
            default:
                await ExpoBetterHapticsModule.notificationSuccess()
        }
    }

    /**
     * Trigger selection feedback.
     * @returns Promise that resolves when the haptic effect is played
     */
    static async selectionAsync(): Promise<void> {
        await this.ensureInitialized()
        await ExpoBetterHapticsModule.selection()
    }

    /**
     * Play a continuous vibration with customizable parameters.
     * @param options - Vibration options (intensity, sharpness, duration)
     * @returns Promise that resolves when the haptic effect is played
     */
    static async vibrateAsync(
        options: {
            intensity?: number
            sharpness?: number
            duration?: number
        } = {},
    ): Promise<void> {
        await this.ensureInitialized()
        await ExpoBetterHapticsModule.playContinuous(
            options.intensity ?? 0.8,
            options.sharpness ?? 0.5,
            options.duration ?? 0.5,
        )
    }

    /**
     * Play a custom haptic pattern.
     * @param events - Array of haptic events that make up the pattern
     * @returns Promise that resolves when the haptic pattern is played
     */
    static async playPatternAsync(events: HapticEvent[]): Promise<void> {
        await this.ensureInitialized()
        await ExpoBetterHapticsModule.playPattern(events)
    }

    /**
     * Play a transient haptic effect directly.
     * Useful for custom haptic effects with specific intensity and sharpness.
     * @param intensity - The intensity of the haptic effect (0.0 to 1.0)
     * @param sharpness - The sharpness of the haptic effect (0.0 to 1.0)
     * @returns Promise that resolves when the haptic effect is played
     */
    static async playTransientAsync(intensity: number, sharpness: number): Promise<void> {
        await this.ensureInitialized()
        await ExpoBetterHapticsModule.playTransient(intensity, sharpness)
    }

    /**
     * Play a continuous haptic effect directly.
     * Useful for custom haptic effects with specific intensity, sharpness, and duration.
     * @param intensity - The intensity of the haptic effect (0.0 to 1.0)
     * @param sharpness - The sharpness of the haptic effect (0.0 to 1.0)
     * @param duration - The duration of the haptic effect in seconds
     * @returns Promise that resolves when the haptic effect is played
     */
    static async playContinuousAsync(intensity: number, sharpness: number, duration: number): Promise<void> {
        await this.ensureInitialized()
        await ExpoBetterHapticsModule.playContinuous(intensity, sharpness, duration)
    }

    /**
     * Create a transient haptic event.
     * Helper method to simplify creating transient haptic events.
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
     * Create a continuous haptic event.
     * Helper method to simplify creating continuous haptic events.
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
            duration: options.duration ?? 0.1,
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
     * Internal helper method
     */
    private static async ensureInitialized(): Promise<void> {
        if (!this._initialized && this.isSupported) {
            await this.initialize()
        }
    }
}

export default ExpoBetterHaptics

// Export all functions with consistent Async naming convention, properly bound to the class
export const impactAsync = ExpoBetterHaptics.impactAsync.bind(ExpoBetterHaptics)
export const notificationAsync = ExpoBetterHaptics.notificationAsync.bind(ExpoBetterHaptics)
export const selectionAsync = ExpoBetterHaptics.selectionAsync.bind(ExpoBetterHaptics)
export const vibrateAsync = ExpoBetterHaptics.vibrateAsync.bind(ExpoBetterHaptics)
export const playPatternAsync = ExpoBetterHaptics.playPatternAsync.bind(ExpoBetterHaptics)
export const playTransientAsync = ExpoBetterHaptics.playTransientAsync.bind(ExpoBetterHaptics)
export const playContinuousAsync = ExpoBetterHaptics.playContinuousAsync.bind(ExpoBetterHaptics)

// Export core functions
export const initialize = ExpoBetterHaptics.initialize.bind(ExpoBetterHaptics)
export const start = ExpoBetterHaptics.start.bind(ExpoBetterHaptics)
export const stop = ExpoBetterHaptics.stop.bind(ExpoBetterHaptics)

// Export helper functions - these don't use 'this', but binding for consistency
export const createTransientEvent = ExpoBetterHaptics.createTransientEvent.bind(ExpoBetterHaptics)
export const createContinuousEvent = ExpoBetterHaptics.createContinuousEvent.bind(ExpoBetterHaptics)

// Export constants
export const isSupported = ExpoBetterHaptics.isSupported
