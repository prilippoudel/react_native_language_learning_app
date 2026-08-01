import { StyleSheet, Pressable, Text } from 'react-native';
import { View } from '@/components/Themed';
import { H1 } from '@/components/ui/Typography';
import { Link, useRouter } from 'expo-router';
import { useUser, useAuth } from '@clerk/expo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLanguageStore } from '@/store/useLanguageStore';

export default function TabOneScreen() {
  const { user } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();

  const selectedLanguage = useLanguageStore((state) => state.selectedLanguage);
  const clearSelectedLanguage = useLanguageStore((state) => state.clearSelectedLanguage);

  const handleClearStorage = async () => {
    try {
      await AsyncStorage.clear();
      clearSelectedLanguage();
      router.replace('/language-selection');
    } catch (error) {
      console.error('Error clearing async storage:', error);
    }
  };

  return (
    <View style={styles.container}>
      <H1 style={styles.title}>Home Screen</H1>
      
      {selectedLanguage ? (
        <View style={styles.selectedLangContainer}>
          <Text style={styles.selectedLangText}>
            Selected Language: {selectedLanguage.name} ({selectedLanguage.nativeName})
          </Text>
        </View>
      ) : null}

      {user ? (
        <View style={styles.userInfoContainer}>
          <Text style={styles.welcomeText}>
            Welcome, {user.primaryEmailAddress?.emailAddress || user.firstName || 'Learner'}!
          </Text>
          <Pressable style={styles.signOutButton} onPress={() => signOut()}>
            <Text style={styles.signOutButtonText}>Sign Out</Text>
          </Pressable>
        </View>
      ) : null}

      <Link href="/language-selection" asChild>
        <Pressable style={styles.languageButton}>
          <Text style={styles.buttonText}>Choose Language</Text>
        </Pressable>
      </Link>

      <Link href="/onboarding" asChild>
        <Pressable style={styles.onboardingButton}>
          <Text style={styles.buttonText}>Open Onboarding Screen</Text>
        </Pressable>
      </Link>

      <Pressable style={styles.clearStorageButton} onPress={handleClearStorage}>
        <Text style={styles.clearStorageButtonText}>Clear Storage (Test Language Gate)</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    marginBottom: 20,
  },
  userInfoContainer: {
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: '#F3F4F6',
    padding: 16,
    borderRadius: 16,
    width: '100%',
    maxWidth: 320,
  },
  welcomeText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    color: '#0D132B',
    marginBottom: 12,
    textAlign: 'center',
  },
  signOutButton: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  signOutButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 14,
  },
  languageButton: {
    backgroundColor: '#21C16B',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#21C16B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  onboardingButton: {
    backgroundColor: '#6C4EF5',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#6C4EF5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  buttonText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
  },
  selectedLangContainer: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#6C4EF5',
  },
  selectedLangText: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 14,
    color: '#6C4EF5',
  },
  clearStorageButton: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  clearStorageButtonText: {
    color: '#4B5563',
    fontFamily: 'Poppins_500Medium',
    fontSize: 13,
  },
});
