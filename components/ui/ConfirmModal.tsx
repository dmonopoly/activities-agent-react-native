import { View, Text, Modal, Pressable } from 'react-native';

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
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDestructive = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View className="flex-1 bg-black/50 items-center justify-center p-4">
        <View className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
          <Text className="text-lg font-semibold text-gray-900 mb-2">
            {title}
          </Text>
          <Text className="text-gray-600 mb-6">{message}</Text>

          <View className="flex-row justify-end gap-3">
            <Pressable
              onPress={onCancel}
              className="px-4 py-2 bg-gray-100 rounded-lg active:bg-gray-200"
            >
              <Text className="text-sm font-medium text-gray-700">
                {cancelLabel}
              </Text>
            </Pressable>

            <Pressable
              onPress={onConfirm}
              className={`px-4 py-2 rounded-lg ${
                isDestructive
                  ? 'bg-red-500 active:bg-red-600'
                  : 'bg-rose-500 active:bg-rose-600'
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

