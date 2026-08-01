import { StyleSheet, Pressable, Text } from 'react-native';
import { View } from '@/components/Themed';
import { H1 } from '@/components/ui/Typography';
import { Link } from 'expo-router';
import { useUser, useAuth } from '@clerk/expo';

export default function TabOneScreen() {
  const { user } = useUser();
  const { signOut } = useAuth();

  return (
    <View style={styles.container}>
      <H1 style={styles.title}>Home Screen</H1>
      
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
});
