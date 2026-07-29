import { StyleSheet } from 'react-native';
import { View } from '@/components/Themed';
import { H1 } from '@/components/ui/Typography';

export default function TabOneScreen() {
  return (
    <View style={styles.container}>
      <H1>Tab One</H1>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
