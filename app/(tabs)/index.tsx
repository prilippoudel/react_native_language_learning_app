import { StyleSheet, Pressable, Text } from 'react-native';
import { View } from '@/components/Themed';
import { H1 } from '@/components/ui/Typography';
import { Link } from 'expo-router';

export default function TabOneScreen() {
  return (
    <View style={styles.container}>
      <H1 style={styles.title}>Home Screen</H1>
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
