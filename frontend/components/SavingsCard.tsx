import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Typography, Shadows } from '../constants/theme';

interface SavingsCardProps {
  userSavings: number;
  societySavings: number;
  societyName: string;
  onPressDetails?: () => void;
}

export const SavingsCard: React.FC<SavingsCardProps> = ({
  userSavings,
  societySavings,
  societyName,
  onPressDetails,
}) => {
  return (
    <View style={[styles.card, Shadows.card]}>
      <View style={styles.topRow}>
        <View>
          <Text style={styles.subtitle}>💰 {societyName} Total Savings</Text>
          <Text style={styles.bigSavings}>₹{societySavings.toLocaleString('en-IN')}</Text>
        </View>
        <TouchableOpacity style={styles.badge} onPress={onPressDetails}>
          <Text style={styles.badgeText}>View Stats ›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.divider} />

      <View style={styles.bottomRow}>
        <View style={styles.item}>
          <Text style={styles.itemLabel}>Your Total Savings</Text>
          <Text style={styles.itemValue}>₹{userSavings.toLocaleString('en-IN')}</Text>
        </View>
        <View style={styles.verticalDivider} />
        <View style={styles.item}>
          <Text style={styles.itemLabel}>Group Power</Text>
          <Text style={styles.itemValueBold}>Save up to 35%</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.primaryDark,
    borderRadius: 20,
    padding: 18,
    marginVertical: 10,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  subtitle: {
    fontSize: Typography.fontSize.xs,
    color: Colors.primaryLight,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  bigSavings: {
    fontSize: 28,
    fontWeight: '900',
    color: Colors.white,
    marginTop: 4,
  },
  badge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    color: Colors.white,
    fontSize: Typography.fontSize.xs,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    marginVertical: 12,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  item: {
    alignItems: 'center',
  },
  itemLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.primaryLight,
  },
  itemValue: {
    fontSize: Typography.fontSize.md,
    fontWeight: '800',
    color: Colors.secondary,
    marginTop: 2,
  },
  itemValueBold: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '700',
    color: Colors.white,
    marginTop: 2,
  },
  verticalDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
});
