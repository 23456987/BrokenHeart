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
  RefreshControl,
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import { useRoute, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function PostDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { categoryId, title } = route.params;
  const [refreshing, setRefreshing] = useState(false);


  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [featuredPost, setFeaturedPost] = useState(null);
const onRefresh = async () => {
  setRefreshing(true);
  await fetchPosts(); // call your existing fetchPosts function
  setRefreshing(false);
};

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
        if (!isLoggedIn) {
          navigation.navigate('Login');
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
    <View style={styles.episodeContent}>
      {/* Gradient background for title */}
      <LinearGradient
        colors={['#000000', '#b30000', '#4d0000']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          borderRadius: 20,
          paddingHorizontal: 10,
          paddingVertical: 4,
          marginBottom: 6,
          alignSelf: 'flex-start',
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'white' }}>
          {item.title}
        </Text>
      </LinearGradient>

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
    <View style={styles.featuredCardWrapper}>
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
        source={{
          uri: 'https://brokenheart.in/wp-content/uploads/2025/04/490127761_647266971372439_3574315247564411426_n.jpg',
        }}
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
</View>

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
                refreshControl={
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      tintColor="#FF6B6B" // Spinner color for iOS
      colors={['#FF6B6B']} // Spinner color for Android
    />
  }
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
    marginTop: hp('5%'),   // responsive
    fontSize: wp('4%'),    // responsive font
    color: '#fff',
  },
  headerContainer: {
    borderBottomLeftRadius: wp('4%'),   // responsive
    borderBottomRightRadius: wp('4%'),
    padding: wp('3%'),
    marginBottom: hp('2.5%'),
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  headerImage: {
    width: wp('18%'),
    height: wp('18%'),
    borderRadius: wp('3%'),
    resizeMode: 'cover',
  },
  headerTitle: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: hp('1%'),
  },
  headerExcerpt: {
    fontSize: wp('3.5%'),
    color: '#eee',
  },
  authorSection: {
    alignItems: 'center',
    marginTop: hp('2.5%'),
  },
  authorAvatar: {
    width: wp('14%'),
    height: wp('14%'),
    borderRadius: wp('7%'),
    borderWidth: 2,
    borderColor: '#fff',
  },
  authorName: {
    fontSize: wp('4%'),
    fontWeight: 'bold',
    color: '#fff',
    marginTop: hp('0.5%'),
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: hp('2%'),
  },
  metaItem: {
    fontSize: wp('3.5%'),
    color: '#ccc',
  },
  episodeCard: {
    backgroundColor: '#ffffffee',
    marginHorizontal: wp('4%'),
    marginBottom: hp('2%'),
    borderRadius: wp('3%'),
    overflow: 'hidden',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: hp('0.5%') },
    shadowOpacity: 0.25,
    shadowRadius: wp('2%'),
  },
  episodeContent: {
    padding: wp('3%'),
  },
  featuredCardWrapper: {
    marginHorizontal: wp('2%'),
    marginBottom: hp('2.5%'),
    borderRadius: wp('4%'),
    overflow: 'hidden',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: hp('0.5%') },
    shadowOpacity: 0.25,
    shadowRadius: wp('1.5%'),
    backgroundColor: '#000',
  },
  episodeTitle: {
    fontSize: wp('5%'),
    fontWeight: 'bold',
    color: 'white',
    marginBottom: hp('0.5%'),
  },
  episodeExcerpt: {
    fontSize: wp('4%'),
    color: 'black',
    lineHeight: hp('2.5%'),
    fontWeight: '500',
  },
  premiumLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#FFD700',
    paddingVertical: hp('0.5%'),
    paddingHorizontal: wp('2%'),
    borderRadius: wp('3%'),
    marginTop: hp('0.5%'),
    marginBottom: hp('1%'),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: wp('0.3%'), height: hp('0.3%') },
    shadowOpacity: 0.2,
    shadowRadius: wp('1%'),
  },
  premiumLabel: {
    fontSize: wp('3%'),
    fontWeight: '700',
    color: '#000',
  },
});