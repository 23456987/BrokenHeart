import React, { useEffect } from "react";
import { Platform } from "react-native"; // Keep only necessary imports
import SpInAppUpdates, {
  IAUUpdateKind,
  // IAUInstallStatus is no longer needed for Immediate flow
} from "sp-react-native-in-app-updates";

// NOTE: We no longer need useState, useRef, Modal, TouchableOpacity, 
// ActivityIndicator, Alert, or StyleSheet for this minimal implementation.

const AppUpdateChecker = () => {
  // --- Core Update Logic ---
  const checkUpdate = async () => {
    // 1. Only run for Android, as iOS requires deep-linking to the App Store
    // which usually requires a custom alert/modal anyway.
    if (Platform.OS !== "android") {
      // You can add logic for iOS here to deep-link to the App Store if needed.
      return;
    }

    try {
      const inAppUpdates = new SpInAppUpdates(false); // false = not debug

      const result = await inAppUpdates.checkNeedsUpdate();

      if (result.shouldUpdate) {
        // 2. Start the IMMEDIATE update flow. 
        // This triggers the native full-screen update dialog from Google Play.
        await inAppUpdates.startUpdate({
          updateType: IAUUpdateKind.IMMEDIATE,
        });

        // The user is blocked until they complete the update (or the app is closed/killed).
        // No need for status listeners or custom UI logic.
      }
    } catch (error) {
      console.log("In-App Update check failed:", error);
      // You might show a generic Alert here, but typically for Immediate flow, 
      // failure means the user must manually update via the Play Store.
    }
  };

  useEffect(() => {
    checkUpdate();
    // No cleanup is necessary as we are not using listeners.
  }, []);

  // 3. The component renders nothing (null) because the update UI 
  // is handled entirely by the native Google Play system.
  return null;
};

export default AppUpdateChecker;

// The previous styles block and other unused imports are now gone.