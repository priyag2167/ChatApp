import React from 'react';
import { Image, StyleSheet, View, useWindowDimensions } from 'react-native';
import { colors } from '../../../helpers/styles';
import { ICON_NAMES } from '../../../helpers/constants/icons';


type SplashViewPropTypes = {};

export const SplashView = ({}: SplashViewPropTypes) => {

  // Get the window dimensions
  const { width, height } = useWindowDimensions();

  // Calculate an icon size that scales based on the smallest dimension
  // (for most devices, that will be the width in portrait orientation).
  const imageSize = Math.min(width, height) * 0.25; // Adjust ratio to your preference

  return (
    <View style={[styles.container]}>
     <Image
        style={[styles.image, { width: imageSize, height: imageSize }]}
        resizeMode="contain"
        source={ICON_NAMES.chat}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.darkblue,
    flex: 1,
    margin: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    // We'll set the width and height dynamically via inline style
  },
});

