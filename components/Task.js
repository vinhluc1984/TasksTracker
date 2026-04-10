import React from 'react';
import { View, Text, StyleSheet, Linking, TouchableOpacity } from 'react-native';

const Task = (props) => {
  const timeColor = props.time === 'Morning' ? '#FFD700' : props.time === 'Afternoon' ? '#FF8C00' : '#483D8B';

  return (
    <View style={styles.item}>
      <View style={styles.itemLeft}>
        <View style={[styles.square, {backgroundColor: timeColor}]}></View>
        <View style={styles.textContainer}>
          <Text style={styles.timeLabel}>{props.time}</Text>
          <Text style={styles.itemText}>{props.text}</Text>
          {props.link ? (
            <Text style={styles.linkText} onPress={() => Linking.openURL(props.link)}>View Link</Text>
          ) : null}
        </View>
      </View>
      
      <View style={styles.rightSection}>
        <View style={[styles.gradeBadge, {backgroundColor: props.gradeColor}]}>
          <Text style={styles.gradeText}>{props.grade}</Text>
        </View>
        <TouchableOpacity onPress={(e) => { e.stopPropagation(); props.onDelete(); }} style={styles.deleteButton}>
          <Text style={styles.deleteText}>✕</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  item: { backgroundColor: '#FFF', padding: 15, borderRadius: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  itemLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  square: { width: 24, height: 24, opacity: 0.6, borderRadius: 5, marginRight: 15 },
  textContainer: { flexDirection: 'column', flex: 1 },
  timeLabel: { fontSize: 9, fontWeight: 'bold', textTransform: 'uppercase', color: '#AAA', marginBottom: 2 },
  itemText: { fontSize: 16, color: '#1A1A1A' },
  linkText: { color: '#55BCF6', fontSize: 12, marginTop: 2, textDecorationLine: 'underline' },
  rightSection: { flexDirection: 'row', alignItems: 'center' },
  gradeBadge: { paddingVertical: 5, paddingHorizontal: 8, borderRadius: 5, marginRight: 10 },
  gradeText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
  deleteButton: { padding: 5 },
  deleteText: { color: '#FF5252', fontSize: 18, fontWeight: 'bold' },
});

export default Task;