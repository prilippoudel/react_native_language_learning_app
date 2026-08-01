import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  Modal,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather, Ionicons } from '@expo/vector-icons';
import { usePostHog } from 'posthog-react-native';

import { useLanguageStore } from '@/store/useLanguageStore';
import { getUnitsByLanguage, UNITS } from '@/data/units';
import { LANGUAGES } from '@/data/languages';
import { IMAGES } from '@/constants/images';
import { Lesson } from '@/types/learning';

const { width } = Dimensions.get('window');

type TabType = 'lessons' | 'practice';

export default function LearnScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const posthog = usePostHog();

  const selectedLanguage = useLanguageStore((state) => state.selectedLanguage);
  const activeLanguage = selectedLanguage || LANGUAGES[0];

  const units = getUnitsByLanguage(activeLanguage.id);
  const currentUnit = units.length > 0 ? units[0] : UNITS[0];

  const [activeTab, setActiveTab] = useState<TabType>('lessons');
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Dynamic completed lesson count calculation
  const completedCount = currentUnit.lessons.filter(
    (l) => l.status === 'completed'
  ).length;
  const inProgressLesson = currentUnit.lessons.find(
    (l) => l.status === 'in_progress'
  ) || currentUnit.lessons[2] || currentUnit.lessons[0];

  const handleSelectLesson = (lesson: Lesson) => {
    posthog?.capture?.('lesson_selected', {
      lesson_id: lesson.id,
      lesson_title: lesson.title,
      language_id: activeLanguage.id,
    });
    setSelectedLesson(lesson);
  };

  const handleStartLesson = (lesson: Lesson) => {
    setSelectedLesson(null);
    posthog?.capture?.('lesson_started', {
      lesson_id: lesson.id,
      language_id: activeLanguage.id,
    });
    // Route to AI teacher or chat practice for interactive learning
    if (lesson.aiTeacherPrompt) {
      router.push({ pathname: '/ai-teacher', params: { lessonId: lesson.id } });
    } else {
      router.push({ pathname: '/ai-teacher', params: { lessonId: lesson.id } });
    }
  };

  const handlePracticeMode = (mode: string) => {
    posthog?.capture?.('practice_mode_selected', {
      mode,
      language_id: activeLanguage.id,
    });
    if (mode === 'ai_conversation') {
      router.push('/ai-teacher');
    } else {
      router.push('/chat');
    }
  };

  return (
    <View style={[styles.screen, { paddingTop: Math.max(insets.top, 12) }]}>
      {/* TOP NAVIGATION HEADER */}
      <View style={styles.header}>
        <Pressable
          style={styles.headerIconButton}
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.push('/');
            }
          }}
        >
          <Feather name="chevron-left" size={24} color="#0F172A" />
        </Pressable>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {inProgressLesson?.title || currentUnit.title}
          </Text>
          <Text style={styles.headerSubtitle}>
            Unit {currentUnit.number} • {completedCount + 1} / {currentUnit.lessons.length} lessons
          </Text>
        </View>

        <Pressable
          style={[
            styles.headerIconButton,
            isBookmarked && styles.headerIconButtonActive,
          ]}
          onPress={() => setIsBookmarked(!isBookmarked)}
        >
          <Feather
            name="bookmark"
            size={20}
            color={isBookmarked ? '#F97316' : '#64748B'}
          />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* HERO BANNER SECTION */}
        <View style={styles.heroContainer}>
          <Image
            source={IMAGES.mascotWelcome}
            style={styles.heroImage}
            resizeMode="contain"
          />

          {/* SEGMENTED TOGGLE SWITCHER */}
          <View style={styles.segmentedContainer}>
            <Pressable
              style={[
                styles.segmentButton,
                activeTab === 'lessons' && styles.segmentButtonActive,
              ]}
              onPress={() => setActiveTab('lessons')}
            >
              <Text
                style={[
                  styles.segmentText,
                  activeTab === 'lessons' && styles.segmentTextActive,
                ]}
              >
                Lessons
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.segmentButton,
                activeTab === 'practice' && styles.segmentButtonActive,
              ]}
              onPress={() => setActiveTab('practice')}
            >
              <Text
                style={[
                  styles.segmentText,
                  activeTab === 'practice' && styles.segmentTextActive,
                ]}
              >
                Practice
              </Text>
            </Pressable>
          </View>
        </View>

        {/* TAB CONTENT: LESSONS */}
        {activeTab === 'lessons' ? (
          <View style={styles.lessonsList}>
            {currentUnit.lessons.map((lesson, index) => {
              const isCompleted = lesson.status === 'completed';
              const isInProgress = lesson.status === 'in_progress';

              return (
                <Pressable
                  key={lesson.id}
                  style={[
                    styles.lessonCard,
                    isInProgress && styles.lessonCardInProgress,
                  ]}
                  onPress={() => handleSelectLesson(lesson)}
                >
                  <View style={styles.lessonCardLeft}>
                    <Text
                      style={[
                        styles.lessonNumberText,
                        isInProgress && styles.lessonNumberInProgress,
                      ]}
                    >
                      Lesson {lesson.order || index + 1}
                    </Text>

                    <Text style={styles.lessonTitleText}>{lesson.title}</Text>

                    {isInProgress && (
                      <View style={styles.inProgressBadge}>
                        <Text style={styles.inProgressBadgeText}>In progress</Text>
                      </View>
                    )}

                    {!isCompleted && !isInProgress && (
                      <Text style={styles.lessonProgressText}>0 / 6 lessons</Text>
                    )}
                  </View>

                  {/* RIGHT SIDE ICON / STATUS */}
                  <View style={styles.lessonCardRight}>
                    {isCompleted ? (
                      <Ionicons
                        name="checkmark-circle"
                        size={28}
                        color="#22C55E"
                      />
                    ) : isInProgress ? (
                      <View style={styles.thumbImageWrapper}>
                        <Image
                          source={
                            lesson.imageUrl
                              ? { uri: lesson.imageUrl }
                              : { uri: IMAGES.cafeThumb }
                          }
                          style={styles.thumbImage}
                          resizeMode="cover"
                        />
                      </View>
                    ) : (
                      <Ionicons
                        name="lock-closed-outline"
                        size={22}
                        color="#94A3B8"
                      />
                    )}
                  </View>
                </Pressable>
              );
            })}
          </View>
        ) : (
          /* TAB CONTENT: PRACTICE */
          <View style={styles.practiceContainer}>
            <Pressable
              style={styles.practiceCard}
              onPress={() => handlePracticeMode('ai_conversation')}
            >
              <View
                style={[
                  styles.practiceIconBox,
                  { backgroundColor: '#F3E8FF' },
                ]}
              >
                <Feather name="headphones" size={24} color="#A855F7" />
              </View>
              <View style={styles.practiceTextContent}>
                <Text style={styles.practiceCardTitle}>
                  AI Voice Conversation
                </Text>
                <Text style={styles.practiceCardDesc}>
                  Practice speaking real-time with Sofia or Mateo in {activeLanguage.name}.
                </Text>
              </View>
              <Feather name="chevron-right" size={20} color="#94A3B8" />
            </Pressable>

            <Pressable
              style={styles.practiceCard}
              onPress={() => handlePracticeMode('vocabulary')}
            >
              <View
                style={[
                  styles.practiceIconBox,
                  { backgroundColor: '#EEF2FF' },
                ]}
              >
                <Feather name="layers" size={24} color="#6366F1" />
              </View>
              <View style={styles.practiceTextContent}>
                <Text style={styles.practiceCardTitle}>
                  Vocabulary Review
                </Text>
                <Text style={styles.practiceCardDesc}>
                  Master new words and test your memory with flashcards.
                </Text>
              </View>
              <Feather name="chevron-right" size={20} color="#94A3B8" />
            </Pressable>

            <Pressable
              style={styles.practiceCard}
              onPress={() => handlePracticeMode('listening')}
            >
              <View
                style={[
                  styles.practiceIconBox,
                  { backgroundColor: '#DCFCE7' },
                ]}
              >
                <Feather name="volume-2" size={24} color="#16A34A" />
              </View>
              <View style={styles.practiceTextContent}>
                <Text style={styles.practiceCardTitle}>
                  Listening Challenge
                </Text>
                <Text style={styles.practiceCardDesc}>
                  Train your ears with native pronunciation recordings.
                </Text>
              </View>
              <Feather name="chevron-right" size={20} color="#94A3B8" />
            </Pressable>
          </View>
        )}
      </ScrollView>

      {/* LESSON DETAIL MODAL */}
      {selectedLesson && (
        <Modal
          visible={!!selectedLesson}
          transparent
          animationType="slide"
          onRequestClose={() => setSelectedLesson(null)}
        >
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setSelectedLesson(null)}
          >
            <Pressable
              style={styles.modalCard}
              onPress={(e) => e.stopPropagation()}
            >
              <View style={styles.modalHeaderRow}>
                <Text style={styles.modalLessonNumber}>
                  Lesson {selectedLesson.order}
                </Text>
                <Pressable onPress={() => setSelectedLesson(null)}>
                  <Feather name="x" size={22} color="#64748B" />
                </Pressable>
              </View>

              <Text style={styles.modalLessonTitle}>{selectedLesson.title}</Text>
              <Text style={styles.modalLessonDesc}>
                {selectedLesson.description}
              </Text>

              {/* STATS BADGES */}
              <View style={styles.statsRow}>
                <View style={styles.statChip}>
                  <Feather name="zap" size={16} color="#F59E0B" />
                  <Text style={styles.statChipText}>
                    +{selectedLesson.xpReward} XP
                  </Text>
                </View>

                <View style={styles.statChip}>
                  <Feather name="clock" size={16} color="#6366F1" />
                  <Text style={styles.statChipText}>
                    {selectedLesson.estimatedMinutes} mins
                  </Text>
                </View>

                <View style={styles.statChip}>
                  <Feather name="check-circle" size={16} color="#10B981" />
                  <Text style={styles.statChipText}>
                    {selectedLesson.goals.length} Goals
                  </Text>
                </View>
              </View>

              {/* GOALS CHECKLIST */}
              {selectedLesson.goals.length > 0 && (
                <View style={styles.goalsContainer}>
                  <Text style={styles.goalsHeading}>Lesson Goals</Text>
                  {selectedLesson.goals.map((goal) => (
                    <View key={goal.id} style={styles.goalItem}>
                      <Ionicons
                        name="checkmark-circle-outline"
                        size={18}
                        color="#6C5CE7"
                      />
                      <Text style={styles.goalText}>{goal.description}</Text>
                    </View>
                  ))}
                </View>
              )}

              {/* START BUTTON */}
              <Pressable
                style={styles.startLessonButton}
                onPress={() => handleStartLesson(selectedLesson)}
              >
                <Text style={styles.startLessonButtonText}>
                  {selectedLesson.status === 'completed'
                    ? 'Review Lesson'
                    : 'Start Lesson'}
                </Text>
                <Feather name="arrow-right" size={18} color="#FFFFFF" />
              </Pressable>
            </Pressable>
          </Pressable>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  /* HEADER */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  headerIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  headerIconButtonActive: {
    backgroundColor: '#FFF7ED',
    borderColor: '#FFEDD5',
  },
  headerCenter: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Poppins_700Bold',
    color: '#0F172A',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 13,
    fontFamily: 'Poppins_500Medium',
    color: '#64748B',
    marginTop: 1,
  },

  scrollContent: {
    paddingBottom: 100, // Account for custom bottom tab bar
  },

  /* HERO BANNER */
  heroContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    paddingTop: 12,
    paddingBottom: 24,
    marginBottom: 20,
  },
  heroImage: {
    width: width * 0.75,
    height: 180,
    marginBottom: 16,
  },

  /* SEGMENTED CONTROL */
  segmentedContainer: {
    flexDirection: 'row',
    width: width - 40,
    height: 48,
    backgroundColor: '#F1F5F9',
    borderRadius: 24,
    padding: 4,
  },
  segmentButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  segmentButtonActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  segmentText: {
    fontSize: 15,
    fontFamily: 'Poppins_600SemiBold',
    color: '#64748B',
  },
  segmentTextActive: {
    color: '#6C5CE7',
  },

  /* LESSONS LIST */
  lessonsList: {
    paddingHorizontal: 20,
    gap: 14,
  },
  lessonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  lessonCardInProgress: {
    borderColor: '#8B5CF6',
    backgroundColor: '#F9F8FF',
  },
  lessonCardLeft: {
    flex: 1,
    marginRight: 12,
  },
  lessonNumberText: {
    fontSize: 13,
    fontFamily: 'Poppins_500Medium',
    color: '#94A3B8',
    marginBottom: 2,
  },
  lessonNumberInProgress: {
    color: '#6C5CE7',
  },
  lessonTitleText: {
    fontSize: 16,
    fontFamily: 'Poppins_700Bold',
    color: '#0F172A',
  },
  inProgressBadge: {
    marginTop: 6,
    alignSelf: 'flex-start',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  inProgressBadgeText: {
    fontSize: 12,
    fontFamily: 'Poppins_600SemiBold',
    color: '#6C5CE7',
  },
  lessonProgressText: {
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
    color: '#94A3B8',
    marginTop: 4,
  },
  lessonCardRight: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbImageWrapper: {
    width: 48,
    height: 48,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
  thumbImage: {
    width: '100%',
    height: '100%',
  },

  /* PRACTICE VIEW */
  practiceContainer: {
    paddingHorizontal: 20,
    gap: 14,
  },
  practiceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  practiceIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  practiceTextContent: {
    flex: 1,
    marginRight: 8,
  },
  practiceCardTitle: {
    fontSize: 16,
    fontFamily: 'Poppins_700Bold',
    color: '#0F172A',
  },
  practiceCardDesc: {
    fontSize: 13,
    fontFamily: 'Poppins_400Regular',
    color: '#64748B',
    marginTop: 2,
  },

  /* MODAL */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: 36,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  modalLessonNumber: {
    fontSize: 13,
    fontFamily: 'Poppins_600SemiBold',
    color: '#6C5CE7',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  modalLessonTitle: {
    fontSize: 22,
    fontFamily: 'Poppins_700Bold',
    color: '#0F172A',
    marginBottom: 6,
  },
  modalLessonDesc: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#64748B',
    marginBottom: 16,
    lineHeight: 20,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  statChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  statChipText: {
    fontSize: 13,
    fontFamily: 'Poppins_600SemiBold',
    color: '#334155',
  },
  goalsContainer: {
    marginBottom: 24,
  },
  goalsHeading: {
    fontSize: 14,
    fontFamily: 'Poppins_700Bold',
    color: '#0F172A',
    marginBottom: 8,
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  goalText: {
    fontSize: 14,
    fontFamily: 'Poppins_500Medium',
    color: '#475569',
  },
  startLessonButton: {
    backgroundColor: '#6C5CE7',
    height: 52,
    borderRadius: 26,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  startLessonButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins_700Bold',
    color: '#FFFFFF',
  },
});
