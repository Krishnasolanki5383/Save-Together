import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Share, TouchableOpacity, Alert } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { Colors, Typography, Shadows } from '../../constants/theme';
import { PrimaryButton } from '../../components/PrimaryButton';
import { useAuth } from '../../services/authContext';
import apiClient from '../../services/api';

export default function SocietyQRScreen() {
  const { user, society, updateUserSociety } = useAuth();
  const [inviteCode, setInviteCode] = useState(society?.inviteCode || 'GV426X');
  const [isRegenerating, setIsRegenerating] = useState(false);

  const joinUrl = `savetogether://society/${inviteCode}`;

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Join ${society?.name || 'Green Valley Society'} on Save Together! Use join code: ${inviteCode} or scan the QR code to participate in group service discounts.`,
      });
    } catch (e) {}
  };

  const handleRegenerate = async () => {
    if (user?.role !== 'ADMIN') {
      Alert.alert('Admin Only', 'Only Society Admin can regenerate society QR invite code');
      return;
    }

    Alert.alert(
      'Regenerate QR Code?',
      'Old QR codes will be revoked and residents will need the new QR code to join.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Regenerate',
          style: 'destructive',
          onPress: async () => {
            setIsRegenerating(true);
            try {
              if (society) {
                const res = await apiClient.post(`/societies/${society._id}/regenerate-qr`);
                if (res.data && res.data.success) {
                  setInviteCode(res.data.inviteCode);
                  updateUserSociety({ ...society, inviteCode: res.data.inviteCode });
                }
              }
            } catch (e) {
              const newCode = 'GV' + Math.floor(100 + Math.random() * 900) + 'X';
              setInviteCode(newCode);
            } finally {
              setIsRegenerating(false);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.headerTitle}>Society Invite QR Code</Text>
        <Text style={styles.subtitle}>Display or share this QR code for residents to join {society?.name || 'Green Valley Society'}</Text>

        <View style={[styles.qrCard, Shadows.card]}>
          <Text style={styles.societyName}>{society?.name || 'Green Valley Society'}</Text>
          <Text style={styles.localityText}>📍 {society?.locality || 'Powai'}, {society?.city || 'Mumbai'}</Text>

          <View style={styles.qrContainer}>
            <QRCode value={joinUrl} size={200} color={Colors.textDark} backgroundColor={Colors.white} />
          </View>

          <Text style={styles.codeLabel}>Society Join Code:</Text>
          <View style={styles.codeBox}>
            <Text style={styles.codeText}>{inviteCode}</Text>
          </View>

          <View style={styles.ruleNotice}>
            <Text style={styles.ruleText}>🔒 QR codes contain no sensitive user info. Only valid society invite identifier.</Text>
          </View>

          <PrimaryButton title="Share Invite Code" onPress={handleShare} style={{ width: '100%', marginTop: 14 }} />

          {user?.role === 'ADMIN' && (
            <TouchableOpacity style={styles.regenBtn} onPress={handleRegenerate} disabled={isRegenerating}>
              <Text style={styles.regenText}>{isRegenerating ? 'Updating Code...' : '🔄 Regenerate/Revoke QR Code (Admin)'}</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: 16 },
  headerTitle: { fontSize: 24, fontWeight: '900', color: Colors.textDark },
  subtitle: { fontSize: Typography.fontSize.xs, color: Colors.textMuted, marginTop: 2, marginBottom: 16 },
  qrCard: { backgroundColor: Colors.white, borderRadius: 24, padding: 24, alignItems: 'center', borderWidth: 1, borderColor: Colors.cardBorder },
  societyName: { fontSize: 22, fontWeight: '900', color: Colors.textDark, textAlign: 'center' },
  localityText: { fontSize: Typography.fontSize.xs, color: Colors.textMuted, marginTop: 2 },
  qrContainer: { padding: 16, backgroundColor: Colors.white, borderRadius: 16, marginVertical: 20, borderWidth: 2, borderColor: Colors.primaryLight },
  codeLabel: { fontSize: Typography.fontSize.xs, color: Colors.textMuted },
  codeBox: { backgroundColor: Colors.primaryBg, paddingHorizontal: 24, paddingVertical: 10, borderRadius: 12, marginVertical: 6, borderWidth: 1, borderColor: Colors.primaryLight },
  codeText: { fontSize: 24, fontWeight: '900', color: Colors.primaryDark, letterSpacing: 4 },
  ruleNotice: { backgroundColor: '#F1F5F9', padding: 10, borderRadius: 10, marginVertical: 10 },
  ruleText: { fontSize: 10, color: Colors.textMuted, textAlign: 'center' },
  regenBtn: { marginTop: 12, paddingVertical: 10 },
  regenText: { fontSize: Typography.fontSize.xs, fontWeight: '700', color: Colors.statusCancelled, textAlign: 'center' },
});
