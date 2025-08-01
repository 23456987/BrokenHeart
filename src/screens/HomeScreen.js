import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import PostCard from '../components/PostCard';
import { fetchPosts } from '../api/api';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [categoryList, setCategoryList] = useState(['All']);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetchPosts();
        setPosts(response);
        setFilteredPosts(response);

        const categoriesSet = new Set();
        response.forEach((post) => {
          post.categories?.forEach((cat) => {
            if (cat?.name) {
              categoriesSet.add(cat.name);
            }
          });
        });

        setCategoryList(['All', ...Array.from(categoriesSet)]);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    if (category === 'All') {
      setFilteredPosts(posts);
    } else {
      const filtered = posts.filter((post) =>
        post.categories?.some((cat) => cat.name === category)
      );
      setFilteredPosts(filtered);
    }
  };

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => handleCategorySelect(item)}
      style={[
        styles.categoryButton,
        selectedCategory === item && styles.selectedCategoryButton,
      ]}
      activeOpacity={0.8}
    >
      <Text numberOfLines={1} ellipsizeMode="tail" style={styles.categoryText}>
        {item}
      </Text>
    </TouchableOpacity>
  );

  const renderPostItem = ({ item }) => (
    <PostCard
      post={item}
      onPress={({ playVideo }) =>
        navigation.navigate('PostDetail', { postId: item.id, playVideo })
      }
    />
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#ff4444" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        horizontal
        data={categoryList}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryList}
      />
      <FlatList
        data={filteredPosts}
        renderItem={renderPostItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.postList}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loaderContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryList: {
    paddingVertical: 10,
    paddingLeft: 10,
  },
  categoryButton: {
    paddingHorizontal: 16,
    height: 38,
    borderRadius: 20,
    backgroundColor: '#222',
    borderWidth: 1,
    borderColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  selectedCategoryButton: {
    backgroundColor: '#ff4444',
    borderColor: '#ff4444',
  },
  categoryText: {
    color: '#fff',
    fontSize: width * 0.035,
    fontWeight: '600',
    textAlign: 'center',
  },
  postList: {
    padding: 10,
  },
});
