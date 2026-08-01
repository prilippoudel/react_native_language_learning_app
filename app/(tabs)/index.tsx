import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useUser, useAuth } from '@clerk/expo';
import { Feather, Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useLanguageStore } from '@/store/useLanguageStore';
import { IMAGES } from '@/constants/images';
import { getUnitsByLanguage, UNITS } from '@/data/units';
import { LANGUAGES } from '@/data/languages';

const GREETINGS: Record<string, string> = {
  es: 'Hola',
  fr: 'Bonjour',
  de: 'Hallo',
  ja: 'Konnichiwa',
};

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useUser();
  const { signOut } = useAuth();

  const selectedLanguage = useLanguageStore((state) => state.selectedLanguage);
  const clearSelectedLanguage = useLanguageStore((state) => state.clearSelectedLanguage);

  // Fallback language if not yet selected
  const activeLanguage = selectedLanguage || LANGUAGES[0];
  const greeting =
    GREETINGS[activeLanguage.code] ||
    GREETINGS[activeLanguage.id] ||
    'Hola';

  // User name resolution from Clerk
  const userName =
    user?.firstName ||
    user?.primaryEmailAddress?.emailAddress?.split('@')[0] ||
    'Alex';

  // Fetch unit and lesson data based on current language
  const units = getUnitsByLanguage(activeLanguage.id);
  const currentUnit = units.length > 0 ? units[0] : UNITS[0];
  const currentLesson = currentUnit?.lessons[0];

  const handleClearStorage = async () => {
    try {
      if (Platform.OS === 'web') {
        window.localStorage?.clear();
      } else {
        await AsyncStorage.clear();
      }
      clearSelectedLanguage();
      router.replace('/language-selection');
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  };

  return (
    <View style={[styles.screen, { paddingTop: Math.max(insets.top, 16) }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* TOP HEADER */}
        <View style={styles.headerRow}>
          <View style={styles.userInfoLeft}>
            {/* Language Flag Badge */}
            <Pressable
              onPress={() => router.push('/language-selection')}
              style={styles.flagButton}
            >
              <Image
                source={{ uri: activeLanguage.flag }}
                style={styles.flagImage}
                resizeMode="cover"
              />
            </Pressable>

            {/* Greeting & Name */}
            <Text style={styles.greetingText}>
              {greeting}, {userName}! 👋
            </Text>
          </View>

          {/* Right Action Icons: Streak & Notifications */}
          <View style={styles.headerRight}>
            <View style={styles.streakBadge}>
              <Image
                source={IMAGES.streakFire}
                style={styles.streakIcon}
                resizeMode="contain"
              />
              <Text style={styles.streakText}>12</Text>
            </View>

            <Pressable style={styles.iconButton}>
              <Feather name="bell" size={20} color="#1E293B" />
            </Pressable>
          </View>
        </View>

        {/* DAILY GOAL CARD */}
        <View style={styles.dailyGoalCard}>
          <View style={styles.dailyGoalLeft}>
            <Text style={styles.dailyGoalLabel}>Daily goal</Text>
            <View style={styles.xpRow}>
              <Text style={styles.xpCurrent}>15</Text>
              <Text style={styles.xpTarget}> / 20 XP</Text>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressBarTrack}>
              <View style={[styles.progressBarFill, { width: '75%' }]} />
            </View>
          </View>

          <Image
            source={IMAGES.treasure}
            style={styles.chestImage}
            resizeMode="contain"
          />
        </View>

        {/* CONTINUE LEARNING CARD */}
        <View style={styles.continueCard}>
          <View style={styles.continueCardContent}>
            <Text style={styles.continueSubtitle}>Continue learning</Text>
            <Text style={styles.continueTitle}>{activeLanguage.name}</Text>
            <Text style={styles.continueUnitText}>
              A1 • Unit {currentUnit?.number || 3}
            </Text>

            <Pressable
              style={styles.continueButton}
              onPress={() => router.push('/learn')}
            >
              <Text style={styles.continueButtonText}>Continue</Text>
            </Pressable>
          </View>

          <Image
            source={IMAGES.palace}
            style={styles.palaceImage}
            resizeMode="cover"
          />
        </View>

        {/* TODAY'S PLAN SECTION */}
        <View style={styles.planSection}>
          <View style={styles.planHeader}>
            <Text style={styles.sectionTitle}>Today's plan</Text>
            <Pressable onPress={() => router.push('/learn')}>
              <Text style={styles.viewAllText}>View all</Text>
            </Pressable>
          </View>

          {/* Plan Item 1: Lesson */}
          <View style={styles.planItem}>
            <View style={[styles.planIconBox, { backgroundColor: '#EEF2FF' }]}>
              <Feather name="book-open" size={20} color="#6366F1" />
            </View>
            <View style={styles.planTextContainer}>
              <Text style={styles.planItemTitle}>Lesson</Text>
              <Text style={styles.planItemSubtitle}>
                {currentLesson?.title || 'At the café'}
              </Text>
            </View>
            <Ionicons name="checkmark-circle" size={24} color="#6366F1" />
          </View>

          {/* Plan Item 2: AI Conversation */}
          <Pressable
            style={styles.planItem}
            onPress={() => router.push('/ai-teacher')}
          >
            <View style={[styles.planIconBox, { backgroundColor: '#F3E8FF' }]}>
              <Feather name="headphones" size={20} color="#A855F7" />
            </View>
            <View style={styles.planTextContainer}>
              <Text style={styles.planItemTitle}>AI Conversation</Text>
              <Text style={styles.planItemSubtitle}>Talk about your day</Text>
            </View>
            <Ionicons name="ellipse-outline" size={24} color="#CBD5E1" />
          </Pressable>

          {/* Plan Item 3: New words */}
          <Pressable
            style={styles.planItem}
            onPress={() => router.push('/chat')}
          >
            <View style={[styles.planIconBox, { backgroundColor: '#FEE2E2' }]}>
              <Feather name="layers" size={20} color="#EF4444" />
            </View>
            <View style={styles.planTextContainer}>
              <Text style={styles.planItemTitle}>New words</Text>
              <Text style={styles.planItemSubtitle}>10 words</Text>
            </View>
            <Ionicons name="ellipse-outline" size={24} color="#CBD5E1" />
          </Pressable>
        </View>

        {/* DEV / QUICK ACTIONS BOTTOM AREA */}
        <View style={styles.devActionsContainer}>
          <Pressable style={styles.devButton} onPress={handleClearStorage}>
            <Text style={styles.devButtonText}>
              Clear Storage (Test Language Gate)
            </Text>
          </Pressable>
          {user ? (
            <Pressable style={styles.signOutButton} onPress={() => signOut()}>
              <Text style={styles.signOutButtonText}>Sign Out</Text>
            </Pressable>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100, // Account for custom tab bar
  },
  /* Header */
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginTop: 8,
  },
  userInfoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  flagButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  flagImage: {
    width: '100%',
    height: '100%',
  },
  greetingText: {
    fontSize: 20,
    fontFamily: 'Poppins_700Bold',
    color: '#0F172A',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  streakIcon: {
    width: 22,
    height: 22,
  },
  streakText: {
    fontSize: 15,
    fontFamily: 'Poppins_700Bold',
    color: '#F97316',
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },

  /* Daily Goal Card */
  dailyGoalCard: {
    backgroundColor: '#FFF8F0',
    borderRadius: 20,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FFEDD5',
  },
  dailyGoalLeft: {
    flex: 1,
    marginRight: 12,
  },
  dailyGoalLabel: {
    fontSize: 14,
    fontFamily: 'Poppins_500Medium',
    color: '#475569',
    marginBottom: 2,
  },
  xpRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 10,
  },
  xpCurrent: {
    fontSize: 26,
    fontFamily: 'Poppins_700Bold',
    color: '#0F172A',
  },
  xpTarget: {
    fontSize: 15,
    fontFamily: 'Poppins_600SemiBold',
    color: '#94A3B8',
  },
  progressBarTrack: {
    height: 10,
    backgroundColor: '#FFEDD5',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FF7A00',
    borderRadius: 5,
  },
  chestImage: {
    width: 75,
    height: 75,
  },

  /* Continue Learning Card */
  continueCard: {
    height: 170,
    borderRadius: 24,
    backgroundColor: '#6C5CE7',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    overflow: 'hidden',
    marginBottom: 24,
    position: 'relative',
  },
  continueCardContent: {
    flex: 1,
    zIndex: 2,
    justifyContent: 'space-between',
  },
  continueSubtitle: {
    fontSize: 13,
    fontFamily: 'Poppins_500Medium',
    color: '#E0E7FF',
    opacity: 0.9,
  },
  continueTitle: {
    fontSize: 24,
    fontFamily: 'Poppins_700Bold',
    color: '#FFFFFF',
    marginTop: -2,
  },
  continueUnitText: {
    fontSize: 13,
    fontFamily: 'Poppins_500Medium',
    color: '#E0E7FF',
    marginTop: -4,
    marginBottom: 8,
  },
  continueButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  continueButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins_700Bold',
    color: '#6C5CE7',
  },
  palaceImage: {
    position: 'absolute',
    right: -10,
    bottom: -10,
    width: 170,
    height: 170,
    zIndex: 1,
    opacity: 0.95,
  },

  /* Today's Plan */
  planSection: {
    marginBottom: 24,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins_700Bold',
    color: '#0F172A',
  },
  viewAllText: {
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold',
    color: '#6C5CE7',
  },
  planItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 14,
    borderRadius: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  planIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  planTextContainer: {
    flex: 1,
  },
  planItemTitle: {
    fontSize: 15,
    fontFamily: 'Poppins_600SemiBold',
    color: '#0F172A',
  },
  planItemSubtitle: {
    fontSize: 13,
    fontFamily: 'Poppins_400Regular',
    color: '#64748B',
    marginTop: 1,
  },

  /* Dev Actions */
  devActionsContainer: {
    marginTop: 12,
    alignItems: 'center',
    gap: 10,
  },
  devButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
  },
  devButtonText: {
    fontSize: 12,
    fontFamily: 'Poppins_500Medium',
    color: '#64748B',
  },
  signOutButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FEE2E2',
    borderRadius: 10,
  },
  signOutButtonText: {
    fontSize: 12,
    fontFamily: 'Poppins_600SemiBold',
    color: '#EF4444',
  },
});
