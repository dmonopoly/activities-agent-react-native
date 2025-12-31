import { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { colors } from "@/constants/colors";
import { useTheme } from "@/contexts/ThemeContext";

export function TypingIndicator() {
  const { colors: themeColors } = useTheme();
  const dot1 = useSharedValue(0);
  const dot2 = useSharedValue(0);
  const dot3 = useSharedValue(0);

  useEffect(() => {
    const animation = (delay: number) =>
      withDelay(
        delay,
        withRepeat(
          withSequence(
            withTiming(-6, { duration: 300 }),
            withTiming(0, { duration: 300 })
          ),
          -1,
          false
        )
      );

    dot1.value = animation(0);
    dot2.value = animation(150);
    dot3.value = animation(300);
  }, [dot1, dot2, dot3]);

  const animatedStyle1 = useAnimatedStyle(() => ({
    transform: [{ translateY: dot1.value }],
  }));

  const animatedStyle2 = useAnimatedStyle(() => ({
    transform: [{ translateY: dot2.value }],
  }));

  const animatedStyle3 = useAnimatedStyle(() => ({
    transform: [{ translateY: dot3.value }],
  }));

  const dotStyle = {
    backgroundColor: colors.gray400,
    width: 8,
    height: 8,
    borderRadius: 4,
  };

  return (
    <View className="flex-row items-center justify-start">
      <View
        className="flex-row items-center gap-1 rounded-2xl px-4 py-3"
        style={{ backgroundColor: themeColors.assistantBubble }}
      >
        <Animated.View style={[animatedStyle1, dotStyle]} />
        <Animated.View style={[animatedStyle2, dotStyle]} />
        <Animated.View style={[animatedStyle3, dotStyle]} />
      </View>
    </View>
  );
}
