import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography } from '../constants/theme';
import { RequestStatus } from '../types';

interface BadgeProps {
  label: string;
  status?: RequestStatus | string;
  color?: string;
  bg?: string;
}

export const Badge: React.FC<BadgeProps> = ({ label, status, color, bg }) => {
  let badgeBg = bg || Colors.primaryLight;
  let badgeColor = color || Colors.primaryDark;

  if (status) {
    switch (status) {
      case 'COLLECTING_MEMBERS':
      case 'OPEN':
        badgeBg = '#DBEAFE';
        badgeColor = '#1D4ED8';
        break;
      case 'TARGET_REACHED':
        badgeBg = '#D1FAE5';
        badgeColor = '#047857';
        break;
      case 'QUOTE_REQUESTED':
        badgeBg = '#EDE9FE';
        badgeColor = '#6D28D9';
        break;
      case 'DEAL_CONFIRMED':
      case 'SERVICE_SCHEDULED':
        badgeBg = '#FEF3C7';
        badgeColor = '#B45309';
        break;
      case 'COMPLETED':
        badgeBg = '#D1FAE5';
        badgeColor = '#065F46';
        break;
      case 'CANCELLED':
        badgeBg = '#FEE2E2';
        badgeColor = '#B91C1C';
        break;
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: badgeBg }]}>
      <Text style={[styles.text, { color: badgeColor }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '700',
  },
});
