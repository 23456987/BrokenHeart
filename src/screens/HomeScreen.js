import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  FlatList,
  TouchableOpacity,
  Image,
  ImageBackground,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import Carousel from '@demfabris/react-native-snap-carousel';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const { width } = Dimensions.get('window');

const carouselItems = [
  {
    id: '1',
    title: 'విలన్ - హస్బండ్',
    description:
      'అభయు అనే అమ్మాయి లవ్ లో ఉన్నపుడు రిలేషన్ షిప్‌లో యార్క్ అనే టాక్సిక్ పర్సన్ తో బ్రేకప్ అయింది...',
    image: require('../assets/images/butterfly.jpg'),
  },
  {
    id: '2',
    title: 'అందాల రాక్షసి',
    description: 'ఒక అందమైన అమ్మాయి ప్రేమలో పడిన కథ...',
    image: require('../assets/images/boat.png'),
  },
];

export default function HomeScreen() {
  const carouselRef = useRef(null);
  const navigation = useNavigation();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(
        'https://brokenheart.in/wp-json/brokenheart-api/v1/get-posts/'
      );
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

      const uniqueCategories = Array.from(categoryMap.values());
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderCarouselItem = ({ item }) => (
    <View style={styles.carouselCard}>
      <Image source={item.image} style={styles.carouselImage} resizeMode="cover" />
      <View style={styles.carouselTextContainer}>
        <Text style={styles.carouselTitle}>{item.title}</Text>
        <Text style={styles.carouselDesc} numberOfLines={3}>
          {item.description}
        </Text>
        <View style={styles.carouselButton}>
          <Text style={styles.carouselButtonText}>అనుసంధానం తెలుసుకోండి</Text>
        </View>
      </View>
    </View>
  );

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
    <ImageBackground
      source={require('../assets/images/heart_bg.jpeg')} // ✅ Update path as per your assets
      style={styles.background}
      resizeMode="cover"
    >
      <View>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        {loading ? (
          <ActivityIndicator size="large" color="#FF6B6B" style={{ marginTop: 50 }} />
        ) : (
          <FlatList
            ListHeaderComponent={
              <>
                <View style={styles.carouselContainer}>
                  <Carousel
                    ref={carouselRef}
                    data={carouselItems}
                    renderItem={renderCarouselItem}
                    sliderWidth={width}
                    itemWidth={width * 0.85}
                    loop={true}
                    autoplay={true}
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
    </ImageBackground>
  );
}

const CARD_MARGIN = 12;
const CARD_WIDTH = (width - CARD_MARGIN * 3) / 2;

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  // overlay: {
  //   flex: 1,
  //   backgroundColor: 'rgba(18,18,18,0.85)', // semi-dark for readability
  // },
  carouselContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  carouselCard: {
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#1f1f1f',
  },
  carouselImage: {
    width: '100%',
    height: 220,
  },
  carouselTextContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  
    padding: 14,
  },
  carouselTitle: {
    color: '#FF6B6B',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  carouselDesc: {
    color: '#ddd',
    fontSize: 13,
    lineHeight: 18,
  },
  carouselButton: {
    marginTop: 10,
    backgroundColor: '#6ba1ffff',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  carouselButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
  headerSection: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  mainHeading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  subHeading: {
    fontSize: 14,
    color: 'black',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 25,
    fontWeight: '800',
  },
  categoryHeading: {
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold',
    marginBottom: 15,
  },
  categoryList: {
    paddingHorizontal: CARD_MARGIN,
    paddingBottom: 30,
  },
  rowSpacing: {
    justifyContent: 'space-between',
    marginBottom: CARD_MARGIN,
  },
  
  categoryImage: {
    width: '100%',
    height: 110,
  },
  categoryInfo: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
categoryCard: {
  width: CARD_WIDTH,
  backgroundColor: '#fff',
  borderRadius: 16,
  overflow: 'hidden',
  marginBottom: CARD_MARGIN,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 4,
  elevation: 4, // for Android
},

categoryTitle: {
  color: '#222', // changed from '#fff'
  fontSize: 14,
  fontWeight: 'bold',
  marginBottom: 6,
  textAlign: 'center',
},
readMoreText: {
  color: 'red', // you can keep this as is
  fontWeight: '800',
  fontSize: 14,
},

});
