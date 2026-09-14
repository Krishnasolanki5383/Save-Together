import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography, Shadows } from '../../constants/theme';
import { RequestCard } from '../../components/RequestCard';
import { useAuth } from '../../services/authContext';
import { ServiceRequest } from '../../types';

export default function MyActivitiesScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [tab, setTab] = useState<'JOINED' | 'CREATED' | 'COMPLETED'>('JOINED');

  const activities = MY_ACTIVITIES_DATA;

  const filtered = activities.filter((a) => {
    if (tab === 'CREATED') return a.createdBy === user?._id || a.createdBy === 'usr_admin';
    if (tab === 'COMPLETED') return a.status === 'COMPLETED';
    return a.status !== 'COMPLETED'; // JOINED
  });

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📋 My Society Activities</Text>
        <Text style={styles.subtitle}>Track service requests you created, joined, or completed</Text>

        {/* Tab Row (Section 30) */}
        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[styles.tab, tab === 'JOINED' && styles.tabActive]}
            onPress={() => setTab('JOINED')}
          >
            <Text style={[styles.tabText, tab === 'JOINED' && styles.tabTextActive]}>Joined by Me ({activities.length})</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, tab === 'CREATED' && styles.tabActive]}
            onPress={() => setTab('CREATED')}
          >
            <Text style={[styles.tabText, tab === 'CREATED' && styles.tabTextActive]}>Created by Me</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, tab === 'COMPLETED' && styles.tabActive]}
            onPress={() => setTab('COMPLETED')}
          >
            <Text style={[styles.tabText, tab === 'COMPLETED' && styles.tabTextActive]}>Completed</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {filtered.map((item) => (
          <RequestCard
            key={item._id}
            request={item}
            onPress={() => router.push(`/request/${item._id}`)}
            isInterested={true}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const MY_ACTIVITIES_DATA: ServiceRequest[] = [
  {
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
    participants: [{ userId: 'usr_admin', name: 'Priya Sharma', flatNumber: 'A-402' }],
    preferredDate: 'This Saturday',
    preferredTime: 'Morning (10:00 AM)',
    estimatedIndividualPrice: 800,
    estimatedGroupPrice: 550,
    status: 'COLLECTING_MEMBERS',
    isHighDemand: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'req_2',
    societyId: 'soc_1',
    createdBy: 'usr_rahul',
    createdByName: 'Rahul Verma',
    createdByFlat: 'Tower B - B-104',
    title: 'Fridge Repair & Servicing',
    category: 'Appliance Repair',
    description: 'My refrigerator is making unusual noise and cooling slowly. Looking for neighbors who need appliance repair.',
    targetMembers: 15,
    participantCount: 14,
    participants: [{ userId: 'usr_rahul', name: 'Rahul Verma', flatNumber: 'B-104' }],
    preferredDate: 'This Weekend',
    preferredTime: 'Afternoon (2:00 PM)',
    estimatedIndividualPrice: 750,
    estimatedGroupPrice: 450,
    status: 'COLLECTING_MEMBERS',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'req_4',
    societyId: 'soc_1',
    createdBy: 'usr_admin',
    createdByName: 'Priya Sharma (Admin)',
    createdByFlat: 'Tower A - A-402',
    title: 'Society Pest Control Drive',
    category: 'Pest Control',
    description: 'Herbal cockroach and mosquito pest control treatment for individual apartments.',
    targetMembers: 30,
    participantCount: 31,
    participants: [{ userId: 'usr_admin', name: 'Priya Sharma', flatNumber: 'A-402' }],
    preferredDate: 'Sunday, 20 Sept',
    preferredTime: 'Morning 9:00 AM',
    estimatedIndividualPrice: 900,
    estimatedGroupPrice: 600,
    finalPrice: 580,
    selectedProvider: 'SafeHome Herbal Pest Control',
    status: 'COMPLETED',
    createdAt: new Date().toISOString(),
  },
];

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: { padding: 16, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.cardBorder },
  headerTitle: { fontSize: 24, fontWeight: '900', color: Colors.textDark },
  subtitle: { fontSize: Typography.fontSize.xs, color: Colors.textMuted, marginTop: 2, marginBottom: 12 },
  tabRow: { flexDirection: 'row', gap: 6 },
  tab: { flex: 1, paddingVertical: 8, borderRadius: 12, backgroundColor: '#F1F5F9', alignItems: 'center' },
  tabActive: { backgroundColor: Colors.primary },
  tabText: { fontSize: Typography.fontSize.xs, fontWeight: '600', color: Colors.textMedium },
  tabTextActive: { color: Colors.white, fontWeight: '700' },
  scroll: { padding: 16 },
});
