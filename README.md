# Expo Better Haptics

An enhanced haptics package for Expo apps offering fine-grained control over haptic feedback on iOS devices.

> **Note:** This module is iOS-only and leverages the CoreHaptics API. All methods will safely no-op on non-iOS platforms.

## Features

- 🎛️ **Fine-grained control** over haptic intensity and sharpness
- 🔄 **Continuous haptic feedback** with customizable duration
- ⚡ **Transient impacts** with multiple intensity levels
- 🎵 **Complex haptic patterns** with precise timing and sequencing
- 💥 **Pre-built notification patterns** (success, warning, error)
- 🔊 **Simple high-level API** for common haptic tasks
- 💪 **Advanced pattern creation** for custom experiences

## Requirements

- Expo SDK 49 or newer
- iOS 13+ (CoreHaptics is only available on iOS 13+)
- iPhone 8 or newer (devices that support Taptic Engine)

## Installation

```bash
npx expo install expo-better-haptics
```

## Usage

### Basic Usage

```javascript
import ExpoBetterHaptics from 'expo-better-haptics'

// Play a light impact
await ExpoBetterHaptics.impactLight()

// Play a medium impact
await ExpoBetterHaptics.impactMedium()

// Play a heavy impact
await ExpoBetterHaptics.impactHeavy()

// Play soft and rigid impacts
await ExpoBetterHaptics.impactSoft()
await ExpoBetterHaptics.impactRigid()

// Play notification haptics
await ExpoBetterHaptics.notificationSuccess()
await ExpoBetterHaptics.notificationWarning()
await ExpoBetterHaptics.notificationError()

// Play selection feedback
await ExpoBetterHaptics.selection()

// Play a continuous vibration
await ExpoBetterHaptics.vibrate({
    intensity: 0.8, // 0-1, defaults to 0.8
    sharpness: 0.5, // 0-1, defaults to 0.5
    duration: 0.5, // in seconds, defaults to 0.5
})
```

### Advanced Usage

#### Custom Transient Haptics

```javascript
import ExpoBetterHaptics from 'expo-better-haptics'

// Play a custom transient haptic with specific intensity and sharpness
await ExpoBetterHaptics.playTransient(0.7, 0.9)
```

#### Custom Continuous Haptics

```javascript
import ExpoBetterHaptics from 'expo-better-haptics'

// Play a continuous haptic with specific intensity, sharpness, and duration
await ExpoBetterHaptics.playContinuous(0.6, 0.3, 1.2) // 1.2 seconds
```

#### Custom Haptic Patterns

```javascript
import ExpoBetterHaptics, { HapticEvent, HapticEventType, HapticEventParameterType } from 'expo-better-haptics'

// Create a custom pattern using helper methods
const customPattern = [
    // First tap at time 0
    ExpoBetterHaptics.createTransientEvent({
        intensity: 0.8,
        sharpness: 0.5,
        time: 0,
    }),
    // Second tap after a short pause
    ExpoBetterHaptics.createTransientEvent({
        intensity: 0.5,
        sharpness: 0.3,
        time: 0.15,
    }),
    // Longer continuous effect after another pause
    ExpoBetterHaptics.createContinuousEvent({
        intensity: 1.0,
        sharpness: 0.7,
        time: 0.4,
        duration: 0.3,
    }),
]

// Play the custom pattern
await ExpoBetterHaptics.play(customPattern)

// Or create patterns manually with full control
const manualPattern = [
    {
        type: HapticEventType.Transient,
        time: 0,
        parameters: [
            { id: HapticEventParameterType.Intensity, value: 0.8 },
            { id: HapticEventParameterType.Sharpness, value: 0.5 },
        ],
    },
    {
        type: HapticEventType.Continuous,
        time: 0.2,
        duration: 0.5,
        parameters: [
            { id: HapticEventParameterType.Intensity, value: 0.6 },
            { id: HapticEventParameterType.Sharpness, value: 0.3 },
        ],
    },
]

await ExpoBetterHaptics.play(manualPattern)
```

### Checking Support and Managing Engine

