// src/screens/HomeScreen.js
import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Dimensions,
  Alert,
} from 'react-native';
import Carousel from '@demfabris/react-native-snap-carousel';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const { width } = Dimensions.get('window');

const CARD_MARGIN = wp('3%');
const CARD_WIDTH = (width - CARD_MARGIN * 3) / 2;

export default function HomeScreen() {
  const carouselRef = useRef(null);
  const navigation = useNavigation();
  const [categories, setCategories] = useState([]);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch Stories & Categories
  useEffect(() => {
    fetchStories();
    fetchCategories();
  }, []);

  const fetchStories = async () => {
    try {
      const res = await axios.get('https://brokenheart.in/wp-json/brokenheart-api/v1/homepage-stories');
      setStories(res.data);
    } catch (error) {
      console.log('Error fetching stories:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get('https://brokenheart.in/wp-json/brokenheart-api/v1/get-posts/');
      const posts = res.data;
      const categoryMap = new Map();

      posts.forEach((post) => {
        post.categories?.forEach((category) => {
          if (!categoryMap.has(category.id)) {
            categoryMap.set(category.id, {
              id: category.id.toString(),
              title: category.name,
              image: { uri: post.featured_image },
            });
          }
        });
      });

      setCategories(Array.from(categoryMap.values()));
    } catch (error) {
      console.log('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Carousel Item
  const renderCarouselItem = ({ item }) => (
    <View style={styles.carouselCard}>
      <Image source={{ uri: item.image }} style={styles.carouselImage} resizeMode="cover" />
      <View style={styles.carouselTextContainer}>
        <Text style={styles.carouselTitle}>{item.title}</Text>
        <Text style={styles.carouselDesc} numberOfLines={3}>{item.excerpt}</Text>
        <TouchableOpacity
          style={styles.carouselButton}
          onPress={() =>
            navigation.navigate('PostDetail', {
              categoryId: item.categories?.[0]?.id
                ? item.categories[0].id.toString()
                : item.categories?.[0]?.toString(),
              title: item.title,
            })
          }
        >
          <Text style={styles.carouselButtonText}>{item.button_text}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // 🔹 Category Item
  const renderCategory = ({ item }) => (
    <TouchableOpacity
      style={styles.categoryCard}
      onPress={() =>
        navigation.navigate('PostDetail', {
          categoryId: item.id,
          title: item.title,
        })
      }
    >
      <Image source={item.image} style={styles.categoryImage} resizeMode="cover" />
      <View style={styles.categoryInfo}>
        <Text style={styles.categoryTitle}>{item.title}</Text>
        <Text style={styles.readMoreText}>కథలు చదవండి →</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.background}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      {loading ? (
        <ActivityIndicator size="large" color="#FF6B6B" style={{ marginTop: hp('5%') }} />
      ) : (
        <FlatList
          ListHeaderComponent={
            <>
              <View style={styles.carouselContainer}>
                <Carousel
                  ref={carouselRef}
                  data={stories}
                  renderItem={renderCarouselItem}
                  sliderWidth={width}
                  itemWidth={width * 0.85}
                  loop
                  autoplay
                  autoplayDelay={1000}
                  autoplayInterval={3000}
                />
              </View>
              <View style={styles.headerSection}>
                <Text style={styles.mainHeading}>
                  💔 Broken Heart Stories | Read Best Telugu Stories
                </Text>
                <Text style={styles.subHeading}>
                  ప్రేమ, మోసం, వ్యథ, ఆకలి, గందం నిండి ఉన్న భావాలు... Broken హార్ట్ కథలతో మీ మనసును హత్తుకుంటాయి.
                </Text>
                <Text style={styles.categoryHeading}>📚 కేటగిరీలు</Text>
              </View>
            </>
          }
          data={categories}
          keyExtractor={(item) => item.id}
          renderItem={renderCategory}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}
          columnWrapperStyle={styles.rowSpacing}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, backgroundColor: '#fff' },
  carouselContainer: { marginTop: hp('1%'), marginBottom: hp('2%') },
  carouselCard: { borderRadius: wp('4%'), overflow: 'hidden', backgroundColor: '#f2f2f2' },
  carouselImage: { width: '100%', height: hp('28%') },
  carouselTextContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: wp('4%') },
  carouselTitle: { color: '#FF6B6B', fontSize: wp('5%'), fontWeight: 'bold', marginBottom: hp('0.5%') },
  carouselDesc: { color: 'white', fontSize: wp('3.5%'), lineHeight: hp('2.2%') },
  carouselButton: { marginTop: hp('1%'), backgroundColor: '#6ba1ff', paddingVertical: hp('0.8%'), paddingHorizontal: wp('4%'), borderRadius: wp('5%'), alignSelf: 'flex-start' },
  carouselButtonText: { color: '#fff', fontWeight: '600', fontSize: wp('3.5%') },
  headerSection: { paddingHorizontal: wp('5%'), paddingBottom: hp('1.5%') },
  mainHeading: { fontSize: wp('6%'), fontWeight: 'bold', color: 'red', textAlign: 'center', marginBottom: hp('1%') },
  subHeading: { fontSize: wp('3.5%'), color: '#000', textAlign: 'center', lineHeight: hp('2.5%'), marginBottom: hp('3%'), fontWeight: '700' },
  categoryHeading: { fontSize: wp('4.5%'), color: '#000', fontWeight: 'bold', marginBottom: hp('2%') },
  categoryList: { paddingHorizontal: CARD_MARGIN, paddingBottom: hp('4%') },
  rowSpacing: { justifyContent: 'space-between', marginBottom: CARD_MARGIN },
  categoryImage: { width: '100%', height: hp('14%') },
  categoryInfo: { paddingVertical: hp('1.2%'), paddingHorizontal: wp('3%'), alignItems: 'center' },
  categoryCard: { width: CARD_WIDTH, backgroundColor: '#fff', borderRadius: wp('4%'), overflow: 'hidden', marginBottom: CARD_MARGIN, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 4 },
  categoryTitle: { color: '#222', fontSize: wp('3.5%'), fontWeight: 'bold', marginBottom: hp('0.8%'), textAlign: 'center' },
  readMoreText: { color: 'red', fontWeight: '800', fontSize: wp('3.8%') },
});
