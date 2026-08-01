import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  Pressable,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { LANGUAGES } from '@/data/languages';
import { Language } from '@/types/learning';

export default function LanguageSelectionScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguageId, setSelectedLanguageId] = useState<string>('es');

  // Filter languages based on search query
  const filteredLanguages = LANGUAGES.filter((lang) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;
    return (
      lang.name.toLowerCase().includes(query) ||
      lang.nativeName.toLowerCase().includes(query)
    );
  });

  const handleSelectLanguage = (lang: Language) => {
    setSelectedLanguageId(lang.id);
  };

  const handleConfirm = () => {
    // Navigate or complete selection (e.g. back to home or previous screen)
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  };

  return (
    <View
      className="flex-1 bg-white w-full max-w-[480px] self-center"
      style={{ paddingTop: Math.max(insets.top, 16) }}
    >
      {/* Top Header */}
      <View className="flex-row items-center justify-between px-5 py-3">
        <Pressable
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/(tabs)'))}
          className="w-10 h-10 items-center justify-center rounded-full active:bg-gray-100"
          hitSlop={8}
        >
          <Feather name="chevron-left" size={28} color="#0D132B" />
        </Pressable>

        <Text className="font-poppins-semibold text-[18px] text-neutral-text-primary">
          Choose a language
        </Text>

        <View className="w-10" />
      </View>

      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingBottom: 16 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Search Bar */}
        <View className="flex-row items-center bg-[#F6F7FB] border border-[#E5E7EB] rounded-full px-4 py-3 mt-2 mb-6">
          <Feather name="search" size={20} color="#9CA3AF" />
          <TextInput
            className="flex-1 ml-2.5 font-poppins text-sm text-neutral-text-primary p-0"
            placeholder="Search languages"
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
          />
        </View>

        {/* Popular Title */}
        <Text className="font-poppins-semibold text-base text-neutral-text-primary mb-3">
          Popular
        </Text>

        {/* Language List */}
        <View className="gap-y-3">
          {filteredLanguages.map((lang) => {
            const isSelected = selectedLanguageId === lang.id;
            return (
              <Pressable
                key={lang.id}
                onPress={() => handleSelectLanguage(lang)}
                className={`flex-row items-center justify-between p-4 rounded-2xl border transition-all ${
                  isSelected
                    ? 'border-primary-purple bg-white shadow-sm'
                    : 'border-gray-100 bg-white'
                }`}
              >
                <View className="flex-row items-center flex-1">
                  <View className="w-10 h-10 rounded-full overflow-hidden items-center justify-center bg-gray-50 border border-gray-100 mr-3.5">
                    <Image
                      source={{ uri: lang.flag }}
                      className="w-8 h-8 rounded-full"
                      resizeMode="cover"
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="font-poppins-semibold text-base text-neutral-text-primary">
                      {lang.name}
                    </Text>
                    {lang.learnersCount ? (
                      <Text className="font-poppins text-xs text-neutral-text-secondary mt-0.5">
                        {lang.learnersCount}
                      </Text>
                    ) : null}
                  </View>
                </View>

                {isSelected ? (
                  <View className="w-6 h-6 rounded-full bg-primary-purple items-center justify-center">
                    <Feather name="check" size={14} color="#FFFFFF" />
                  </View>
                ) : (
                  <Feather name="chevron-right" size={20} color="#9CA3AF" />
                )}
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      {/* Bottom Section with Confirmation Button and Earth Artwork */}
      <View className="w-full bg-white items-center">
        {/* Confirmation Button */}
        <View className="w-full px-5 pt-2 pb-3">
          <Pressable
            onPress={handleConfirm}
            className="w-full bg-primary-purple h-14 rounded-2xl items-center justify-center shadow-md active:opacity-90 active:scale-98"
          >
            <Text className="font-poppins-semibold text-base text-white">
              Continue
            </Text>
          </Pressable>
        </View>

        {/* Earth Illustration Footer */}
        <View
          className="w-full overflow-hidden items-center justify-end"
          style={{ height: 130, paddingBottom: insets.bottom }}
        >
          <Image
            source={require('@/assets/images/earth.png')}
            className="w-full h-[150px]"
            resizeMode="cover"
            style={{ width: '100%', height: 150, marginBottom: -20 }}
          />
        </View>
      </View>
    </View>
  );
}
