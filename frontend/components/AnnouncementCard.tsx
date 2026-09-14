import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Typography, Shadows } from '../constants/theme';
import { Announcement } from '../types';

interface AnnouncementCardProps {
  announcement: Announcement;
  onAcknowledge: (id: string) => void;
  userId?: string;
}

export const AnnouncementCard: React.FC<AnnouncementCardProps> = ({
  announcement,
  onAcknowledge,
  userId,
}) => {
  const isAcked = userId ? announcement.acknowledgements.includes(userId) : false;

  return (
    <View style={[styles.card, Shadows.card]}>
      <View style={styles.badgeRow}>
        <Text style={styles.badgeLabel}>📢 OFFICIAL ANNOUNCEMENT</Text>
        <Text style={styles.ackCount}>✓ {announcement.ackCount} Acknowledged</Text>
      </View>

      <Text style={styles.title}>{announcement.title}</Text>
      <Text style={styles.content}>{announcement.content}</Text>

      {(announcement.eventDate || announcement.location) && (
        <View style={styles.metaBox}>
          {announcement.eventDate ? (
            <Text style={styles.metaItem}>📅 {announcement.eventDate} {announcement.eventTime ? `(${announcement.eventTime})` : ''}</Text>
          ) : null}
          {announcement.location ? (
            <Text style={styles.metaItem}>📍 {announcement.location}</Text>
          ) : null}
        </View>
      )}

      <View style={styles.footer}>
        <Text style={styles.createdBy}>Posted by {announcement.createdByName}</Text>
        <TouchableOpacity
          style={[styles.ackBtn, isAcked && styles.ackBtnActive]}
          disabled={isAcked}
          onPress={() => onAcknowledge(announcement._id)}
        >
          <Text style={[styles.ackBtnText, isAcked && styles.ackBtnTextActive]}>
            {isAcked ? '✓ Acknowledged' : 'Acknowledge Notice'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFBEB',
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  badgeLabel: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '800',
    color: '#B45309',
    textTransform: 'uppercase',
  },
  ackCount: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  title: {
    fontSize: Typography.fontSize.md,
    fontWeight: '700',
    color: Colors.textDark,
    marginBottom: 4,
  },
  content: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textMedium,
    lineHeight: 20,
  },
  metaBox: {
    backgroundColor: '#FEF3C7',
    padding: 8,
    borderRadius: 8,
    marginVertical: 8,
  },
  metaItem: {
    fontSize: Typography.fontSize.xs,
    color: '#92400E',
    fontWeight: '600',
    marginVertical: 2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  createdBy: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textMuted,
  },
  ackBtn: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  ackBtnActive: {
    backgroundColor: '#D97706',
  },
  ackBtnText: {
    color: Colors.white,
    fontSize: Typography.fontSize.xs,
    fontWeight: '700',
  },
  ackBtnTextActive: {
    color: Colors.white,
  },
});
