import React, { useContext, useEffect, useState } from 'react';
import { Alert, BackHandler } from 'react-native';
import { LoginScreenView } from './LoginScreenView';
import { AuthContext } from '../../../context/AuthContext';

type LoginProps = {
  navigation: any;
};

const Login = ({ navigation }: LoginProps) => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      Alert.alert('Hold on!', 'Are you sure you want to exit the application?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Yes', onPress: () => BackHandler.exitApp() }
      ]);
      return true;
    });
    return () => sub.remove();
  }, []);
  const handleLogin = async (emailParam: string, passwordParam: string) => {
    try {
      await login(emailParam, passwordParam);
      navigation.navigate('MainStack', { screen: 'Home' });
    } catch (e) {
      Alert.alert('Login failed', 'Please check your credentials');
    }
  };
  return (
    <LoginScreenView
      onContinue={(e,p) => { setEmail(e); setPassword(p); handleLogin(e, p); }}
      onGoToRegister={() => navigation.navigate('Register')}
    />
  );
};

export default Login;


