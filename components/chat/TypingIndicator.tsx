import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

export function TypingIndicator() {
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

  return (
    <View className="flex-row items-center justify-start">
      <View className="bg-gray-100 rounded-2xl px-4 py-3 flex-row items-center gap-1">
        <Animated.View
          style={animatedStyle1}
          className="w-2 h-2 bg-gray-400 rounded-full"
        />
        <Animated.View
          style={animatedStyle2}
          className="w-2 h-2 bg-gray-400 rounded-full"
        />
        <Animated.View
          style={animatedStyle3}
          className="w-2 h-2 bg-gray-400 rounded-full"
        />
      </View>
    </View>
  );
}

