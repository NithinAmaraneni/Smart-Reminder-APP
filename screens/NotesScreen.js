import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Swipeable } from 'react-native-gesture-handler';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function NotesScreen() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    const saved = await AsyncStorage.getItem('NOTES');
    if (saved) setNotes(JSON.parse(saved));
  };

  const saveNotes = async (data) => {
    await AsyncStorage.setItem('NOTES', JSON.stringify(data));
  };

  const handleAddOrUpdate = () => {
    if (!title.trim()) {
      Alert.alert('Title is required');
      return;
    }

    if (editingId) {
      const updated = notes.map((note) =>
        note.id === editingId ? { ...note, title, desc } : note
      );
      setNotes(updated);
      saveNotes(updated);
      setEditingId(null);
    } else {
      const newNote = {
        id: Date.now().toString(),
        title,
        desc,
      };
      const updated = [newNote, ...notes];
      setNotes(updated);
      saveNotes(updated);
    }

    setTitle('');
    setDesc('');
  };

  const handleDelete = (id) => {
    const updated = notes.filter((n) => n.id !== id);
    setNotes(updated);
    saveNotes(updated);
  };

  const handleEdit = (note) => {
    setTitle(note.title);
    setDesc(note.desc);
    setEditingId(note.id);
  };

  const renderRightActions = (id) => (
    <TouchableOpacity style={styles.deleteBox} onPress={() => handleDelete(id)}>
      <Ionicons name="trash" size={24} color="#fff" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Your Notes</Text>

      <TextInput
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
        placeholderTextColor="#888"
      />
      <TextInput
        placeholder="Description"
        value={desc}
        onChangeText={setDesc}
        style={[styles.input, { height: 80 }]}
        multiline
        placeholderTextColor="#888"
      />

      <Button
        title={editingId ? 'Update Note' : 'Add Note'}
        onPress={handleAddOrUpdate}
        color="#2e7d32"
      />

      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        style={{ marginTop: 20 }}
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInDown.delay(index * 80)}>
            <Swipeable renderRightActions={() => renderRightActions(item.id)}>
              <TouchableOpacity
                style={styles.noteItem}
                onPress={() => handleEdit(item)}
              >
                <Text style={styles.noteTitle}>{item.title}</Text>
                {item.desc ? <Text style={styles.noteDesc}>{item.desc}</Text> : null}
              </TouchableOpacity>
            </Swipeable>
          </Animated.View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#e8f5e9' },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1b5e20',
    marginBottom: 10,
    marginTop: 50,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    color: '#000',
  },
  noteItem: {
    backgroundColor: '#c8e6c9',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1b5e20',
  },
  noteDesc: {
    marginTop: 4,
    color: '#333',
  },
  deleteBox: {
    backgroundColor: '#e53935',
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    borderRadius: 10,
    marginVertical: 5,
  },
});
