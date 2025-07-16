import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Platform,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { saveReminders, getReminders } from '../utils/storageHelper';
import { scheduleNotification } from '../utils/notificationHelper';

export default function AddReminderScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [tone, setTone] = useState('default');

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const handleTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || date;
    setShowTimePicker(Platform.OS === 'ios');
    const updatedDate = new Date(date);
    updatedDate.setHours(currentTime.getHours());
    updatedDate.setMinutes(currentTime.getMinutes());
    setDate(updatedDate);
  };

  const toggleTone = () => {
    const nextTone = tone === 'default' ? 'alert' : tone === 'alert' ? 'chime' : 'default';
    setTone(nextTone);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      alert("Title can't be empty");
      return;
    }

    const newReminder = {
      id: Date.now().toString(),
      title,
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: date.toISOString(),
      tone,
    };

    try {
      const notificationId = await scheduleNotification(newReminder, tone);
      newReminder.notificationId = notificationId;

      const existing = await getReminders();
      const updated = [...existing, newReminder];
      await saveReminders(updated);

      console.log('Reminder saved:', newReminder);
      navigation.goBack();
    } catch (err) {
      console.error('Failed to save reminder:', err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Add New Reminder</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Reminder Title:</Text>
        <TextInput
          placeholder="e.g. Take medicine"
          value={title}
          onChangeText={setTitle}
          style={styles.input}
          placeholderTextColor="#888"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Date:</Text>
        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.button}>
          <Text style={styles.buttonText}>{date.toDateString()}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Time:</Text>
        <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.button}>
          <Text style={styles.buttonText}>
            {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </TouchableOpacity>
        {showTimePicker && (
          <DateTimePicker
            value={date}
            mode="time"
            display="default"
            onChange={handleTimeChange}
          />
        )}
      </View>

      <View style={styles.saveBtn}>
        <Button title="Save Reminder" onPress={handleSave} color="#2e7d32" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#e8f5e9',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1b5e20',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#1b5e20',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    color: '#000',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
  },
  button: {
    backgroundColor: '#c8e6c9',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#1b5e20',
    fontWeight: '600',
  },
  saveBtn: {
    marginTop: 30,
  },
});