```javascript
import ExpoBetterHaptics from 'expo-better-haptics'

// Check if haptics are supported on the device
const isSupported = ExpoBetterHaptics.isSupported

if (isSupported) {
    // Explicitly initialize the haptics engine (optional - will auto-initialize when needed)
    await ExpoBetterHaptics.initialize()

    // Do haptic operations...

    // When done, you can explicitly stop the engine (optional)
    await ExpoBetterHaptics.stop()
}
```

## API Reference

### Constants

- `isSupported` - Boolean indicating if haptics are supported on the device

### Methods

#### Initialization

- `initialize()` - Explicitly initializes the haptic engine (auto-initialized when needed)
- `start()` - Explicitly starts the haptic engine
- `stop()` - Explicitly stops the haptic engine

#### High-Level Haptics

- `impactLight()` - Plays a light impact haptic
- `impactMedium()` - Plays a medium impact haptic
- `impactHeavy()` - Plays a heavy impact haptic
- `impactSoft()` - Plays a soft impact haptic
- `impactRigid()` - Plays a rigid impact haptic
- `selection()` - Plays a selection haptic
- `notificationSuccess()` - Plays a success notification haptic
- `notificationWarning()` - Plays a warning notification haptic
- `notificationError()` - Plays an error notification haptic
- `vibrate(options?)` - Plays a continuous vibration
    - `options.intensity` (number, 0-1) - Intensity of the vibration, defaults to 0.8
    - `options.sharpness` (number, 0-1) - Sharpness of the vibration, defaults to 0.5
    - `options.duration` (number) - Duration in seconds, defaults to 0.5

#### Low-Level Haptics

- `playTransient(intensity, sharpness)` - Plays a transient haptic with customized parameters
    - `intensity` (number, 0-1) - Required. Intensity of the haptic effect
    - `sharpness` (number, 0-1) - Required. Sharpness of the haptic effect
- `playContinuous(intensity, sharpness, duration)` - Plays a continuous haptic with customized parameters
    - `intensity` (number, 0-1) - Required. Intensity of the haptic effect
    - `sharpness` (number, 0-1) - Required. Sharpness of the haptic effect
    - `duration` (number) - Required. Duration in seconds
- `play(events)` - Plays a custom haptic pattern defined by an array of haptic events

#### Helper Methods

- `createTransientEvent(options)` - Creates a transient haptic event object
    - `options.intensity` (number, 0-1) - Intensity of the haptic effect
    - `options.sharpness` (number, 0-1) - Sharpness of the haptic effect
    - `options.time` (number) - Time offset in seconds for when this event should occur
- `createContinuousEvent(options)` - Creates a continuous haptic event object
    - `options.intensity` (number, 0-1) - Intensity of the haptic effect
    - `options.sharpness` (number, 0-1) - Sharpness of the haptic effect
    - `options.time` (number) - Time offset in seconds for when this event should occur
    - `options.duration` (number) - Duration of the continuous effect in seconds

### Types

- `HapticEventType` - Enum for haptic event types
- `HapticEventParameterType` - Enum for haptic event parameter types
- `HapticEvent` - Interface for haptic events
- `HapticParameter` - Interface for haptic parameters

## Compared to Expo Haptics

`expo-better-haptics` offers more granular control over the standard `expo-haptics`:

1. **Fine-grained control**: Adjust intensity and sharpness parameters
2. **Continuous haptics**: Standard haptics only offers `UIImpactFeedbackGenerator` preset impacts
3. **Complex patterns**: Create sequences of haptic events with precise timing
4. **Longer effects**: Create sustained haptic experiences of any duration

## Example App

The module includes an example app that demonstrates all the haptic capabilities:

```bash
cd example
npx expo run:ios --device
```

> Note: Must be run on a physical iOS device to feel the haptic feedback.

## Limitations

- iOS-only (CoreHaptics API is not available on Android)
- Requires iOS 13+ and iPhone 8 or newer
- Must be run on a physical device to feel the haptics
- Haptics may not work if device is in silent mode or low power mode

## Authors

This library was co-authored by:

- Carter (@carter-0)
- Claude Code

## License

MIT
