
import { ActivityIndicator, Image, StyleSheet, Text, View, Animated, Easing } from 'react-native';
import React, { useEffect, useRef } from 'react';

const WelcomeScreen = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Hiệu ứng làm mờ cho logo xuất hiện
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
      easing: Easing.ease,
    }).start();
  }, [fadeAnim]);

  return (
    <View style={styles.background}>
      <Animated.View style={{ opacity: fadeAnim }}>
        <Image style={styles.img} source={require('../Image/logo_02.png')} />
      </Animated.View>
      <Text style={styles.welcomeText}>Chào mừng đến với Soccer Booking!</Text>
      <ActivityIndicator color={'#A05E56'} size="large" />
    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  background: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    height: '100%',
    justifyContent: 'center',
    padding: 20,
  },
  img: {
    width: 260,
    height: 260,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 24,            
    color: '#A05E56',
    fontWeight: 'bold',      
    textAlign: 'center',
    marginBottom: 30,
    letterSpacing: 1.2,      
    textTransform: 'uppercase', 
    paddingHorizontal: 20,   
    lineHeight: 30,         
},

});
