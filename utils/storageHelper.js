// utils/storageHelper.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'REMINDERS';

export const getReminders = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY); // ✅ use constant
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Error reading reminders:', e);
    return [];
  }
};

export const saveReminders = async (reminders) => {
  try {
    const jsonValue = JSON.stringify(reminders);
    await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
  } catch (e) {
    console.error('Error saving reminders:', e);
  }
};
