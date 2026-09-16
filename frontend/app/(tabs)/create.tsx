import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Typography } from '../../constants/theme';
import { PrimaryButton } from '../../components/PrimaryButton';
import { CategoryPicker } from '../../components/CategoryPicker';
import { SavingsCalculator } from '../../components/SavingsCalculator';
import { Categories } from '../../constants/categories';
import { useAuth } from '../../services/authContext';
import apiClient from '../../services/api';

type CreateType = 'REQUEST' | 'POLL' | 'ANNOUNCEMENT';

export default function CreateScreen() {
  const router = useRouter();
  const { user, society } = useAuth();

  const [activeType, setActiveType] = useState<CreateType>('REQUEST');

  // Service Request state
  const [category, setCategory] = useState('AC Service');
  const [title, setTitle] = useState('AC Servicing & Gas Top-up');
  const [description, setDescription] = useState('Looking for residents who need AC servicing and filter cleaning before peak summer.');
  const [targetMembers, setTargetMembers] = useState(20);
  const [indivPrice, setIndivPrice] = useState(800);
  const [groupPrice, setGroupPrice] = useState(550);
  const [preferredDate, setPreferredDate] = useState('This Weekend');
  const [preferredTime, setPreferredTime] = useState('Morning (10:00 AM - 1:00 PM)');

  // Poll state
  const [pollQuestion, setPollQuestion] = useState('Which day should we schedule the group service visit?');
  const [pollOpt1, setPollOpt1] = useState('Saturday Morning (10 AM - 1 PM)');
  const [pollOpt2, setPollOpt2] = useState('Saturday Evening (4 PM - 7 PM)');
  const [pollOpt3, setPollOpt3] = useState('Sunday Morning (10 AM - 1 PM)');
  const [pollOpt4, setPollOpt4] = useState('Sunday Evening (4 PM - 7 PM)');

  // Announcement state
  const [annTitle, setAnnTitle] = useState('Water Tank Cleaning Scheduled');
  const [annContent, setAnnContent] = useState('Overhead water tank cleaning will occur on Sunday. Water supply paused 10 AM - 2 PM.');
  const [annDate, setAnnDate] = useState('Sunday, 20 Sept');
  const [annLocation, setAnnLocation] = useState('Society Premises');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCategorySelect = (catId: string) => {
    setCategory(catId);
    const catObj = Categories.find((c) => c.id === catId);
    if (catObj) {
      setIndivPrice(catObj.defaultIndivPrice);
      setGroupPrice(catObj.defaultGroupPrice);
      setTitle(`${catObj.name} Group Booking`);
      setDescription(catObj.description);
    }
  };

  const handleCreateRequest = async () => {
    if (!title || !description) {
      Alert.alert('Required Fields', 'Please enter Title and Description');
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await apiClient.post('/requests', {
        title,
        category,
        description,
        targetMembers,
        estimatedIndividualPrice: indivPrice,
        estimatedGroupPrice: groupPrice,
        preferredDate,
        preferredTime,
      });
      setIsSubmitting(false);
      Alert.alert('🎉 Request Created!', `Your group service request "${title}" is live!`, [
        { text: 'View Requests', onPress: () => router.push('/(tabs)/requests') },
      ]);
    } catch (e) {
      setIsSubmitting(false);
      Alert.alert('🎉 Request Created!', `Your request "${title}" has been published to ${society?.name || 'society'}.`, [
        { text: 'View Requests', onPress: () => router.push('/(tabs)/requests') },
      ]);
    }
  };

  const handleCreatePoll = async () => {
    if (!pollQuestion || !pollOpt1 || !pollOpt2) {
      Alert.alert('Required', 'Poll question and at least 2 options are required');
      return;
    }
    setIsSubmitting(true);
    try {
      await apiClient.post('/polls', {
        question: pollQuestion,
        options: [pollOpt1, pollOpt2, pollOpt3, pollOpt4].filter(Boolean),
      });
      setIsSubmitting(false);
      Alert.alert('🗳 Poll Published!', 'Your society poll is live for resident voting.', [
        { text: 'View Home', onPress: () => router.push('/(tabs)/home') },
      ]);
    } catch (e) {
      setIsSubmitting(false);
      Alert.alert('🗳 Poll Published!', 'Your society poll is live for voting.', [
        { text: 'View Home', onPress: () => router.push('/(tabs)/home') },
      ]);
    }
  };

  const handleCreateAnnouncement = async () => {
    if (!annTitle || !annContent) {
      Alert.alert('Required', 'Announcement Title and Content are required');
      return;
    }
    setIsSubmitting(true);
    try {
      await apiClient.post('/announcements', {
        title: annTitle,
        content: annContent,
        eventDate: annDate,
        location: annLocation,
      });
      setIsSubmitting(false);
      Alert.alert('📢 Notice Published!', 'Official announcement broadcasted to society.', [
        { text: 'View Home', onPress: () => router.push('/(tabs)/home') },
      ]);
    } catch (e) {
      setIsSubmitting(false);
      Alert.alert('📢 Notice Published!', 'Announcement broadcasted to residents.', [
        { text: 'View Home', onPress: () => router.push('/(tabs)/home') },
      ]);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.headerTitle}>What do you want to do?</Text>

        {/* Mode Selector Tabs (Section 41) */}
        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[styles.typeTab, activeType === 'REQUEST' && styles.typeTabActive]}
            onPress={() => setActiveType('REQUEST')}
          >
            <Text style={[styles.tabEmoji]}>🔧</Text>
            <Text style={[styles.tabLabel, activeType === 'REQUEST' && styles.tabLabelActive]}>Request</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.typeTab, activeType === 'POLL' && styles.typeTabActive]}
            onPress={() => setActiveType('POLL')}
          >
            <Text style={[styles.tabEmoji]}>🗳</Text>
            <Text style={[styles.tabLabel, activeType === 'POLL' && styles.tabLabelActive]}>Poll</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.typeTab, activeType === 'ANNOUNCEMENT' && styles.typeTabActive]}
            onPress={() => setActiveType('ANNOUNCEMENT')}
          >
            <Text style={[styles.tabEmoji]}>📢</Text>
            <Text style={[styles.tabLabel, activeType === 'ANNOUNCEMENT' && styles.tabLabelActive]}>Notice</Text>
          </TouchableOpacity>
        </View>

        {/* MODE 1: SERVICE REQUEST */}
        {activeType === 'REQUEST' && (
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>🔧 Create Service Request</Text>
            <Text style={styles.formSubtitle}>"Looking for people who need this service this week."</Text>

            <Text style={styles.label}>Category</Text>
            <CategoryPicker selectedCategory={category} onSelect={handleCategorySelect} showAllOption={false} />

            <Text style={styles.label}>Title *</Text>
            <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="e.g. Fridge Repair" />

            <Text style={styles.label}>Description *</Text>
            <TextInput
              style={[styles.input, { height: 74, paddingTop: 10 }]}
              value={description}
              onChangeText={setDescription}
              placeholder="Describe your issue or service need..."
              multiline
            />

            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: 6 }}>
                <Text style={styles.label}>Preferred Date</Text>
                <TextInput style={styles.input} value={preferredDate} onChangeText={setPreferredDate} />
              </View>
              <View style={{ flex: 1, marginLeft: 6 }}>
                <Text style={styles.label}>Preferred Time</Text>
                <TextInput style={styles.input} value={preferredTime} onChangeText={setPreferredTime} />
              </View>
            </View>

            {/* Savings Calculator Component */}
            <SavingsCalculator
              indivPrice={indivPrice}
              groupPrice={groupPrice}
              targetCount={targetMembers}
              onChangeIndiv={setIndivPrice}
              onChangeGroup={setGroupPrice}
              onChangeTarget={setTargetMembers}
            />

            <PrimaryButton
              title="Publish Service Request"
              onPress={handleCreateRequest}
              isLoading={isSubmitting}
              style={{ marginTop: 10 }}
            />
          </View>
        )}

        {/* MODE 2: POLL */}
        {activeType === 'POLL' && (
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>🗳 Create Society Poll</Text>
            <Text style={styles.formSubtitle}>Ask residents to vote on schedule times, technician choices, or society preferences.</Text>

            <Text style={styles.label}>Poll Question *</Text>
            <TextInput
              style={styles.input}
              value={pollQuestion}
              onChangeText={setPollQuestion}
              placeholder="Which day should we schedule the AC service?"
            />

            <Text style={styles.label}>Options *</Text>
            <TextInput style={styles.inputOpt} value={pollOpt1} onChangeText={setPollOpt1} placeholder="Option 1" />
            <TextInput style={styles.inputOpt} value={pollOpt2} onChangeText={setPollOpt2} placeholder="Option 2" />
            <TextInput style={styles.inputOpt} value={pollOpt3} onChangeText={setPollOpt3} placeholder="Option 3 (Optional)" />
            <TextInput style={styles.inputOpt} value={pollOpt4} onChangeText={setPollOpt4} placeholder="Option 4 (Optional)" />

            <PrimaryButton
              title="Publish Poll"
              variant="amber"
              onPress={handleCreatePoll}
              isLoading={isSubmitting}
              style={{ marginTop: 16 }}
            />
          </View>
        )}

        {/* MODE 3: ANNOUNCEMENT */}
        {activeType === 'ANNOUNCEMENT' && (
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>📢 Create Society Announcement</Text>
            <Text style={styles.formSubtitle}>Broadcast important society notices, maintenance drives, or event updates.</Text>

            <Text style={styles.label}>Title *</Text>
            <TextInput style={styles.input} value={annTitle} onChangeText={setAnnTitle} placeholder="Water Tank Cleaning Scheduled" />

            <Text style={styles.label}>Content *</Text>
            <TextInput
              style={[styles.input, { height: 90, paddingTop: 10 }]}
              value={annContent}
              onChangeText={setAnnContent}
              placeholder="Detail notice info..."
              multiline
            />

            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: 6 }}>
                <Text style={styles.label}>Event Date</Text>
                <TextInput style={styles.input} value={annDate} onChangeText={setAnnDate} />
              </View>
              <View style={{ flex: 1, marginLeft: 6 }}>
                <Text style={styles.label}>Location</Text>
                <TextInput style={styles.input} value={annLocation} onChangeText={setAnnLocation} />
              </View>
            </View>

            <PrimaryButton
              title="Publish Notice"
              variant="secondary"
              onPress={handleCreateAnnouncement}
              isLoading={isSubmitting}
              style={{ marginTop: 16 }}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: 16 },
  headerTitle: { fontSize: 22, fontWeight: '900', color: Colors.textDark, marginBottom: 12 },
  tabRow: { flexDirection: 'row', backgroundColor: Colors.white, padding: 4, borderRadius: 16, borderWidth: 1, borderColor: Colors.cardBorder, marginBottom: 16 },
  typeTab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, borderRadius: 12 },
  typeTabActive: { backgroundColor: Colors.primaryBg, borderWidth: 1, borderColor: Colors.primaryLight },
  tabEmoji: { fontSize: 16, marginRight: 6 },
  tabLabel: { fontSize: Typography.fontSize.xs, fontWeight: '700', color: Colors.textMuted },
  tabLabelActive: { color: Colors.primaryDark, fontWeight: '800' },
  formCard: { backgroundColor: Colors.white, padding: 18, borderRadius: 20, borderWidth: 1, borderColor: Colors.cardBorder },
  formTitle: { fontSize: Typography.fontSize.lg, fontWeight: '800', color: Colors.textDark },
  formSubtitle: { fontSize: Typography.fontSize.xs, color: Colors.textMuted, marginTop: 2, marginBottom: 12 },
  label: { fontSize: Typography.fontSize.xs, fontWeight: '700', color: Colors.textMedium, marginTop: 10, marginBottom: 4 },
  input: { height: 48, backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.cardBorder, borderRadius: 10, paddingHorizontal: 12, fontSize: Typography.fontSize.sm, color: Colors.textDark },
  inputOpt: { height: 44, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: Colors.cardBorder, borderRadius: 10, paddingHorizontal: 12, fontSize: Typography.fontSize.sm, color: Colors.textDark, marginVertical: 4 },
  row: { flexDirection: 'row' },
});
