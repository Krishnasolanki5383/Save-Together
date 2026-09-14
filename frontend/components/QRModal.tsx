import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Share } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { Colors, Typography } from '../constants/theme';
import { PrimaryButton } from './PrimaryButton';

interface QRModalProps {
  visible: boolean;
  onClose: () => void;
  societyName: string;
  inviteCode: string;
  isRegenerating?: boolean;
  onRegenerate?: () => void;
  isAdmin?: boolean;
}

export const QRModal: React.FC<QRModalProps> = ({
  visible,
  onClose,
  societyName,
  inviteCode,
  onRegenerate,
  isAdmin = false,
}) => {
  const joinUrl = `savetogether://society/${inviteCode}`;

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Join ${societyName} on Save Together! Use society join code: ${inviteCode} or scan the QR code to start saving on common services together.`,
      });
    } catch (e) {
      console.log('Share error:', e);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.content}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>✕</Text>
          </TouchableOpacity>

          <Text style={styles.subTitle}>Society Invite QR</Text>
          <Text style={styles.title}>Scan to join {societyName}</Text>

          <View style={styles.qrContainer}>
            <QRCode value={joinUrl} size={180} color={Colors.textDark} backgroundColor={Colors.white} />
          </View>

          <Text style={styles.codeLabel}>Or Enter Society Join Code:</Text>
          <View style={styles.codeBox}>
            <Text style={styles.codeText}>{inviteCode}</Text>
          </View>

          <View style={styles.btnRow}>
            <PrimaryButton title="Share Invite" onPress={handleShare} style={{ flex: 1, marginRight: 6 }} />
            {isAdmin && onRegenerate && (
              <TouchableOpacity style={styles.regenBtn} onPress={onRegenerate}>
                <Text style={styles.regenText}>🔄 New Code</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: 24,
    width: '100%',
    alignItems: 'center',
    position: 'relative',
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textMuted,
  },
  subTitle: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '800',
    color: Colors.primary,
    textTransform: 'uppercase',
    marginTop: 4,
  },
  title: {
    fontSize: Typography.fontSize.lg,
    fontWeight: '800',
    color: Colors.textDark,
    textAlign: 'center',
    marginVertical: 6,
  },
  qrContainer: {
    padding: 16,
    backgroundColor: Colors.white,
    borderRadius: 16,
    marginVertical: 16,
    borderWidth: 2,
    borderColor: Colors.primaryLight,
  },
  codeLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textMuted,
  },
  codeBox: {
    backgroundColor: Colors.primaryBg,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 12,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: Colors.primaryLight,
  },
  codeText: {
    fontSize: 22,
    fontWeight: '900',
    color: Colors.primaryDark,
    letterSpacing: 4,
  },
  btnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    width: '100%',
  },
  regenBtn: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 14,
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
  },
  regenText: {
    color: '#B45309',
    fontSize: Typography.fontSize.xs,
    fontWeight: '700',
  },
});
