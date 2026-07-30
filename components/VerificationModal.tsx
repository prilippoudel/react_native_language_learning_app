import React, { useState, useRef, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface VerificationModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  email?: string;
}

export default function VerificationModal({
  visible,
  onClose,
  onSuccess,
  email = '',
}: VerificationModalProps) {
  const [code, setCode] = useState<string>('');
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const inputRef = useRef<TextInput>(null);

  // Reset input when modal opens and focus
  useEffect(() => {
    if (visible) {
      setCode('');
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [visible]);

  const handleCodeChange = (text: string) => {
    const cleanText = text.replace(/[^0-9]/g, '').slice(0, 6);
    setCode(cleanText);

    // Auto-submit when 6 digits are filled
    if (cleanText.length === 6) {
      setTimeout(() => {
        onClose();
        if (onSuccess) {
          onSuccess();
        } else {
          router.replace('/');
        }
      }, 300);
    }
  };

  const handleResend = () => {
    setCode('');
    inputRef.current?.focus();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 justify-end sm:justify-center items-center bg-black/50 px-4"
      >
        {/* Backdrop touchable to dismiss */}
        <Pressable className="absolute inset-0" onPress={onClose} />

        {/* Modal Card Container */}
        <View className="w-full max-w-[440px] bg-white rounded-3xl p-6 sm:p-7 shadow-2xl z-10 mb-6 sm:mb-0 border border-neutral-border">
          {/* Header & Close */}
          <View className="flex-row items-center justify-between mb-4">
            <View className="w-9 h-9 rounded-full bg-purple-50 items-center justify-center">
              <Ionicons name="mail-unread-outline" size={20} color="#6C4EF5" />
            </View>
            <Pressable
              onPress={onClose}
              className="w-9 h-9 rounded-full bg-neutral-surface items-center justify-center active:opacity-70"
            >
              <Ionicons name="close" size={20} color="#6B7280" />
            </Pressable>
          </View>

          {/* Title & Description */}
          <Text className="font-poppins-bold text-2xl text-neutral-text-primary mb-1">
            Verification Code
          </Text>
          <Text className="font-poppins text-slate-500 text-sm leading-5 mb-6">
            We sent a 6-digit verification code to{' '}
            <Text className="font-poppins-semibold text-neutral-text-primary">
              {email || 'your email'}
            </Text>
            . Please enter it below.
          </Text>

          {/* 6 Digit Input Boxes Container */}
          <Pressable
            onPress={() => inputRef.current?.focus()}
            className="flex-row justify-between items-center mb-6 gap-2 relative"
          >
            {/* Hidden TextInput handling user input continuously without blur/keyboard dismiss */}
            <TextInput
              ref={inputRef}
              value={code}
              onChangeText={handleCodeChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              keyboardType="number-pad"
              maxLength={6}
              textContentType="oneTimeCode"
              autoComplete="one-time-code"
              caretHidden
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                opacity: 0,
                zIndex: 20,
              }}
            />

            {/* Visual 6 Digit Display Boxes */}
            {Array.from({ length: 6 }).map((_, index) => {
              const digit = code[index] || '';
              const isCurrentFocus =
                isFocused &&
                (index === code.length || (code.length === 6 && index === 5));

              return (
                <View
                  key={index}
                  className={`w-11 h-14 sm:w-12 sm:h-14 rounded-xl border items-center justify-center ${
                    digit
                      ? 'border-primary-purple bg-purple-50/40'
                      : isCurrentFocus
                      ? 'border-primary-purple bg-white shadow-sm'
                      : 'border-neutral-border bg-neutral-surface'
                  }`}
                >
                  <Text
                    className={`font-poppins-bold text-xl ${
                      digit ? 'text-primary-purple' : 'text-neutral-text-primary'
                    }`}
                  >
                    {digit}
                  </Text>
                </View>
              );
            })}
          </Pressable>

          {/* Resend Link & Footer */}
          <View className="flex-row items-center justify-center">
            <Text className="font-poppins text-xs text-slate-500">
              Didn't receive the code?{' '}
            </Text>
            <Pressable onPress={handleResend}>
              <Text className="font-poppins-semibold text-xs text-primary-purple underline">
                Resend Code
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
