import { Modal, Pressable, Text, View } from "react-native";

import { useTheme } from "@/contexts/ThemeContext";

interface ConfirmModalProps {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  visible,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isDestructive = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const { colors: themeColors } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View className="flex-1 items-center justify-center bg-black/50 p-4">
        <View
          className="w-full max-w-sm rounded-2xl p-6 shadow-xl"
          style={{ backgroundColor: themeColors.card }}
        >
          <Text
            className="mb-2 text-lg font-semibold"
            style={{ color: themeColors.text }}
          >
            {title}
          </Text>
          <Text className="mb-6" style={{ color: themeColors.textSecondary }}>
            {message}
          </Text>

          <View className="flex-row justify-end gap-3">
            <Pressable
              onPress={onCancel}
              className="rounded-lg px-4 py-2 active:opacity-70"
              style={{ backgroundColor: themeColors.backgroundSecondary }}
            >
              <Text
                className="text-sm font-medium"
                style={{ color: themeColors.text }}
              >
                {cancelLabel}
              </Text>
            </Pressable>

            <Pressable
              onPress={onConfirm}
              className={`rounded-lg px-4 py-2 ${
                isDestructive
                  ? "bg-red-500 active:bg-red-600"
                  : "bg-rose-500 active:bg-rose-600"
              }`}
            >
              <Text className="text-sm font-medium text-white">
                {confirmLabel}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
