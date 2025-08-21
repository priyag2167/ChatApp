import React, { useContext } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import { colors } from '../helpers/styles';

type ProfileProps = {
  onLogoutSuccess?: () => void;
};

const Profile = ({ onLogoutSuccess }: ProfileProps) => {
  const { user, logout } = useContext(AuthContext);
  const navigation = useNavigation<any>();

  const handleLogout = async () => {
    try {
      await logout();
      // Navigate directly to Login inside AuthFlow after logout
      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'AuthFlow',
            state: { index: 0, routes: [{ name: 'Login' }] },
          },
        ],
      });
      onLogoutSuccess && onLogoutSuccess();
    } catch {
      console.log('logout failed');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Profile</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Name</Text>
          <Text style={styles.value}>{user?.name || '-'}</Text>

          <View style={styles.separator} />

          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{user?.email || '-'}</Text>
        </View>

        <TouchableOpacity accessibilityRole="button" onPress={handleLogout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.darkblue
  },
  container: {
    flex: 1,
    padding: 20
  },
  title: {
    color: colors.white,
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 16
  },
  card: {
    backgroundColor: colors.gray,
    borderRadius: 16,
    padding: 16
  },
  label: {
    color: colors.white,
    opacity: 0.7,
    marginBottom: 4
  },
  value: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700'
  },
  separator: {
    height: 1,
    backgroundColor: '#3a4154',
    marginVertical: 12
  },
  logoutBtn: {
    backgroundColor: colors.red,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    marginTop: 20
  },
  logoutText: {
    color: colors.white,
    fontWeight: '700'
  }
});

export default Profile;


