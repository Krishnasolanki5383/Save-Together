import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography } from '../../constants/theme';
import { PrimaryButton } from '../../components/PrimaryButton';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleReset = () => {
    if (!email) {
      Alert.alert('Required', 'Please enter your registered email address');
      return;
    }
    setSent(true);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backText}>← Back to Login</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Forgot Password?</Text>
          <Text style={styles.subtitle}>Enter your registered email to receive password reset instructions.</Text>
        </View>

        {sent ? (
          <View style={styles.successBox}>
            <Text style={styles.successEmoji}>📬</Text>
            <Text style={styles.successTitle}>Check Your Inbox</Text>
            <Text style={styles.successDesc}>
              We have sent password recovery instructions to <Text style={{ fontWeight: '700' }}>{email}</Text>.
            </Text>
            <PrimaryButton title="Return to Login" onPress={() => router.push('/(auth)/login')} style={{ marginTop: 20 }} />
          </View>
        ) : (
          <View style={styles.form}>
            <Text style={styles.label}>Registered Email Address</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="resident@society.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <PrimaryButton title="Send Reset Instructions" onPress={handleReset} style={{ marginTop: 20 }} />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1, padding: 24 },
  backBtn: { paddingVertical: 8 },
  backText: { fontSize: Typography.fontSize.sm, fontWeight: '700', color: Colors.primaryDark },
  header: { marginVertical: 20 },
  title: { fontSize: 28, fontWeight: '900', color: Colors.textDark },
  subtitle: { fontSize: Typography.fontSize.sm, color: Colors.textMuted, marginTop: 4 },
  form: { marginVertical: 10 },
  label: { fontSize: Typography.fontSize.xs, fontWeight: '700', color: Colors.textMedium, marginBottom: 6 },
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
  successBox: {
    backgroundColor: Colors.white,
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    marginTop: 20,
  },
  successEmoji: { fontSize: 48, marginBottom: 12 },
  successTitle: { fontSize: Typography.fontSize.lg, fontWeight: '800', color: Colors.textDark },
  successDesc: { fontSize: Typography.fontSize.sm, color: Colors.textMedium, textAlign: 'center', marginTop: 8, lineHeight: 20 },
});
