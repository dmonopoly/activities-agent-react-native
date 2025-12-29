import { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { StatusBar } from 'expo-status-bar';
import { storage } from '@/services/storage';
import { DrawerContent } from '@/components/ui/DrawerContent';
import { colors } from '@/constants/colors';
import '../global.css';

export default function RootLayout() {
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    storage.getOrCreateUserId().then(setUserId);
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <Drawer
        screenOptions={{
          headerShown: true,
          headerStyle: {
            backgroundColor: colors.white,
          },
          headerTintColor: colors.rose500,
          headerTitleStyle: {
            fontWeight: '600',
            color: colors.gray900,
          },
          headerShadowVisible: true,
          drawerStyle: {
            width: 280,
          },
          swipeEnabled: true,
        }}
        drawerContent={() => <DrawerContent userId={userId} />}
      >
        <Drawer.Screen
          name="index"
          options={{
            title: 'Activities Agent',
          }}
        />
        <Drawer.Screen
          name="history"
          options={{
            title: 'Chat History',
          }}
        />
        <Drawer.Screen
          name="preferences"
          options={{
            title: 'Preferences',
          }}
        />
        <Drawer.Screen
          name="chat/[id]"
          options={{
            title: 'Chat',
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}

