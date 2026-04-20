import React, { useState, useEffect } from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, View, TextInput, TouchableOpacity, Keyboard, ScrollView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Task from './components/Task';

export default function App() {
  const [currentView, setCurrentView] = useState("tasks"); // "tasks" or "recipes"
  
  // Task States
  const [task, setTask] = useState("");
  const [link, setLink] = useState(""); 
  const [timeTag, setTimeTag] = useState("Morning"); 
  const [taskItems, setTaskItems] = useState([]);

  // Recipe States
  const [recipeName, setRecipeName] = useState("");
  const [recipeDetails, setRecipeDetails] = useState("");
  const [recipeItems, setRecipeItems] = useState([]);

  useEffect(() => { loadData(); }, []);
  useEffect(() => { saveData(); }, [taskItems, recipeItems]);

  const saveData = async () => {
    try {
      await AsyncStorage.setItem('@task_list', JSON.stringify(taskItems));
      await AsyncStorage.setItem('@recipe_list', JSON.stringify(recipeItems));
    } catch (e) { console.log("Error saving", e); }
  };

  const loadData = async () => {
    try {
      const taskJson = await AsyncStorage.getItem('@task_list');
      const recipeJson = await AsyncStorage.getItem('@recipe_list');
      if (taskJson !== null) setTaskItems(JSON.parse(taskJson));
      if (recipeJson !== null) setRecipeItems(JSON.parse(recipeJson));
    } catch (e) { console.log("Error loading", e); }
  };

  const handleAddEntry = () => {
    Keyboard.dismiss();
    if (currentView === "tasks") {
      if (!task || task.trim() === "") return;
      setTaskItems([...taskItems, { text: task, link: link, time: timeTag, completedDates: [] }]);
      setTask(""); setLink(""); setTimeTag("Morning");
    } else {
      if (!recipeName || recipeName.trim() === "") return;
      setRecipeItems([...recipeItems, { name: recipeName, details: recipeDetails }]);
      setRecipeName(""); setRecipeDetails("");
    }
  };

  const deleteItem = (index) => {
    if (currentView === "tasks") {
      let copy = [...taskItems];
      copy.splice(index, 1);
      setTaskItems(copy);
    } else {
      let copy = [...recipeItems];
      copy.splice(index, 1);
      setRecipeItems(copy);
    }
  };

  const moveItem = (index, direction) => {
    const list = currentView === "tasks" ? [...taskItems] : [...recipeItems];
    const nextIndex = direction === 'up' ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= list.length) return;
    const temp = list[index];
    list[index] = list[nextIndex];
    list[nextIndex] = temp;
    currentView === "tasks" ? setTaskItems(list) : setRecipeItems(list);
  };

  const completeTask = (index) => {
    let itemsCopy = [...taskItems];
    if (!itemsCopy[index].completedDates) itemsCopy[index].completedDates = [];
    itemsCopy[index].completedDates.push(new Date().toISOString());
    setTaskItems(itemsCopy);
  };

  const getGrade = (dates) => {
    if (!dates || dates.length === 0) return { label: 'New', color: '#9E9E9E' };
    const now = new Date();
    const startOfWeek = new Date(now);
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1); 
    startOfWeek.setDate(diff);
    startOfWeek.setHours(0, 0, 0, 0); 
    const weeklyCount = dates.filter(d => new Date(d) >= startOfWeek).length;
    if (weeklyCount >= 7) return { label: 'A+ Expert', color: '#4CAF50' };
    if (weeklyCount >= 5) return { label: 'B Steady', color: '#8BC34A' };
    if (weeklyCount >= 3) return { label: 'C Getting There', color: '#FFC107' };
    if (weeklyCount >= 1) return { label: 'D Beginner', color: '#FF9800' };
    return { label: 'New', color: '#9E9E9E' };
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.tabWrapper}>
          <TouchableOpacity 
            style={[styles.tab, currentView === "tasks" && styles.activeTab]} 
            onPress={() => setCurrentView("tasks")}
          >
            <Text style={[styles.tabText, currentView === "tasks" && styles.activeTabText]}>Tasks</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, currentView === "recipes" && styles.activeTab]} 
            onPress={() => setCurrentView("recipes")}
          >
            <Text style={[styles.tabText, currentView === "recipes" && styles.activeTabText]}>Recipes</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps='handled' showsVerticalScrollIndicator={false}>
        <View style={styles.tasksWrapper}>
          <Text style={styles.sectionTitle}>{currentView === "tasks" ? "Weekly Progress" : "My Cookbook"}</Text>
          <View style={styles.items}>
            {currentView === "tasks" ? (
              taskItems.map((item, index) => (
                <Task 
                  key={index}
                  type="task"
                  text={item.text} 
                  link={item.link} 
                  time={item.time}
                  grade={getGrade(item.completedDates).label}
                  gradeColor={getGrade(item.completedDates).color}
                  onDelete={() => deleteItem(index)}
                  onComplete={() => completeTask(index)}
                  onMoveUp={() => moveItem(index, 'up')}
                  onMoveDown={() => moveItem(index, 'down')}
                  isFirst={index === 0}
                  isLast={index === taskItems.length - 1}
                />
              ))
            ) : (
              recipeItems.map((item, index) => (
                <Task 
                  key={index}
                  type="recipe"
                  text={item.name} 
                  link={item.details} 
                  onDelete={() => deleteItem(index)}
                  onMoveUp={() => moveItem(index, 'up')}
                  onMoveDown={() => moveItem(index, 'down')}
                  isFirst={index === 0}
                  isLast={index === recipeItems.length - 1}
                />
              ))
            )}
          </View>
        </View>
      </ScrollView>

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.writeTaskWrapper}>
        <View style={styles.inputContainer}>
          {currentView === "tasks" && (
            <View style={styles.tagRow}>
              {['Morning', 'Afternoon', 'Evening'].map((t) => (
                <TouchableOpacity key={t} style={[styles.tagButton, timeTag === t && styles.activeTag]} onPress={() => setTimeTag(t)}>
                  <Text style={[styles.tagText, timeTag === t && styles.activeTagText]}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          <View style={styles.actionRow}>
            <View style={styles.inputGroup}>
              <TextInput 
                style={styles.input} 
                placeholder={currentView === "tasks" ? 'Task Name' : 'Recipe Name'} 
                value={currentView === "tasks" ? task : recipeName} 
                onChangeText={currentView === "tasks" ? setTask : setRecipeName} 
              />
              <TextInput 
                style={[styles.input, styles.linkInput]} 
                placeholder={currentView === "tasks" ? 'Link' : 'Link or Ingredients...'} 
                value={currentView === "tasks" ? link : recipeDetails} 
                onChangeText={currentView === "tasks" ? setLink : setRecipeDetails}
                multiline={currentView === "recipes"}
              />
            </View>
            <TouchableOpacity onPress={handleAddEntry}>
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
  header: { paddingTop: 50, backgroundColor: '#FFF', paddingBottom: 10, shadowColor: "#000", shadowOpacity: 0.1, elevation: 5 },
  tabWrapper: { flexDirection: 'row', justifyContent: 'center', marginHorizontal: 20, backgroundColor: '#F1F2F6', borderRadius: 12, padding: 4 },
  tab: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 10 },
  activeTab: { backgroundColor: '#FFF' },
  tabText: { fontSize: 14, color: '#747D8C', fontWeight: '600' },
  activeTabText: { color: '#55BCF6' },
  scrollContainer: { flexGrow: 1, paddingBottom: 220 },
  tasksWrapper: { paddingTop: 20, paddingHorizontal: 20 },
  sectionTitle: { fontSize: 24, fontWeight: 'bold', color: '#2F3542' },
  items: { marginTop: 20 },
  writeTaskWrapper: { position: 'absolute', bottom: 0, width: '100%', backgroundColor: '#F5F6FA', paddingHorizontal: 20, paddingBottom: Platform.OS === 'ios' ? 40 : 20, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#DDD' },
  inputContainer: { width: '100%' },
  tagRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  tagButton: { flex: 1, marginHorizontal: 4, paddingVertical: 6, borderRadius: 12, backgroundColor: '#FFF', alignItems: 'center', borderWidth: 1, borderColor: '#CED4DA' },
  activeTag: { backgroundColor: '#55BCF6', borderColor: '#55BCF6' },
  tagText: { fontSize: 10, color: '#57606F' },
  activeTagText: { color: '#FFF', fontWeight: 'bold' },
  actionRow: { flexDirection: 'row', alignItems: 'flex-end' },
  inputGroup: { flex: 1, marginRight: 15 },
  input: { backgroundColor: '#FFF', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#CED4DA', marginBottom: 8, fontSize: 16 },
  linkInput: { fontSize: 13 },
  addWrapper: { width: 56, height: 102, backgroundColor: '#55BCF6', borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  addText: { color: '#FFF', fontSize: 32 },
});