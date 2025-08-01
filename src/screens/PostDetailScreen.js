import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  ScrollView,
  Text,
  ActivityIndicator,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert,
} from 'react-native';
import axios from 'axios';
import { WebView } from 'react-native-webview';
import VoiceIcon from 'react-native-vector-icons/FontAwesome';
import Tts from 'react-native-tts';
import CommentSection from './CommentSections';

const screenHeight = Dimensions.get('window').height;

export default function PostDetailScreen({ route }) {
  const { postId, playVideo } = route.params || {};
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const stopRequested = useRef(false);
  const [isCommentModalVisible, setIsCommentModalVisible] = useState(false);


  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`https://brokenheart.in/wp-json/brokenheart-api/v1/get-posts/`);
        const found = res.data.find(p => p.id === postId);
        setPost(found);
      } catch (error) {
        console.log('❌ Error fetching post:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [postId]);

  useEffect(() => {
    const onStart = () => setIsSpeaking(true);
    const onFinish = () => setIsSpeaking(false);
    const onCancel = () => setIsSpeaking(false);

    Tts.addEventListener('tts-start', onStart);
    Tts.addEventListener('tts-finish', onFinish);
    Tts.addEventListener('tts-cancel', onCancel);

    return () => {
      Tts.removeAllListeners('tts-start');
      Tts.removeAllListeners('tts-finish');
      Tts.removeAllListeners('tts-cancel');
    };
  }, []);

  const translateText = async (text) => {
    try {
      const response = await axios.get('https://translate.googleapis.com/translate_a/single', {
        params: {
          client: 'gtx',
          sl: 'te',
          tl: 'en',
          dt: 't',
          q: text,
        },
      });
      return response.data?.[0]?.[0]?.[0];
    } catch (error) {
      console.log('❌ Translation Error:', error.message);
      return null;
    }
  };

  const handleMicPress = () => {
    if (isSpeaking) {
      stopRequested.current = true;
      Tts.stop();
      setIsSpeaking(false);
      return;
    }

    if (!post?.content) return;

    stopRequested.current = false;

    Alert.alert(
      'Choose Language',
      'Which language do you want to listen in?',
      [
        { text: 'Telugu', onPress: () => speakContent(true) },
        { text: 'English', onPress: () => speakContent(false) },
        { text: 'Cancel', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };

const speakContent = async (speakTelugu) => {
  const rawContent = post.content?.rendered || post.content || '';
  const plainText = rawContent.replace(/<[^>]+>/g, '').replace(/&#8211;/g, '–').trim();

  if (!plainText) return;

  const isTelugu = /[ఁ-౿]/.test(plainText);

  try {
    await Tts.stop();
    await new Promise(resolve => setTimeout(resolve, 300));

    const chunks = plainText.length > 4000
      ? Array.from({ length: Math.ceil(plainText.length / 500) }, (_, i) =>
        plainText.slice(i * 500, (i + 1) * 500))
      : [plainText];

    const voices = await Tts.voices();
    const teluguVoice = voices.find(v => v.language === 'te-IN' && !v.notInstalled);
    const englishVoice = voices.find(v => v.language === 'en-US' && !v.notInstalled);
    const selectedVoice = speakTelugu ? teluguVoice : englishVoice;

    console.log('Available Voices:', voices);
    console.log('Selected Voice:', selectedVoice);

    if (!selectedVoice) {
      Alert.alert('Voice not available', `Please install a ${speakTelugu ? 'Telugu' : 'English'} voice.`);
      return;
    }

    await Tts.setDefaultLanguage(selectedVoice.language);
    await Tts.setDefaultVoice(selectedVoice.id);
    await Tts.setDefaultRate(0.5);

    setIsSpeaking(true);

    for (let i = 0; i < chunks.length; i++) {
      if (stopRequested.current) break;

      let text = chunks[i];

      if (!speakTelugu && isTelugu) {
        const translated = await translateText(text);
        console.log(`Original: ${text}`);
        console.log(`Translated: ${translated}`);
        if (!translated) continue;
        text = translated;
      }

      console.log(`Speaking chunk ${i + 1}/${chunks.length}`);
      Tts.speak(text);

      // Wait based on text length (~60ms per word)
      const estimatedDuration = Math.max(2000, text.split(' ').length * 60);
      await new Promise(resolve => setTimeout(resolve, estimatedDuration));
    }

    setIsSpeaking(false);
  } catch (err) {
    console.log('❌ Error in speakContent:', err.message);
    setIsSpeaking(false);
  }
};

  const extractYouTubeId = (url) => {
    const match = url?.match(/(?:v=|\.be\/|\/embed\/)([\w-]{11})/);
    return match ? match[1] : null;
  };

  if (loading) {
    return (
      <ActivityIndicator size="large" style={{ flex: 1, backgroundColor: '#121212' }} color="#fff" />
    );
  }

  if (!post) {
    return (
      <View style={styles.center}>
        <Text style={{ color: '#fff' }}>⚠️ Post not found</Text>
      </View>
    );
  }

  const videoId = extractYouTubeId(post.video_link);
  const showMic = !videoId && post.featured_image;

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 120 }}>

        {videoId ? (
          <View style={styles.videoContainer}>
            <WebView
              style={styles.webview}
              javaScriptEnabled
              domStorageEnabled
              allowsFullscreenVideo
              allowsInlineMediaPlayback
              mediaPlaybackRequiresUserAction={false}
              source={{ uri: `https://www.youtube.com/embed/${videoId}?controls=1${playVideo ? '&autoplay=1&mute=1' : ''}` }}
            />
          </View>
        ) : post.featured_image && (
          <Image source={{ uri: post.featured_image }} style={styles.image} />
        )}

        <Text style={styles.title}>{post.title}</Text>
        {post.date && <Text style={styles.date}>{post.date}</Text>}
        {post.author && <Text style={styles.author}>By {post.author}</Text>}

        <TouchableOpacity
          style={styles.readMoreButton}
          onPress={() => setShowContent(prev => !prev)}
        >
          <Text style={styles.readMoreText}>
            {showContent ? 'Hide Story' : 'Read Story'}
          </Text>
        </TouchableOpacity>
        {showContent && (
          <Text style={styles.content}>
            {post.content?.replace(/<[^>]+>/g, '').replace(/&#8211;/g, '–').trim()}
          </Text>
        )}
          <CommentSection postId={post.id} />

      </ScrollView>

      {showMic && (
        <TouchableOpacity style={styles.micButton} onPress={handleMicPress}>
          <VoiceIcon
            name={isSpeaking ? 'stop-circle' : 'volume-up'}
            size={24}
            color="#fff"
          />
        </TouchableOpacity>
      )}


{/* 💬 Comment Icon */}
<TouchableOpacity
  style={styles.commentFab}
  onPress={() => setIsCommentModalVisible(true)}
>
  <VoiceIcon name="comment" size={22} color="#fff" />
</TouchableOpacity>

{/* Comment Section */}
<CommentSection
  postId={post.id}
  isVisible={isCommentModalVisible}
  onClose={() => setIsCommentModalVisible(false)}
/>



    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#121212',
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginTop: 12,
    marginBottom: 4,
  },
  date: {
    fontSize: 13,
    color: '#aaaaaa',
    marginBottom: 4,
  },
  author: {
    fontSize: 13,
    color: '#bbbbbb',
    fontStyle: 'italic',
    marginBottom: 16,
  },
  videoContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: '#000',
  },
  webview: {
    height: screenHeight * 0.3,
    width: '100%',
  },
  image: {
    width: '100%',
    height: 220,
    borderRadius: 12,
    marginBottom: 16,
  },
  readMoreButton: {
    backgroundColor: '#000',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  readMoreText: {
    color: 'crimson',
    fontSize: 16,
    fontWeight: '700',
  },
  content: {
    fontSize: 16,
    lineHeight: 26,
    color: '#e0e0e0',
    marginTop: 10,
  },
  micButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#ff5252',
    padding: 16,
    borderRadius: 32,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  commentSection: {
    marginTop: 30,
    borderTopWidth: 1,
    borderTopColor: '#333',
    paddingTop: 20,
  },
  commentTitle: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 12,
  },
  commentBox: {
    backgroundColor: '#1e1e1e',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  commentAuthor: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#f1c40f',
    marginBottom: 4,
  },
  commentText: {
    fontSize: 15,
    color: '#f0f0f0',
    marginBottom: 6,
  },
  commentDate: {
    fontSize: 12,
    color: '#aaa',
    textAlign: 'right',
  },
  noCommentsText: {
    color: '#999',
    fontStyle: 'italic',
    marginVertical: 10,
    textAlign: 'center',
  },
  commentInput: {
    height: 80,
    backgroundColor: '#1e1e1e',
    color: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingTop: 10,
    marginTop: 10,
    textAlignVertical: 'top',
  },
  commentButton: {
    backgroundColor: '#ff5252',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginTop: 10,
    alignSelf: 'flex-end',
    marginRight: 120,
  },
  commentButtonText: {
    color: '#fff',
    fontWeight: 'bold',

  },
  commentFab: {
  position: 'absolute',
  bottom: 100,
  right: 20,
  backgroundColor: '#2196F3',
  padding: 16,
  borderRadius: 32,
  elevation: 6,
  shadowColor: '#000',
  shadowOpacity: 0.3,
  shadowRadius: 6,
  shadowOffset: { width: 0, height: 4 },
},

});
