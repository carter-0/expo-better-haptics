import Slider from '@react-native-community/slider'
import ExpoBetterHaptics, { HapticEvent, HapticEventParameterType } from 'expo-better-haptics'
import React, { useEffect, useState } from 'react'
import { Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

export default function App() {
    const [isSupported, setIsSupported] = useState<boolean | null>(null)
    const [initialized, setInitialized] = useState(false)
    const [intensity, setIntensity] = useState(0.5)
    const [sharpness, setSharpness] = useState(0.5)
    const [duration, setDuration] = useState(0.5)
    const [status, setStatus] = useState('Ready')

    // Check haptics support on app load
    useEffect(() => {
        function checkHapticsSupport() {
            try {
                // Check if haptics are supported
                const supported = ExpoBetterHaptics.isSupported
                setIsSupported(supported)
                setInitialized(supported) // Auto-init when needed, so we can consider it ready

                if (supported) {
                    setStatus('Ready')
                } else {
                    setStatus('Haptics not supported on this device')
                }
            } catch (error) {
                console.error('Error checking haptics support:', error)
                setStatus('Error: ' + (error instanceof Error ? error.message : String(error)))
            }
        }

        checkHapticsSupport()
    }, [])

    // Create a custom pattern of haptic events
    const createCustomPattern = (): HapticEvent[] => {
        return [
            // First tap
            {
                type: 'transient', // Use string type instead of numeric constant
                time: 0,
                parameters: [
                    { id: HapticEventParameterType.Intensity, value: 0.8 },
                    { id: HapticEventParameterType.Sharpness, value: 0.5 },
                ],
            },
            // Small pause then second tap
            {
                type: 'transient', // Use string type instead of numeric constant
                time: 0.15,
                parameters: [
                    { id: HapticEventParameterType.Intensity, value: 0.5 },
                    { id: HapticEventParameterType.Sharpness, value: 0.3 },
                ],
            },
            // Longer pause then third tap
            {
                type: 'transient', // Use string type instead of numeric constant
                time: 0.4,
                parameters: [
                    { id: HapticEventParameterType.Intensity, value: 1.0 },
                    { id: HapticEventParameterType.Sharpness, value: 0.7 },
                ],
            },
        ]
    }

    // Create a more complex rhythm pattern
    const createRhythmPattern = (): HapticEvent[] => {
        const events: HapticEvent[] = []
        const rhythm = [0.1, 0.1, 0.2, 0.1, 0.1, 0.1, 0.1, 0.2] // eighth notes, quarter note pattern
        let time = 0

        rhythm.forEach((beat, index) => {
            // Alternate between higher and lower intensity
            const intensity = index % 2 === 0 ? 0.8 : 0.4
            // First beat of each measure is sharper
            const sharpness = index % 4 === 0 ? 0.7 : 0.3

            events.push({
                type: 'transient', // Use string type instead of numeric constant
                time,
                parameters: [
                    { id: HapticEventParameterType.Intensity, value: intensity },
                    { id: HapticEventParameterType.Sharpness, value: sharpness },
                ],
            })

            time += beat
        })

        return events
    }

    // Helper to handle button presses and set status
    const handleHapticButton = async (callback: () => Promise<void>, name: string) => {
        try {
            setStatus(`Playing: ${name}...`)
            await callback()
            setStatus('Ready')
        } catch (error) {
            console.error(`Error playing ${name}:`, error)
            setStatus(`Error: ${error instanceof Error ? error.message : String(error)}`)
        }
    }

    // Main testing UI
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
                <Text style={styles.title}>ExpoBetterHaptics Demo</Text>

                <View style={styles.statusContainer}>
                    <Text style={styles.statusLabel}>Status:</Text>
                    <Text style={styles.statusValue}>{status}</Text>
                    <Text style={styles.statusInfo}>
                        Haptics supported: {isSupported === null ? 'Checking...' : isSupported ? 'Yes' : 'No'}
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Basic Impacts</Text>
                    <View style={styles.buttonRow}>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => handleHapticButton(() => ExpoBetterHaptics.impactLight(), 'Light Impact')}
                            disabled={!isSupported}
                        >
                            <Text style={styles.buttonText}>Light</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => handleHapticButton(() => ExpoBetterHaptics.impactMedium(), 'Medium Impact')}
                            disabled={!isSupported}
                        >
                            <Text style={styles.buttonText}>Medium</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => handleHapticButton(() => ExpoBetterHaptics.impactHeavy(), 'Heavy Impact')}
                            disabled={!isSupported}
                        >
                            <Text style={styles.buttonText}>Heavy</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.buttonRow}>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => handleHapticButton(() => ExpoBetterHaptics.impactSoft(), 'Soft Impact')}
                            disabled={!isSupported}
                        >
                            <Text style={styles.buttonText}>Soft</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => handleHapticButton(() => ExpoBetterHaptics.impactRigid(), 'Rigid Impact')}
                            disabled={!isSupported}
                        >
                            <Text style={styles.buttonText}>Rigid</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Notifications</Text>
                    <View style={styles.buttonRow}>
                        <TouchableOpacity
                            style={[styles.button, styles.successButton]}
                            onPress={() =>
                                handleHapticButton(
                                    () => ExpoBetterHaptics.notificationSuccess(),
                                    'Success Notification',
                                )
                            }
                            disabled={!isSupported}
                        >
                            <Text style={styles.buttonText}>Success</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.button, styles.warningButton]}
                            onPress={() =>
                                handleHapticButton(
                                    () => ExpoBetterHaptics.notificationWarning(),
                                    'Warning Notification',
                                )
                            }
                            disabled={!isSupported}
                        >
                            <Text style={styles.buttonText}>Warning</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.button, styles.errorButton]}
                            onPress={() =>
                                handleHapticButton(() => ExpoBetterHaptics.notificationError(), 'Error Notification')
                            }
                            disabled={!isSupported}
                        >
                            <Text style={styles.buttonText}>Error</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Selection & Vibration</Text>
                    <View style={styles.buttonRow}>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => handleHapticButton(() => ExpoBetterHaptics.selection(), 'Selection')}
                            disabled={!isSupported}
                        >
                            <Text style={styles.buttonText}>Selection</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.button}
                            onPress={() =>
                                handleHapticButton(
                                    () => ExpoBetterHaptics.vibrate({ duration: 0.5 }),
                                    'Short Vibration',
                                )
                            }
                            disabled={!isSupported}
                        >
                            <Text style={styles.buttonText}>Short Vibrate</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.button}
                            onPress={() =>
                                handleHapticButton(() => ExpoBetterHaptics.vibrate({ duration: 1.0 }), 'Long Vibration')
                            }
                            disabled={!isSupported}
                        >
                            <Text style={styles.buttonText}>Long Vibrate</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Custom Patterns</Text>
                    <View style={styles.buttonRow}>
                        <TouchableOpacity
                            style={[styles.button, { flex: 1 }]}
                            onPress={() =>
                                handleHapticButton(
                                    () => ExpoBetterHaptics.play(createCustomPattern()),
                                    'Simple Pattern',
                                )
                            }
                            disabled={!isSupported}
                        >
                            <Text style={styles.buttonText}>Simple Pattern</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.button, { flex: 1 }]}
                            onPress={() =>
                                handleHapticButton(
                                    () => ExpoBetterHaptics.play(createRhythmPattern()),
                                    'Rhythm Pattern',
                                )
                            }
                            disabled={!isSupported}
                        >
                            <Text style={styles.buttonText}>Rhythm Pattern</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Custom Haptic</Text>

                    <View style={styles.sliderContainer}>
                        <Text style={styles.sliderLabel}>Intensity: {intensity.toFixed(2)}</Text>
                        <Slider
                            style={styles.slider}
                            value={intensity}
                            onValueChange={setIntensity}
                            minimumValue={0}
                            maximumValue={1}
                            step={0.01}
                            minimumTrackTintColor="#007AFF"
                            maximumTrackTintColor="#DDDDDD"
                        />
                    </View>

                    <View style={styles.sliderContainer}>
                        <Text style={styles.sliderLabel}>Sharpness: {sharpness.toFixed(2)}</Text>
                        <Slider
                            style={styles.slider}
                            value={sharpness}
                            onValueChange={setSharpness}
                            minimumValue={0}
                            maximumValue={1}
                            step={0.01}
                            minimumTrackTintColor="#007AFF"
                            maximumTrackTintColor="#DDDDDD"
                        />
                    </View>

                    <View style={styles.sliderContainer}>
                        <Text style={styles.sliderLabel}>Duration: {duration.toFixed(2)}s</Text>
                        <Slider
                            style={styles.slider}
                            value={duration}
                            onValueChange={setDuration}
                            minimumValue={0.1}
                            maximumValue={2}
                            step={0.1}
                            minimumTrackTintColor="#007AFF"
                            maximumTrackTintColor="#DDDDDD"
                        />
                    </View>

                    <View style={styles.buttonRow}>
                        <TouchableOpacity
                            style={[styles.button, { flex: 1 }]}
                            onPress={() =>
                                handleHapticButton(
                                    () => ExpoBetterHaptics.playTransient(intensity, sharpness),
                                    'Transient',
                                )
                            }
                            disabled={!isSupported}
                        >
                            <Text style={styles.buttonText}>Transient</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.button, { flex: 1 }]}
                            onPress={() =>
                                handleHapticButton(
                                    () =>
                                        ExpoBetterHaptics.play([
                                            {
                                                type: 'continuous', // Use string type instead of numeric constant
                                                time: 0,
                                                duration: duration,
                                                parameters: [
                                                    {
                                                        id: HapticEventParameterType.Intensity,
                                                        value: intensity,
                                                    },
                                                    {
                                                        id: HapticEventParameterType.Sharpness,
                                                        value: sharpness,
                                                    },
                                                ],
                                            },
                                        ]),
                                    'Continuous',
                                )
                            }
                            disabled={!isSupported}
                        >
                            <Text style={styles.buttonText}>Continuous</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Engine Control</Text>
                    <View style={styles.buttonRow}>
                        <TouchableOpacity
                            style={[styles.button, { flex: 1 }]}
                            onPress={async () => {
                                try {
                                    setStatus('Initializing haptic engine explicitly...')
                                    await ExpoBetterHaptics.initialize()
                                    setInitialized(true)
                                    setStatus('Engine explicitly initialized')
                                } catch (error) {
                                    console.error('Error initializing haptic engine:', error)
                                    setStatus(`Error: ${error instanceof Error ? error.message : String(error)}`)
                                }
                            }}
                            disabled={!isSupported}
                        >
                            <Text style={styles.buttonText}>Explicit Init</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.button, { flex: 1 }]}
                            onPress={async () => {
                                try {
                                    setStatus('Stopping haptic engine...')
                                    setInitialized(false)
                                    setStatus('Engine state reset')
                                } catch (error) {
                                    console.error('Error stopping haptic engine:', error)
                                    setStatus(`Error: ${error instanceof Error ? error.message : String(error)}`)
                                }
                            }}
                            disabled={!isSupported}
                        >
                            <Text style={styles.buttonText}>Reset Engine</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>ExpoBetterHaptics Demo App</Text>
                    <Text style={styles.footerVersion}>v1.0.0</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    scrollView: {
        flex: 1,
    },
    contentContainer: {
        paddingVertical: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 16,
        color: '#333',
    },
    statusContainer: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 16,
        marginHorizontal: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    statusLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
        color: '#333',
    },
    statusValue: {
        fontSize: 16,
        marginBottom: 8,
        color: '#007AFF',
    },
    statusInfo: {
        fontSize: 14,
        color: '#666',
    },
    section: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 16,
        marginHorizontal: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#333',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
    },
    button: {
        flex: Platform.OS === 'android' ? 0 : 1,
        backgroundColor: '#007AFF',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginRight: 8,
        marginBottom: 8,
        minWidth: 100,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontWeight: '600',
        fontSize: 16,
    },
    successButton: {
        backgroundColor: '#34C759',
    },
    warningButton: {
        backgroundColor: '#FF9500',
    },
    errorButton: {
        backgroundColor: '#FF3B30',
    },
    sliderContainer: {
        marginBottom: 16,
    },
    sliderLabel: {
        fontSize: 16,
        marginBottom: 8,
        color: '#333',
    },
    slider: {
        width: '100%',
        height: 40,
    },
    footer: {
        marginTop: 8,
        marginBottom: 20,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 14,
        color: '#666',
    },
    footerVersion: {
        fontSize: 12,
        color: '#999',
        marginTop: 4,
    },
})
