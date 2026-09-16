import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Typography, Shadows } from '../../constants/theme';
import { useAuth } from '../../services/authContext';
import { PrimaryButton } from '../../components/PrimaryButton';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, society, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out of Save Together?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: () => {
          logout();
          router.replace('/(auth)/welcome');
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Profile Card Header */}
        <View style={[styles.profileCard, Shadows.card]}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{user ? user.name.charAt(0) : 'R'}</Text>
          </View>
          <Text style={styles.name}>{user ? user.name : 'Rahul Verma'}</Text>
          <Text style={styles.flatText}>
            🏠 {user ? `${user.buildingBlock ? user.buildingBlock + ' • ' : ''}Flat ${user.flatNumber}` : 'Tower B • Flat B-104'}
          </Text>
          <View style={styles.societyBadge}>
            <Text style={styles.societyBadgeText}>🏢 {society ? society.name : 'Green Valley Society'}</Text>
          </View>
          {user?.role === 'ADMIN' && (
            <View style={styles.adminBadge}>
              <Text style={styles.adminBadgeText}>👑 Society Admin</Text>
            </View>
          )}
        </View>

        {/* My Savings Section (Section 29) */}
        <View style={styles.savingsBox}>
          <Text style={styles.savingsLabel}>💰 MY TOTAL SAVINGS</Text>
          <Text style={styles.savingsAmount}>
            ₹{(user ? user.totalSavings : 2450).toLocaleString('en-IN')}
          </Text>
          <Text style={styles.savingsSub}>Saved across {user?.joinedActivitiesCount || 8} group services</Text>
        </View>

        {/* My Activity Stats (Section 29) */}
        <Text style={styles.sectionTitle}>My Activity Summary</Text>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{user ? user.createdRequestsCount || 8 : 8}</Text>
            <Text style={styles.statLabel}>Requests Created</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{user ? user.joinedActivitiesCount || 16 : 16}</Text>
            <Text style={styles.statLabel}>Requests Joined</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{user ? user.completedDealsCount || 7 : 7}</Text>
            <Text style={styles.statLabel}>Deals Completed</Text>
          </View>
        </View>

        {/* Shortcuts & Admin Links */}
        <Text style={styles.sectionTitle}>Quick Shortcuts</Text>
        <View style={styles.menuBox}>
          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/activity/my-activities')}>
            <Text style={styles.menuEmoji}>📋</Text>
            <Text style={styles.menuText}>My Activities & Joined Deals</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/society/savings')}>
            <Text style={styles.menuEmoji}>📊</Text>
            <Text style={styles.menuText}>Society Savings Dashboard</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/society/qr')}>
            <Text style={styles.menuEmoji}>📱</Text>
            <Text style={styles.menuText}>Society QR & Join Code</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>

          {/* Admin Dashboard Option */}
          {user?.role === 'ADMIN' && (
            <TouchableOpacity style={styles.adminMenuItem} onPress={() => router.push('/society/admin')}>
              <Text style={styles.menuEmoji}>👑</Text>
              <Text style={styles.adminMenuText}>Admin Control Panel & Members</Text>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Settings List */}
        <Text style={styles.sectionTitle}>Settings & Support</Text>
        <View style={styles.menuBox}>
          <View style={styles.menuItem}>
            <Text style={styles.menuEmoji}>🔔</Text>
            <Text style={styles.menuText}>Event Notifications</Text>
            <Text style={styles.statusOn}>ENABLED</Text>
          </View>
          <View style={styles.menuItem}>
            <Text style={styles.menuEmoji}>🛡️</Text>
            <Text style={styles.menuText}>Society Isolation & Privacy</Text>
            <Text style={styles.statusOn}>PROTECTED</Text>
          </View>
        </View>

        <PrimaryButton
          title="Log Out"
          variant="danger"
          onPress={handleLogout}
          style={{ marginTop: 20, marginBottom: 30 }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: 16 },
  profileCard: { backgroundColor: Colors.white, borderRadius: 20, padding: 20, alignItems: 'center', borderWidth: 1, borderColor: Colors.cardBorder },
  avatarCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: Colors.primaryLight, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  avatarText: { fontSize: 28, fontWeight: '900', color: Colors.primaryDark },
  name: { fontSize: 22, fontWeight: '900', color: Colors.textDark },
  flatText: { fontSize: Typography.fontSize.sm, color: Colors.textMedium, marginTop: 4 },
  societyBadge: { backgroundColor: Colors.primaryBg, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 10, marginTop: 8, borderWidth: 1, borderColor: Colors.primaryLight },
  societyBadgeText: { fontSize: Typography.fontSize.xs, fontWeight: '700', color: Colors.primaryDark },
  adminBadge: { backgroundColor: '#FEF3C7', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 10, marginTop: 6, borderWidth: 1, borderColor: '#F59E0B' },
  adminBadgeText: { fontSize: Typography.fontSize.xs, fontWeight: '800', color: '#B45309' },
  savingsBox: { backgroundColor: Colors.primaryDark, borderRadius: 18, padding: 18, alignItems: 'center', marginVertical: 14 },
  savingsLabel: { fontSize: Typography.fontSize.xs, fontWeight: '800', color: Colors.primaryLight },
  savingsAmount: { fontSize: 32, fontWeight: '900', color: Colors.secondary, marginVertical: 4 },
  savingsSub: { fontSize: Typography.fontSize.xs, color: Colors.white, opacity: 0.9 },
  sectionTitle: { fontSize: Typography.fontSize.md, fontWeight: '800', color: Colors.textDark, marginTop: 12, marginBottom: 8 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  statCard: { flex: 1, backgroundColor: Colors.white, paddingVertical: 14, paddingHorizontal: 4, borderRadius: 14, alignItems: 'center', marginHorizontal: 3, borderWidth: 1, borderColor: Colors.cardBorder },
  statNumber: { fontSize: 20, fontWeight: '900', color: Colors.primary },
  statLabel: { fontSize: 10, color: Colors.textMuted, fontWeight: '600', marginTop: 2, textAlign: 'center' },
  menuBox: { backgroundColor: Colors.white, borderRadius: 16, borderWidth: 1, borderColor: Colors.cardBorder, overflow: 'hidden', marginBottom: 10 },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 14, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  adminMenuItem: { flexDirection: 'row', alignItems: 'center', padding: 14, backgroundColor: '#FFFBEB' },
  adminMenuText: { flex: 1, fontSize: Typography.fontSize.sm, fontWeight: '800', color: '#B45309' },
  menuEmoji: { fontSize: 20, marginRight: 12 },
  menuText: { flex: 1, fontSize: Typography.fontSize.sm, fontWeight: '600', color: Colors.textDark },
  menuArrow: { fontSize: 18, fontWeight: '700', color: Colors.textMuted },
  statusOn: { fontSize: 10, fontWeight: '800', color: Colors.statusTarget, backgroundColor: '#D1FAE5', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
});
