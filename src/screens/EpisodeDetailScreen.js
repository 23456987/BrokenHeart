import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
  Alert,
  Platform,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { WebView } from "react-native-webview";
import Icon from "react-native-vector-icons/MaterialIcons";
import CommentSection from "./CommentSection";
import LanguageModal from "./LanguageModal";
import Tts from "react-native-tts";

const { width } = Dimensions.get("window");

export default function EpisodeScreen() {
  const [isCommentModalVisible, setCommentModalVisible] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLangModalVisible, setLangModalVisible] = useState(false);
  const [voices, setVoices] = useState([]);

  const route = useRoute();
  const { title, content, date, author, image, video_link, id } = route.params;

  // 🔊 Setup TTS
  useEffect(() => {
    // Fetch voices
    Tts.voices().then(v => {
      // console.log("📢 Available voices:", v);
      setVoices(v);
    });

    Tts.addEventListener("tts-start", () => setIsSpeaking(true));
    Tts.addEventListener("tts-finish", () => setIsSpeaking(false));
    Tts.addEventListener("tts-cancel", () => setIsSpeaking(false));
    Tts.addEventListener("tts-error", (e) => {
      // console.log("❌ TTS Error:", e);
      setIsSpeaking(false);
      Alert.alert("TTS Error", "Language data is missing or not supported.");
    });

    return () => {
      Tts.stop();
      Tts.removeAllListeners("tts-start");
      Tts.removeAllListeners("tts-finish");
      Tts.removeAllListeners("tts-cancel");
      Tts.removeAllListeners("tts-error");
    };
  }, []);

  const isYouTubeLink =
    video_link &&
    (video_link.includes("youtube.com") || video_link.includes("youtu.be"));

  const getYouTubeIframe = (url) => {
    const videoIdMatch = url.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    const videoId = videoIdMatch ? videoIdMatch[1] : null;
    if (!videoId) return null;
    return `
      <html>
        <body style="margin:0;padding:0;background-color:#000;">
          <iframe 
            width="100%" 
            height="100%" 
            src="https://www.youtube.com/embed/${videoId}?controls=1&autoplay=0"
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen
          ></iframe>
        </body>
      </html>
    `;
  };

  // ✅ Speak text with proper voice setup
  const speakText = async (lang) => {
    try {
      await Tts.stop();

      // Find a valid voice for the language
      const voice = voices.find(
        v => v.language === lang && !v.notInstalled
      );

      if (!voice) {
        Alert.alert(
          "Language Not Available",
          "This language is not installed. Do you want to install it?",
          [
            {
              text: "Install",
              onPress: () => {
                try {
                  Tts.requestInstallData();
                } catch {
                  Alert.alert("Error", "Unable to open TTS installer");
                }
              },
            },
            { text: "Cancel", style: "cancel" },
          ]
        );
        return;
      }

      await Tts.setDefaultLanguage(lang);
      await Tts.setDefaultVoice(voice.id);

      setIsSpeaking(true);
      await Tts.speak(`${title}. ${content}`);
    } catch (e) {
      // console.log("❌ Speak Error:", e);
      setIsSpeaking(false);
    }
  };

  return (
    <ImageBackground
      source={require("../assets/images/heart_bg.jpeg")}
      style={styles.background}
      resizeMode="cover"
    >
      <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
        {isYouTubeLink ? (
          <View style={styles.videoWrapper}>
            <WebView
              originWhitelist={["*"]}
              source={{ html: getYouTubeIframe(video_link) }}
              style={styles.video}
              allowsFullscreenVideo
            />
          </View>
        ) : (
          <Image source={{ uri: image }} style={styles.banner} />
        )}

        <View style={styles.contentContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.meta}>
            <Text style={styles.metaLabel}>By </Text>
            {author}
            <Text style={styles.metaLabel}> | </Text>
            {date}
          </Text>
          <View style={styles.divider} />
          <Text style={styles.content}>{content}</Text>
        </View>
      </ScrollView>

      {/* Floating Comment Icon */}
      <TouchableOpacity
        style={[styles.fab, { right: 20, bottom: 20 }]}
        onPress={() => setCommentModalVisible(true)}
      >
        <Icon name="comment" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Floating Voice Icon
        
        
        <TouchableOpacity
        style={[styles.fab, { right: 80, bottom: 20, backgroundColor: "#009688" }]}
        onPress={() => {
          if (isSpeaking) {
            Tts.stop();
            setIsSpeaking(false);
          } else {
            setLangModalVisible(true);
          }
        }}
      >
        <Icon
          name={isSpeaking ? "stop" : "record-voice-over"}
          size={24}
          color="#fff"
        />
      </TouchableOpacity>
        
        
        
        */}
      

      <CommentSection
        postId={id}
        isVisible={isCommentModalVisible}
        onClose={() => setCommentModalVisible(false)}
      />

      {/* 🔊 Language Modal */}
      <LanguageModal
        isVisible={isLangModalVisible}
        onClose={() => setLangModalVisible(false)}
        onSelect={(lang) => {
          setLangModalVisible(false);
          speakText(lang);
        }}
      />
    </ImageBackground>
  );
}
const styles = StyleSheet.create({
  background: { flex: 1 },
  scroll: { flex: 1 },
  container: {
    paddingBottom: 60,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 10,
    margin: 10,
  },
  banner: {
    width: "100%",
    height: 220,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    resizeMode: "cover",
  },
  videoWrapper: {
    width: "100%",
    height: 220,
    overflow: "hidden",
    borderRadius: 16,
    backgroundColor: "#000",
  },
  video: { flex: 1, height: 200 },
  contentContainer: { padding: 20 },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#b30059",
    marginBottom: 6,
  },
  meta: { fontSize: 14, color: "#aa4a66", marginBottom: 14 },
  metaLabel: { color: "#d66" },
  divider: { height: 1, backgroundColor: "#ccc", marginBottom: 16 },
  content: { fontSize: 16, color: "#444", lineHeight: 26 },
  fab: {
    position: "absolute",
    backgroundColor: "#b30059",
    padding: 14,
    borderRadius: 28,
    elevation: 6,
  },
});
