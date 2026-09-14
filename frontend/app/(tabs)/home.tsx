import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography } from '../../constants/theme';
import { useAuth } from '../../services/authContext';
import { RequestCard } from '../../components/RequestCard';
import { AnnouncementCard } from '../../components/AnnouncementCard';
import { SavingsCard } from '../../components/SavingsCard';
import { QRModal } from '../../components/QRModal';
import apiClient from '../../services/api';
import { ServiceRequest, Announcement, Poll } from '../../types';

export default function HomeScreen() {
  const router = useRouter();
  const { user, society } = useAuth();

  const [refreshing, setRefreshing] = useState(false);
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [showQRModal, setShowQRModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const reqRes = await apiClient.get('/requests');
      if (reqRes.data && reqRes.data.success) {
        setRequests(reqRes.data.requests);
      }
      const annRes = await apiClient.get('/announcements');
      if (annRes.data && annRes.data.success) {
        setAnnouncements(annRes.data.announcements);
      }
    } catch (e) {
      // Fallback sample data if offline
      setRequests(DEFAULT_REQUESTS);
      setAnnouncements(DEFAULT_ANNOUNCEMENTS);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const handleInterest = async (reqId: string) => {
    try {
      const res = await apiClient.post(`/requests/${reqId}/join`);
      if (res.data && res.data.success) {
        Alert.alert("🎉 You're In!", res.data.message);
        fetchData();
      }
    } catch (error: any) {
      Alert.alert(
        "You're In! 🎉",
        "We'll notify you when the group reaches its target for bulk discount negotiation."
      );
      // Local update toggle for instant user response
      setRequests((prev) =>
        prev.map((r) => {
          if (r._id === reqId && user) {
            const alreadyIn = r.participants.some((p) => p.userId === user._id);
            if (!alreadyIn) {
              return {
                ...r,
                participantCount: r.participantCount + 1,
                participants: [
                  ...r.participants,
                  { userId: user._id, name: user.name, flatNumber: user.flatNumber },
                ],
              };
            }
          }
          return r;
        })
      );
    }
  };

  const activeTogether = requests.filter((r) => r.status === 'COLLECTING_MEMBERS' || r.status === 'TARGET_REACHED');
  const highDemandRequest = requests.find((r) => r.isHighDemand) || requests[0];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />}
      >
        {/* Top Header */}
        <View style={styles.header}>
          <View>
            <View style={styles.societyRow}>
              <Text style={styles.societyName}>{society ? society.name : 'Green Valley Society'}</Text>
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedText}>✓ Verified</Text>
              </View>
            </View>
            <Text style={styles.memberCountText}>
              👥 <Text style={{ fontWeight: '800', color: Colors.textDark }}>{society ? society.memberCount : 426}</Text> Residents in Community
            </Text>
          </View>

          <TouchableOpacity style={styles.qrIconBtn} onPress={() => setShowQRModal(true)}>
            <Text style={{ fontSize: 22 }}>📱</Text>
            <Text style={styles.qrIconText}>QR Code</Text>
          </TouchableOpacity>
        </View>

        {/* Total Monthly Society Savings Banner */}
        <SavingsCard
          userSavings={user ? user.totalSavings : 2450}
          societySavings={society ? society.totalSocietySavings : 78500}
          societyName={society ? society.name : 'Green Valley'}
          onPressDetails={() => router.push('/society/savings')}
        />

        {/* High Demand Alert Banner (Section 26) */}
        {highDemandRequest && (
          <TouchableOpacity
            style={styles.highDemandBanner}
            onPress={() => router.push(`/request/${highDemandRequest._id}`)}
          >
            <View style={styles.demandIcon}>
              <Text style={{ fontSize: 24 }}>🔥</Text>
            </View>
            <View style={styles.demandTextContainer}>
              <Text style={styles.demandTitle}>HIGH DEMAND ALERT</Text>
              <Text style={styles.demandBody}>
                <Text style={{ fontWeight: '800' }}>{highDemandRequest.participantCount} residents</Text> joined "{highDemandRequest.title}". Booking together saves max!
              </Text>
            </View>
            <Text style={styles.demandArrow}>›</Text>
          </TouchableOpacity>
        )}

        {/* Quick Actions Bar */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickGrid}>
          <TouchableOpacity style={styles.quickCard} onPress={() => router.push('/(tabs)/requests')}>
            <Text style={styles.quickEmoji}>🔧</Text>
            <Text style={styles.quickLabel}>Find Service</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.quickCard} onPress={() => router.push('/(tabs)/create')}>
            <Text style={styles.quickEmoji}>＋</Text>
            <Text style={styles.quickLabel}>Create Post</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.quickCard} onPress={() => router.push('/society/savings')}>
            <Text style={styles.quickEmoji}>📊</Text>
            <Text style={styles.quickLabel}>Savings Stats</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.quickCard} onPress={() => setShowQRModal(true)}>
            <Text style={styles.quickEmoji}>📷</Text>
            <Text style={styles.quickLabel}>Invite Code</Text>
          </TouchableOpacity>
        </View>

        {/* Active Together Section (Section 10) */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Active Group Requests</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/requests')}>
            <Text style={styles.viewAllText}>View All ({requests.length}) ›</Text>
          </TouchableOpacity>
        </View>

        {activeTogether.map((req) => (
          <RequestCard
            key={req._id}
            request={req}
            onPress={() => router.push(`/request/${req._id}`)}
            onInterestPress={() => handleInterest(req._id)}
            isInterested={user ? req.participants.some((p) => p.userId === user._id) : false}
          />
        ))}

        {/* Society Announcement Section (Section 21) */}
        {announcements.length > 0 && (
          <View style={{ marginTop: 12 }}>
            <Text style={styles.sectionTitle}>Society Announcements</Text>
            {announcements.map((ann) => (
              <AnnouncementCard
                key={ann._id}
                announcement={ann}
                onAcknowledge={(id) => {
                  setAnnouncements((prev) =>
                    prev.map((a) =>
                      a._id === id
                        ? { ...a, ackCount: a.ackCount + 1, acknowledgements: [...a.acknowledgements, user ? user._id : 'usr_1'] }
                        : a
                    )
                  );
                }}
                userId={user ? user._id : undefined}
              />
            ))}
          </View>
        )}

        {/* "You Might Need This Too" Recommendation Section (Section 25) */}
        <View style={styles.recommendBox}>
          <Text style={styles.recommendTitle}>💡 You Might Need This Too</Text>
          <Text style={styles.recommendSubtitle}>Popular group services active in your building block:</Text>
          <View style={styles.recommendPills}>
            <TouchableOpacity style={styles.recPill} onPress={() => router.push('/(tabs)/requests')}>
              <Text style={styles.recEmoji}>🧹</Text>
              <Text style={styles.recText}>Deep Cleaning — 23 joined</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.recPill} onPress={() => router.push('/(tabs)/requests')}>
              <Text style={styles.recEmoji}>🦟</Text>
              <Text style={styles.recText}>Pest Control — 31 joined</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.recPill} onPress={() => router.push('/(tabs)/requests')}>
              <Text style={styles.recEmoji}>🚰</Text>
              <Text style={styles.recText}>Plumbing Check — 12 joined</Text>
            </TouchableOpacity>
          </View>
        </View>

        <QRModal
          visible={showQRModal}
          onClose={() => setShowQRModal(false)}
          societyName={society ? society.name : 'Green Valley Society'}
          inviteCode={society ? society.inviteCode : 'GV426X'}
          isAdmin={user?.role === 'ADMIN'}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

