import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography, Shadows } from '../../constants/theme';
import { useAuth } from '../../services/authContext';

export default function SocietySavingsDashboardScreen() {
  const { user, society } = useAuth();

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>📊 Society Savings Dashboard</Text>
          <Text style={styles.subtitle}>{society?.name || 'Green Valley Society'} • Monthly Summary</Text>
        </View>

        {/* Hero Savings Card */}
        <View style={[styles.heroCard, Shadows.card]}>
          <Text style={styles.heroSub}>ESTIMATED SOCIETY SAVINGS THIS MONTH</Text>
          <Text style={styles.heroAmount}>₹42,800</Text>
          <Text style={styles.heroTag}>🎉 287 residents participating in 14 group activities</Text>

          <View style={styles.divider} />

          <View style={styles.heroRow}>
            <View style={styles.heroCol}>
              <Text style={styles.colLabel}>Total Lifetime Savings</Text>
              <Text style={styles.colVal}>₹78,500</Text>
            </View>
            <View style={styles.vertLine} />
            <View style={styles.heroCol}>
              <Text style={styles.colLabel}>Your Personal Share</Text>
              <Text style={styles.colValHighlight}>₹{(user?.totalSavings || 2450).toLocaleString('en-IN')}</Text>
            </View>
          </View>
        </View>

        {/* Most Popular Categories (Section 18) */}
        <Text style={styles.sectionTitle}>🔥 Most Popular Group Services</Text>
        <View style={styles.popularBox}>
          <View style={styles.popularRow}>
            <Text style={styles.rankNum}>1</Text>
            <Text style={styles.catEmoji}>❄️</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.catName}>AC Servicing & Gas Top-up</Text>
              <Text style={styles.catMeta}>142 residents joined</Text>
            </View>
            <Text style={styles.catSavings}>₹18,500 saved</Text>
          </View>

          <View style={styles.popularRow}>
            <Text style={styles.rankNum}>2</Text>
            <Text style={styles.catEmoji}>🦟</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.catName}>Herbal Pest Control Drive</Text>
              <Text style={styles.catMeta}>98 residents joined</Text>
            </View>
            <Text style={styles.catSavings}>₹14,200 saved</Text>
          </View>

          <View style={styles.popularRow}>
            <Text style={styles.rankNum}>3</Text>
            <Text style={styles.catEmoji}>🧹</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.catName}>Home Deep Cleaning</Text>
              <Text style={styles.catMeta}>64 residents joined</Text>
            </View>
            <Text style={styles.catSavings}>₹12,400 saved</Text>
          </View>

          <View style={styles.popularRow}>
            <Text style={styles.rankNum}>4</Text>
            <Text style={styles.catEmoji}>🔧</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.catName}>Appliance Repair</Text>
              <Text style={styles.catMeta}>52 residents joined</Text>
            </View>
            <Text style={styles.catSavings}>₹9,800 saved</Text>
          </View>
        </View>

        <View style={styles.quoteCard}>
          <Text style={styles.quoteTitle}>💡 Why Save Together Works?</Text>
          <Text style={styles.quoteBody}>
            "When 20 people in the same society book AC servicing or fridge repair on the same day, technicians save traveling time and offer 25%–35% bulk discount per apartment!"
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: 16 },
  header: { marginBottom: 12 },
  headerTitle: { fontSize: 24, fontWeight: '900', color: Colors.textDark },
  subtitle: { fontSize: Typography.fontSize.xs, color: Colors.textMuted, marginTop: 2 },
  heroCard: { backgroundColor: Colors.primaryDark, borderRadius: 24, padding: 22, marginVertical: 10, alignItems: 'center' },
  heroSub: { fontSize: 10, fontWeight: '800', color: Colors.primaryLight, letterSpacing: 0.5 },
  heroAmount: { fontSize: 36, fontWeight: '900', color: Colors.secondary, marginVertical: 4 },
  heroTag: { fontSize: Typography.fontSize.xs, color: Colors.white, opacity: 0.9 },
  divider: { width: '100%', height: 1, backgroundColor: 'rgba(255, 255, 255, 0.15)', marginVertical: 14 },
  heroRow: { flexDirection: 'row', justifyContent: 'space-around', width: '100%' },
  heroCol: { alignItems: 'center' },
  colLabel: { fontSize: Typography.fontSize.xs, color: Colors.primaryLight },
  colVal: { fontSize: Typography.fontSize.md, fontWeight: '800', color: Colors.white, marginTop: 2 },
  colValHighlight: { fontSize: Typography.fontSize.md, fontWeight: '900', color: Colors.secondary, marginTop: 2 },
  vertLine: { width: 1, height: 30, backgroundColor: 'rgba(255, 255, 255, 0.2)' },
  sectionTitle: { fontSize: Typography.fontSize.md, fontWeight: '800', color: Colors.textDark, marginTop: 14, marginBottom: 8 },
  popularBox: { backgroundColor: Colors.white, borderRadius: 20, padding: 16, borderWidth: 1, borderColor: Colors.cardBorder },
  popularRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  rankNum: { fontSize: Typography.fontSize.sm, fontWeight: '900', color: Colors.primaryDark, width: 24 },
  catEmoji: { fontSize: 22, marginRight: 10 },
  catName: { fontSize: Typography.fontSize.sm, fontWeight: '800', color: Colors.textDark },
  catMeta: { fontSize: 10, color: Colors.textMuted },
  catSavings: { fontSize: Typography.fontSize.xs, fontWeight: '900', color: Colors.statusTarget },
  quoteCard: { backgroundColor: Colors.primaryBg, borderRadius: 16, padding: 16, marginVertical: 14, borderWidth: 1, borderColor: Colors.primaryLight },
  quoteTitle: { fontSize: Typography.fontSize.xs, fontWeight: '800', color: Colors.primaryDark },
  quoteBody: { fontSize: Typography.fontSize.xs, color: Colors.textMedium, fontStyle: 'italic', marginTop: 4, lineHeight: 18 },
});
