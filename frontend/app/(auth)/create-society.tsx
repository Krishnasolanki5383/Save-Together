import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Typography } from '../../constants/theme';
import { PrimaryButton } from '../../components/PrimaryButton';
import { useAuth } from '../../services/authContext';

export default function CreateSocietyScreen() {
  const router = useRouter();
  const { createSociety, isLoading } = useAuth();

  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [locality, setLocality] = useState('');
  const [address, setAddress] = useState('');

  const handleCreate = async () => {
    if (!name || !city || !locality) {
      Alert.alert('Required Fields', 'Please enter Society Name, City, and Locality');
      return;
    }

    const success = await createSociety({
      name,
      city,
      locality,
      address,
    });

    if (success) {
      Alert.alert(
        '🎉 Society Created!',
        `Your society "${name}" has been registered. You are now the Society Admin with a unique Join QR Code!`,
        [
          {
            text: 'Go to Society Home',
            onPress: () => router.replace('/(tabs)/home'),
          },
        ]
      );
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Register Your Society</Text>
          <Text style={styles.subtitle}>
            Create your apartment community board so residents can coordinate common services & save money.
          </Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Society / Apartment Name *</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Green Valley Society"
            placeholderTextColor={Colors.textLight}
          />

          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 6 }}>
              <Text style={styles.label}>City *</Text>
              <TextInput
                style={styles.input}
                value={city}
                onChangeText={setCity}
                placeholder="Mumbai"
                placeholderTextColor={Colors.textLight}
              />
            </View>
            <View style={{ flex: 1, marginLeft: 6 }}>
              <Text style={styles.label}>Area / Locality *</Text>
              <TextInput
                style={styles.input}
                value={locality}
                onChangeText={setLocality}
                placeholder="Powai"
                placeholderTextColor={Colors.textLight}
              />
            </View>
          </View>

          <Text style={styles.label}>Optional Full Address</Text>
          <TextInput
            style={[styles.input, { height: 80, paddingTop: 10 }]}
            value={address}
            onChangeText={setAddress}
            placeholder="Central Avenue, Hiranandani Gardens, Powai"
            placeholderTextColor={Colors.textLight}
            multiline
          />

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>👑 What happens after creation?</Text>
            <Text style={styles.infoText}>
              • You become the <Text style={{ fontWeight: '800' }}>Society Admin</Text>.{'\n'}
              • A unique <Text style={{ fontWeight: '800' }}>Society Join QR Code</Text> will be generated.{'\n'}
              • Other residents can join via QR code or Join Code.
            </Text>
          </View>

          <PrimaryButton
            title="Create & Generate Society QR"
            onPress={handleCreate}
            isLoading={isLoading}
            style={{ marginTop: 10 }}
          />
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
    lineHeight: 20,
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
  infoCard: {
    backgroundColor: Colors.primaryBg,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.primaryLight,
    marginVertical: 16,
  },
  infoTitle: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '800',
    color: Colors.primaryDark,
    marginBottom: 4,
  },
  infoText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textMedium,
    lineHeight: 18,
  },
});