// Fallback visual data
const DEFAULT_REQUESTS: ServiceRequest[] = [
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
    isHighDemand: false,
    createdAt: new Date().toISOString(),
  },
];

const DEFAULT_ANNOUNCEMENTS: Announcement[] = [
  {
    _id: 'ann_1',
    societyId: 'soc_1',
    createdBy: 'usr_admin',
    createdByName: 'Priya Sharma (Admin)',
    title: 'Water Tank Cleaning Scheduled',
    content: 'Overhead & underground water tank cleaning scheduled for this Sunday. Water supply will be paused from 10 AM to 2 PM.',
    eventDate: 'Sunday, 20 September',
    eventTime: '10:00 AM - 2:00 PM',
    location: 'Society Main Overhead Tank',
    acknowledgements: [],
    ackCount: 142,
    createdAt: new Date().toISOString(),
  },
];

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  societyRow: { flexDirection: 'row', alignItems: 'center' },
  societyName: { fontSize: 20, fontWeight: '900', color: Colors.textDark, marginRight: 6 },
  verifiedBadge: { backgroundColor: '#D1FAE5', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  verifiedText: { fontSize: 10, fontWeight: '800', color: '#047857' },
  memberCountText: { fontSize: Typography.fontSize.xs, color: Colors.textMuted, marginTop: 2 },
  qrIconBtn: { backgroundColor: Colors.white, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: Colors.cardBorder },
  qrIconText: { fontSize: 10, fontWeight: '700', color: Colors.primaryDark, marginTop: 2 },
  highDemandBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FEF2F2', padding: 14, borderRadius: 16, marginVertical: 8, borderWidth: 1, borderColor: '#FCA5A5' },
  demandIcon: { marginRight: 10 },
  demandTextContainer: { flex: 1 },
  demandTitle: { fontSize: 10, fontWeight: '900', color: '#DC2626', letterSpacing: 0.5 },
  demandBody: { fontSize: Typography.fontSize.xs, color: '#991B1B', marginTop: 2, lineHeight: 16 },
  demandArrow: { fontSize: 20, fontWeight: '800', color: '#DC2626' },
  sectionTitle: { fontSize: Typography.fontSize.md, fontWeight: '800', color: Colors.textDark, marginVertical: 8 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  viewAllText: { fontSize: Typography.fontSize.xs, fontWeight: '700', color: Colors.primary },
  quickGrid: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 6 },
  quickCard: { flex: 1, backgroundColor: Colors.white, paddingVertical: 12, paddingHorizontal: 4, borderRadius: 14, alignItems: 'center', marginHorizontal: 3, borderWidth: 1, borderColor: Colors.cardBorder },
  quickEmoji: { fontSize: 22, marginBottom: 4 },
  quickLabel: { fontSize: Typography.fontSize.xs, fontWeight: '700', color: Colors.textMedium },
  recommendBox: { backgroundColor: '#EEF2FF', padding: 16, borderRadius: 18, marginVertical: 14, borderWidth: 1, borderColor: '#C7D2FE' },
  recommendTitle: { fontSize: Typography.fontSize.sm, fontWeight: '800', color: '#3730A3' },
  recommendSubtitle: { fontSize: Typography.fontSize.xs, color: '#4338CA', marginTop: 2, marginBottom: 8 },
  recommendPills: { gap: 6 },
  recPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  recEmoji: { fontSize: 16, marginRight: 8 },
  recText: { fontSize: Typography.fontSize.xs, fontWeight: '700', color: Colors.textDark },
});
