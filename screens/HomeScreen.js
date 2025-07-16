import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { getReminders, saveReminders } from '../utils/storageHelper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Swipeable } from 'react-native-gesture-handler';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function HomeScreen({ navigation }) {
  const [reminders, setReminders] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) loadReminders();
  }, [isFocused]);

  const loadReminders = async () => {
    const data = await getReminders();
    setReminders(data);
  };

  const deleteReminder = async (id) => {
    const updated = reminders.filter((r) => r.id !== id);
    setReminders(updated);
    await saveReminders(updated);
  };

  const renderRightActions = (id) => (
    <TouchableOpacity onPress={() => deleteReminder(id)} style={styles.deleteBox}>
      <Text style={styles.deleteText}>Delete</Text>
    </TouchableOpacity>
  );

  const renderItem = ({ item }) => (
    <Swipeable renderRightActions={() => renderRightActions(item.id)}>
      <View style={styles.reminderItem}>
        <Text style={styles.reminderTitle}>{item.title}</Text>
        <Text style={styles.reminderTime}>{item.time}</Text>
      </View>
    </Swipeable>
  );

  return (
    <View style={styles.container}>
      <View style={styles.banner}>
        <Text style={styles.bannerText}>Stay on track. Stay productive!</Text>
      </View>

      <View style={styles.gridWrapper}>
        {[
          {
            name: 'Add Reminder',
            icon: 'add-circle',
            color: '#2e7d32',
            action: () => navigation.navigate('AddReminder'),
          },
          {
            name: 'Calendar',
            icon: 'calendar',
            color: '#43a047',
            action: () => navigation.navigate('Calendar'),
          },
          {
            name: 'Tasks',
            icon: 'book-outline',
            color: '#fbc02d',
            action: () => alert('Tasks feature coming soon!'),
          },
          {
            name: 'Routines',
            icon: 'alarm',
            color: '#e53935',
            action: () => alert('Routines feature coming soon!'),
          },
        ].map((item, i) => (
          <Animated.View
            key={item.name}
            entering={FadeInDown.delay(i * 100)}
            style={styles.gridItemWrapper}
          >
            <TouchableOpacity style={styles.gridItem} onPress={item.action}>
              <Ionicons name={item.icon} size={30} color={item.color} />
              <Text style={styles.gridText}>{item.name}</Text>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Your Reminders</Text>

      {reminders.length === 0 ? (
        <Text style={styles.emptyText}>No reminders yet</Text>
      ) : (
        <FlatList
          data={reminders}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#e8f5e9' },
  banner: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 19,
    marginTop: 51,
    elevation: 2,
    backgroundColor: '#c8e6c9',
  },
  bannerText: {
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
    color: '#1b5e20',
  },
  gridWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  gridItemWrapper: {
    width: '48%',
    aspectRatio: 1,
    marginBottom: 12,
  },
  gridItem: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  gridText: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1b5e20',
  },
  reminderItem: {
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    borderLeftWidth: 4,
    backgroundColor: '#c8e6c9',
    borderLeftColor: '#2e7d32',
  },
  reminderTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1b5e20',
  },
  reminderTime: {
    color: '#555',
    marginTop: 4,
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 10,
  },
  deleteBox: {
    backgroundColor: '#e53935',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    borderRadius: 10,
    marginVertical: 5,
  },
  deleteText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
