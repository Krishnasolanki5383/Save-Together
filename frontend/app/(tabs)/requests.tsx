import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Typography } from '../../constants/theme';
import { RequestCard } from '../../components/RequestCard';
import { CategoryPicker } from '../../components/CategoryPicker';
import { EmptyState } from '../../components/EmptyState';
import { useAuth } from '../../services/authContext';
import apiClient from '../../services/api';
import { ServiceRequest } from '../../types';

export default function RequestsScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, [selectedCategory, selectedStatus]);

  const fetchRequests = async () => {
    try {
      const res = await apiClient.get('/requests', {
        params: {
          category: selectedCategory,
          status: selectedStatus === 'ALL' ? undefined : selectedStatus,
          search: search || undefined,
        },
      });
      if (res.data && res.data.success) {
        setRequests(res.data.requests);
      }
    } catch (e) {
      setRequests(DEFAULT_REQUESTS_LIST);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchRequests();
    setRefreshing(false);
  };

  const filteredRequests = requests.filter((r) => {
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase()) || r.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCategory === 'All' || r.category === selectedCategory;
    const matchStat = selectedStatus === 'ALL' || r.status === selectedStatus;
    return matchSearch && matchCat && matchStat;
  });

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Society Service Requests</Text>
        <Text style={styles.subtitle}>Discover common needs created by neighbors & join for group savings</Text>

        {/* Search Bar */}
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search fridge, AC service, pest control..."
            value={search}
            onChangeText={setSearch}
            onSubmitEditing={fetchRequests}
          />
        </View>

        {/* Status Tabs */}
        <View style={styles.statusRow}>
          <TouchableOpacity
            style={[styles.statusChip, selectedStatus === 'ALL' && styles.statusChipActive]}
            onPress={() => setSelectedStatus('ALL')}
          >
            <Text style={[styles.statusText, selectedStatus === 'ALL' && styles.statusTextActive]}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.statusChip, selectedStatus === 'COLLECTING_MEMBERS' && styles.statusChipActive]}
            onPress={() => setSelectedStatus('COLLECTING_MEMBERS')}
          >
            <Text style={[styles.statusText, selectedStatus === 'COLLECTING_MEMBERS' && styles.statusTextActive]}>Collecting</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.statusChip, selectedStatus === 'TARGET_REACHED' && styles.statusChipActive]}
            onPress={() => setSelectedStatus('TARGET_REACHED')}
          >
            <Text style={[styles.statusText, selectedStatus === 'TARGET_REACHED' && styles.statusTextActive]}>Target Reached 🎉</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.statusChip, selectedStatus === 'DEAL_CONFIRMED' && styles.statusChipActive]}
            onPress={() => setSelectedStatus('DEAL_CONFIRMED')}
          >
            <Text style={[styles.statusText, selectedStatus === 'DEAL_CONFIRMED' && styles.statusTextActive]}>Confirmed Deals</Text>
          </TouchableOpacity>
        </View>

        {/* Smart Categories horizontal picker */}
        <CategoryPicker
          selectedCategory={selectedCategory}
          onSelect={setSelectedCategory}
          showAllOption={true}
        />
      </View>

      <FlatList
        data={filteredRequests}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />}
        renderItem={({ item }) => (
          <RequestCard
            request={item}
            onPress={() => router.push(`/request/${item._id}`)}
            isInterested={user ? item.participants.some((p) => p.userId === user._id) : false}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            title="No Service Requests Found"
            description="Be the first resident to create a group service request and get bulk discounts!"
            buttonTitle="Create Service Request"
            onButtonPress={() => router.push('/(tabs)/create')}
            iconEmoji="🔧"
          />
        }
      />
    </SafeAreaView>
  );
}

const DEFAULT_REQUESTS_LIST: ServiceRequest[] = [
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
    _id: 'req_3',
    societyId: 'soc_1',
    createdBy: 'usr_ananya',
    createdByName: 'Ananya Patel',
    createdByFlat: 'Tower C - C-701',
    title: 'Home Deep Cleaning & Sanitize',
    category: 'Cleaning',
    description: 'Balcony, bathroom & couch deep cleaning. Bulk discount unlocked at 20+ flats.',
    targetMembers: 25,
    participantCount: 23,
    participants: [{ userId: 'usr_ananya', name: 'Ananya Patel', flatNumber: 'C-701' }],
    preferredDate: 'Next Sunday',
    preferredTime: 'Full Day',
    estimatedIndividualPrice: 1200,
    estimatedGroupPrice: 850,
    status: 'TARGET_REACHED',
    createdAt: new Date().toISOString(),
  },
];

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: 16, paddingTop: 16, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.cardBorder },
  title: { fontSize: 24, fontWeight: '900', color: Colors.textDark },
  subtitle: { fontSize: Typography.fontSize.xs, color: Colors.textMuted, marginTop: 2, marginBottom: 12 },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F1F5F9', borderRadius: 12, paddingHorizontal: 12, height: 44, marginBottom: 10 },
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchInput: { flex: 1, fontSize: Typography.fontSize.sm, color: Colors.textDark },
  statusRow: { flexDirection: 'row', gap: 6, marginVertical: 4 },
  statusChip: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 14, backgroundColor: '#F1F5F9' },
  statusChipActive: { backgroundColor: Colors.primary },
  statusText: { fontSize: Typography.fontSize.xs, fontWeight: '600', color: Colors.textMedium },
  statusTextActive: { color: Colors.white, fontWeight: '700' },
  listContent: { padding: 16 },
});
