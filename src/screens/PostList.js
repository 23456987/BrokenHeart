import React, { useState } from 'react';
import { View, FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';
import PostCard from '../components/PostCard';

export default function PostList({ posts, onPress }) {
  const [visibleCount, setVisibleCount] = useState(4); // Show 4 initially

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 5); // Load 5 more on click
  };

  const visiblePosts = posts.slice(0, visibleCount);

  return (
    <FlatList
      data={visiblePosts}
      keyExtractor={(item, index) => `${item.id}-${index}`}
      renderItem={({ item }) => <PostCard post={item} onPress={onPress} />}
      ListFooterComponent={
        visibleCount < posts.length ? (
          <TouchableOpacity style={styles.loadMoreBtn} onPress={handleLoadMore}>
            <Text style={styles.loadMoreText}>Load More</Text>
          </TouchableOpacity>
        ) : null
      }
    />
  );
}

const styles = StyleSheet.create({
  loadMoreBtn: {
    backgroundColor: '#333',
    padding: 12,
    margin: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  loadMoreText: {
    color: '#fff',
    fontSize: 16,
  },
});
