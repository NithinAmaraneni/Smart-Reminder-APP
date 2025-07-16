// screens/CalendarScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { getReminders } from '../utils/storageHelper';

export default function CalendarScreen() {
  const [reminders, setReminders] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [remindersForDate, setRemindersForDate] = useState([]);

  useEffect(() => {
    (async () => {
      const all = await getReminders();
      setReminders(all);
    })();
  }, []);

  const onDayPress = (day) => {
    setSelectedDate(day.dateString);

    const filtered = reminders.filter(
      (reminder) => reminder.date.startsWith(day.dateString)
    );
    setRemindersForDate(filtered);
  };

  return (
    <View style={styles.container}>
      <View style={styles.banner}>
        <Text style={styles.bannerText}>Your Calendar of Reminders</Text>
      </View>

      <Calendar
        onDayPress={onDayPress}
        markedDates={{
          [selectedDate]: {
            selected: true,
            selectedColor: '#2e7d32',
          },
        }}
        theme={{
          backgroundColor: '#e8f5e9',
          calendarBackground: '#e8f5e9',
          textSectionTitleColor: '#1b5e20',
          selectedDayBackgroundColor: '#2e7d32',
          selectedDayTextColor: '#ffffff',
          todayTextColor: '#2e7d32',
          dayTextColor: '#1b5e20',
          arrowColor: '#2e7d32',
          monthTextColor: '#1b5e20',
        }}
      />

      <Text style={styles.header}>
        {selectedDate
          ? `Reminders for ${selectedDate}`
          : 'Tap a date to view reminders'}
      </Text>

      {selectedDate && remindersForDate.length === 0 ? (
        <Text style={styles.empty}>No reminders for this date.</Text>
      ) : (
        <FlatList
          data={remindersForDate}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.reminderItem}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.time}>{item.time}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12, backgroundColor: '#e8f5e9' },
  banner: {
    backgroundColor: '#c8e6c9',
    padding: 16,
    borderRadius: 12,
    marginBottom: 14,
    marginTop: 20,
  },
  bannerText: {
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
    color: '#1b5e20',
  },
  header: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 15,
    color: '#1b5e20',
    marginBottom: 10,
  },
  empty: {
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
  },
  reminderItem: {
    backgroundColor: '#c8e6c9',
    padding: 12,
    marginBottom: 10,
    borderRadius: 10,
    borderLeftColor: '#2e7d32',
    borderLeftWidth: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1b5e20',
  },
  time: {
    color: '#555',
    marginTop: 4,
  },
});
