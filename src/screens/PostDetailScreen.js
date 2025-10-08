import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  ImageBackground,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useRoute, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';


const { width } = Dimensions.get('window');

export default function PostDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { categoryId, title } = route.params;

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [featuredPost, setFeaturedPost] = useState(null);

  const checkLoginStatus = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (!userData) return false;

      const parsed = JSON.parse(userData);
      // console.log('Parsed login check:', parsed);

      // ✅ Correct key names based on stored userData
      return !!(parsed && parsed.username && parsed.first_name);
    } catch (err) {
      // console.error('Error reading userData:', err);
      return false;
    }
  };


  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await axios.get('https://brokenheart.in/wp-json/brokenheart-api/v1/get-posts/');
      // const filtered = res.data.filter((item) =>
      //   item.categories?.some((cat) => cat.id.toString() === categoryId)
      // );
      const filtered = res.data.filter((item) =>
        item.categories?.some((cat) => {
          // if cat is object -> compare cat.id
          // if cat is number -> compare directly
          return (typeof cat === 'object'
            ? cat.id.toString()
            : cat.toString()) === categoryId;
        })
      );


      if (filtered.length > 0) {
        setFeaturedPost(filtered[0]);
      }

      setPosts(filtered);
    } catch (err) {
      // console.error('Failed to load post details', err);
    } finally {
      setLoading(false);
    }
  };

  const renderEpisode = useCallback(({ item, index }) => (
    <TouchableOpacity
      style={styles.episodeCard}
      onPress={async () => {
        const isPremium = item.is_premium?.includes('yes');
        const requiresLogin = item.need_login?.includes('yes');

        if (isPremium && requiresLogin) {
          const isLoggedIn = await checkLoginStatus();
          // console.log('isPremium:', isPremium, 'requiresLogin:', requiresLogin, 'isLoggedIn:', isLoggedIn);
          if (!isLoggedIn) {
            navigation.navigate('Login');
            // Alert.alert('Login Required', 'Please login to view this premium content.');
            return;
          }
        }

        navigation.navigate('EpisodeDetail', {
          id: item.id,
          title: item.title,
          content: item.content,
          date: item.date,
          author: item.author,
          image: item.featured_image,
          video_link: item.video_link,
        });
      }}
    >
      <Image source={{ uri: item.featured_image }} style={styles.episodeImage} />

      <View style={styles.episodeContent}>
        <Text style={styles.episodeTitle}>Episode {index + 1}</Text>

        {/* ✅ Add Premium Label below Episode number */}
        {item.is_premium?.includes('yes') && (
          <View style={styles.premiumLabelContainer}>
            <Icon name="workspace-premium" size={14} color="black" style={{ marginRight: 4 }} />
            <Text style={styles.premiumLabel}>Premium</Text>

          </View>
        )}

        <Text style={styles.episodeExcerpt} numberOfLines={3}>
          {item.excerpt}
        </Text>
      </View>
    </TouchableOpacity>
  ), [navigation]);


  const renderHeader = () => {
    if (!featuredPost) return null;

    return (
      <LinearGradient
        colors={['#000000', '#b30000', '#4d0000']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}


        style={styles.headerContainer}
      >
        <View style={styles.headerTop}>
          <Image
            source={{ uri: featuredPost.featured_image }}
            style={styles.headerImage}
          />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.headerTitle}>{featuredPost.title}</Text>
            <Text style={styles.headerExcerpt} numberOfLines={3}>
              {featuredPost.excerpt}
            </Text>
          </View>
        </View>

        <View style={styles.authorSection}>
          <Image
            // source={{ uri: featuredPost.author_image }}
            source={{ uri: 'https://i.pravatar.cc/100' }} // Author avatar or random image
            style={styles.authorAvatar}
          />
          <Text style={styles.authorName}>Sravana Sandhya</Text>
        </View>

        <View style={styles.metaRow}>
          <Text style={styles.metaItem}>📚 {posts.length} Episodes</Text>
          <Text style={styles.metaItem}>👁️ {featuredPost.views || 0} Views</Text>
          <Text style={styles.metaItem}>💬 {featuredPost.comments || 0} Comments</Text>
        </View>
      </LinearGradient>
    );
  };

  return (
    <View
      style={styles.background}
    >
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color="#FF6B6B" style={{ marginTop: 20 }} />
        ) : (
          <React.Fragment>
            {posts.length === 0 ? (
              <Text style={styles.emptyText}>No episodes found in this category.</Text>
            ) : (
              <FlatList
                data={posts}
                renderItem={renderEpisode}
                keyExtractor={(item) => item.id.toString()}
                ListHeaderComponent={renderHeader}
                contentContainerStyle={{ paddingBottom: 50 }}
                showsVerticalScrollIndicator={false}
              />
            )}
          </React.Fragment>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#fff',
  },
  headerContainer: {
    //  backgroundColor: '#2D1B3C', // Dark purple-gray, sleek and elegant
    borderBottomLeftRadius: 17,
    borderBottomRightRadius: 17,
    padding: 14,
    marginBottom: 20,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  headerImage: {
    width: 70,
    height: 70,
    borderRadius: 12,
    resizeMode: 'cover',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 6,
  },
  headerExcerpt: {
    fontSize: 13,
    color: '#eee',
  },
  authorSection: {
    alignItems: 'center',
    marginTop: 20,
  },
  authorAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#fff',
  },
  authorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 6,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  metaItem: {
    fontSize: 13,
    color: '#ccc',
  },
  episodeCard: {
    backgroundColor: '#ffffffee',
    marginHorizontal: 16,
    marginBottom: 14,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  episodeImage: {
    width: '100%',
    height: 210,
  },
  episodeContent: {
    padding: 12,
  },
  episodeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 6,
  },
  episodeExcerpt: {
    fontSize: 13,
    color: 'black',
    lineHeight: 18,
    fontWeight: '500',
  },
  premiumLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#FFD700', // Brighter gold background
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginTop: 4,
    marginBottom: 6,
    elevation: 2, // For shadow on Android
    shadowColor: '#000', // For iOS shadow
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },

  premiumLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#000', // Black for contrast
  },

});