import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Typography } from '../../constants/theme';
import { PrimaryButton } from '../../components/PrimaryButton';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.headerBox}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoEmoji}>🤝</Text>
          </View>
          <Text style={styles.appName}>Save Together</Text>
          <Text style={styles.tagline}>"Do more together. Pay less together."</Text>
        </View>

        <View style={styles.illustrationCard}>
          <Text style={styles.illEmoji}>🏢 🔧 🧹 💰</Text>
          <Text style={styles.illTitle}>Housing Society Group Savings</Text>
          <Text style={styles.illDesc}>
            Join neighbors in your apartment building for fridge repairs, AC servicing, deep cleaning & pest control to unlock bulk group discounts!
          </Text>
        </View>

        <View style={styles.actions}>
          <PrimaryButton
            title="Create Society"
            onPress={() => router.push('/(auth)/create-society')}
          />
          <PrimaryButton
            title="Join Society"
            variant="amber"
            onPress={() => router.push('/(auth)/join-society')}
          />

          <View style={styles.loginRow}>
            <Text style={styles.loginText}>Already registered? </Text>
            <Text style={styles.loginLink} onPress={() => router.push('/(auth)/login')}>
              Log In
            </Text>
          </View>
        </View>
      </View>
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
  headerBox: {
    alignItems: 'center',
    marginTop: 20,
  },
  logoBadge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  logoEmoji: {
    fontSize: 36,
  },
  appName: {
    fontSize: 32,
    fontWeight: '900',
    color: Colors.primaryDark,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: Typography.fontSize.md,
    color: Colors.textMuted,
    fontStyle: 'italic',
    marginTop: 6,
    textAlign: 'center',
  },
  illustrationCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  illEmoji: {
    fontSize: 40,
    marginBottom: 12,
  },
  illTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: '800',
    color: Colors.textDark,
    textAlign: 'center',
    marginBottom: 8,
  },
  illDesc: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textMedium,
    textAlign: 'center',
    lineHeight: 22,
  },
  actions: {
    marginBottom: 10,
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 14,
  },
  loginText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textMuted,
  },
  loginLink: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '800',
    color: Colors.primary,
  },
});
