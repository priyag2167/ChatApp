import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { colors } from '../../../helpers/styles';

type RegistrationScreenViewProps = {
  name: string;
  email: string;
  phone: string;
  password: string;
  isPasswordVisible: boolean;
  isValid: boolean;
  isSubmitting: boolean;
  onChangeName: (t: string) => void;
  onChangeEmail: (t: string) => void;
  onChangePhone: (t: string) => void;
  onChangePassword: (t: string) => void;
  onTogglePasswordVis: () => void;
  onSubmit: () => void;
  onGoToLogin: () => void;
};

export const RegistrationScreenView = ({
  name,
  email,
  phone,
  password,
  isPasswordVisible,
  isValid,
  isSubmitting,
  onChangeName,
  onChangeEmail,
  onChangePhone,
  onChangePassword,
  onTogglePasswordVis,
  onSubmit,
  onGoToLogin
}: RegistrationScreenViewProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Create account</Text>
        <Text style={styles.subtitle}>Join and start chatting</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            placeholder="Your name"
            placeholderTextColor={colors.gray}
            style={styles.input}
            value={name}
            onChangeText={onChangeName}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="you@example.com"
            placeholderTextColor={colors.gray}
            style={styles.input}
            value={email}
            onChangeText={onChangeEmail}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone number</Text>
          <TextInput
            keyboardType="phone-pad"
            placeholder="(+91)"
            placeholderTextColor={colors.gray}
            style={styles.input}
            value={phone}
            onChangeText={onChangePhone}
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
              onChangeText={onChangePassword}
            />
            <TouchableOpacity onPress={onTogglePasswordVis} style={styles.eyeButton}>
              <Text style={styles.eyeText}>{isPasswordVisible ? 'Hide' : 'Show'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.primaryButton, (!isValid || isSubmitting) && styles.primaryButtonDisabled]}
          onPress={onSubmit}
          disabled={!isValid || isSubmitting}
        >
          <Text style={styles.primaryButtonText}>{isSubmitting ? 'Creating...' : 'Create account'}</Text>
        </TouchableOpacity>

        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <TouchableOpacity onPress={onGoToLogin}>
            <Text style={styles.footerLink}> Log in</Text>
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