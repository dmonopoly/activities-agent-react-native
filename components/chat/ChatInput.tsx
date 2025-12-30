import { useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { colors } from "@/constants/colors";
import { useTheme } from "@/contexts/ThemeContext";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled = false }: ChatInputProps) {
  const [text, setText] = useState("");
  const inputRef = useRef<TextInput>(null);
  const insets = useSafeAreaInsets();
  const { colors: themeColors } = useTheme();

  const handleSend = () => {
    if (text.trim() && !disabled) {
      onSend(text.trim());
      setText("");
    }
  };

  const handleSubmitEditing = () => {
    handleSend();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <View
        className="px-4 py-3"
        style={{
          backgroundColor: themeColors.background,
          borderTopWidth: 1,
          borderTopColor: themeColors.border,
          paddingBottom: Math.max(insets.bottom, 12),
        }}
      >
        <View
          className="chat-input-wrapper flex-row items-end rounded-3xl px-4 py-2"
          style={{ backgroundColor: themeColors.inputBackground }}
        >
          <TextInput
            ref={inputRef}
            value={text}
            onChangeText={setText}
            onSubmitEditing={handleSubmitEditing}
            placeholder="Ask about activities..."
            placeholderTextColor={themeColors.inputPlaceholder}
            multiline
            maxLength={2000}
            editable={!disabled}
            className="max-h-32 flex-1 py-1 text-base"
            style={{
              textAlignVertical: "center",
              color: themeColors.inputText,
            }}
          />

          {text.trim().length > 0 && (
            <Pressable
              onPress={handleSend}
              disabled={disabled}
              className={`ml-2 h-9 w-9 items-center justify-center rounded-full ${
                disabled ? "bg-gray-300" : "bg-rose-500 active:bg-rose-600"
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
