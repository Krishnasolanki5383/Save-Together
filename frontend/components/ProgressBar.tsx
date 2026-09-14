import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography } from '../constants/theme';

interface ProgressBarProps {
  current: number;
  target: number;
  showText?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ current, target, showText = true }) => {
  const percentage = Math.min(Math.round((current / target) * 100), 100);
  const isReached = current >= target;

  return (
    <View style={styles.container}>
      {showText && (
        <View style={styles.textRow}>
          <Text style={styles.countText}>
            👥 <Text style={styles.bold}>{current}</Text> / {target} residents interested
          </Text>
          <Text style={[styles.percentText, isReached && { color: Colors.statusTarget }]}>
            {percentage}%
          </Text>
        </View>
      )}
      <View style={styles.track}>
        <View
          style={[
            styles.fill,
            { width: `${percentage}%` },
            isReached ? { backgroundColor: Colors.statusTarget } : { backgroundColor: Colors.primary },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
  },
  textRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  countText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textMedium,
  },
  bold: {
    fontWeight: '700',
    color: Colors.textDark,
  },
  percentText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '700',
    color: Colors.primary,
  },
  track: {
    height: 10,
    backgroundColor: '#E2E8F0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 5,
  },
});
