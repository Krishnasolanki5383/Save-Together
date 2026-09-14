import React from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { Colors, Typography, Shadows } from '../constants/theme';

interface SavingsCalculatorProps {
  indivPrice: number;
  groupPrice: number;
  targetCount: number;
  onChangeIndiv: (val: number) => void;
  onChangeGroup: (val: number) => void;
  onChangeTarget: (val: number) => void;
}

export const SavingsCalculator: React.FC<SavingsCalculatorProps> = ({
  indivPrice,
  groupPrice,
  targetCount,
  onChangeIndiv,
  onChangeGroup,
  onChangeTarget,
}) => {
  const perPersonSaving = Math.max(indivPrice - groupPrice, 0);
  const totalSocietySaving = perPersonSaving * targetCount;

  return (
    <View style={[styles.card, Shadows.card]}>
      <Text style={styles.title}>🧮 Group Savings Calculator (Estimate)</Text>
      <Text style={styles.subtitle}>
        See how much your society will save when residents join together.
      </Text>

      <View style={styles.inputsRow}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Solo Price (₹)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={String(indivPrice)}
            onChangeText={(t) => onChangeIndiv(Number(t) || 0)}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Group Price (₹)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={String(groupPrice)}
            onChangeText={(t) => onChangeGroup(Number(t) || 0)}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Target People</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={String(targetCount)}
            onChangeText={(t) => onChangeTarget(Number(t) || 1)}
          />
        </View>
      </View>

      <View style={styles.resultBanner}>
        <View>
          <Text style={styles.resultLabel}>Per Person Saving:</Text>
          <Text style={styles.resultValue}>₹{perPersonSaving}</Text>
        </View>

        <View style={styles.rightResult}>
          <Text style={styles.resultLabel}>Estimated Total Society Saving:</Text>
          <Text style={styles.resultBig}>₹{totalSocietySaving.toLocaleString('en-IN')}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F0FDFA',
    borderRadius: 16,
    padding: 16,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: Colors.primaryLight,
  },
  title: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '800',
    color: Colors.primaryDark,
  },
  subtitle: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textMuted,
    marginTop: 2,
    marginBottom: 12,
  },
  inputsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputGroup: {
    flex: 1,
    marginHorizontal: 4,
  },
  label: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '600',
    color: Colors.textMedium,
    marginBottom: 4,
  },
  input: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: Typography.fontSize.sm,
    fontWeight: '700',
    color: Colors.textDark,
    textAlign: 'center',
  },
  resultBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.primaryDark,
    borderRadius: 12,
    padding: 12,
    marginTop: 14,
  },
  resultLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.primaryLight,
  },
  resultValue: {
    fontSize: Typography.fontSize.md,
    fontWeight: '800',
    color: Colors.secondary,
    marginTop: 2,
  },
  rightResult: {
    alignItems: 'flex-end',
  },
  resultBig: {
    fontSize: Typography.fontSize.lg,
    fontWeight: '900',
    color: Colors.white,
    marginTop: 2,
  },
});
