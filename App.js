import React, { useState, useEffect } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, View, TextInput, TouchableOpacity, Keyboard, ScrollView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Task from './components/Task';

export default function App() {
  const [task, setTask] = useState("");
  const [link, setLink] = useState(""); 
  const [timeTag, setTimeTag] = useState("Morning"); 
  const [taskItems, setTaskItems] = useState([]);

  // Load data on startup
  useEffect(() => {
    loadTasks();
  }, []);

  // Save data whenever list changes
  useEffect(() => {
    saveTasks(taskItems);
  }, [taskItems]);

  const saveTasks = async (tasks) => {
    try {
      await AsyncStorage.setItem('@task_list', JSON.stringify(tasks));
    } catch (e) { console.log("Error saving", e); }
  };

  const loadTasks = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@task_list');
      if (jsonValue !== null) setTaskItems(JSON.parse(jsonValue));
    } catch (e) { console.log("Error loading", e); }
  };

  const handleAddTask = () => {
    if (!task || task.trim() === "") return; 
    Keyboard.dismiss();
    
    setTaskItems([...taskItems, { 
      text: task, 
      link: link, 
      time: timeTag,
      completedDates: [] 
    }]);

    setTask("");
    setLink("");
    setTimeTag("Morning"); 
  };

  const completeTask = (index) => {
    let itemsCopy = [...taskItems];
    itemsCopy[index].completedDates.push(new Date().toISOString());
    setTaskItems(itemsCopy);
  };

  const deleteTask = (index) => {
    let itemsCopy = [...taskItems];
    itemsCopy.splice(index, 1);
    setTaskItems(itemsCopy);
  };

  const getGrade = (dates) => {
    const now = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 7);
    const weeklyCount = dates.filter(d => new Date(d) > sevenDaysAgo).length;

    if (weeklyCount >= 7) return { label: 'A+ Expert', color: '#4CAF50' };
    if (weeklyCount >= 5) return { label: 'B Steady', color: '#8BC34A' };
    if (weeklyCount >= 3) return { label: 'C Getting There', color: '#FFC107' };
    if (weeklyCount >= 1) return { label: 'D Beginner', color: '#FF9800' };
    return { label: 'New', color: '#9E9E9E' };
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps='handled'>
        <View style={styles.tasksWrapper}>
          <Text style={styles.sectionTitle}>Weekly Progress</Text>
          <View style={styles.items}>
            {taskItems.map((item, index) => {
              const gradeInfo = getGrade(item.completedDates || []);
              return (
                <TouchableOpacity key={index} onPress={() => completeTask(index)}>
                  <Task 
                    text={item.text} 
                    link={item.link} 
                    time={item.time}
                    grade={gradeInfo.label}
                    gradeColor={gradeInfo.color}
                    onDelete={() => deleteTask(index)}
                  /> 
                </TouchableOpacity>
              )
            })}
          </View>
        </View>
      </ScrollView>

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.writeTaskWrapper}>
        <View style={styles.inputGroup}>
          <View style={styles.tagRow}>
            {['Morning', 'Afternoon', 'Evening'].map((t) => (
              <TouchableOpacity 
                key={t} 
                style={[styles.tagButton, timeTag === t && styles.activeTag]}
                onPress={() => setTimeTag(t)}
              >
                <Text style={[styles.tagText, timeTag === t && styles.activeTagText]}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TextInput style={styles.input} placeholder={'Write a task'} value={task} onChangeText={setTask} />
          <TextInput style={[styles.input, styles.linkInput]} placeholder={'Paste link'} value={link} onChangeText={setLink} />
        </View>
        <TouchableOpacity onPress={handleAddTask}>
          <View style={styles.addWrapper}><Text style={styles.addText}>+</Text></View>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E8EAED' },
  tasksWrapper: { paddingTop: 60, paddingHorizontal: 20 },
  sectionTitle: { fontSize: 24, fontWeight: 'bold', color: '#1A1A1A' },
  items: { marginTop: 30, paddingBottom: 150 },
  writeTaskWrapper: { position: 'absolute', bottom: 30, width: '100%', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingHorizontal: 20, backgroundColor: '#E8EAED', paddingTop: 10 },
  inputGroup: { flex: 1, marginRight: 20 },
  tagRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  tagButton: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 15, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#C0C0C0' },
  activeTag: { backgroundColor: '#55BCF6', borderColor: '#55BCF6' },
  tagText: { fontSize: 10, color: '#555' },
  activeTagText: { color: '#FFF', fontWeight: 'bold' },
  input: { paddingVertical: 12, paddingHorizontal: 15, backgroundColor: '#FFF', borderRadius: 60, borderColor: '#C0C0C0', borderWidth: 1, width: '100%', marginBottom: 5 },
  linkInput: { fontSize: 12, borderColor: '#55BCF6' },
  addWrapper: { width: 55, height: 55, backgroundColor: '#FFF', borderRadius: 60, justifyContent: 'center', alignItems: 'center', borderColor: '#C0C0C0', borderWidth: 1 },
  addText: { fontSize: 30 },
});