import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { WebView } from 'react-native-webview';
import CommentSection from '../screens/CommentSection';
import useTranslator from '../screens/Translator';

const { width } = Dimensions.get('window');

export default function PostCard({ post, onPress, playInCard = false }) {
  const {
    translatesText,
    translatedText,
    loading,
    targetLang,
  } = useTranslator();

  const [mediaLoading, setMediaLoading] = useState(true);
  const [commentVisible, setCommentVisible] = useState(false);
  const [muted, setMuted] = useState(true);

  const thumbnail = post.featured_image;
  const videoUrl = post.video_link;
  const excerptText = post.excerpt?.replace(/<[^>]+>/g, '').trim() || '';
  const author = post.author || 'Unknown Author';
  const date = post.date || '';

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    const regex = /(?:youtube\.com\/.*v=|youtu\.be\/)([^&?/]+)/;
    const match = url.match(regex);
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}?autoplay=${playInCard ? 1 : 0}&mute=${muted ? 1 : 0}&playsinline=1&controls=1`;
    }
    return null;
  };

  const youTubeEmbedUrl = getYouTubeEmbedUrl(videoUrl);

  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={() => onPress({ playVideo: true })} activeOpacity={1}>
        <View style={{ position: 'relative' }}>
          {mediaLoading && (
            <ActivityIndicator
              size="large"
              color="#aaa"
              style={{ position: 'absolute', top: '40%', alignSelf: 'center', zIndex: 10 }}
            />
          )}

          {youTubeEmbedUrl ? (
            <WebView
              key={`${youTubeEmbedUrl}-${muted}`}
              style={styles.video}
              source={{
                html: `
                  <html>
                    <body style="margin:0;padding:0;">
                      <iframe 
                        src="${youTubeEmbedUrl}" 
                        frameborder="0" 
                        allow="autoplay; encrypted-media" 
                        allowfullscreen 
                        style="width:100%; height:100%;">
                      </iframe>
                    </body>
                  </html>
                `,
              }}
              javaScriptEnabled
              domStorageEnabled
              allowsInlineMediaPlayback
              mediaPlaybackRequiresUserAction={!playInCard}
              onLoadStart={() => setMediaLoading(true)}
              onLoadEnd={() => setMediaLoading(false)}
            />
          ) : (
            thumbnail && (
              <Image
                source={{ uri: thumbnail }}
                style={styles.image}
                onLoadStart={() => setMediaLoading(true)}
                onLoadEnd={() => setMediaLoading(false)}
              />
            )
          )}

          {youTubeEmbedUrl && (
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation();
                setMuted((prev) => !prev);
              }}
              style={styles.unmuteButton}
            >
              <Text style={styles.unmuteText}>{muted ? '🔇 Unmute' : '🔊 Mute'}</Text>
            </TouchableOpacity>
          )}
        </View>
      

      <View style={styles.textContainer}>
        <Text style={styles.title}>{post.title}</Text>
        <Text style={styles.metaText}>{author} | {date}</Text>
        <Text style={styles.excerpt} numberOfLines={3}>{excerptText}</Text>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.translateButton}
            onPress={() => translatesText(excerptText, 'en')}
          >
            <Text style={styles.translateText}>Translate to English</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.translateButton}
            onPress={() => translatesText(excerptText, 'hi')}
          >
            <Text style={styles.translateText}>Translate to Hindi</Text>
          </TouchableOpacity>
        </View>

        {!!translatedText && (
          <Text style={styles.translatedText}>
            {targetLang === 'en' ? 'English: ' : 'Hindi: '}
            {translatedText}
          </Text>
        )}
        {loading && (
          <ActivityIndicator size="small" color="#aaa" style={{ marginTop: 8 }} />
        )}

        <View style={{ marginTop: 12, alignItems: 'flex-end' }}>
          <TouchableOpacity onPress={() => setCommentVisible(true)}>
            <Text style={{ color: '#00acee', fontSize: 16 }}>💬 Comments</Text>
          </TouchableOpacity>
        </View>
      </View>

      <CommentSection
        postId={post.id}
        isVisible={commentVisible}
        onClose={() => setCommentVisible(false)}
      />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: width * 0.04,
    backgroundColor: '#1e1e1e',
    borderRadius: width * 0.025,
    overflow: 'hidden',
    elevation: 3,
    marginHorizontal: width * 0.02,
  },
  image: {
    width: '100%',
    height: width * 0.5,
    resizeMode: 'cover',
  },
  video: {
    width: '100%',
    height: width * 0.5,
    backgroundColor: '#000',
  },
  unmuteButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    zIndex: 20,
  },
  unmuteText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  textContainer: {
    padding: width * 0.04,
  },
  title: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: width * 0.01,
  },
  metaText: {
    fontSize: width * 0.035,
    color: '#aaaaaa',
    marginBottom: width * 0.02,
    fontWeight: '700',
  },
  excerpt: {
    fontSize: width * 0.04,
    color: '#cccccc',
    lineHeight: width * 0.055,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: width * 0.025,
    gap: width * 0.025,
    flexWrap: 'wrap',
  },
  translateButton: {
    paddingVertical: width * 0.02,
    paddingHorizontal: width * 0.04,
    backgroundColor: '#333',
    borderRadius: width * 0.015,
    marginTop: width * 0.015,
  },
  translateText: {
    color: '#fff',
    fontSize: width * 0.035,
  },
  translatedText: {
    marginTop: width * 0.025,
    color: '#ffffff',
    fontSize: width * 0.04,
  },
});
