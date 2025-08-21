import React, { useContext, useMemo, useState } from 'react';
import { RegistrationScreenView } from './RegistrationScreenView';
import { AuthContext } from '../../../context/AuthContext';
import { Alert } from 'react-native';

type RegistrationProps = {
  navigation: any;
};

const Register = ({ navigation }: RegistrationProps) => {
  const { register } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isValid = useMemo(() => {
    const hasName = name.trim().length >= 2;
    const hasEmail = /.+@.+\..+/.test(email.trim());
    const hasPhone = phone.replace(/\D/g, '').length >= 10;
    const hasPassword = password.length >= 6;
    return hasName && hasEmail && hasPhone && hasPassword;
  }, [name, email, phone, password]);

  const onSubmit = async () => {
    if (!isValid || isSubmitting) return;
    setIsSubmitting(true);
    try {
      console.log('registering', name, email, phone, password);
      await register(name.trim(), email.trim(), phone.replace(/\s+/g, ''), password);
      navigation.replace('MainStack', { screen: 'Home' });
    } catch (e: any) {
      const message = e?.message || 'Unable to register. Please try again.';
      Alert.alert('Registration failed', message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <RegistrationScreenView
      name={name}
      email={email}
      phone={phone}
      password={password}
      onChangeName={setName}
      onChangeEmail={setEmail}
      onChangePhone={setPhone}
      onChangePassword={setPassword}
      isPasswordVisible={isPasswordVisible}
      onTogglePasswordVis={() => setIsPasswordVisible(v => !v)}
      isValid={isValid}
      isSubmitting={isSubmitting}
      onSubmit={onSubmit}
      onGoToLogin={() => navigation.navigate('Login')}
    />
  );
};

export default Register;