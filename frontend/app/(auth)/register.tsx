import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography } from '../../constants/theme';
import { PrimaryButton } from '../../components/PrimaryButton';
import { useAuth } from '../../services/authContext';

export default function RegisterScreen() {
  const router = useRouter();
  const { register, isLoading } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [flatNumber, setFlatNumber] = useState('');
  const [buildingBlock, setBuildingBlock] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (!name || !email || !password || !flatNumber) {
      Alert.alert('Required Fields', 'Please enter Name, Email, Flat Number, and Password');
      return;
    }

    const success = await register({
      name,
      email,
      phone,
      flatNumber,
      buildingBlock,
      password,
    });

    if (success) {
      router.replace('/(auth)/join-society');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Create Resident Account</Text>
          <Text style={styles.subtitle}>Register to start saving money together with your society</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Full Name *</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Rahul Verma"
            placeholderTextColor={Colors.textLight}
          />

          <Text style={styles.label}>Email Address *</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="rahul@example.com"
            placeholderTextColor={Colors.textLight}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Mobile Phone (Optional)</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="9812345678"
            placeholderTextColor={Colors.textLight}
            keyboardType="phone-pad"
          />

          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 6 }}>
              <Text style={styles.label}>Flat / Apartment # *</Text>
              <TextInput
                style={styles.input}
                value={flatNumber}
                onChangeText={setFlatNumber}
                placeholder="B-104"
                placeholderTextColor={Colors.textLight}
              />
            </View>
            <View style={{ flex: 1, marginLeft: 6 }}>
              <Text style={styles.label}>Tower / Block</Text>
              <TextInput
                style={styles.input}
                value={buildingBlock}
                onChangeText={setBuildingBlock}
                placeholder="Tower B"
                placeholderTextColor={Colors.textLight}
              />
            </View>
          </View>

          <Text style={styles.label}>Password *</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            placeholderTextColor={Colors.textLight}
            secureTextEntry
          />

          <PrimaryButton
            title="Continue to Society"
            onPress={handleRegister}
            isLoading={isLoading}
            style={{ marginTop: 20 }}
          />
        </View>

        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <Text style={styles.loginLink} onPress={() => router.push('/(auth)/login')}>
            Log In
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    padding: 24,
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
    fontSize: 26,
    fontWeight: '900',
    color: Colors.textDark,
  },
  subtitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textMuted,
    marginTop: 4,
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
  row: {
    flexDirection: 'row',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
  },
  footerText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textMuted,
  },
  loginLink: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '800',
    color: Colors.primary,
  },
});
