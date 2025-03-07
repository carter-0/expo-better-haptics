# Expo Better Haptics

A drop-in replacement for `expo-haptics` offering fine-grained control over haptic feedback on iOS and Android devices.

## Features

- 🤖 **Better Android support** using dedicated Haptics APIs
- 💿 **Drop-in replacement** for `expo-haptics`
- ⚡ **Continuous or transient impacts** with multiple intensity levels
- 🎵 **Complex haptic patterns** with precise timing and sequencing
- 💥 **Pre-built notification patterns** (success, warning, error)
- 📱 **Cross-platform support** for both iOS and Android

## Requirements

- Expo SDK 49 or newer
- iOS 13+ for CoreHaptics API (iPhone 8 or newer)
- Android 8+ (API level 26) for enhanced vibration effects
- Android 11+ (API level 30) for Haptic Compositions and Primitives

## Installation

```bash
npx expo install expo-better-haptics
```

## Usage

### Basic Usage

```javascript
import * as Haptics from 'expo-better-haptics'

// Play impact haptics
await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft)
await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid)

// Play notification haptics
await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)
await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)

// Play selection feedback
await Haptics.selectionAsync()

// Play a continuous vibration
await Haptics.vibrateAsync({
    intensity: 0.8, // 0-1, defaults to 0.8
    sharpness: 0.5, // 0-1, defaults to 0.5
    duration: 0.5, // in seconds, defaults to 0.5
})
```

### Advanced Usage

#### Custom Transient Haptics

```javascript
import * as Haptics from 'expo-better-haptics'

// Play a custom transient haptic with specific intensity and sharpness
await Haptics.playTransientAsync(0.7, 0.9)
```

#### Custom Continuous Haptics

```javascript
import * as Haptics from 'expo-better-haptics'

// Play a continuous haptic with specific intensity, sharpness, and duration
await Haptics.playContinuousAsync(0.6, 0.3, 1.2) // 1.2 seconds
```

#### Custom Haptic Patterns

```javascript
import * as Haptics from 'expo-better-haptics'
import { HapticEvent, HapticEventType, HapticEventParameterType } from 'expo-better-haptics'

// Create a custom pattern using helper methods
const customPattern = [
    // First tap at time 0
    Haptics.createTransientEvent({
        intensity: 0.8,
        sharpness: 0.5,
        time: 0,
    }),
    // Second tap after a short pause
    Haptics.createTransientEvent({
        intensity: 0.5,
        sharpness: 0.3,
        time: 0.15,
    }),
    // Longer continuous effect after another pause
    Haptics.createContinuousEvent({
        intensity: 1.0,
        sharpness: 0.7,
        time: 0.4,
        duration: 0.3,
    }),
]

// Play the custom pattern
await Haptics.playPatternAsync(customPattern)

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

await Haptics.playPatternAsync(manualPattern)
```

### Checking Support and Managing Engine

