import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { WebView } from "react-native-webview";
import Icon from "react-native-vector-icons/Ionicons";

const { width, height } = Dimensions.get("window");

const ChatBotWidget = () => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      {/* Floating button */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => setVisible(!visible)}
      >
        <Icon name="chatbubble-ellipses" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Floating WebView bubble */}
      {visible && (
        <View style={styles.webviewContainer}>
          <WebView
  originWhitelist={["*"]}
  javaScriptEnabled
  domStorageEnabled
  mixedContentMode="always"
  onLoadStart={() => console.log("✅ WebView started loading")}
  onLoadEnd={() => console.log("✅ WebView finished loading")}
  onError={(e) => console.log("❌ WebView error:", e.nativeEvent)}
  onHttpError={(e) =>
    console.log("❌ HTTP error:", e.nativeEvent.statusCode, e.nativeEvent.url)
  }
  source={{
    html: `... your Tawk.to script html ...`,
  }}
  style={{ flex: 1, borderRadius: 10, overflow: "hidden" }}
/>

        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  floatingButton: {
    position: "absolute",
    bottom: 25,
    right: 20,
    backgroundColor: "#0078ff",
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
    zIndex: 999,
  },
  webviewContainer: {
    position: "absolute",
    bottom: 90,
    right: 20,
    width: width * 0.9,
    height: height * 0.6,
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 6,
    zIndex: 998,
  },
});

export default ChatBotWidget;
