import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Typography, Shadows } from '../constants/theme';
import { Poll } from '../types';

interface PollCardProps {
  poll: Poll;
  onVote: (pollId: string, optionId: string) => void;
  userId?: string;
}

export const PollCard: React.FC<PollCardProps> = ({ poll, onVote, userId }) => {
  const isVoted = userId ? poll.voterIds.includes(userId) : false;
  const isClosed = poll.status === 'CLOSED';

  return (
    <View style={[styles.card, Shadows.card]}>
      <View style={styles.header}>
        <Text style={styles.badgeText}>{isClosed ? '🔒 Poll Closed' : '🗳 Active Poll'}</Text>
        <Text style={styles.totalVotes}>{poll.totalVotes} votes</Text>
      </View>

      <Text style={styles.question}>{poll.question}</Text>

      {poll.winningOption && (
        <View style={styles.winnerBanner}>
          <Text style={styles.winnerLabel}>Selected Winner:</Text>
          <Text style={styles.winnerValue}>🏆 {poll.winningOption}</Text>
        </View>
      )}

      {poll.options.map((opt) => {
        const pct = poll.totalVotes > 0 ? Math.round((opt.voteCount / poll.totalVotes) * 100) : 0;
        const userVotedThis = userId ? opt.votes.includes(userId) : false;

        return (
          <TouchableOpacity
            key={opt._id}
            style={[
              styles.optionBtn,
              userVotedThis && styles.optionBtnSelected,
            ]}
            disabled={isVoted || isClosed}
            onPress={() => onVote(poll._id, opt._id)}
          >
            <View style={[styles.fillBar, { width: `${pct}%` }]} />
            <View style={styles.optionContent}>
              <Text style={[styles.optionText, userVotedThis && styles.optionTextSelected]}>
                {userVotedThis ? '✓ ' : ''}
                {opt.text}
              </Text>
              <Text style={styles.percentText}>{pct}%</Text>
            </View>
          </TouchableOpacity>
        );
      })}

      <Text style={styles.footerText}>
        Created by {poll.createdByName}
      </Text>
    </View>
  );
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
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  badgeText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '700',
    color: Colors.accent,
    textTransform: 'uppercase',
  },
  totalVotes: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textMuted,
  },
  question: {
    fontSize: Typography.fontSize.md,
    fontWeight: '700',
    color: Colors.textDark,
    marginBottom: 12,
  },
  winnerBanner: {
    backgroundColor: '#FEF3C7',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  winnerLabel: {
    fontSize: Typography.fontSize.xs,
    color: '#B45309',
    fontWeight: '600',
  },
  winnerValue: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '800',
    color: '#B45309',
    marginTop: 2,
  },
  optionBtn: {
    height: 44,
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    marginVertical: 4,
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    position: 'relative',
  },
  optionBtnSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryBg,
  },
  fillBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: Colors.primaryLight,
    borderRadius: 10,
  },
  optionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    zIndex: 1,
  },
  optionText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textDark,
    fontWeight: '500',
    flex: 1,
  },
  optionTextSelected: {
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  percentText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '700',
    color: Colors.textMedium,
    marginLeft: 8,
  },
  footerText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textMuted,
    marginTop: 8,
    textAlign: 'right',
  },
});
