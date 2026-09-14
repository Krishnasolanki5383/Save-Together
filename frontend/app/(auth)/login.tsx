import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography } from '../../constants/theme';
import { PrimaryButton } from '../../components/PrimaryButton';
import { useAuth } from '../../services/authContext';

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading } = useAuth();

  const [email, setEmail] = useState('admin@greenvalley.com');
  const [password, setPassword] = useState('password123');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Required Fields', 'Please enter email/phone and password');
      return;
    }
    const success = await login(email, password);
    if (success) {
      router.replace('/(tabs)/home');
    }
  };

  const fillDemo = (role: 'ADMIN' | 'MEMBER') => {
    if (role === 'ADMIN') {
      setEmail('admin@greenvalley.com');
      setPassword('password123');
    } else {
      setEmail('rahul@greenvalley.com');
      setPassword('password123');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Log in to access your housing society group savings</Text>
        </View>

        {/* Demo Fast Login Pills */}
        <View style={styles.demoBox}>
          <Text style={styles.demoTitle}>⚡ Quick Demo Accounts (1-Tap):</Text>
          <View style={styles.demoRow}>
            <TouchableOpacity style={styles.demoChip} onPress={() => fillDemo('ADMIN')}>
              <Text style={styles.demoChipText}>👑 Society Admin</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.demoChipAlt} onPress={() => fillDemo('MEMBER')}>
              <Text style={styles.demoChipTextAlt}>🏠 Resident Member</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Email Address or Mobile Phone</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="admin@greenvalley.com"
            placeholderTextColor={Colors.textLight}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            placeholderTextColor={Colors.textLight}
            secureTextEntry
          />

          <TouchableOpacity
            style={styles.forgotBtn}
            onPress={() => router.push('/(auth)/forgot-password')}
          >
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          <PrimaryButton title="Log In" onPress={handleLogin} isLoading={isLoading} />
        </View>

        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <Text style={styles.registerLink} onPress={() => router.push('/(auth)/register')}>
            Register Now
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  backBtn: {
    paddingVertical: 8,
  },
  backText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  header: {
    marginVertical: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: Colors.textDark,
  },
  subtitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textMuted,
    marginTop: 4,
  },
  demoBox: {
    backgroundColor: Colors.primaryBg,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.primaryLight,
    marginBottom: 10,
  },
  demoTitle: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '800',
    color: Colors.primaryDark,
    marginBottom: 6,
  },
  demoRow: {
    flexDirection: 'row',
  },
  demoChip: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 8,
  },
  demoChipText: {
    color: Colors.white,
    fontSize: Typography.fontSize.xs,
    fontWeight: '700',
  },
  demoChipAlt: {
    backgroundColor: Colors.white,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  demoChipTextAlt: {
    color: Colors.textDark,
    fontSize: Typography.fontSize.xs,
    fontWeight: '700',
  },
  form: {
    marginVertical: 10,
  },
  label: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '700',
    color: Colors.textMedium,
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    height: 50,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: Typography.fontSize.md,
    color: Colors.textDark,
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginVertical: 10,
  },
  forgotText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '700',
    color: Colors.primary,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  footerText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textMuted,
  },
  registerLink: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '800',
    color: Colors.primary,
  },
});
