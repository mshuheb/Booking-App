import React from 'react';
import { ImageBackground, StyleSheet, SafeAreaView, View } from 'react-native';

const BackgroundWrapper = ({ children }) => {
  return (
    <ImageBackground
      source={require('./assets/background.webp')} 
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay} />

      <SafeAreaView style={styles.content}>{children}</SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
  },
  content: {
    flex: 1,
  },
});

export default BackgroundWrapper;
