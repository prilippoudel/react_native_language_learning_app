import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSignIn, useSSO } from '@clerk/expo';
import VerificationModal from '../components/VerificationModal';

export default function SignInScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { signIn } = useSignIn();
  const { startSSOFlow } = useSSO();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleSignIn = async () => {
    setErrorMsg(null);
    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    if (!signIn) {
      setErrorMsg('Auth client is not initialized yet. Please try again.');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await signIn.password({ emailAddress: email.trim(), password });
      if (error) {
        const errObj = error as any;
        setErrorMsg(errObj.errors?.[0]?.longMessage || errObj.errors?.[0]?.message || errObj.message || 'Sign in failed.');
        setIsLoading(false);
        return;
      }

      if (signIn.status === 'complete') {
        const { error: finalizeError } = await signIn.finalize();
        if (finalizeError) {
          const errObj = finalizeError as any;
          setErrorMsg(errObj.errors?.[0]?.longMessage || errObj.errors?.[0]?.message || errObj.message || 'Failed to complete session setup.');
        } else {
          router.replace('/(tabs)');
        }
      } else {
        // If MFA or factor verification is needed
        setIsModalVisible(true);
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'An error occurred during sign in.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialAuth = async (strategy: 'oauth_google' | 'oauth_facebook' | 'oauth_apple') => {
    setErrorMsg(null);
    try {
      const { createdSessionId, setActive } = await startSSOFlow({ strategy });
      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        router.replace('/(tabs)');
      }
    } catch (err: any) {
      const msg = err?.message || '';
      if (msg.includes('ExpoCryptoAES') || msg.includes('native module')) {
        setErrorMsg('Social OAuth sign-in requires a native Development Build (npx expo run:ios / run:android) when using native crypto on a physical device. Please use Email Sign In in Expo Go.');
      } else {
        setErrorMsg(msg || `Social sign-in with ${strategy} failed.`);
      }
    }
  };

  return (
    <View
      className="flex-1 bg-white w-full max-w-[480px] self-center"
      style={{ paddingTop: Math.max(insets.top, 16) }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <ScrollView
          className="flex-1 px-6"
          contentContainerStyle={{ flexGrow: 1, paddingBottom: Math.max(insets.bottom + 20, 30) }}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Top Bar / Back Button */}
          <View className="flex-row items-center pt-2 pb-4">
            <Pressable
              onPress={() => router.back()}
              className="w-10 h-10 rounded-full items-center justify-center -ml-2 active:bg-neutral-surface"
              hitSlop={8}
            >
              <Ionicons name="chevron-back" size={26} color="#0D132B" />
            </Pressable>
          </View>

          {/* Header Title & Subtitle */}
          <View className="mb-2">
            <Text className="font-poppins-bold text-[28px] leading-[36px] text-neutral-text-primary -tracking-[0.5px]">
              Welcome back
            </Text>
            <Text className="font-poppins text-slate-500 text-base mt-1">
              Continue your language journey ✨
            </Text>
          </View>

          {/* Mascot Illustration */}
          <View className="items-center justify-center my-3">
            <Image
              source={require('../assets/images/mascot-auth.png')}
              className="w-[180px] h-[140px]"
              style={{ width: 180, height: 140 }}
              resizeMode="contain"
            />
          </View>

          {/* Error Message Box */}
          {errorMsg ? (
            <View className="mb-4 p-3.5 bg-red-50 rounded-2xl border border-red-200">
              <Text className="font-poppins text-xs text-red-600 font-medium">
                {errorMsg}
              </Text>
            </View>
          ) : null}

          {/* Form Fields (Email & Password) */}
          <View className="gap-3.5 mb-5">
            {/* Email Field */}
            <View
              className={`border rounded-2xl px-4 py-2.5 bg-white shadow-xs ${
                isFocused ? 'border-primary-purple' : 'border-neutral-border'
              }`}
            >
              <Text className="font-poppins-medium text-xs text-slate-400">
                Email
              </Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="alex@gmail.com"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
                className="font-poppins text-base text-neutral-text-primary p-0 mt-0.5"
                style={{ padding: 0, includeFontPadding: false }}
              />
            </View>

            {/* Password Field */}
            <View
              className={`border rounded-2xl px-4 py-2.5 bg-white shadow-xs flex-row items-center justify-between ${
                isPasswordFocused ? 'border-primary-purple' : 'border-neutral-border'
              }`}
            >
              <View className="flex-1 pr-2">
                <Text className="font-poppins-medium text-xs text-slate-400">
                  Password
                </Text>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                  placeholder="••••••••"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  className="font-poppins text-base text-neutral-text-primary p-0 mt-0.5"
                  style={{ padding: 0, includeFontPadding: false }}
                />
              </View>
              <Pressable
                onPress={() => setShowPassword(!showPassword)}
                className="p-1 active:opacity-60"
                hitSlop={8}
              >
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={22}
                  color="#6B7280"
                />
              </Pressable>
            </View>
          </View>

          {/* Primary Submit Button */}
          <Pressable
            className="bg-primary-purple h-14 rounded-[18px] flex-row items-center justify-center shadow-lg active:opacity-90 active:scale-98 mb-6"
            onPress={handleSignIn}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text className="font-poppins-semibold text-lg text-white">
                Sign In
              </Text>
            )}
          </Pressable>

          {/* Divider */}
          <View className="flex-row items-center mb-6 px-2">
            <View className="flex-1 h-[1px] bg-neutral-border" />
            <Text className="font-poppins text-xs text-slate-400 px-3">
              or continue with
            </Text>
            <View className="flex-1 h-[1px] bg-neutral-border" />
          </View>

          {/* Social Auth Buttons */}
          <View className="gap-3 mb-6">
            {/* Google */}
            <Pressable
              className="h-[52px] border border-neutral-border rounded-2xl flex-row items-center justify-center bg-white active:bg-neutral-surface"
              onPress={() => handleSocialAuth('oauth_google')}
            >
              <Ionicons name="logo-google" size={20} color="#EA4335" style={{ marginRight: 10 }} />
              <Text className="font-poppins-medium text-base text-neutral-text-primary">
                Continue with Google
              </Text>
            </Pressable>

            {/* Facebook */}
            <Pressable
              className="h-[52px] border border-neutral-border rounded-2xl flex-row items-center justify-center bg-white active:bg-neutral-surface"
              onPress={() => handleSocialAuth('oauth_facebook')}
            >
              <Ionicons name="logo-facebook" size={20} color="#1877F2" style={{ marginRight: 10 }} />
              <Text className="font-poppins-medium text-base text-neutral-text-primary">
                Continue with Facebook
              </Text>
            </Pressable>

            {/* Apple */}
            <Pressable
              className="h-[52px] border border-neutral-border rounded-2xl flex-row items-center justify-center bg-white active:bg-neutral-surface"
              onPress={() => handleSocialAuth('oauth_apple')}
            >
              <Ionicons name="logo-apple" size={22} color="#0D132B" style={{ marginRight: 10 }} />
              <Text className="font-poppins-medium text-base text-neutral-text-primary">
                Continue with Apple
              </Text>
            </Pressable>
          </View>

          {/* Bottom Account Switch Footer */}
          <View className="mt-auto py-3 items-center justify-center flex-row">
            <Text className="font-poppins text-sm text-slate-500">
              Don't have an account?{' '}
            </Text>
            <Pressable onPress={() => router.push('/signup')}>
              <Text className="font-poppins-semibold text-sm text-primary-purple">
                Sign Up
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Verification Code Modal */}
      <VerificationModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSuccess={() => router.replace('/(tabs)')}
        email={email}
      />
    </View>
  );
}