```javascript
import * as Haptics from 'expo-better-haptics'

// Check if haptics are supported on the device
const isSupported = Haptics.isSupported

if (isSupported) {
    // Explicitly initialize the haptics engine (optional - will auto-initialize when needed)
    await Haptics.initialize()

    // Do haptic operations...

    // When done, you can explicitly stop the engine (optional)
    await Haptics.stop()
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

#### Standard Haptics

- `impactAsync(style?)` - Plays an impact haptic with the specified style
    - `style` (ImpactFeedbackStyle) - Style of impact, defaults to Medium
- `notificationAsync(type?)` - Plays a notification haptic with the specified type
    - `type` (NotificationFeedbackType) - Type of notification, defaults to Success
- `selectionAsync()` - Plays a selection haptic

#### Advanced Haptics

- `vibrateAsync(options?)` - Plays a customizable continuous vibration
    - `options.intensity` (number, 0-1) - Intensity of the vibration, defaults to 0.8
    - `options.sharpness` (number, 0-1) - Sharpness of the vibration, defaults to 0.5
    - `options.duration` (number) - Duration in seconds, defaults to 0.5
- `playTransientAsync(intensity, sharpness)` - Plays a transient haptic with customized parameters
    - `intensity` (number, 0-1) - Required. Intensity of the haptic effect
    - `sharpness` (number, 0-1) - Required. Sharpness of the haptic effect
- `playContinuousAsync(intensity, sharpness, duration)` - Plays a continuous haptic with customized parameters
    - `intensity` (number, 0-1) - Required. Intensity of the haptic effect
    - `sharpness` (number, 0-1) - Required. Sharpness of the haptic effect
    - `duration` (number) - Required. Duration in seconds
- `playPatternAsync(events)` - Plays a custom haptic pattern defined by an array of haptic events

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

### Enums

- `ImpactFeedbackStyle` - Enum for impact feedback styles

    - `Light` - A collision between small, light user interface elements
    - `Medium` - A collision between moderately sized user interface elements
    - `Heavy` - A collision between large, heavy user interface elements
    - `Rigid` - A collision between user interface elements that are rigid
    - `Soft` - A collision between user interface elements that are soft

- `NotificationFeedbackType` - Enum for notification feedback types
    - `Success` - A notification feedback type indicating that a task has completed successfully
    - `Warning` - A notification feedback type indicating that a task has produced a warning
    - `Error` - A notification feedback type indicating that a task has failed

### Types

- `HapticEventType` - Enum for haptic event types
- `HapticEventParameterType` - Enum for haptic event parameter types
- `HapticEvent` - Interface for haptic events
- `HapticParameter` - Interface for haptic parameters

## Platform-Specific Implementation

### iOS

On iOS, this module uses:

- **CoreHaptics API** for fine-grained haptic control (iOS 13+)
- **UIImpactFeedbackGenerator** for impact feedback
- **UINotificationFeedbackGenerator** for notification feedback
- **UISelectionFeedbackGenerator** for selection feedback

### Android

On Android, this module uses:

- **Haptic Compositions API** with primitives for rich haptic feedback (Android 11+)
- **VibrationEffect API** for amplitude control and waveforms (Android 8+)
- **View.performHapticFeedback** for simple haptic feedback
- Intelligent fallbacks for older devices

## Feature Compatibility by Platform

| Feature                   | iOS | Android 11+ | Android 8-10 | Android <8 |
| ------------------------- | --- | ----------- | ------------ | ---------- |
| Impact feedback           | ✓   | ✓           | ✓            | Limited    |
| Notification patterns     | ✓   | ✓           | ✓            | Limited    |
| Selection feedback        | ✓   | ✓           | ✓            | ✓          |
| Intensity control         | ✓   | ✓           | ✓            | ✗          |
| Sharpness control         | ✓   | Limited     | ✗            | ✗          |
| Custom patterns           | ✓   | ✓           | Limited      | ✗          |
| Continuous effects        | ✓   | ✓           | ✓            | Limited    |
| Dynamic parameter control | ✓   | Limited     | ✗            | ✗          |

## Compared to Expo Haptics

`expo-better-haptics` offers more capabilities over the standard `expo-haptics`:

1. **Fine-grained control**: Adjust intensity and sharpness parameters on both iOS and Android
2. **Continuous haptics**: Standard haptics only offers preset impacts
3. **Complex patterns**: Create sequences of haptic events with precise timing
4. **Longer effects**: Create sustained haptic experiences of any duration
5. **Cross-platform**: Full Android support with proper haptic implementations

### API Compatibility with expo-haptics

This library is fully compatible with `expo-haptics`, making migration easy:

```javascript
// Replace this:
import * as Haptics from 'expo-haptics'

// With this:
import * as Haptics from 'expo-better-haptics'
```

All existing code will continue to work:

```javascript
// Standard expo-haptics API
await Haptics.impactAsync() // Default medium impact
await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid)
await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft)

await Haptics.notificationAsync() // Default success notification
await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)
await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)

await Haptics.selectionAsync()
```

In addition, you'll gain access to more powerful haptic features:

```javascript
// Extended functionality
await Haptics.vibrateAsync({ intensity: 0.8, sharpness: 0.6, duration: 0.5 })
await Haptics.playTransientAsync(0.7, 0.9)
await Haptics.playContinuousAsync(0.6, 0.3, 1.2)
await Haptics.playPatternAsync(customPattern)
```

## Example App

The module includes an example app that demonstrates all the haptic capabilities:

```bash
cd example
npx expo run:android --device  # For Android testing
npx expo run:ios --device      # For iOS testing
```

> Note: Must be run on a physical device to feel the haptic feedback.

## Android Implementation Details

The Android implementation uses a tiered approach to provide the best haptic experience based on the device's capabilities:

1. **Android 11+ (API 30+)**: Uses Haptic Composition API with primitives like TICK, CLICK, THUD, QUICK_RISE, etc.
2. **Android 8-10 (API 26-29)**: Uses VibrationEffect API with amplitude control and waveform patterns
3. **Older Android versions**: Falls back to basic vibration patterns

The implementation intelligently maps iOS haptic concepts to their Android equivalents:

- **Intensity**: Maps to vibration amplitude (0-255)
- **Sharpness**: Maps to different primitive types or vibration duration
- **Patterns**: Converted to appropriate waveform patterns

## Limitations

- iOS CoreHaptics requires iOS 13+ and iPhone 8 or newer
- Android haptic primitives require Android 11+ (API level 30)
- Must be run on a physical device to feel the haptics
- Haptics may not work if device is in silent mode, battery saver mode, or has haptics disabled
- Some Android devices have limited haptic capability hardware

## Authors

This library was co-authored by:

- Carter (@carter-0)
- Claude Code

## License

MIT
