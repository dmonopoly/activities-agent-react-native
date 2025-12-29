import { View, Text, Pressable, ScrollView } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';

interface DrawerContentProps {
  userId?: string;
}

interface NavItem {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: '/' | '/history' | '/preferences';
}

const navItems: NavItem[] = [
  { label: 'New Chat', icon: 'chatbubble-outline', route: '/' },
  { label: 'Chat History', icon: 'time-outline', route: '/history' },
  { label: 'Preferences', icon: 'settings-outline', route: '/preferences' },
];

export function DrawerContent({ userId }: DrawerContentProps) {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  const isActive = (route: string) => {
    if (route === '/') return pathname === '/' || pathname.startsWith('/chat');
    return pathname === route;
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top + 16, flexGrow: 1 }}
      >
        {/* Header */}
        <View className="px-6 pb-6 border-b border-gray-200">
          <Pressable onPress={() => router.push('/')}>
            <Text className="text-2xl font-bold text-rose-500">
              Activities Agent
            </Text>
          </Pressable>
        </View>

        {/* Navigation Items */}
        <View className="px-4 py-4">
          {navItems.map((item) => {
            const active = isActive(item.route);
            return (
              <Pressable
                key={item.route}
                onPress={() => router.push(item.route)}
                className={`flex-row items-center px-4 py-3 rounded-xl mb-1 ${
                  active ? 'bg-rose-50' : 'active:bg-gray-100'
                }`}
              >
                <Ionicons
                  name={item.icon}
                  size={22}
                  color={active ? colors.rose500 : colors.gray500}
                />
                <Text
                  className={`ml-3 text-base font-medium ${
                    active ? 'text-rose-500' : 'text-gray-700'
                  }`}
                >
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      {/* User Badge */}
      {userId && (
        <Pressable
          onPress={() => router.push('/preferences')}
          className="px-6 py-4 border-t border-gray-200 active:bg-gray-50"
          style={{ paddingBottom: insets.bottom + 16 }}
        >
          <View className="flex-row items-center">
            <View className="w-10 h-10 rounded-full bg-rose-100 items-center justify-center">
              <Ionicons name="person" size={20} color={colors.rose500} />
            </View>
            <View className="ml-3 flex-1">
              <Text className="text-xs text-gray-400">Current User</Text>
              <Text
                className="text-sm font-medium text-gray-900"
                numberOfLines={1}
              >
                {userId}
              </Text>
            </View>
          </View>
        </Pressable>
      )}
    </View>
  );
}

