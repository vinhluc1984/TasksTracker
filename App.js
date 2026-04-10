import React, { useState, useEffect } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, View, TextInput, TouchableOpacity, Keyboard, ScrollView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // New Import
import Task from './components/Task';

export default function App() {
  const [task, setTask] = useState("");
  const [link, setLink] = useState(""); 
  const [taskItems, setTaskItems] = useState([]);

  // --- STORAGE LOGIC START ---

  // 1. Load data from storage when app starts
  useEffect(() => {
    loadTasks();
  }, []);

  // 2. Save data whenever taskItems changes
  useEffect(() => {
    saveTasks(taskItems);
  }, [taskItems]);

  const saveTasks = async (tasks) => {
    try {
      const jsonValue = JSON.stringify(tasks);
      await AsyncStorage.setItem('@task_list', jsonValue);
    } catch (e) {
      console.log("Error saving tasks", e);
    }
  };

  const loadTasks = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@task_list');
      if (jsonValue !== null) {
        setTaskItems(JSON.parse(jsonValue));
      }
    } catch (e) {
      console.log("Error loading tasks", e);
    }
  };

  // --- STORAGE LOGIC END ---

  const handleAddTask = () => {
    if (!task || task.trim() === "") return; 
    Keyboard.dismiss();
    
    const newTasks = [...taskItems, { 
      text: task, 
      link: link, 
      completedDates: [] 
    }];

    setTaskItems(newTasks);
    setTask("");
    setLink(""); 
  }

  const completeTask = (index) => {
    let itemsCopy = [...taskItems];
    const now = new Date().toISOString();
    itemsCopy[index].completedDates.push(now);
    setTaskItems(itemsCopy);
  }

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
                    grade={gradeInfo.label}
                    gradeColor={gradeInfo.color}
                  /> 
                </TouchableOpacity>
              )
            })}
          </View>
        </View>
      </ScrollView>

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.writeTaskWrapper}>
        <View style={styles.inputGroup}>
          <TextInput style={styles.input} placeholder={'Write a task'} value={task} onChangeText={text => setTask(text)} />
          <TextInput style={[styles.input, styles.linkInput]} placeholder={'Paste link'} value={link} onChangeText={text => setLink(text)} />
        </View>
        <TouchableOpacity onPress={() => handleAddTask()}>
          <View style={styles.addWrapper}><Text style={styles.addText}>+</Text></View>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E8EAED' },
  tasksWrapper: { paddingTop: 80, paddingHorizontal: 20 },
  sectionTitle: { fontSize: 24, fontWeight: 'bold' },
  items: { marginTop: 30 },
  writeTaskWrapper: { position: 'absolute', bottom: 60, width: '100%', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingHorizontal: 20 },
  inputGroup: { flex: 1, marginRight: 20 },
  input: { paddingVertical: 15, paddingHorizontal: 15, backgroundColor: '#FFF', borderRadius: 60, borderColor: '#C0C0C0', borderWidth: 1, width: '100%' },
  linkInput: { marginTop: 10, fontSize: 12, borderColor: '#55BCF6' },
  addWrapper: { width: 60, height: 60, backgroundColor: '#FFF', borderRadius: 60, justifyContent: 'center', alignItems: 'center', borderColor: '#C0C0C0', borderWidth: 1 },
  addText: { fontSize: 30 },
});