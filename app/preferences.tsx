import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";

import { InterestChip } from "@/components/preferences/InterestChip";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { colors } from "@/constants/colors";
import { useTheme } from "@/contexts/ThemeContext";
import { useUser } from "@/contexts/UserContext";
import { api } from "@/services/api";

export default function PreferencesScreen() {
  const insets = useSafeAreaInsets();
  const { userId, allUsers, isLoading: isUserLoading, setUserId } = useUser();
  const { colors: themeColors, isDark } = useTheme();

  const [isLoadingPrefs, setIsLoadingPrefs] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Preferences form
  const [location, setLocation] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [newInterest, setNewInterest] = useState("");
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");

  // Load preferences when userId changes
  useEffect(() => {
    if (userId) {
      loadUserPreferences(userId);
    }
  }, [userId]);

  const loadUserPreferences = async (id: string) => {
    try {
      setIsLoadingPrefs(true);
      const prefs = await api.getPreferences(id);
      setLocation(prefs.location || "");
      setInterests(prefs.interests || []);
      setBudgetMin(prefs.budget_min?.toString() || "");
      setBudgetMax(prefs.budget_max?.toString() || "");
    } catch (error) {
      console.error("Failed to load preferences:", error);
    } finally {
      setIsLoadingPrefs(false);
    }
  };

  const handleUserChange = useCallback(
    async (newUserId: string) => {
      await setUserId(newUserId);
    },
    [setUserId]
  );

  const handleAddInterest = useCallback(() => {
    const trimmed = newInterest.trim();
    if (trimmed && !interests.includes(trimmed)) {
      setInterests([...interests, trimmed]);
      setNewInterest("");
    }
  }, [newInterest, interests]);

  const handleRemoveInterest = useCallback(
    (index: number) => {
      setInterests(interests.filter((_, i) => i !== index));
    },
    [interests]
  );

  const handleSave = useCallback(async () => {
    if (!userId) return;

    try {
      setIsSaving(true);
      setSaveSuccess(false);

      await api.updatePreferences(userId, {
        location: location || undefined,
        interests,
        budget_min: budgetMin ? parseFloat(budgetMin) : undefined,
        budget_max: budgetMax ? parseFloat(budgetMax) : undefined,
      });

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (error) {
      console.error("Failed to save preferences:", error);
      Alert.alert("Error", "Failed to save preferences. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }, [userId, location, interests, budgetMin, budgetMax]);

  if (isUserLoading) {
    return <LoadingSpinner />;
  }

  return (
    <ScrollView
      className="flex-1"
      style={{ backgroundColor: themeColors.background }}
      contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
      keyboardShouldPersistTaps="handled"
    >
      <View className="p-4">
        {/* Page Header */}
        <View className="mb-6">
          <Text
            className="mb-1 text-2xl font-bold"
            style={{ color: themeColors.text }}
          >
            Your Preferences
          </Text>
          <Text
            className="text-base"
            style={{ color: themeColors.textSecondary }}
          >
            Help us find the ideal activities for you!
          </Text>
        </View>

        {/* User Selector Card */}
        <View
          className="mb-6 rounded-xl p-4"
          style={{
            backgroundColor: themeColors.primaryLight,
            borderWidth: 1,
            borderColor: themeColors.primaryBorder,
          }}
        >
          <Text
            className="mb-2 text-sm font-semibold"
            style={{ color: isDark ? colors.rose200 : colors.rose700 }}
          >
            Select User Profile
          </Text>
          <View
            className="picker-wrapper overflow-hidden rounded-xl"
            style={{
              backgroundColor: themeColors.inputBackground,
              borderWidth: 1,
              borderColor: themeColors.primaryBorder,
            }}
          >
            <Picker
              selectedValue={userId}
              onValueChange={handleUserChange}
              style={{
                height: Platform.OS === "ios" ? 150 : 50,
                color: themeColors.text,
                backgroundColor: themeColors.inputBackground,
              }}
              dropdownIconColor={themeColors.text}
            >
              {allUsers.map((user) => (
                <Picker.Item
                  key={user}
                  label={user}
                  value={user}
                  color={isDark ? themeColors.text : colors.gray900}
                  style={{ backgroundColor: themeColors.inputBackground }}
                />
              ))}
            </Picker>
          </View>
          <Text className="mt-2 text-xs" style={{ color: colors.rose500 }}>
            Switching users will load their saved preferences
          </Text>
        </View>

        {isLoadingPrefs ? (
          <View className="py-8">
            <LoadingSpinner size="small" />
          </View>
        ) : (
          <>
            {/* Location */}
            <View className="mb-6">
              <Text
                className="mb-2 text-base font-semibold"
                style={{ color: themeColors.text }}
              >
                Location
              </Text>
              <TextInput
                value={location}
                onChangeText={setLocation}
                placeholder="e.g., San Francisco, CA"
                placeholderTextColor={themeColors.inputPlaceholder}
                className="rounded-xl px-4 py-3 text-base"
                style={{
                  backgroundColor: themeColors.inputBackground,
                  borderWidth: 1,
                  borderColor: themeColors.inputBorder,
                  color: themeColors.inputText,
                }}
              />
            </View>

            {/* Interests */}
            <View className="mb-6">
              <Text
                className="mb-2 text-base font-semibold"
                style={{ color: themeColors.text }}
              >
                Interests
              </Text>

              {/* Interest Chips */}
              {interests.length > 0 && (
                <View className="mb-3 flex-row flex-wrap">
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
                  placeholderTextColor={themeColors.inputPlaceholder}
                  className="flex-1 rounded-xl px-4 py-3 text-base"
                  style={{
                    backgroundColor: themeColors.inputBackground,
                    borderWidth: 1,
                    borderColor: themeColors.inputBorder,
                    color: themeColors.inputText,
                  }}
                />
                <Pressable
                  onPress={handleAddInterest}
                  className="items-center justify-center rounded-xl bg-rose-500 px-4 active:bg-rose-600"
                >
                  <Ionicons name="add" size={24} color={colors.white} />
                </Pressable>
              </View>
            </View>

            {/* Budget */}
            <View className="mb-8">
              <Text
                className="mb-2 text-base font-semibold"
                style={{ color: themeColors.text }}
              >
                Budget Range
              </Text>
              <View className="flex-row gap-3">
                <View className="flex-1">
                  <Text
                    className="mb-1 text-xs"
                    style={{ color: themeColors.textSecondary }}
                  >
                    Minimum ($)
                  </Text>
                  <TextInput
                    value={budgetMin}
                    onChangeText={setBudgetMin}
                    placeholder="0"
                    placeholderTextColor={themeColors.inputPlaceholder}
                    keyboardType="numeric"
                    className="rounded-xl px-4 py-3 text-base"
                    style={{
                      backgroundColor: themeColors.inputBackground,
                      borderWidth: 1,
                      borderColor: themeColors.inputBorder,
                      color: themeColors.inputText,
                    }}
                  />
                </View>
                <View className="flex-1">
                  <Text
                    className="mb-1 text-xs"
                    style={{ color: themeColors.textSecondary }}
                  >
                    Maximum ($)
                  </Text>
                  <TextInput
                    value={budgetMax}
                    onChangeText={setBudgetMax}
                    placeholder="100"
                    placeholderTextColor={themeColors.inputPlaceholder}
                    keyboardType="numeric"
                    className="rounded-xl px-4 py-3 text-base"
                    style={{
                      backgroundColor: themeColors.inputBackground,
                      borderWidth: 1,
                      borderColor: themeColors.inputBorder,
                      color: themeColors.inputText,
                    }}
                  />
                </View>
              </View>
            </View>

            {/* Save Button */}
            <Pressable
              onPress={handleSave}
              disabled={isSaving}
              className={`items-center rounded-xl py-4 ${
                saveSuccess
                  ? "bg-green-500"
                  : isSaving
                    ? "bg-gray-300"
                    : "bg-rose-500 active:bg-rose-600"
              }`}
            >
              {saveSuccess ? (
                <View className="flex-row items-center">
                  <Ionicons
                    name="checkmark-circle"
                    size={20}
                    color={colors.white}
                  />
                  <Text className="ml-2 text-base font-semibold text-white">
                    Saved!
                  </Text>
                </View>
              ) : (
                <Text className="text-base font-semibold text-white">
                  {isSaving ? "Saving..." : "Save Preferences"}
                </Text>
              )}
            </Pressable>
          </>
        )}
      </View>
    </ScrollView>
  );
}
