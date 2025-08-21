/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { SplashView } from './splashView';


const Splash = ({ navigation }: any) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 1500);
    return () => clearTimeout(timer);
  }, [navigation]);

  return <SplashView />;
};

export default Splash;

