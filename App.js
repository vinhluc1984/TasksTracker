import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [text, setText] = useState('');
  const [reminders, setReminders] = useState([]);

  // Load reminders from browser storage when the app opens
  useEffect(() => {
    const loadData = async () => {
      try {
        const saved = await AsyncStorage.getItem('@tasks_tracker');
        if (saved) setReminders(JSON.parse(saved));
      } catch (e) { console.log("Error loading data"); }
    };
    loadData();
  }, []);

  // Save a new reminder
  const addReminder = async () => {
    if (text.trim().length === 0) return;
    const updated = [...reminders, { id: Date.now().toString(), title: text }];
    setReminders(updated);
    await AsyncStorage.setItem('@tasks_tracker', JSON.stringify(updated));
    setText('');
  };

  // Delete a reminder
  const removeReminder = async (id) => {
    const updated = reminders.filter(item => item.id !== id);
    setReminders(updated);
    await AsyncStorage.setItem('@tasks_tracker', JSON.stringify(updated));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.header}>Daily Reminders</Text>
        
        <View style={styles.inputArea}>
          <TextInput 
            style={styles.input} 
            placeholder="What needs to be done?" 
            value={text} 
            onChangeText={setText} 
          />
          <TouchableOpacity style={styles.button} onPress={addReminder}>
            <Text style={styles.buttonText}>Add</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={reminders}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.itemText}>{item.title}</Text>
              <TouchableOpacity onPress={() => removeReminder(item.id)}>
                <Text style={styles.deleteText}>✕</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  innerContainer: { padding: 30, flex: 1 },
  header: { fontSize: 32, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  inputArea: { flexDirection: 'row', marginBottom: 20 },
  input: { 
    flex: 1, 
    backgroundColor: '#fff', 
    padding: 15, 
    borderRadius: 10, 
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ddd'
  },
  button: { 
    backgroundColor: '#007AFF', 
    paddingHorizontal: 20, 
    justifyContent: 'center', 
    borderRadius: 10 
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  item: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    padding: 20, 
    backgroundColor: '#fff', 
    borderRadius: 12, 
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    elevation: 2
  },
  itemText: { fontSize: 18, color: '#444' },
  deleteText: { color: '#FF3B30', fontSize: 20, fontWeight: 'bold' }
});