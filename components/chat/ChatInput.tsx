import { useState, useRef } from 'react';
import {
  View,
  TextInput,
  Pressable,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled = false }: ChatInputProps) {
  const [text, setText] = useState('');
  const inputRef = useRef<TextInput>(null);
  const insets = useSafeAreaInsets();

  const handleSend = () => {
    if (text.trim() && !disabled) {
      onSend(text.trim());
      setText('');
    }
  };

  const handleSubmitEditing = () => {
    handleSend();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View
        className="bg-white border-t border-gray-200 px-4 py-3"
        style={{ paddingBottom: Math.max(insets.bottom, 12) }}
      >
        <View className="flex-row items-end bg-gray-100 rounded-3xl px-4 py-2">
          <TextInput
            ref={inputRef}
            value={text}
            onChangeText={setText}
            onSubmitEditing={handleSubmitEditing}
            placeholder="Ask about activities..."
            placeholderTextColor={colors.gray400}
            multiline
            maxLength={2000}
            editable={!disabled}
            className="flex-1 text-base text-gray-900 max-h-32 py-1"
            style={{ textAlignVertical: 'center' }}
          />
          
          {text.trim().length > 0 && (
            <Pressable
              onPress={handleSend}
              disabled={disabled}
              className={`ml-2 w-9 h-9 rounded-full items-center justify-center ${
                disabled ? 'bg-gray-300' : 'bg-rose-500 active:bg-rose-600'
              }`}
            >
              <Ionicons name="arrow-up" size={20} color={colors.white} />
            </Pressable>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

