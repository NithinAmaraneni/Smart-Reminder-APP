import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Switch,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { saveReminders } from '../utils/storageHelper';

export default function SettingsScreen() {
  const [defaultTone, setDefaultTone] = useState('default');
  const [dailySummary, setDailySummary] = useState(false);

  useEffect(() => {
    const loadTone = async () => {
      const savedTone = await AsyncStorage.getItem('DEFAULT_TONE');
      if (savedTone) setDefaultTone(savedTone);
    };
    loadTone();
  }, []);

  const changeTone = async (tone) => {
    setDefaultTone(tone);
    await AsyncStorage.setItem('DEFAULT_TONE', tone);
    Alert.alert('Tone Updated', `Default tone set to: ${tone}`);
  };

  const clearAllReminders = async () => {
    Alert.alert('Confirm', 'Are you sure you want to delete all reminders?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        onPress: async () => {
          await saveReminders([]);
          Alert.alert('Success', 'All reminders cleared');
        },
        style: 'destructive',
      },
    ]);
  };

  const toggleSummary = () => {
    setDailySummary(!dailySummary);
    // You can integrate logic here to schedule/cancel daily summary notifications
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Settings</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Default Reminder Tone:</Text>
        <View style={styles.toneRow}>
          {['default', 'chime', 'beep'].map((tone) => (
            <TouchableOpacity
              key={tone}
              style={[
                styles.toneBtn,
                defaultTone === tone && styles.toneBtnSelected,
              ]}
              onPress={() => changeTone(tone)}
            >
              <Text
                style={[
                  styles.toneText,
                  defaultTone === tone && styles.toneTextSelected,
                ]}
              >
                {tone}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Daily Summary:</Text>
        <Switch value={dailySummary} onValueChange={toggleSummary} />
      </View>

      <View style={styles.section}>
        <Button
          title="Clear All Reminders"
          onPress={clearAllReminders}
          color="#e53935"
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Smart Reminder App v1.0</Text>
        <Text style={styles.footerText}>© 2025 Nithin Amaraneni</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#e8f5e9', padding: 20 },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1b5e20',
    marginBottom: 20,
    marginTop: 50,
    textAlign: 'center',
  },
  section: {
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1b5e20',
    marginBottom: 8,
  },
  toneRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  toneBtn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#4caf50',
    backgroundColor: '#ffffff',
  },
  toneBtnSelected: {
    backgroundColor: '#4caf50',
  },
  toneText: {
    color: '#4caf50',
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  toneTextSelected: {
    color: '#ffffff',
  },
  footer: {
    marginTop: 330,
    alignItems: 'center',
  },
  footerText: {
    color: '#4caf50',
    fontSize: 14,
  },
});
