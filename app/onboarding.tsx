import React from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { usePostHog } from 'posthog-react-native';

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const posthog = usePostHog();
  const { height: windowHeight } = useWindowDimensions();

  const handleGetStarted = () => {
    posthog?.capture?.('onboarding_started');
    router.push('/signup');
  };

  const isSmallScreen = windowHeight < 700;
  const mascotContainerSize = isSmallScreen ? 280 : 330;
  const mascotImageSize = isSmallScreen ? 220 : 260;

  return (
    <View
      className="flex-1 bg-white w-full max-w-[480px] self-center"
      style={{ paddingTop: Math.max(insets.top, 16) }}
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View className="flex-1 justify-between">
          {/* Top Section: Header & Text */}
          <View className="w-full">
            <View className="flex-row items-center justify-center mt-3.5 mb-12">
              <Image
                source={require('../assets/images/moscot-logo.png')}
                className="w-[38px] h-[38px]"
                style={{ width: 38, height: 38 }}
                resizeMode="contain"
              />
              <Text className="font-poppins-bold text-[26px] text-neutral-text-primary ml-2 -tracking-[0.5px]">
                muolingo
              </Text>
            </View>

            <View className="px-7 mt-4">
              <Text
                className={`font-poppins-bold text-neutral-text-primary -tracking-[0.5px] ${
                  isSmallScreen
                    ? 'text-[28px] leading-[36px]'
                    : 'text-[34px] leading-[42px]'
                }`}
              >
                Your AI language{'\n'}
                <Text className="text-primary-purple">teacher.</Text>
              </Text>
              <Text
                className={`font-poppins text-slate-500 ${
                  isSmallScreen
                    ? 'text-sm leading-[22px] mt-2'
                    : 'text-base leading-[26px] mt-3'
                }`}
              >
                Real conversations, personalized{'\n'}lessons, anytime, anywhere.
              </Text>
            </View>
          </View>

          {/* Middle Section: Mascot & Speech Bubbles */}
          <View className="flex-1 items-center justify-center my-4">
            <View
              className={`items-center justify-center relative ${
                isSmallScreen ? 'w-[280px] h-[280px]' : 'w-[330px] h-[330px]'
              }`}
              style={{ width: mascotContainerSize, height: mascotContainerSize }}
            >
              <Image
                source={require('../assets/images/mascot-welcome.png')}
                className={
                  isSmallScreen ? 'w-[220px] h-[220px]' : 'w-[260px] h-[260px]'
                }
                style={{ width: mascotImageSize, height: mascotImageSize }}
                resizeMode="contain"
              />

              {/* Speech Bubble 1: Hello! */}
              <View
                className={`absolute bg-[#EDF5FF] rounded-2xl z-10 shadow-sm ${
                  isSmallScreen
                    ? 'top-2.5 left-1 px-3 py-2'
                    : 'top-5 left-2.5 px-4 py-2.5'
                }`}
              >
                <Text className="font-poppins-semibold text-base text-neutral-text-primary">
                  Hello!
                </Text>
                <View className="absolute -bottom-[5px] right-[18px] w-[10px] h-[10px] bg-[#EDF5FF] rotate-45" />
              </View>

              {/* Speech Bubble 2: ¡Hola! */}
              <View
                className={`absolute bg-[#F3E8FF] rounded-2xl z-10 shadow-sm ${
                  isSmallScreen
                    ? 'top-0 right-2.5 px-3 py-2'
                    : 'top-[5px] right-[18px] px-4 py-2.5'
                }`}
              >
                <Text className="font-poppins-semibold text-base text-primary-purple">
                  ¡Hola!
                </Text>
                <View className="absolute -bottom-[5px] left-[18px] w-[10px] h-[10px] bg-[#F3E8FF] rotate-45" />
              </View>

              {/* Speech Bubble 3: 你好! */}
              <View
                className={`absolute bg-[#FFF0ED] rounded-2xl z-10 shadow-sm ${
                  isSmallScreen
                    ? 'top-[110px] right-0 px-3 py-2'
                    : 'top-[135px] right-[5px] px-4 py-2.5'
                }`}
              >
                <Text className="font-poppins-semibold text-base text-semantic-error">
                  你好!
                </Text>
                <View className="absolute -left-[5px] top-[14px] w-[10px] h-[10px] bg-[#FFF0ED] rotate-45" />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Bottom CTA Button */}
      <View
        className="px-6 pt-3 bg-white"
        style={{ paddingBottom: Math.max(insets.bottom + 32, 54) }}
      >
        <Pressable
          className="bg-primary-purple h-14 rounded-[18px] flex-row items-center justify-center shadow-lg active:opacity-90 active:scale-98"
          onPress={handleGetStarted}
        >
          <Text className="font-poppins-semibold text-lg text-white">
            Get Started
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
