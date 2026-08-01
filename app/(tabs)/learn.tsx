import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LearnScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white justify-center items-center p-4">
      <Text className="text-2xl font-bold text-slate-800">Learn</Text>
      <Text className="text-slate-500 mt-2">Learn screen content coming soon.</Text>
    </SafeAreaView>
  );
}
