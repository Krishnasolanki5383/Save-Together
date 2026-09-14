import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography } from '../../constants/theme';
import { PrimaryButton } from '../../components/PrimaryButton';
import { useAuth } from '../../services/authContext';

export default function JoinSocietyScreen() {
  const router = useRouter();
  const { joinSociety, isLoading } = useAuth();

  const [code, setCode] = useState('GV426X');
  const [isScanning, setIsScanning] = useState(false);

  const handleJoin = async (joinCodeToUse?: string) => {
    const codeToSubmit = joinCodeToUse || code;
    if (!codeToSubmit) {
      Alert.alert('Required', 'Please enter a society join code');
      return;
    }

    const success = await joinSociety(codeToSubmit);
    if (success) {
      Alert.alert('🎉 Welcome to Society!', 'You have successfully joined Green Valley Society!', [
        {
          text: 'Go to Home',
          onPress: () => router.replace('/(tabs)/home'),
        },
      ]);
    }
  };

  const handleSimulateQRScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      handleJoin('GV426X');
    }, 1200);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Join Your Housing Society</Text>
          <Text style={styles.subtitle}>Scan your society's QR code or enter the invite code provided by your society admin.</Text>
        </View>

        {isScanning ? (
          <View style={styles.scannerBox}>
            <Text style={styles.scanEmoji}>📷</Text>
            <Text style={styles.scanTitle}>Scanning Society QR Code...</Text>
            <Text style={styles.scanDesc}>Align the QR code within the frame to join instantly.</Text>
          </View>
        ) : (
          <View style={styles.card}>
            <TouchableOpacity style={styles.qrBtn} onPress={handleSimulateQRScan}>
              <Text style={styles.qrEmoji}>📷</Text>
              <Text style={styles.qrBtnTitle}>Scan Society QR Code</Text>
              <Text style={styles.qrBtnSub}>Tap to scan noticeboard or admin QR code</Text>
            </TouchableOpacity>

            <View style={styles.dividerRow}>
              <View style={styles.line} />
              <Text style={styles.orText}>OR ENTER CODE</Text>
              <View style={styles.line} />
            </View>

            <Text style={styles.label}>Society Join Code</Text>
            <TextInput
              style={styles.input}
              value={code}
              onChangeText={setCode}
              placeholder="e.g. GV426X"
              autoCapitalize="characters"
            />

            <PrimaryButton
              title="Join Society"
              onPress={() => handleJoin()}
              isLoading={isLoading}
              style={{ marginTop: 16 }}
            />
          </View>
        )}

        <View style={styles.demoTip}>
          <Text style={styles.tipText}>
            💡 <Text style={{ fontWeight: '700' }}>Demo Tip:</Text> Use default code <Text style={styles.codeHighlight}>GV426X</Text> to join Green Valley Society (426 members).
          </Text>
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
  card: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  qrBtn: {
    backgroundColor: Colors.primaryBg,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.primaryLight,
    borderStyle: 'dashed',
  },
  qrEmoji: {
    fontSize: 36,
    marginBottom: 6,
  },
  qrBtnTitle: {
    fontSize: Typography.fontSize.md,
    fontWeight: '800',
    color: Colors.primaryDark,
  },
  qrBtnSub: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.cardBorder,
  },
  orText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '800',
    color: Colors.textLight,
    marginHorizontal: 10,
  },
  label: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '700',
    color: Colors.textMedium,
    marginBottom: 6,
  },
  input: {
    height: 50,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 20,
    fontWeight: '800',
    color: Colors.primaryDark,
    textAlign: 'center',
    letterSpacing: 3,
  },
  scannerBox: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  scanEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  scanTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: '800',
    color: Colors.primaryDark,
  },
  scanDesc: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 6,
  },
  demoTip: {
    backgroundColor: Colors.secondaryLight,
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  tipText: {
    fontSize: Typography.fontSize.xs,
    color: '#B45309',
  },
  codeHighlight: {
    fontWeight: '900',
    color: Colors.textDark,
  },
});
