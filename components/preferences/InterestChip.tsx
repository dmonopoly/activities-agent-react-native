import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';

interface InterestChipProps {
  interest: string;
  onRemove: () => void;
}

export function InterestChip({ interest, onRemove }: InterestChipProps) {
  return (
    <View className="flex-row items-center bg-rose-50 border border-rose-200 rounded-full px-3 py-1.5 mr-2 mb-2">
      <Text className="text-rose-600 text-sm font-medium mr-1">{interest}</Text>
      <Pressable
        onPress={onRemove}
        className="ml-1 active:opacity-60"
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Ionicons name="close-circle" size={16} color={colors.rose500} />
      </Pressable>
    </View>
  );
}

