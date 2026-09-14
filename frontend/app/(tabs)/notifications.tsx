import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography } from '../../constants/theme';
import { EmptyState } from '../../components/EmptyState';
import apiClient from '../../services/api';
import { NotificationItem } from '../../types';

export default function NotificationsScreen() {
  const router = useRouter();
  const [category, setCategory] = useState<'ALL' | 'REQUEST' | 'POLL' | 'DEAL' | 'SOCIETY'>('ALL');
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, [category]);

  const fetchNotifications = async () => {
    try {
      const res = await apiClient.get('/notifications', { params: { category } });
      if (res.data && res.data.success) {
        setNotifications(res.data.notifications);
      }
    } catch (e) {
      setNotifications(DEFAULT_NOTIFICATIONS);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchNotifications();
    setRefreshing(false);
  };

  const handleMarkAllRead = async () => {
    try {
      await apiClient.patch('/notifications/read-all');
    } catch (e) {}
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const filteredNotifs = notifications.filter((n) => category === 'ALL' || n.type === category);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>Society Notifications</Text>
          <TouchableOpacity onPress={handleMarkAllRead}>
            <Text style={styles.markReadText}>Mark all as read</Text>
          </TouchableOpacity>
        </View>

        {/* Category Pills (Section 20) */}
        <View style={styles.pillRow}>
          <TouchableOpacity
            style={[styles.pill, category === 'ALL' && styles.pillActive]}
            onPress={() => setCategory('ALL')}
          >
            <Text style={[styles.pillText, category === 'ALL' && styles.pillTextActive]}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.pill, category === 'REQUEST' && styles.pillActive]}
            onPress={() => setCategory('REQUEST')}
          >
            <Text style={[styles.pillText, category === 'REQUEST' && styles.pillTextActive]}>🔧 Requests</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.pill, category === 'POLL' && styles.pillActive]}
            onPress={() => setCategory('POLL')}
          >
            <Text style={[styles.pillText, category === 'POLL' && styles.pillTextActive]}>🗳 Polls</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.pill, category === 'DEAL' && styles.pillActive]}
            onPress={() => setCategory('DEAL')}
          >
            <Text style={[styles.pillText, category === 'DEAL' && styles.pillTextActive]}>💰 Deals</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.pill, category === 'SOCIETY' && styles.pillActive]}
            onPress={() => setCategory('SOCIETY')}
          >
            <Text style={[styles.pillText, category === 'SOCIETY' && styles.pillTextActive]}>📢 Society</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={filteredNotifs}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.notifCard, !item.read && styles.unreadCard]}
            onPress={() => {
              if (item.relatedId) {
                if (item.type === 'REQUEST') router.push(`/request/${item.relatedId}`);
                if (item.type === 'POLL') router.push(`/poll/${item.relatedId}`);
              }
            }}
          >
            <Text style={styles.notifIcon}>{getNotifIcon(item.type)}</Text>
            <View style={styles.notifTextContainer}>
              <View style={styles.notifHeader}>
                <Text style={styles.notifTitle}>{item.title}</Text>
                {!item.read && <View style={styles.unreadDot} />}
              </View>
              <Text style={styles.notifBody}>{item.body}</Text>
              <Text style={styles.notifTime}>Recent</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <EmptyState
            title="No Notifications"
            description="You are all caught up! Updates regarding service requests, target thresholds, and poll results will appear here."
            iconEmoji="🔔"
          />
        }
      />
    </SafeAreaView>
  );
}

const getNotifIcon = (type: string) => {
  switch (type) {
    case 'REQUEST':
      return '🔧';
    case 'POLL':
      return '🗳';
    case 'DEAL':
      return '🎉';
    case 'SOCIETY':
      return '📢';
    default:
      return '🔔';
  }
};

const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    _id: 'n1',
    userId: 'u1',
    societyId: 's1',
    type: 'REQUEST',
    title: '🔥 High Demand Alert',
    body: '18 residents are looking for AC servicing. Join to save up to ₹250/person!',
    relatedId: 'req_1',
    read: false,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'n2',
    userId: 'u1',
    societyId: 's1',
    type: 'POLL',
    title: 'New Society Poll Created',
    body: 'Priya Sharma created a poll: "Which day should we schedule AC service group visit?"',
    relatedId: 'req_1',
    read: false,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'n3',
    userId: 'u1',
    societyId: 's1',
    type: 'DEAL',
    title: '🎉 Target Reached for Deep Cleaning',
    body: '23 residents joined Deep Cleaning. Bulk deal unlocked!',
    relatedId: 'req_3',
    read: true,
    createdAt: new Date().toISOString(),
  },
];

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: { padding: 16, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.cardBorder },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  title: { fontSize: 24, fontWeight: '900', color: Colors.textDark },
  markReadText: { fontSize: Typography.fontSize.xs, fontWeight: '700', color: Colors.primary },
  pillRow: { flexDirection: 'row', gap: 6 },
  pill: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 14, backgroundColor: '#F1F5F9' },
  pillActive: { backgroundColor: Colors.primary },
  pillText: { fontSize: Typography.fontSize.xs, fontWeight: '600', color: Colors.textMedium },
  pillTextActive: { color: Colors.white, fontWeight: '700' },
  listContent: { padding: 16 },
  notifCard: { flexDirection: 'row', backgroundColor: Colors.white, padding: 14, borderRadius: 16, marginVertical: 6, borderWidth: 1, borderColor: Colors.cardBorder },
  unreadCard: { backgroundColor: Colors.primaryBg, borderColor: Colors.primaryLight },
  notifIcon: { fontSize: 24, marginRight: 12 },
  notifTextContainer: { flex: 1 },
  notifHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  notifTitle: { fontSize: Typography.fontSize.sm, fontWeight: '800', color: Colors.textDark },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.primary },
  notifBody: { fontSize: Typography.fontSize.xs, color: Colors.textMedium, marginTop: 4, lineHeight: 18 },
  notifTime: { fontSize: 10, color: Colors.textMuted, marginTop: 6 },
});
