import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  Platform,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { api } from '@/services/api';
import { storage } from '@/services/storage';
import type { UserPreferences } from '@/types';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { InterestChip } from '@/components/preferences/InterestChip';
import { colors } from '@/constants/colors';

export default function PreferencesScreen() {
  const insets = useSafeAreaInsets();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // User selection
  const [allUsers, setAllUsers] = useState<string[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('');

  // Preferences form
  const [location, setLocation] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [newInterest, setNewInterest] = useState('');
  const [budgetMin, setBudgetMin] = useState('');
  const [budgetMax, setBudgetMax] = useState('');

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      const [users, currentUserId] = await Promise.all([
        api.getAllUsers(),
        storage.getUserId(),
      ]);

      setAllUsers(users);

      // Use stored userId or first available user
      const initialUserId = currentUserId || (users.length > 0 ? users[0] : '');
      if (initialUserId) {
        setSelectedUserId(initialUserId);
        await loadUserPreferences(initialUserId);
      }
    } catch (error) {
      console.error('Failed to load initial data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserPreferences = async (userId: string) => {
    try {
      const prefs = await api.getPreferences(userId);
      setLocation(prefs.location || '');
      setInterests(prefs.interests || []);
      setBudgetMin(prefs.budget_min?.toString() || '');
      setBudgetMax(prefs.budget_max?.toString() || '');
    } catch (error) {
      console.error('Failed to load preferences:', error);
    }
  };

  const handleUserChange = useCallback(async (userId: string) => {
    setSelectedUserId(userId);
    await storage.setUserId(userId);
    await loadUserPreferences(userId);
  }, []);

  const handleAddInterest = useCallback(() => {
    const trimmed = newInterest.trim();
    if (trimmed && !interests.includes(trimmed)) {
      setInterests([...interests, trimmed]);
      setNewInterest('');
    }
  }, [newInterest, interests]);

  const handleRemoveInterest = useCallback(
    (index: number) => {
      setInterests(interests.filter((_, i) => i !== index));
    },
    [interests]
  );

  const handleSave = useCallback(async () => {
    if (!selectedUserId) return;

    try {
      setIsSaving(true);
      setSaveSuccess(false);

      await api.updatePreferences(selectedUserId, {
        location: location || undefined,
        interests,
        budget_min: budgetMin ? parseFloat(budgetMin) : undefined,
        budget_max: budgetMax ? parseFloat(budgetMax) : undefined,
      });

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (error) {
      console.error('Failed to save preferences:', error);
      Alert.alert('Error', 'Failed to save preferences. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }, [selectedUserId, location, interests, budgetMin, budgetMax]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
      keyboardShouldPersistTaps="handled"
    >
      <View className="p-4">
        {/* User Selector */}
        <View className="mb-6">
          <Text className="text-base font-semibold text-gray-900 mb-2">
            Select User
          </Text>
          <View className="border border-gray-200 rounded-xl bg-gray-50 overflow-hidden">
            <Picker
              selectedValue={selectedUserId}
              onValueChange={handleUserChange}
              style={{
                height: Platform.OS === 'ios' ? 150 : 50,
                color: colors.gray900,
              }}
            >
              {allUsers.map((user) => (
                <Picker.Item key={user} label={user} value={user} />
              ))}
            </Picker>
          </View>
        </View>

        {/* Location */}
        <View className="mb-6">
          <Text className="text-base font-semibold text-gray-900 mb-2">
            Location
          </Text>
          <TextInput
            value={location}
            onChangeText={setLocation}
            placeholder="e.g., San Francisco, CA"
            placeholderTextColor={colors.gray400}
            className="border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900 bg-gray-50"
          />
        </View>

        {/* Interests */}
        <View className="mb-6">
          <Text className="text-base font-semibold text-gray-900 mb-2">
            Interests
          </Text>

          {/* Interest Chips */}
          {interests.length > 0 && (
            <View className="flex-row flex-wrap mb-3">
              {interests.map((interest, index) => (
                <InterestChip
                  key={index}
                  interest={interest}
                  onRemove={() => handleRemoveInterest(index)}
                />
              ))}
            </View>
          )}

          {/* Add Interest Input */}
          <View className="flex-row gap-2">
            <TextInput
              value={newInterest}
              onChangeText={setNewInterest}
              onSubmitEditing={handleAddInterest}
              placeholder="Add an interest..."
              placeholderTextColor={colors.gray400}
              className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900 bg-gray-50"
            />
            <Pressable
              onPress={handleAddInterest}
              className="bg-rose-500 rounded-xl px-4 items-center justify-center active:bg-rose-600"
            >
              <Ionicons name="add" size={24} color={colors.white} />
            </Pressable>
          </View>
        </View>

        {/* Budget */}
        <View className="mb-8">
          <Text className="text-base font-semibold text-gray-900 mb-2">
            Budget Range
          </Text>
          <View className="flex-row gap-3">
            <View className="flex-1">
              <Text className="text-xs text-gray-500 mb-1">Minimum ($)</Text>
              <TextInput
                value={budgetMin}
                onChangeText={setBudgetMin}
                placeholder="0"
                placeholderTextColor={colors.gray400}
                keyboardType="numeric"
                className="border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900 bg-gray-50"
              />
            </View>
            <View className="flex-1">
              <Text className="text-xs text-gray-500 mb-1">Maximum ($)</Text>
              <TextInput
                value={budgetMax}
                onChangeText={setBudgetMax}
                placeholder="100"
                placeholderTextColor={colors.gray400}
                keyboardType="numeric"
                className="border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-900 bg-gray-50"
              />
            </View>
          </View>
        </View>

        {/* Save Button */}
        <Pressable
          onPress={handleSave}
          disabled={isSaving}
          className={`rounded-xl py-4 items-center ${
            saveSuccess
              ? 'bg-green-500'
              : isSaving
              ? 'bg-gray-300'
              : 'bg-rose-500 active:bg-rose-600'
          }`}
        >
          {saveSuccess ? (
            <View className="flex-row items-center">
              <Ionicons name="checkmark-circle" size={20} color={colors.white} />
              <Text className="text-white font-semibold text-base ml-2">
                Saved!
              </Text>
            </View>
          ) : (
            <Text className="text-white font-semibold text-base">
              {isSaving ? 'Saving...' : 'Save Preferences'}
            </Text>
          )}
        </Pressable>
      </View>
    </ScrollView>
  );
}

