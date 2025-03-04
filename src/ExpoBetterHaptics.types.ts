/**
 * Event parameter types for haptic events
 */
export const HapticEventParameterType = {
    // These values will be populated from native constants
    Intensity: 0,
    Sharpness: 0,
    AttackTime: 0,
    DecayTime: 0,
    ReleaseTime: 0,
    Sustained: 0,
}

/**
 * Event types for haptic events
 */
export const HapticEventType = {
    // These values will be populated from native constants
    Transient: 0,
    Continuous: 0,
}

/**
 * Dynamic parameter IDs for real-time updates
 */
export const DynamicParameterID = {
    // These values will be populated from native constants
    Intensity: 0,
    Sharpness: 0,
}

/**
 * Parameter object for haptic events
 */
export interface HapticParameter {
    id: number
    value: number
}

/**
 * Event object for haptic patterns
 */
export interface HapticEvent {
    type: string | number // Accept either string ("transient"/"continuous") or number (from HapticEventType)
    time: number
    parameters: HapticParameter[]
    duration?: number // Required for continuous events
}

/**
 * Module event types
 */
export type ExpoBetterHapticsModuleEvents = Record<string, never>
