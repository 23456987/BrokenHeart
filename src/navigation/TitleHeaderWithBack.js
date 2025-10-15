// components/TitleHeaderWithBack.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function TitleHeaderWithBack({ title }) {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        {/* Back button */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={18} color="#fff" />

        </TouchableOpacity>

        {/* Screen title */}
        <Text style={styles.titleText}>{title}</Text>

        {/* Empty placeholder to center title */}
        <View style={{ width: 70 }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#121212',
    paddingTop: hp('6%'),        // responsive top padding
    paddingBottom: hp('2%'),     // responsive bottom padding
    borderBottomWidth: 1,
    borderColor: '#333',
    marginBottom: hp('0.5%'),    // responsive bottom margin
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    width: wp('18%'),           // responsive width
    marginLeft: wp('3%'),       // responsive left margin
  },

  titleText: {
    fontSize: wp('5.5%'),       // responsive title size
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
});
