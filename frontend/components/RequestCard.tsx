import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Typography, Shadows } from '../constants/theme';
import { ServiceRequest } from '../types';
import { Badge } from './Badge';
import { ProgressBar } from './ProgressBar';
import { Categories } from '../constants/categories';

interface RequestCardProps {
  request: ServiceRequest;
  onPress: () => void;
  onInterestPress?: () => void;
  isInterested?: boolean;
}

export const RequestCard: React.FC<RequestCardProps> = ({
  request,
  onPress,
  onInterestPress,
  isInterested = false,
}) => {
  const categoryInfo = Categories.find((c) => c.id === request.category) || Categories[Categories.length - 1];
  const savings = request.estimatedIndividualPrice - request.estimatedGroupPrice;
  const isTargetReached = request.participantCount >= request.targetMembers;

  return (
    <TouchableOpacity style={[styles.card, Shadows.card]} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.header}>
        <View style={[styles.iconCircle, { backgroundColor: categoryInfo.bg }]}>
          <Text style={styles.iconEmoji}>{getCategoryEmoji(request.category)}</Text>
        </View>
        <View style={styles.headerText}>
          <Text style={styles.categoryText}>{request.category}</Text>
          <Text style={styles.title} numberOfLines={1}>
            {request.title}
          </Text>
        </View>
        <Badge
          label={
            isTargetReached && request.status === 'COLLECTING_MEMBERS'
              ? 'Target Reached 🎉'
              : formatStatusLabel(request.status)
          }
          status={request.status}
        />
      </View>

      <Text style={styles.description} numberOfLines={2}>
        "{request.description}"
      </Text>

      {/* Saving Highlight Banner */}
      <View style={styles.savingBanner}>
        <Text style={styles.savingLabel}>💰 Estimated Group Saving:</Text>
        <Text style={styles.savingValue}>₹{savings}/person</Text>
      </View>

      <ProgressBar current={request.participantCount} target={request.targetMembers} />

      <View style={styles.footer}>
        <Text style={styles.creatorText}>
          Posted by {request.createdByName} ({request.createdByFlat})
        </Text>
        {onInterestPress && (
          <TouchableOpacity
            style={[
              styles.interestBtn,
              isInterested && styles.interestedActiveBtn,
            ]}
            onPress={onInterestPress}
          >
            <Text style={[styles.interestBtnText, isInterested && styles.interestedActiveText]}>
              {isInterested ? "✓ You're In" : "I'm Interested"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const formatStatusLabel = (status: string) => {
  switch (status) {
    case 'COLLECTING_MEMBERS':
      return 'Collecting Members';
    case 'TARGET_REACHED':
      return 'Target Reached 🎉';
    case 'QUOTE_REQUESTED':
      return 'Quotes Requested';
    case 'DEAL_CONFIRMED':
      return 'Deal Confirmed';
    case 'COMPLETED':
      return 'Completed';
    default:
      return status.replace('_', ' ');
  }
};

const getCategoryEmoji = (category: string) => {
  switch (category) {
    case 'AC Service':
      return '❄️';
    case 'Appliance Repair':
      return '🔧';
    case 'Plumbing':
      return '🚰';
    case 'Electrical':
      return '⚡';
    case 'Carpenter':
      return '🪚';
    case 'Cleaning':
      return '🧹';
    case 'Pest Control':
      return '🦟';
    case 'Internet':
      return '📶';
    case 'Moving':
      return '📦';
    case 'Home Painting':
      return '🎨';
    case 'RO Service':
      return '💧';
    case 'CCTV':
      return '📹';
    default:
      return '🏢';
  }
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  iconEmoji: {
    fontSize: 22,
  },
  headerText: {
    flex: 1,
  },
  categoryText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: Typography.fontSize.md,
    fontWeight: '700',
    color: Colors.textDark,
  },
  description: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textMedium,
    marginVertical: 6,
    lineHeight: 20,
  },
  savingBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.primaryBg,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: Colors.primaryLight,
  },
  savingLabel: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '600',
    color: Colors.primaryDark,
  },
  savingValue: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '800',
    color: Colors.primaryDark,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  creatorText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textMuted,
    flex: 1,
  },
  interestBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
  },
  interestedActiveBtn: {
    backgroundColor: Colors.statusTarget,
  },
  interestBtnText: {
    color: Colors.white,
    fontSize: Typography.fontSize.xs,
    fontWeight: '700',
  },
  interestedActiveText: {
    color: Colors.white,
  },
});
