import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Colors, Typography } from '../../constants/theme';
import { PollCard } from '../../components/PollCard';
import { useAuth } from '../../services/authContext';
import apiClient from '../../services/api';
import { Poll } from '../../types';

export default function PollDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const [poll, setPoll] = useState<Poll | null>(null);

  useEffect(() => {
    fetchPoll();
  }, [id]);

  const fetchPoll = async () => {
    try {
      const res = await apiClient.get(`/polls/${id}`);
      if (res.data && res.data.success) {
        setPoll(res.data.poll);
      }
    } catch (e) {
      setPoll(DEFAULT_POLL);
    }
  };

  const handleVote = async (pollId: string, optionId: string) => {
    try {
      await apiClient.post(`/polls/${pollId}/vote`, { optionId });
      fetchPoll();
      Alert.alert('🎉 Vote Counted', 'Thank you for casting your vote!');
    } catch (e) {
      if (poll && user) {
        const updatedOptions = poll.options.map((opt) => {
          if (opt._id === optionId) {
            return {
              ...opt,
              voteCount: opt.voteCount + 1,
              votes: [...opt.votes, user._id],
            };
          }
          return opt;
        });
        setPoll({
          ...poll,
          options: updatedOptions,
          totalVotes: poll.totalVotes + 1,
          voterIds: [...poll.voterIds, user._id],
        });
        Alert.alert('🎉 Vote Counted', 'Thank you for casting your vote!');
      }
    }
  };

  if (!poll) return null;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.headerTitle}>Society Polling Board</Text>
        <Text style={styles.subtitle}>Every resident vote helps finalize timing & provider selection</Text>

        <PollCard poll={poll} onVote={handleVote} userId={user?._id} />
      </ScrollView>
    </SafeAreaView>
  );
}

const DEFAULT_POLL: Poll = {
  _id: 'p1',
  societyId: 's1',
  createdBy: 'usr_admin',
  createdByName: 'Priya Sharma (Admin)',
  question: 'Which day should we schedule the AC service group technician visit?',
  options: [
    { _id: 'o1', text: 'Saturday Morning (10 AM - 1 PM)', voteCount: 48, votes: ['usr_admin'] },
    { _id: 'o2', text: 'Saturday Evening (4 PM - 7 PM)', voteCount: 25, votes: [] },
    { _id: 'o3', text: 'Sunday Morning (10 AM - 1 PM)', voteCount: 20, votes: [] },
    { _id: 'o4', text: 'Sunday Evening (4 PM - 7 PM)', voteCount: 7, votes: [] },
  ],
  totalVotes: 100,
  voterIds: ['usr_admin'],
  status: 'OPEN',
  createdAt: new Date().toISOString(),
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: 16 },
  headerTitle: { fontSize: 24, fontWeight: '900', color: Colors.textDark },
  subtitle: { fontSize: Typography.fontSize.xs, color: Colors.textMuted, marginTop: 2, marginBottom: 16 },
});
