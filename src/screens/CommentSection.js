import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function CommentSection({ postId, isVisible, onClose }) {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commentCount, setCommentCount] = useState(0);

const fetchComments = async () => {
  try {
    const response = await fetch(`https://brokenheart.in/wp-json/brokenheart-api/v1/comments/${postId}`);
    const data = await response.json();

    // console.log('Fetched comments:', data);

    setComments(data?.comments || []);
    setCommentCount(data?.comments?.length || 0);
  } catch (error) {
    // console.log('Error fetching comments:', error);
    // Alert.alert('Error', 'Failed to fetch comments.');
  }
};

const submitComment = async () => {
  if (!commentText.trim()) return;
  setIsSubmitting(true);

  try {
    const username = await AsyncStorage.getItem('username');
    const password = await AsyncStorage.getItem('password');

    // console.log('Username:', username);
    // console.log('Password:', password);

    if (!username || !password) {
      Alert.alert('Login Required', 'Please log in to post a comment.');
      return;
    }

    const payload = {
      username,
      password,
      post_id: postId,
      comment: commentText.trim(),
    };

    // console.log('Submitting comment with payload:', payload);

    const response = await fetch(`https://brokenheart.in/wp-json/brokenheart-api/v1/comment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    // console.log('Response:', data);

    if (!response.ok || !data.success) {
      throw new Error(data?.message || 'Failed to post comment.');
    }

    // Show success alert
    Alert.alert('Success', 'Comment posted successfully.');

    setCommentText('');
    fetchComments(); // Refresh list
  } catch (error) {
    // console.log('Error posting comment:', error);
    Alert.alert('Error', error.message || 'Failed to post comment.');
  } finally {
    setIsSubmitting(false);
  }
};


useEffect(() => {
  if (isVisible && postId) {
    fetchComments();
  }
}, [isVisible, postId]);

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      style={styles.modal}
      backdropOpacity={0.5}
      animationIn="slideInUp"
      animationOut="slideOutDown"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Comments ({commentCount})</Text>
          <TouchableOpacity onPress={onClose}>
            <Icon name="close" size={24} />
          </TouchableOpacity>
        </View>

        <FlatList
          data={comments}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.commentList}
          renderItem={({ item }) => (
            <View style={styles.commentCard}>
              <Text style={styles.commentAuthor}>{item.author}</Text>
              <Text style={styles.commentContent}>{item.content}</Text>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.noCommentsText}>No comments yet.</Text>
          }
        />

        <View style={styles.inputRow}>
          <TextInput
            placeholder="Write a comment..."
            value={commentText}
            onChangeText={setCommentText}
            style={styles.input}
            multiline
            placeholderTextColor="#999"
          />
          <TouchableOpacity
            style={[styles.postButton, isSubmitting && { opacity: 0.6 }]}
            onPress={submitComment}
            disabled={isSubmitting}
          >
            <Text style={styles.postButtonText}>
              {isSubmitting ? 'Posting...' : 'Post'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  container: {
    height: '70%',
    backgroundColor: 'white',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  commentList: {
    paddingBottom: 10,
  },
  commentCard: {
    padding: 10,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    marginBottom: 8,
  },
  commentAuthor: {
    fontWeight: 'bold',
  },
  commentContent: {
    marginTop: 4,
  },
  noCommentsText: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
    marginTop: 20,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 8,
    borderTopWidth: 1,
    borderColor: '#ddd',
    paddingTop: 8,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 80,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingTop: 8,
    backgroundColor: '#f9f9f9',
    color: '#000',
  },
  postButton: {
    marginLeft: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: 'crimson',
    borderRadius: 6,
  },
  postButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
