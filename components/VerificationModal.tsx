import React, { useState, useRef, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface VerificationModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  email?: string;
  onVerify?: (code: string) => Promise<{ success: boolean; error?: string }>;
  onResend?: () => Promise<{ success: boolean; error?: string }>;
}

export default function VerificationModal({
  visible,
  onClose,
  onSuccess,
  email = '',
  onVerify,
  onResend,
}: VerificationModalProps) {
  const [code, setCode] = useState<string>('');
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [resendStatus, setResendStatus] = useState<string | null>(null);
  const inputRef = useRef<TextInput>(null);

  // Reset input when modal opens and focus
  useEffect(() => {
    if (visible) {
      setCode('');
      setErrorMsg(null);
      setResendStatus(null);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [visible]);

  const handleCodeChange = async (text: string) => {
    const cleanText = text.replace(/[^0-9]/g, '').slice(0, 6);
    setCode(cleanText);
    setErrorMsg(null);

    // Auto-submit when 6 digits are filled
    if (cleanText.length === 6 && !isSubmitting) {
      if (onVerify) {
        setIsSubmitting(true);
        const result = await onVerify(cleanText);
        setIsSubmitting(false);

        if (result.success) {
          onClose();
          if (onSuccess) {
            onSuccess();
          }
        } else {
          setErrorMsg(result.error || 'Verification failed. Please check your code.');
        }
      } else {
        setTimeout(() => {
          onClose();
          if (onSuccess) {
            onSuccess();
          }
        }, 300);
      }
    }
  };

  const handleResend = async () => {
    setCode('');
    setErrorMsg(null);
    if (onResend) {
      const result = await onResend();
      if (result.success) {
        setResendStatus('Code resent successfully!');
      } else {
        setErrorMsg(result.error || 'Failed to resend code.');
      }
    }
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
          <Text className="font-poppins text-slate-500 text-sm leading-5 mb-4">
            We sent a 6-digit verification code to{' '}
            <Text className="font-poppins-semibold text-neutral-text-primary">
              {email || 'your email'}
            </Text>
            . Please enter it below.
          </Text>

          {/* Error / Resend status feedback */}
          {errorMsg ? (
            <View className="mb-3 p-3 bg-red-50 rounded-xl border border-red-200">
              <Text className="font-poppins text-xs text-red-600 font-medium">
                {errorMsg}
              </Text>
            </View>
          ) : null}

          {resendStatus ? (
            <View className="mb-3 p-3 bg-green-50 rounded-xl border border-green-200">
              <Text className="font-poppins text-xs text-green-700 font-medium">
                {resendStatus}
              </Text>
            </View>
          ) : null}

          {/* 6 Digit Input Boxes Container */}
          <Pressable
            onPress={() => inputRef.current?.focus()}
            className="flex-row justify-between items-center mb-6 gap-2 relative"
          >
            {/* Hidden TextInput handling user input continuously */}
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
              editable={!isSubmitting}
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

          {/* Loading Indicator or Resend Link */}
          {isSubmitting ? (
            <View className="flex-row items-center justify-center py-1">
              <ActivityIndicator color="#6C4EF5" size="small" />
              <Text className="font-poppins text-xs text-slate-500 ml-2">
                Verifying code...
              </Text>
            </View>
          ) : (
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
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
