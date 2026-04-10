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
  useEffect(() => { loadTasks(); }, []);

  // Save data whenever list changes
  useEffect(() => { saveTasks(taskItems); }, [taskItems]);

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

  const moveTask = (index, direction) => {
    const newTasks = [...taskItems];
    const nextIndex = direction === 'up' ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= newTasks.length) return;

    const temp = newTasks[index];
    newTasks[index] = newTasks[nextIndex];
    newTasks[nextIndex] = temp;
    setTaskItems(newTasks);
  };

  const getGrade = (dates) => {
    const now = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 7);
    const weeklyCount = (dates || []).filter(d => new Date(d) > sevenDaysAgo).length;

    if (weeklyCount >= 7) return { label: 'A+ Expert', color: '#4CAF50' };
    if (weeklyCount >= 5) return { label: 'B Steady', color: '#8BC34A' };
    if (weeklyCount >= 3) return { label: 'C Getting There', color: '#FFC107' };
    if (weeklyCount >= 1) return { label: 'D Beginner', color: '#FF9800' };
    return { label: 'New', color: '#9E9E9E' };
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer} 
        keyboardShouldPersistTaps='handled'
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.tasksWrapper}>
          <Text style={styles.sectionTitle}>Weekly Progress</Text>
          <View style={styles.items}>
            {taskItems.map((item, index) => {
              const gradeInfo = getGrade(item.completedDates);
              return (
                <View key={index}>
                  <Task 
                    text={item.text} 
                    link={item.link} 
                    time={item.time}
                    grade={gradeInfo.label}
                    gradeColor={gradeInfo.color}
                    onDelete={() => deleteTask(index)}
                    onComplete={() => completeTask(index)}
                    onMoveUp={() => moveTask(index, 'up')}
                    onMoveDown={() => moveTask(index, 'down')}
                    isFirst={index === 0}
                    isLast={index === taskItems.length - 1}
                  /> 
                </View>
              )
            })}
          </View>
        </View>
      </ScrollView>

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        style={styles.writeTaskWrapper}
      >
        <View style={styles.inputContainer}>
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
          <View style={styles.actionRow}>
            <View style={styles.inputGroup}>
              <TextInput style={styles.input} placeholder={'Task...'} value={task} onChangeText={setTask} />
              <TextInput style={[styles.input, styles.linkInput]} placeholder={'Link...'} value={link} onChangeText={setLink} />
            </View>
            <TouchableOpacity onPress={handleAddTask}>
              <View style={styles.addWrapper}><Text style={styles.addText}>+</Text></View>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F6FA' },
  scrollContainer: { flexGrow: 1, paddingBottom: 220 },
  tasksWrapper: { paddingTop: 60, paddingHorizontal: 20 },
  sectionTitle: { fontSize: 28, fontWeight: 'bold', color: '#2F3542' },
  items: { marginTop: 30 },
  writeTaskWrapper: { 
    position: 'absolute', 
    bottom: 0, 
    width: '100%', 
    backgroundColor: '#F5F6FA',
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#DDD'
  },
  inputContainer: { width: '100%' },
  tagRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  tagButton: { flex: 1, marginHorizontal: 4, paddingVertical: 8, borderRadius: 12, backgroundColor: '#FFF', alignItems: 'center', borderWidth: 1, borderColor: '#CED4DA' },
  activeTag: { backgroundColor: '#55BCF6', borderColor: '#55BCF6' },
  tagText: { fontSize: 12, color: '#57606F' },
  activeTagText: { color: '#FFF', fontWeight: 'bold' },
  actionRow: { flexDirection: 'row', alignItems: 'flex-end' },
  inputGroup: { flex: 1, marginRight: 15 },
  input: { backgroundColor: '#FFF', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#CED4DA', marginBottom: 8, fontSize: 16 },
  linkInput: { fontSize: 13, color: '#55BCF6' },
  addWrapper: { width: 56, height: 102, backgroundColor: '#55BCF6', borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  addText: { color: '#FFF', fontSize: 32, fontWeight: '300' },
});