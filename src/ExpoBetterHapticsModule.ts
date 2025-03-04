import { requireNativeModule } from 'expo'

import { DynamicParameterID, HapticEvent, HapticEventParameterType, HapticEventType } from './ExpoBetterHaptics.types'

/**
 * Native module interface for ExpoBetterHaptics
 */
interface ExpoBetterHapticsModule {
    // Constants exposed from native code
    readonly isSupported: boolean
    readonly HapticEventTypes: Record<string, number>
    readonly HapticEventParameters: Record<string, number>
    readonly DynamicParameterIDs: Record<string, number>

    /**
     * Initialize the haptic engine
     * Must be called before using any haptic functionality
     * @returns Promise that resolves to true if initialization was successful
     */
    initialize(): Promise<boolean>

    /**
     * Start the haptic engine
     * @returns Promise that resolves to true if the engine started successfully
     */
    start(): Promise<boolean>

    /**
     * Stop the haptic engine
     * @returns Promise that resolves to true if the engine stopped successfully
     */
    stop(): Promise<boolean>

    /**
     * Play a light impact haptic feedback
     * Uses UIImpactFeedbackGenerator with style .light
     * @returns Promise that resolves to true if the haptic played successfully
     */
    impactLight(): Promise<boolean>

    /**
     * Play a medium impact haptic feedback
     * Uses UIImpactFeedbackGenerator with style .medium
     * @returns Promise that resolves to true if the haptic played successfully
     */
    impactMedium(): Promise<boolean>

    /**
     * Play a heavy impact haptic feedback
     * Uses UIImpactFeedbackGenerator with style .heavy
     * @returns Promise that resolves to true if the haptic played successfully
     */
    impactHeavy(): Promise<boolean>

    /**
     * Play a soft impact haptic feedback
     * Uses UIImpactFeedbackGenerator with style .soft
     * @returns Promise that resolves to true if the haptic played successfully
     */
    impactSoft(): Promise<boolean>

    /**
     * Play a rigid impact haptic feedback
     * Uses UIImpactFeedbackGenerator with style .rigid
     * @returns Promise that resolves to true if the haptic played successfully
     */
    impactRigid(): Promise<boolean>

    /**
     * Play a success notification haptic feedback
     * Uses UINotificationFeedbackGenerator with type .success
     * @returns Promise that resolves to true if the haptic played successfully
     */
    notificationSuccess(): Promise<boolean>

    /**
     * Play a warning notification haptic feedback
     * Uses UINotificationFeedbackGenerator with type .warning
     * @returns Promise that resolves to true if the haptic played successfully
     */
    notificationWarning(): Promise<boolean>

    /**
     * Play an error notification haptic feedback
     * Uses UINotificationFeedbackGenerator with type .error
     * @returns Promise that resolves to true if the haptic played successfully
     */
    notificationError(): Promise<boolean>

    /**
     * Play a selection haptic feedback
     * Uses UISelectionFeedbackGenerator
     * @returns Promise that resolves to true if the haptic played successfully
     */
    selection(): Promise<boolean>

    /**
     * Play a transient haptic effect
     * @param intensity The intensity of the haptic effect (0.0 to 1.0)
     * @param sharpness The sharpness of the haptic effect (0.0 to 1.0)
     * @returns Promise that resolves to true if the haptic played successfully
     */
    playTransient(intensity: number, sharpness: number): Promise<boolean>

    /**
     * Play a continuous haptic effect
     * @param intensity The intensity of the haptic effect (0.0 to 1.0)
     * @param sharpness The sharpness of the haptic effect (0.0 to 1.0)
     * @param duration The duration of the haptic effect in seconds
     * @returns Promise that resolves to true if the haptic played successfully
     */
    playContinuous(intensity: number, sharpness: number, duration: number): Promise<boolean>

    /**
     * Play a custom haptic pattern
     * @param events Array of haptic events that make up the pattern
     * @returns Promise that resolves to true if the pattern played successfully
     */
    playPattern(events: HapticEvent[]): Promise<boolean>
}

// Load the native module
const nativeModule = requireNativeModule<ExpoBetterHapticsModule>('ExpoBetterHaptics')

// Initialize object values from native constants
if (nativeModule.HapticEventParameters) {
    HapticEventParameterType.Intensity = nativeModule.HapticEventParameters.intensity
    HapticEventParameterType.Sharpness = nativeModule.HapticEventParameters.sharpness
    HapticEventParameterType.AttackTime = nativeModule.HapticEventParameters.attackTime
    HapticEventParameterType.DecayTime = nativeModule.HapticEventParameters.decayTime
    HapticEventParameterType.ReleaseTime = nativeModule.HapticEventParameters.releaseTime
    HapticEventParameterType.Sustained = nativeModule.HapticEventParameters.sustained
}

if (nativeModule.HapticEventTypes) {
    HapticEventType.Transient = nativeModule.HapticEventTypes.transient
    HapticEventType.Continuous = nativeModule.HapticEventTypes.continuous
}

if (nativeModule.DynamicParameterIDs) {
    DynamicParameterID.Intensity = nativeModule.DynamicParameterIDs.intensity
    DynamicParameterID.Sharpness = nativeModule.DynamicParameterIDs.sharpness
}

export default nativeModule
