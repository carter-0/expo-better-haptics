import ExpoModulesCore
import CoreHaptics

public class ExpoBetterHapticsModule: Module {
    // Store the haptic engine as a class property
    private var engine: CHHapticEngine?
    private var supportsHaptics: Bool = false
    
    // Feedback generators for UIKit haptics
    private var impactLight: UIImpactFeedbackGenerator?
    private var impactMedium: UIImpactFeedbackGenerator?
    private var impactHeavy: UIImpactFeedbackGenerator?
    private var impactSoft: UIImpactFeedbackGenerator?
    private var impactRigid: UIImpactFeedbackGenerator?
    private var notificationGenerator: UINotificationFeedbackGenerator?
    private var selectionGenerator: UISelectionFeedbackGenerator?
    
    // Set up the haptic engine when module is initialized
    public func definition() -> ModuleDefinition {
        Name("ExpoBetterHaptics")

        // Expose constants to JavaScript
        Constants([
            // Basic capabilities info
            "isSupported": CHHapticEngine.capabilitiesForHardware().supportsHaptics,
            
            // Haptic parameter types
            "HapticEventTypes": [
                "transient": CHHapticEvent.EventType.hapticTransient.rawValue,
                "continuous": CHHapticEvent.EventType.hapticContinuous.rawValue
            ],
            
            // Event parameter keys
            "HapticEventParameters": [
                "intensity": CHHapticEvent.ParameterID.hapticIntensity.rawValue,
                "sharpness": CHHapticEvent.ParameterID.hapticSharpness.rawValue,
                "attackTime": CHHapticEvent.ParameterID.attackTime.rawValue,
                "decayTime": CHHapticEvent.ParameterID.decayTime.rawValue,
                "releaseTime": CHHapticEvent.ParameterID.releaseTime.rawValue,
                "sustained": CHHapticEvent.ParameterID.sustained.rawValue
            ],
            
            // Dynamic parameter keys
            "DynamicParameterIDs": [
                "intensity": CHHapticDynamicParameter.ID.hapticIntensityControl.rawValue,
                "sharpness": CHHapticDynamicParameter.ID.hapticSharpnessControl.rawValue
            ]
        ])
        
        // Initialize the haptic engine if device supports haptics
        AsyncFunction("initialize") { () -> Bool in
            let hapticCapability = CHHapticEngine.capabilitiesForHardware()
            self.supportsHaptics = hapticCapability.supportsHaptics
            
            if !self.supportsHaptics {
                return false
            }
            
            // Initialize all UIKit feedback generators
            self.impactLight = UIImpactFeedbackGenerator(style: .light)
            self.impactMedium = UIImpactFeedbackGenerator(style: .medium)
            self.impactHeavy = UIImpactFeedbackGenerator(style: .heavy)
            self.impactSoft = UIImpactFeedbackGenerator(style: .soft)
            self.impactRigid = UIImpactFeedbackGenerator(style: .rigid)
            self.notificationGenerator = UINotificationFeedbackGenerator()
            self.selectionGenerator = UISelectionFeedbackGenerator()
            
            // Prepare all generators
            self.impactLight?.prepare()
            self.impactMedium?.prepare()
            self.impactHeavy?.prepare()
            self.impactSoft?.prepare()
            self.impactRigid?.prepare()
            self.notificationGenerator?.prepare()
            self.selectionGenerator?.prepare()
            
            do {
                self.engine = try CHHapticEngine()
                
                // Set up engine reset handler
                self.engine?.resetHandler = {
                    do {
                        try self.engine?.start()
                    } catch {
                        print("Failed to restart the engine: \(error)")
                    }
                }
                
                // Set up engine stopped handler for debugging
                self.engine?.stoppedHandler = { reason in
                    print("Haptic engine stopped: \(reason.rawValue)")
                }
                
                return true
            } catch {
                print("Failed to create haptic engine: \(error)")
                return false
            }
        }
        
        // Start the haptic engine
        AsyncFunction("start") { () -> Bool in
            guard let engine = self.engine, self.supportsHaptics else {
                return false
            }
            
            do {
                try engine.start()
                return true
            } catch {
                print("Failed to start the engine: \(error)")
                return false
            }
        }
        
        // Stop the haptic engine
        AsyncFunction("stop") { () -> Bool in
            guard let engine = self.engine, self.supportsHaptics else {
                return false
            }
            
            engine.stop(completionHandler: nil)
            return true
        }
        
        // Impact feedback methods using UIImpactFeedbackGenerator
        AsyncFunction("impactLight") { () -> Bool in
            if !self.supportsHaptics {
                return false
            }
            
            DispatchQueue.main.async {
                self.impactLight?.impactOccurred()
            }
            return true
        }
        
        AsyncFunction("impactMedium") { () -> Bool in
            if !self.supportsHaptics {
                return false
            }
            
            DispatchQueue.main.async {
                self.impactMedium?.impactOccurred()
            }
            return true
        }
        
        AsyncFunction("impactHeavy") { () -> Bool in
            if !self.supportsHaptics {
                return false
            }
            
            DispatchQueue.main.async {
                self.impactHeavy?.impactOccurred()
            }
            return true
        }
        
        AsyncFunction("impactSoft") { () -> Bool in
            if !self.supportsHaptics {
                return false
            }
            
            DispatchQueue.main.async {
                self.impactSoft?.impactOccurred()
            }
            return true
        }
        
        AsyncFunction("impactRigid") { () -> Bool in
            if !self.supportsHaptics {
                return false
            }
            
            DispatchQueue.main.async {
                self.impactRigid?.impactOccurred()
            }
            return true
        }
        
        // Notification feedback methods using UINotificationFeedbackGenerator
        AsyncFunction("notificationSuccess") { () -> Bool in
            if !self.supportsHaptics {
                return false
            }
            
            DispatchQueue.main.async {
                self.notificationGenerator?.notificationOccurred(.success)
            }
            return true
        }
        
        AsyncFunction("notificationWarning") { () -> Bool in
            if !self.supportsHaptics {
                return false
            }
            
            DispatchQueue.main.async {
                self.notificationGenerator?.notificationOccurred(.warning)
            }
            return true
        }
        
        AsyncFunction("notificationError") { () -> Bool in
            if !self.supportsHaptics {
                return false
            }
            
            DispatchQueue.main.async {
                self.notificationGenerator?.notificationOccurred(.error)
            }
            return true
        }
        
        // Selection feedback method using UISelectionFeedbackGenerator
        AsyncFunction("selection") { () -> Bool in
            if !self.supportsHaptics {
                return false
            }
            
            DispatchQueue.main.async {
                self.selectionGenerator?.selectionChanged()
            }
            return true
        }
        
        // Play a simple transient haptic pattern with customizable intensity and sharpness
        // This is kept for backward compatibility and custom haptics
        AsyncFunction("playTransient") { (intensity: Float, sharpness: Float) -> Bool in
            guard let engine = self.engine, self.supportsHaptics else {
                return false
            }
            
            do {
                // Create a transient haptic event
                let intensity = CHHapticEventParameter(parameterID: .hapticIntensity, value: intensity)
                let sharpness = CHHapticEventParameter(parameterID: .hapticSharpness, value: sharpness)
                
                let event = CHHapticEvent(eventType: .hapticTransient, parameters: [intensity, sharpness], relativeTime: 0)
                
                // Create a pattern from the event
                let pattern = try CHHapticPattern(events: [event], parameters: [])
                
                // Create a player to play the pattern
                let player = try engine.makePlayer(with: pattern)
                
                // Start the engine
                try engine.start()
                
                // Play the pattern
                try player.start(atTime: CHHapticTimeImmediate)
                return true
            } catch {
                print("Failed to play haptic: \(error)")
                return false
            }
        }
        
        // Play a continuous haptic pattern with customizable intensity, sharpness, and duration
        // This is kept for backward compatibility and custom haptics
        AsyncFunction("playContinuous") { (intensity: Float, sharpness: Float, duration: Double) -> Bool in
            guard let engine = self.engine, self.supportsHaptics else {
                return false
            }
            
            do {
                // Create a continuous haptic event
                let intensity = CHHapticEventParameter(parameterID: .hapticIntensity, value: intensity)
                let sharpness = CHHapticEventParameter(parameterID: .hapticSharpness, value: sharpness)
                
                let event = CHHapticEvent(eventType: .hapticContinuous, parameters: [intensity, sharpness], relativeTime: 0, duration: duration)
                
                // Create a pattern from the event
                let pattern = try CHHapticPattern(events: [event], parameters: [])
                
                // Create a player to play the pattern
                let player = try engine.makePlayer(with: pattern)
                
                // Start the engine
                try engine.start()
                
                // Play the pattern
                try player.start(atTime: CHHapticTimeImmediate)
                return true
            } catch {
                print("Failed to play haptic: \(error)")
                return false
            }
        }
        
        // Play a custom haptic pattern defined by an array of events
        AsyncFunction("playPattern") { (events: [[String: Any]]) -> Bool in
            guard let engine = self.engine, self.supportsHaptics else {
                return false
            }
            
            do {
                var hapticEvents: [CHHapticEvent] = []
                
                // Convert JS event objects to CHHapticEvent objects
                for event in events {
                    guard let type = event["type"] as? String,
                          let time = event["time"] as? TimeInterval,
                          let parameters = event["parameters"] as? [[String: Any]] else {
                        continue
                    }
                    
                    // Use event type directly based on the string type
                    let eventType: CHHapticEvent.EventType
                    if type == "transient" {
                        eventType = .hapticTransient
                    } else if type == "continuous" {
                        eventType = .hapticContinuous
                    } else {
                        continue
                    }
                    
                    var hapticParameters: [CHHapticEventParameter] = []
                    
                    // Convert JS parameter objects to CHHapticEventParameter objects
                    for param in parameters {
                        guard let id = param["id"] as? String,
                              let value = param["value"] as? Float else {
                            continue
                        }
                        
                        // Map string to parameter ID
                        let parameterID: CHHapticEvent.ParameterID
                        switch id {
                            case "intensity": parameterID = .hapticIntensity
                            case "sharpness": parameterID = .hapticSharpness
                            case "attackTime": parameterID = .attackTime
                            case "decayTime": parameterID = .decayTime
                            case "releaseTime": parameterID = .releaseTime
                            case "sustained": parameterID = .sustained
                            default: continue
                        }
                        
                        let hapticParameter = CHHapticEventParameter(parameterID: parameterID, value: value)
                        hapticParameters.append(hapticParameter)
                    }
                    
                    // Create haptic event with appropriate type and duration
                    if eventType == .hapticContinuous {
                        guard let duration = event["duration"] as? TimeInterval else {
                            continue
                        }
                        
                        let hapticEvent = CHHapticEvent(eventType: eventType, parameters: hapticParameters, relativeTime: time, duration: duration)
                        hapticEvents.append(hapticEvent)
                    } else {
                        let hapticEvent = CHHapticEvent(eventType: eventType, parameters: hapticParameters, relativeTime: time)
                        hapticEvents.append(hapticEvent)
                    }
                }
                
                // Create a pattern from the events
                let pattern = try CHHapticPattern(events: hapticEvents, parameters: [])
                
                // Create a player to play the pattern
                let player = try engine.makePlayer(with: pattern)
                
                // Start the engine
                try engine.start()
                
                // Play the pattern
                try player.start(atTime: CHHapticTimeImmediate)
                return true
            } catch {
                print("Failed to play pattern: \(error)")
                return false
            }
        }
    }
}