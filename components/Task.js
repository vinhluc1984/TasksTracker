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
          <Text style={styles.itemText} numberOfLines={2} ellipsizeMode="tail">
            {props.text}
          </Text>
          {props.link ? (
            <TouchableOpacity onPress={() => Linking.openURL(props.link)}>
              <Text style={styles.linkText} numberOfLines={1}>View Link</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
      
      <View style={styles.rightSection}>
        <View style={[styles.gradeBadge, {backgroundColor: props.gradeColor}]}>
          <Text style={styles.gradeText}>{props.grade}</Text>
        </View>
        <TouchableOpacity 
          onPress={(e) => { e.stopPropagation(); props.onDelete(); }} 
          style={styles.deleteButton}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
        >
          <Text style={styles.deleteText}>✕</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  item: { 
    backgroundColor: '#FFF', 
    padding: 15, 
    borderRadius: 16, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    marginBottom: 16,
    // Shadow for iOS/Web
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    // Elevation for Android
    elevation: 3,
  },
  itemLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 10 },
  square: { width: 12, height: 40, borderRadius: 6, marginRight: 12 },
  textContainer: { flex: 1, paddingRight: 5 },
  timeLabel: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase', color: '#A4B0BE', marginBottom: 2 },
  itemText: { fontSize: 16, color: '#2F3542', fontWeight: '500' },
  linkText: { color: '#55BCF6', fontSize: 12, marginTop: 4, textDecorationLine: 'underline' },
  rightSection: { flexDirection: 'row', alignItems: 'center', flexShrink: 0 },
  gradeBadge: { paddingVertical: 4, paddingHorizontal: 8, borderRadius: 8, marginRight: 8 },
  gradeText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
  deleteButton: { padding: 4 },
  deleteText: { color: '#FF4757', fontSize: 20, fontWeight: 'bold' },
});

export default Task;