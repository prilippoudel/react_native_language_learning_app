import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  Modal,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useUser } from '@clerk/expo';
import { Feather, Ionicons } from '@expo/vector-icons';
import { usePostHog } from 'posthog-react-native';

import { useLanguageStore } from '@/store/useLanguageStore';
import { getLessonById, LESSONS } from '@/data/lessons';
import { getUnitsByLanguage } from '@/data/units';
import { LANGUAGES } from '@/data/languages';
import { IMAGES } from '@/constants/images';
import { Lesson, PhraseItem } from '@/types/learning';

const { width } = Dimensions.get('window');

interface TeacherMessage {
  original: string;
  translation: string;
  emoji?: string;
}

export default function AITeacherScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useUser();
  const posthog = usePostHog();
  const params = useLocalSearchParams<{ lessonId?: string }>();

  const selectedLanguageStore = useLanguageStore((state) => state.selectedLanguage);
  const activeLanguage = selectedLanguageStore || LANGUAGES[0];

  // Resolve Active Lesson
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);

  useEffect(() => {
    if (params.lessonId) {
      const foundLesson = getLessonById(params.lessonId);
      if (foundLesson) {
        setCurrentLesson(foundLesson);
        return;
      }
    }
    // Fallback: search lessons for the active language
    const langUnits = getUnitsByLanguage(activeLanguage.id);
    const fallbackLesson =
      langUnits[0]?.lessons.find((l) => l.status === 'in_progress') ||
      langUnits[0]?.lessons[0] ||
      LESSONS[0];
    setCurrentLesson(fallbackLesson);
  }, [params.lessonId, activeLanguage.id]);

  // Audio Lesson Interactive States
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicActive, setIsMicActive] = useState(true);
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showEndCallModal, setShowEndCallModal] = useState(false);

  // Lesson Feedback / Stats
  const [speakingRating, setSpeakingRating] = useState('Excellent');
  const [pronunciationRating, setPronunciationRating] = useState('Great');
  const [grammarRating, setGrammarRating] = useState('Good');

  // Active Teacher Response Bubble
  const defaultInitialMessage: TeacherMessage = {
    original: currentLesson?.aiTeacherPrompt?.initialMessage || '¡Muy bien!',
    translation: 'That was great!',
    emoji: '👏',
  };

  const [activeMessage, setActiveMessage] = useState<TeacherMessage>(
    defaultInitialMessage
  );

  // Update initial message when lesson changes
  useEffect(() => {
    if (currentLesson?.aiTeacherPrompt?.initialMessage) {
      setActiveMessage({
        original: currentLesson.aiTeacherPrompt.initialMessage,
        translation:
          currentLesson.phrases[0]?.translation ||
          'Hello! How are you doing today?',
        emoji: '👋',
      });
    }
  }, [currentLesson]);

  // Waveform animation for speaker audio
  const waveAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isPlayingAudio) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(waveAnim, {
            toValue: 1.25,
            duration: 350,
            useNativeDriver: true,
          }),
          Animated.timing(waveAnim, {
            toValue: 1,
            duration: 350,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      waveAnim.setValue(1);
    }
  }, [isPlayingAudio, waveAnim]);

  // Pulse animation for active mic
  useEffect(() => {
    if (isMicActive) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.12,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isMicActive, pulseAnim]);

  const handlePlayAudio = () => {
    posthog?.capture?.('ai_teacher_audio_played', {
      lesson_id: currentLesson?.id || 'none',
      phrase: activeMessage.original,
    });
    setIsPlayingAudio(true);
    setTimeout(() => {
      setIsPlayingAudio(false);
    }, 2200);
  };

  const handleSelectSuggestedPhrase = (phrase: string | PhraseItem) => {
    const text = typeof phrase === 'string' ? phrase : phrase.original;
    const trans = typeof phrase === 'string' ? '' : phrase.translation;

    posthog?.capture?.('ai_teacher_suggested_phrase_tapped', {
      phrase: text,
      lesson_id: currentLesson?.id || 'none',
    });

    // Simulate AI response update
    setIsPlayingAudio(true);
    if (text.toLowerCase().includes('hola') || text.toLowerCase().includes('bonjour') || text.toLowerCase().includes('hallo')) {
      setActiveMessage({
        original: `¡Excelente! Perfect response!`,
        translation: 'Great start! Let us continue our practice.',
        emoji: '🌟',
      });
    } else {
      setActiveMessage({
        original: `¡Muy bien! You said: "${text}"`,
        translation: trans || 'That sounded very natural!',
        emoji: '👏',
      });
    }

    setTimeout(() => {
      setIsPlayingAudio(false);
    }, 2500);
  };

  const handleEndCall = () => {
    posthog?.capture?.('ai_teacher_session_ended', {
      lesson_id: currentLesson?.id || 'none',
    });
    setShowEndCallModal(true);
  };

  const personaName = currentLesson?.aiTeacherPrompt?.personaName || 'Sofia';
  const suggestedPhrases = currentLesson?.aiTeacherPrompt?.suggestedPhrases || [
    '¡Hola!',
    'Buenos días',
    'Estoy bien, gracias',
  ];

  return (
    <View style={[styles.screen, { paddingTop: Math.max(insets.top, 10) }]}>
      {/* 1. TOP NAVIGATION HEADER */}
      <View style={styles.header}>
        <Pressable
          style={styles.headerIconButton}
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.push('/learn');
            }
          }}
        >
          <Feather name="chevron-left" size={24} color="#0F172A" />
        </Pressable>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>AI Teacher</Text>
          <View style={styles.statusRow}>
            <View style={styles.greenDot} />
            <Text style={styles.statusText}>Online</Text>
          </View>
        </View>

        <View style={styles.headerRightActions}>
          <Pressable
            style={[
              styles.headerCircleBtn,
              !isCameraOn && styles.headerCircleBtnInactive,
            ]}
            onPress={() => setIsCameraOn(!isCameraOn)}
          >
            <Feather
              name={isCameraOn ? 'video' : 'video-off'}
              size={18}
              color={isCameraOn ? '#4F46E5' : '#94A3B8'}
            />
          </Pressable>

          <View style={styles.streakBadge}>
            <Text style={styles.streakText}>12</Text>
          </View>

          <View style={styles.avatarCircleBtn}>
            {user?.imageUrl ? (
              <Image source={{ uri: user.imageUrl }} style={styles.userAvatarHeader} />
            ) : (
              <Feather name="user" size={18} color="#64748B" />
            )}
          </View>
        </View>
      </View>

      {/* LESSON CONTEXT BANNER */}
      {currentLesson && (
        <View style={styles.contextBanner}>
          <View style={styles.contextHeaderRow}>
            <Text style={styles.contextFlag}>{activeLanguage.flag}</Text>
            <Text style={styles.contextTitle} numberOfLines={1}>
              {currentLesson.title}
            </Text>
          </View>
          <Text style={styles.contextGoal} numberOfLines={1}>
            Goal: {currentLesson.goals[0]?.description || currentLesson.description}
          </Text>
        </View>
      )}

      {/* 2. MAIN VISUAL & AUDIO CALL CONTAINER */}
      <View style={styles.mainCallContainer}>
        {/* BACKGROUND & TEACHER MASCOT PREVIEW */}
        <View style={styles.teacherPreviewArea}>
          <Image
            source={IMAGES.mascotWelcome}
            style={styles.teacherMascotImage}
            resizeMode="contain"
          />

          {/* TOP RIGHT: USER CAMERA/AVATAR PREVIEW CARD */}
          <View style={styles.userCameraCard}>
            {isCameraOn ? (
              user?.imageUrl ? (
                <Image
                  source={{ uri: user.imageUrl }}
                  style={styles.userCameraImage}
                />
              ) : (
                <View style={styles.userCameraPlaceholder}>
                  <Feather name="user" size={28} color="#8B5CF6" />
                </View>
              )
            ) : (
              <View style={[styles.userCameraPlaceholder, styles.cameraOffBg]}>
                <Feather name="video-off" size={24} color="#94A3B8" />
              </View>
            )}
            <View
              style={[
                styles.cameraIndicatorDot,
                { backgroundColor: isCameraOn ? '#10B981' : '#EF4444' },
              ]}
            />
          </View>

          {/* TEACHER RESPONSE SPEECH BUBBLE */}
          <View style={styles.speechBubbleWrapper}>
            <View style={styles.speechBubbleCard}>
              <View style={styles.speechBubbleContent}>
                <Text style={styles.speechBubbleTargetText}>
                  {activeMessage.original}
                </Text>
                {showSubtitles && activeMessage.translation ? (
                  <Text style={styles.speechBubbleTranslationText}>
                    {activeMessage.translation} {activeMessage.emoji || ''}
                  </Text>
                ) : null}
              </View>

              <Pressable
                style={[
                  styles.audioSpeakerBtn,
                  isPlayingAudio && styles.audioSpeakerBtnActive,
                ]}
                onPress={handlePlayAudio}
              >
                <Animated.View style={{ transform: [{ scale: waveAnim }] }}>
                  <Feather
                    name={isPlayingAudio ? 'volume-2' : 'volume-1'}
                    size={22}
                    color={isPlayingAudio ? '#6C5CE7' : '#8B5CF6'}
                  />
                </Animated.View>
              </Pressable>
            </View>
            {/* Speech bubble tail pointer */}
            <View style={styles.speechBubbleTail} />
          </View>
        </View>

        {/* AUDIO LESSON ACTION CONTROLS */}
        <View style={styles.actionControlsRow}>
          {/* CAMERA BUTTON */}
          <View style={styles.controlItem}>
            <Pressable
              style={[
                styles.controlCircleBtn,
                !isCameraOn && styles.controlCircleBtnOff,
              ]}
              onPress={() => setIsCameraOn(!isCameraOn)}
            >
              <Feather
                name={isCameraOn ? 'video' : 'video-off'}
                size={22}
                color={isCameraOn ? '#0F172A' : '#64748B'}
              />
            </Pressable>
            <Text style={styles.controlLabel}>Camera</Text>
          </View>

          {/* MIC BUTTON */}
          <View style={styles.controlItem}>
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <Pressable
                style={[
                  styles.controlCircleBtn,
                  isMicActive && styles.controlCircleBtnMicActive,
                  !isMicActive && styles.controlCircleBtnOff,
                ]}
                onPress={() => setIsMicActive(!isMicActive)}
              >
                <Feather
                  name={isMicActive ? 'mic' : 'mic-off'}
                  size={22}
                  color={isMicActive ? '#6C5CE7' : '#64748B'}
                />
              </Pressable>
            </Animated.View>
            <Text style={styles.controlLabel}>Mic</Text>
          </View>

          {/* SUBTITLES BUTTON */}
          <View style={styles.controlItem}>
            <Pressable
              style={[
                styles.controlCircleBtn,
                showSubtitles && styles.controlCircleBtnActive,
              ]}
              onPress={() => setShowSubtitles(!showSubtitles)}
            >
              <Feather
                name="type"
                size={22}
                color={showSubtitles ? '#6C5CE7' : '#0F172A'}
              />
            </Pressable>
            <Text style={styles.controlLabel}>Subtitles</Text>
          </View>

          {/* END CALL BUTTON */}
          <View style={styles.controlItem}>
            <Pressable
              style={[styles.controlCircleBtn, styles.endCallBtn]}
              onPress={handleEndCall}
            >
              <Ionicons name="call" size={22} color="#FFFFFF" style={styles.endCallIcon} />
            </Pressable>
            <Text style={styles.controlLabel}>End Call</Text>
          </View>
        </View>
      </View>

      {/* 3. LESSON FEEDBACK & STATS CARD */}
      <View style={styles.feedbackCard}>
        <View style={styles.feedbackCol}>
          <Text style={styles.feedbackTitle}>Speaking</Text>
          <Text style={[styles.feedbackValue, { color: '#10B981' }]}>
            {speakingRating}
          </Text>
        </View>

        <View style={styles.feedbackDivider} />

        <View style={styles.feedbackCol}>
          <Text style={styles.feedbackTitle}>Pronunciation</Text>
          <Text style={[styles.feedbackValue, { color: '#3B82F6' }]}>
            {pronunciationRating}
          </Text>
        </View>

        <View style={styles.feedbackDivider} />

        <View style={styles.feedbackCol}>
          <Text style={styles.feedbackTitle}>Grammar</Text>
          <Text style={[styles.feedbackValue, { color: '#8B5CF6' }]}>
            {grammarRating}
          </Text>
        </View>
      </View>

      {/* SUGGESTED PHRASES CHIPS */}
      <View style={styles.suggestedContainer}>
        <Text style={styles.suggestedHeading}>
          Practice Phrases ({personaName})
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.suggestedScroll}
        >
          {suggestedPhrases.map((phraseText, idx) => (
            <Pressable
              key={idx}
              style={styles.phraseChip}
              onPress={() => handleSelectSuggestedPhrase(phraseText)}
            >
              <Feather name="message-circle" size={14} color="#6C5CE7" />
              <Text style={styles.phraseChipText}>{phraseText}</Text>
            </Pressable>
          ))}
          {currentLesson?.phrases?.map((p) => (
            <Pressable
              key={p.id}
              style={styles.phraseChip}
              onPress={() => handleSelectSuggestedPhrase(p)}
            >
              <Feather name="message-circle" size={14} color="#6C5CE7" />
              <Text style={styles.phraseChipText}>{p.original}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* 4. END CALL / LESSON SUMMARY MODAL */}
      {showEndCallModal && (
        <Modal
          visible={showEndCallModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowEndCallModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeaderIcon}>
                <Feather name="award" size={36} color="#8B5CF6" />
              </View>

              <Text style={styles.modalTitle}>Audio Session Complete!</Text>
              <Text style={styles.modalSub}>
                Great conversation practice with {personaName} in {activeLanguage.name}!
              </Text>

              <View style={styles.modalStatsGrid}>
                <View style={styles.modalStatItem}>
                  <Feather name="zap" size={20} color="#F59E0B" />
                  <Text style={styles.modalStatNum}>
                    +{currentLesson?.xpReward || 10} XP
                  </Text>
                  <Text style={styles.modalStatLabel}>Earned</Text>
                </View>

                <View style={styles.modalStatItem}>
                  <Feather name="check-circle" size={20} color="#10B981" />
                  <Text style={styles.modalStatNum}>95%</Text>
                  <Text style={styles.modalStatLabel}>Accuracy</Text>
                </View>

                <View style={styles.modalStatItem}>
                  <Feather name="clock" size={20} color="#3B82F6" />
                  <Text style={styles.modalStatNum}>
                    {currentLesson?.estimatedMinutes || 3} min
                  </Text>
                  <Text style={styles.modalStatLabel}>Speaking</Text>
                </View>
              </View>

              <Pressable
                style={styles.modalPrimaryBtn}
                onPress={() => {
                  setShowEndCallModal(false);
                  router.push('/learn');
                }}
              >
                <Text style={styles.modalPrimaryBtnText}>Back to Lessons</Text>
              </Pressable>

              <Pressable
                style={styles.modalSecondaryBtn}
                onPress={() => setShowEndCallModal(false)}
              >
                <Text style={styles.modalSecondaryBtnText}>Continue Practice</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FAFAFD',
  },

  /* HEADER */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  headerIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Poppins_700Bold',
    color: '#0F172A',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
  },
  greenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22C55E',
  },
  statusText: {
    fontSize: 13,
    fontFamily: 'Poppins_500Medium',
    color: '#64748B',
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerCircleBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCircleBtnInactive: {
    backgroundColor: '#F1F5F9',
  },
  streakBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  streakText: {
    fontSize: 14,
    fontFamily: 'Poppins_700Bold',
    color: '#0F172A',
  },
  avatarCircleBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  userAvatarHeader: {
    width: '100%',
    height: '100%',
  },

  /* CONTEXT BANNER */
  contextBanner: {
    marginHorizontal: 18,
    marginTop: 4,
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  contextHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  contextFlag: {
    fontSize: 16,
  },
  contextTitle: {
    fontSize: 14,
    fontFamily: 'Poppins_700Bold',
    color: '#1E293B',
    flex: 1,
  },
  contextGoal: {
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
    color: '#64748B',
    marginTop: 2,
  },

  /* MAIN CALL CONTAINER */
  mainCallContainer: {
    marginHorizontal: 18,
    height: 410,
    borderRadius: 28,
    backgroundColor: '#EAE6FF',
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'space-between',
  },
  teacherPreviewArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  teacherMascotImage: {
    width: width * 0.72,
    height: 250,
    marginTop: 10,
  },

  /* USER CAMERA CARD OVERLAY */
  userCameraCard: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 88,
    height: 110,
    borderRadius: 18,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    backgroundColor: '#F1F5F9',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  userCameraImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  userCameraPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#DDD6FE',
  },
  cameraOffBg: {
    backgroundColor: '#CBD5E1',
  },
  cameraIndicatorDot: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },

  /* SPEECH BUBBLE OVERLAY */
  speechBubbleWrapper: {
    position: 'absolute',
    bottom: 78,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  speechBubbleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingVertical: 14,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  speechBubbleContent: {
    flex: 1,
    marginRight: 10,
  },
  speechBubbleTargetText: {
    fontSize: 16,
    fontFamily: 'Poppins_700Bold',
    color: '#0F172A',
  },
  speechBubbleTranslationText: {
    fontSize: 13,
    fontFamily: 'Poppins_500Medium',
    color: '#64748B',
    marginTop: 2,
  },
  audioSpeakerBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F3E8FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  audioSpeakerBtnActive: {
    backgroundColor: '#DDD6FE',
  },
  speechBubbleTail: {
    width: 14,
    height: 14,
    backgroundColor: '#FFFFFF',
    transform: [{ rotate: '45deg' }],
    marginTop: -7,
    alignSelf: 'flex-start',
    marginLeft: 36,
  },

  /* ACTION CONTROLS ROW */
  actionControlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  controlItem: {
    alignItems: 'center',
  },
  controlCircleBtn: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  controlCircleBtnOff: {
    backgroundColor: '#F1F5F9',
  },
  controlCircleBtnMicActive: {
    backgroundColor: '#F3E8FF',
    borderWidth: 2,
    borderColor: '#8B5CF6',
  },
  controlCircleBtnActive: {
    backgroundColor: '#F3E8FF',
    borderWidth: 2,
    borderColor: '#8B5CF6',
  },
  endCallBtn: {
    backgroundColor: '#FF4B4B',
  },
  endCallIcon: {
    transform: [{ rotate: '135deg' }],
  },
  controlLabel: {
    fontSize: 12,
    fontFamily: 'Poppins_500Medium',
    color: '#64748B',
    marginTop: 6,
  },

  /* FEEDBACK CARD */
  feedbackCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 18,
    marginTop: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    paddingVertical: 14,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  feedbackCol: {
    flex: 1,
    alignItems: 'center',
  },
  feedbackTitle: {
    fontSize: 13,
    fontFamily: 'Poppins_500Medium',
    color: '#475569',
    marginBottom: 4,
  },
  feedbackValue: {
    fontSize: 15,
    fontFamily: 'Poppins_700Bold',
  },
  feedbackDivider: {
    width: 1,
    height: 32,
    backgroundColor: '#F1F5F9',
  },

  /* SUGGESTED PHRASES CHIPS */
  suggestedContainer: {
    marginTop: 12,
    marginHorizontal: 18,
  },
  suggestedHeading: {
    fontSize: 13,
    fontFamily: 'Poppins_600SemiBold',
    color: '#64748B',
    marginBottom: 8,
  },
  suggestedScroll: {
    gap: 8,
    paddingRight: 10,
  },
  phraseChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1.5,
    borderColor: '#EEF2FF',
  },
  phraseChipText: {
    fontSize: 13,
    fontFamily: 'Poppins_600SemiBold',
    color: '#4F46E5',
  },

  /* MODAL */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeaderIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F3E8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Poppins_700Bold',
    color: '#0F172A',
    textAlign: 'center',
  },
  modalSub: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: '#64748B',
    textAlign: 'center',
    marginTop: 6,
    marginHorizontal: 10,
  },
  modalStatsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 20,
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    paddingVertical: 14,
  },
  modalStatItem: {
    alignItems: 'center',
  },
  modalStatNum: {
    fontSize: 16,
    fontFamily: 'Poppins_700Bold',
    color: '#0F172A',
    marginTop: 4,
  },
  modalStatLabel: {
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
    color: '#64748B',
  },
  modalPrimaryBtn: {
    width: '100%',
    backgroundColor: '#6C5CE7',
    borderRadius: 20,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 10,
  },
  modalPrimaryBtnText: {
    fontSize: 16,
    fontFamily: 'Poppins_700Bold',
    color: '#FFFFFF',
  },
  modalSecondaryBtn: {
    paddingVertical: 8,
  },
  modalSecondaryBtnText: {
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold',
    color: '#64748B',
  },
});
