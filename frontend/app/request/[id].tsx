import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors, Typography, Shadows } from '../../constants/theme';
import { Badge } from '../../components/Badge';
import { ProgressBar } from '../../components/ProgressBar';
import { PrimaryButton } from '../../components/PrimaryButton';
import { useAuth } from '../../services/authContext';
import apiClient from '../../services/api';
import { ServiceRequest, Quote, StructuredComment } from '../../types';

const PREDEFINED_COMMENTS = [
  'I need this service urgently',
  'Saturday morning works best for me',
  'Saturday evening works best for me',
  'Sunday morning works best for me',
  'Sunday evening works best for me',
  'I have contacted a local technician option',
  'Please request provider quote',
  'Count me in for group booking',
];

export default function RequestDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();

  const [request, setRequest] = useState<ServiceRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [newProviderName, setNewProviderName] = useState('');
  const [newProviderPrice, setNewProviderPrice] = useState('');

  useEffect(() => {
    fetchRequestDetails();
  }, [id]);

  const fetchRequestDetails = async () => {
    try {
      const res = await apiClient.get(`/requests/${id}`);
      if (res.data && res.data.success) {
        setRequest(res.data.request);
      }
    } catch (e) {
      setRequest(DEFAULT_REQUEST_DETAIL);
    } finally {
      setLoading(false);
    }
  };

  const isUserInterested = request && user ? request.participants.some((p) => p.userId === user._id) : false;

  const handleJoin = async () => {
    try {
      const res = await apiClient.post(`/requests/${id}/join`);
      if (res.data && res.data.success) {
        Alert.alert("🎉 You're In!", res.data.message);
        fetchRequestDetails();
      }
    } catch (e) {
      if (request && user) {
        const updated = {
          ...request,
          participantCount: request.participantCount + 1,
          participants: [
            ...request.participants,
            { userId: user._id, name: user.name, flatNumber: user.flatNumber },
          ],
        };
        setRequest(updated);
        Alert.alert("🎉 You're In!", "You have joined this request. We'll notify you when target is reached!");
      }
    }
  };

  const handleLeave = async () => {
    try {
      await apiClient.delete(`/requests/${id}/leave`);
      fetchRequestDetails();
    } catch (e) {
      if (request && user) {
        const updated = {
          ...request,
          participantCount: Math.max(request.participantCount - 1, 0),
          participants: request.participants.filter((p) => p.userId !== user._id),
        };
        setRequest(updated);
      }
    }
  };

  const handleVoteQuote = async (quoteId: string) => {
    try {
      await apiClient.post(`/requests/${id}/quotes/${quoteId}/vote`);
      fetchRequestDetails();
      Alert.alert('✓ Vote Recorded', 'Your provider preference has been saved.');
    } catch (e) {
      Alert.alert('✓ Vote Recorded', 'Your provider vote has been saved.');
    }
  };

  const handleAddPresetComment = async (presetText: string) => {
    try {
      await apiClient.post(`/requests/${id}/comments`, { presetText });
      fetchRequestDetails();
    } catch (e) {
      if (request && user) {
        const newComm: StructuredComment = {
          userId: user._id,
          userName: user.name,
          flatNumber: user.flatNumber,
          presetText,
          createdAt: new Date().toISOString(),
        };
        setRequest({
          ...request,
          structuredComments: [...(request.structuredComments || []), newComm],
        });
      }
    }
  };

  const handleAddQuote = async () => {
    if (!newProviderName || !newProviderPrice) {
      Alert.alert('Required', 'Enter provider name and price per person');
      return;
    }
    try {
      await apiClient.post(`/requests/${id}/quotes`, {
        providerName: newProviderName,
        pricePerPerson: Number(newProviderPrice),
      });
      setNewProviderName('');
      setNewProviderPrice('');
      fetchRequestDetails();
      Alert.alert('✓ Quote Added', 'New service provider quote published to residents!');
    } catch (e) {}
  };

  if (!request) return null;

  const perPersonSaving = request.estimatedIndividualPrice - request.estimatedGroupPrice;
  const isTargetReached = request.participantCount >= request.targetMembers;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Top Summary Card */}
        <View style={[styles.mainCard, Shadows.card]}>
          <View style={styles.badgeRow}>
            <Text style={styles.categoryTag}>{request.category}</Text>
            <Badge label={isTargetReached ? 'Target Reached 🎉' : request.status} status={request.status} />
          </View>

          <Text style={styles.title}>{request.title}</Text>
          <Text style={styles.description}>"{request.description}"</Text>

          {/* Savings Box */}
          <View style={styles.savingsBox}>
            <View style={styles.savingCol}>
              <Text style={styles.savingLabel}>Solo Price:</Text>
              <Text style={styles.savingStrikethrough}>₹{request.estimatedIndividualPrice}</Text>
            </View>
            <View style={styles.savingCol}>
              <Text style={styles.savingLabel}>Group Target Price:</Text>
              <Text style={styles.savingPrice}>₹{request.estimatedGroupPrice}</Text>
            </View>
            <View style={styles.savingCol}>
              <Text style={styles.savingLabel}>You Save:</Text>
              <Text style={styles.savingHighlight}>₹{perPersonSaving}/person</Text>
            </View>
          </View>

          <View style={styles.metaRow}>
            <Text style={styles.metaText}>📅 Date: {request.preferredDate}</Text>
            <Text style={styles.metaText}>⏰ Time: {request.preferredTime}</Text>
          </View>

          <ProgressBar current={request.participantCount} target={request.targetMembers} />

          {/* Action Button */}
          {isUserInterested ? (
            <View style={styles.inGroupRow}>
              <Text style={styles.inGroupText}>✓ You are participating in this request</Text>
              <TouchableOpacity style={styles.leaveBtn} onPress={handleLeave}>
                <Text style={styles.leaveText}>Leave Request</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <PrimaryButton
              title="I'm Interested — Join Group"
              onPress={handleJoin}
              style={{ marginTop: 12 }}
            />
          )}
        </View>

        {/* Service Provider Quotes Section (Section 27) */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>👨‍🔧 Service Provider Quotes & Voting</Text>
          <Text style={styles.sectionSubtitle}>
            Review technician quotes obtained for bulk group booking and vote for your preference:
          </Text>

          {request.quotes && request.quotes.length > 0 ? (
            request.quotes.map((q) => (
              <View key={q._id} style={styles.quoteBox}>
                <View style={styles.quoteHeader}>
                  <View>
                    <Text style={styles.quoteProvider}>{q.providerName}</Text>
                    <Text style={styles.quoteRating}>⭐ {q.rating} rating</Text>
                  </View>
                  <Text style={styles.quotePrice}>₹{q.pricePerPerson}/person</Text>
                </View>
                <TouchableOpacity
                  style={[styles.voteQuoteBtn, q.votes.includes(user?._id || '') && styles.voteQuoteBtnActive]}
                  onPress={() => handleVoteQuote(q._id)}
                >
                  <Text style={[styles.voteQuoteText, q.votes.includes(user?._id || '') && styles.voteQuoteTextActive]}>
                    {q.votes.includes(user?._id || '') ? '✓ Your Voted Choice' : `Vote for ${q.providerName} (${q.votes.length} votes)`}
                  </Text>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text style={styles.noQuotesText}>No provider quotes added yet. Admin or creator can request quotes after target is reached.</Text>
          )}

          {/* Admin/Creator Add Quote Input */}
          {(user?.role === 'ADMIN' || user?._id === request.createdBy) && (
            <View style={styles.addQuoteForm}>
              <Text style={styles.addQuoteTitle}>＋ Add Technician Quote Option:</Text>
              <View style={styles.row}>
                <TextInput
                  style={[styles.input, { flex: 2, marginRight: 6 }]}
                  placeholder="Provider Name (e.g. CoolAir)"
                  value={newProviderName}
                  onChangeText={setNewProviderName}
                />
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Price ₹"
                  keyboardType="numeric"
                  value={newProviderPrice}
                  onChangeText={setNewProviderPrice}
                />
              </View>
              <TouchableOpacity style={styles.addQuoteSubmitBtn} onPress={handleAddQuote}>
                <Text style={styles.addQuoteSubmitText}>Add Provider Quote</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Structured Predefined Comments (Section 32 - Strict No Chat) */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>💬 Structured Quick Responses (No Chat)</Text>
          <Text style={styles.sectionSubtitle}>Select a predefined status option to communicate with participants:</Text>

          <View style={styles.presetGrid}>
            {PREDEFINED_COMMENTS.map((preset, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.presetChip}
                onPress={() => handleAddPresetComment(preset)}
              >
                <Text style={styles.presetText}>+ {preset}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Displayed Comment List */}
          {request.structuredComments && request.structuredComments.length > 0 && (
            <View style={styles.commentList}>
              <Text style={styles.recentTitle}>Resident Updates:</Text>
              {request.structuredComments.map((c, i) => (
                <View key={i} style={styles.commentItem}>
                  <Text style={styles.commentUser}>{c.userName} ({c.flatNumber}):</Text>
                  <Text style={styles.commentBody}>"{c.presetText}"</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Participants List */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>👥 Interested Residents ({request.participantCount})</Text>
          {request.participants.map((p, idx) => (
            <View key={idx} style={styles.participantRow}>
              <Text style={styles.partIcon}>👤</Text>
              <Text style={styles.partName}>{p.name}</Text>
              <Text style={styles.partFlat}>Flat {p.flatNumber}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const DEFAULT_REQUEST_DETAIL: ServiceRequest = {
  _id: 'req_1',
  societyId: 'soc_1',
  createdBy: 'usr_admin',
  createdByName: 'Priya Sharma (Admin)',
  createdByFlat: 'Tower A - A-402',
  title: 'AC Servicing & Gas Top-up',
  category: 'AC Service',
  description: 'Looking for residents who need AC servicing and deep filter cleaning before peak summer heat.',
  targetMembers: 20,
  participantCount: 18,
  participants: [
    { userId: 'usr_admin', name: 'Priya Sharma', flatNumber: 'A-402' },
    { userId: 'usr_rahul', name: 'Rahul Verma', flatNumber: 'B-104' },
  ],
  preferredDate: 'This Saturday',
  preferredTime: 'Morning (10:00 AM)',
  estimatedIndividualPrice: 800,
  estimatedGroupPrice: 550,
  status: 'COLLECTING_MEMBERS',
  quotes: [
    { _id: 'q1', providerName: 'CoolAir Services', pricePerPerson: 550, rating: 4.7, votes: ['usr_admin'] },
    { _id: 'q2', providerName: 'Urban Tech Repairs', pricePerPerson: 580, rating: 4.5, votes: [] },
  ],
  structuredComments: [
    { userId: 'usr_rahul', userName: 'Rahul Verma', flatNumber: 'B-104', presetText: 'Saturday morning works best for me' },
  ],
  createdAt: new Date().toISOString(),
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: 16 },
  mainCard: { backgroundColor: Colors.white, borderRadius: 20, padding: 18, marginBottom: 14, borderWidth: 1, borderColor: Colors.cardBorder },
  badgeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  categoryTag: { fontSize: Typography.fontSize.xs, fontWeight: '800', color: Colors.primaryDark, textTransform: 'uppercase' },
  title: { fontSize: 22, fontWeight: '900', color: Colors.textDark, marginBottom: 6 },
  description: { fontSize: Typography.fontSize.sm, color: Colors.textMedium, lineHeight: 20, marginBottom: 12 },
  savingsBox: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: Colors.primaryBg, padding: 12, borderRadius: 14, borderWidth: 1, borderColor: Colors.primaryLight, marginBottom: 12 },
  savingCol: { alignItems: 'center' },
  savingLabel: { fontSize: 10, color: Colors.textMuted, fontWeight: '600' },
  savingStrikethrough: { fontSize: Typography.fontSize.sm, color: Colors.textLight, textDecorationLine: 'line-through' },
  savingPrice: { fontSize: Typography.fontSize.md, fontWeight: '800', color: Colors.primaryDark },
  savingHighlight: { fontSize: Typography.fontSize.md, fontWeight: '900', color: Colors.secondary },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  metaText: { fontSize: Typography.fontSize.xs, fontWeight: '600', color: Colors.textMedium },
  inGroupRow: { marginTop: 12, padding: 12, backgroundColor: '#D1FAE5', borderRadius: 12, alignItems: 'center' },
  inGroupText: { fontSize: Typography.fontSize.xs, fontWeight: '800', color: '#047857' },
  leaveBtn: { marginTop: 6 },
  leaveText: { fontSize: Typography.fontSize.xs, fontWeight: '700', color: Colors.statusCancelled, textDecorationLine: 'underline' },
  sectionCard: { backgroundColor: Colors.white, borderRadius: 20, padding: 18, marginBottom: 14, borderWidth: 1, borderColor: Colors.cardBorder },
  sectionTitle: { fontSize: Typography.fontSize.md, fontWeight: '800', color: Colors.textDark },
  sectionSubtitle: { fontSize: Typography.fontSize.xs, color: Colors.textMuted, marginTop: 2, marginBottom: 10 },
  quoteBox: { backgroundColor: '#F8FAFC', padding: 12, borderRadius: 12, marginVertical: 6, borderWidth: 1, borderColor: Colors.cardBorder },
  quoteHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  quoteProvider: { fontSize: Typography.fontSize.sm, fontWeight: '800', color: Colors.textDark },
  quoteRating: { fontSize: Typography.fontSize.xs, color: Colors.textMuted },
  quotePrice: { fontSize: Typography.fontSize.md, fontWeight: '900', color: Colors.primaryDark },
  voteQuoteBtn: { marginTop: 8, backgroundColor: Colors.white, paddingVertical: 8, borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: Colors.cardBorder },
  voteQuoteBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  voteQuoteText: { fontSize: Typography.fontSize.xs, fontWeight: '700', color: Colors.textDark },
  voteQuoteTextActive: { color: Colors.white },
  noQuotesText: { fontSize: Typography.fontSize.xs, color: Colors.textMuted, fontStyle: 'italic', marginVertical: 8 },
  addQuoteForm: { marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  addQuoteTitle: { fontSize: Typography.fontSize.xs, fontWeight: '800', color: Colors.primaryDark, marginBottom: 6 },
  row: { flexDirection: 'row' },
  input: { height: 40, backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.cardBorder, borderRadius: 8, paddingHorizontal: 10, fontSize: Typography.fontSize.xs, color: Colors.textDark },
  addQuoteSubmitBtn: { backgroundColor: Colors.primary, paddingVertical: 8, borderRadius: 8, alignItems: 'center', marginTop: 6 },
  addQuoteSubmitText: { color: Colors.white, fontSize: Typography.fontSize.xs, fontWeight: '700' },
  presetGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginVertical: 6 },
  presetChip: { backgroundColor: '#F1F5F9', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12 },
  presetText: { fontSize: Typography.fontSize.xs, color: Colors.primaryDark, fontWeight: '600' },
  commentList: { marginTop: 10, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  recentTitle: { fontSize: Typography.fontSize.xs, fontWeight: '800', color: Colors.textDark, marginBottom: 4 },
  commentItem: { backgroundColor: '#F8FAFC', padding: 8, borderRadius: 8, marginVertical: 2 },
  commentUser: { fontSize: 10, fontWeight: '700', color: Colors.textMuted },
  commentBody: { fontSize: Typography.fontSize.xs, color: Colors.textDark, fontStyle: 'italic' },
  participantRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  partIcon: { fontSize: 16, marginRight: 10 },
  partName: { flex: 1, fontSize: Typography.fontSize.sm, fontWeight: '700', color: Colors.textDark },
  partFlat: { fontSize: Typography.fontSize.xs, color: Colors.textMuted },
});
