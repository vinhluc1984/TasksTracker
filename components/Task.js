import React from 'react';
import { View, Text, StyleSheet, Linking, TouchableOpacity } from 'react-native';

const Task = (props) => {
  const isTask = props.type === "task";
  const timeColor = props.time === 'Morning' ? '#FFD700' : props.time === 'Afternoon' ? '#FF8C00' : '#483D8B';

  const handleLinkPress = (text) => {
    if (text.startsWith('http') || text.startsWith('www')) {
      Linking.openURL(text.startsWith('www') ? `https://${text}` : text);
    }
  };

  return (
    <View style={styles.item}>
      <View style={styles.sortControls}>
        {!props.isFirst && (
          <TouchableOpacity onPress={props.onMoveUp} style={styles.sortBtn}>
            <Text style={styles.sortArrow}>▲</Text>
          </TouchableOpacity>
        )}
        {!props.isLast && (
          <TouchableOpacity onPress={props.onMoveDown} style={styles.sortBtn}>
            <Text style={styles.sortArrow}>▼</Text>
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity 
        style={styles.mainClickArea} 
        onPress={isTask ? props.onComplete : null}
      >
        <View style={styles.itemLeft}>
          <View style={[styles.square, {backgroundColor: isTask ? timeColor : '#A4B0BE'}]}></View>
          <View style={styles.textContainer}>
            {isTask && <Text style={styles.timeLabel}>{props.time}</Text>}
            <Text style={styles.itemText}>{props.text}</Text>
            {props.link ? (
              <Text 
                style={[styles.linkText, !props.link.startsWith('http') && {color: '#555', textDecorationLine: 'none'}]} 
                onPress={() => handleLinkPress(props.link)}
              >
                {props.link.startsWith('http') || props.link.startsWith('www') ? "View Source" : props.link}
              </Text>
            ) : null}
          </View>
        </View>
      </TouchableOpacity>
      
      <View style={styles.rightSection}>
        {isTask && (
          <View style={[styles.gradeBadge, {backgroundColor: props.gradeColor}]}>
            <Text style={styles.gradeText}>{props.grade}</Text>
          </View>
        )}
        <TouchableOpacity onPress={(e) => { e.stopPropagation(); props.onDelete(); }} style={styles.deleteButton}>
          <Text style={styles.deleteText}>✕</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  item: { backgroundColor: '#FFF', padding: 12, borderRadius: 16, flexDirection: 'row', alignItems: 'center', marginBottom: 16, elevation: 3, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 3.84 },
  sortControls: { marginRight: 8, justifyContent: 'center', alignItems: 'center', width: 20 },
  sortBtn: { paddingVertical: 4 },
  sortArrow: { fontSize: 12, color: '#D1D1D1' },
  mainClickArea: { flex: 1 },
  itemLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  square: { width: 6, height: 35, borderRadius: 3, marginRight: 10 },
  textContainer: { flex: 1, paddingRight: 5 },
  timeLabel: { fontSize: 8, fontWeight: '800', color: '#A4B0BE', textTransform: 'uppercase', marginBottom: 2 },
  itemText: { fontSize: 15, color: '#2F3542', fontWeight: '600' },
  linkText: { color: '#55BCF6', fontSize: 12, marginTop: 4, textDecorationLine: 'underline' },
  rightSection: { flexDirection: 'row', alignItems: 'center', flexShrink: 0 },
  gradeBadge: { paddingVertical: 4, paddingHorizontal: 6, borderRadius: 6, marginRight: 8 },
  gradeText: { color: '#FFF', fontSize: 9, fontWeight: 'bold' },
  deleteButton: { padding: 5 },
  deleteText: { color: '#FF4757', fontSize: 18, fontWeight: 'bold' },
});

export default Task;