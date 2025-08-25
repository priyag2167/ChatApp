import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { colors } from '../../../helpers/styles';


type LoginScreenViewProps = {
  onContinue?: (email: string, password: string) => void;
  onGoToRegister?: () => void;
};

export const LoginScreenView = ({ onContinue, onGoToRegister }: LoginScreenViewProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const isValid = useMemo(() => email.trim().length > 0 && password.length >= 6, [email, password]);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="you@example.com"
            placeholderTextColor={colors.gray}
            style={styles.input}
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordRow}>
            <TextInput
              placeholder="••••••••"
              placeholderTextColor={colors.gray}
              secureTextEntry={!isPasswordVisible}
              style={[styles.input, styles.inputPassword]}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setIsPasswordVisible(v => !v)} style={styles.eyeButton}>
              <Text style={styles.eyeText}>{isPasswordVisible ? 'Hide' : 'Show'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.primaryButton, !isValid && styles.primaryButtonDisabled]}
          onPress={() => onContinue && onContinue(email, password)}
          disabled={!isValid}
        >
          <Text style={styles.primaryButtonText}>Login</Text>
        </TouchableOpacity>

        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <TouchableOpacity onPress={onGoToRegister}>
            <Text style={styles.footerLink}> Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.darkblue
  },
  card: {
    width: '88%',
    backgroundColor: colors.gray,
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 18,
    shadowColor: colors.black,
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 4
  },
  subtitle: {
    color: colors.white,
    marginBottom: 20
  },
  inputGroup: {
    marginBottom: 14
  },
  label: {
    fontSize: 12,
    color: colors.white,
    marginBottom: 6
  },
  input: {
    borderWidth: 1,
    borderColor: colors.combinedColor,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: colors.white,
    color: colors.black
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  inputPassword: {
    flex: 1
  },
  eyeButton: {
    marginLeft: 8,
    paddingHorizontal: 12,
    paddingVertical: 10
  },
  eyeText: {
    color: colors.blue,
    fontWeight: '600'
  },
  primaryButton: {
    backgroundColor: colors.darkgreen,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 4
  },
  primaryButtonDisabled: {
    opacity: 0.5
  },
  primaryButtonText: {
    color: colors.white,
    fontWeight: '700'
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16
  },
  footerText: {
    color: colors.white
  },
  footerLink: {
    color: colors.blue,
    fontWeight: '700'
  }
});


