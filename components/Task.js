import React from 'react';
import { View, Text, StyleSheet, Linking } from 'react-native';

const Task = (props) => {
  return (
    <View style={styles.item}>
      <View style={styles.itemLeft}>
        <View style={styles.square}></View>
        <View style={styles.textContainer}>
          <Text style={styles.itemText}>{props.text}</Text>
          {props.link ? (
            <Text 
              style={styles.linkText} 
              onPress={() => Linking.openURL(props.link)}
            >
              View Link
            </Text>
          ) : null}
        </View>
      </View>
      
      {/* Grading Badge */}
      <View style={[styles.gradeBadge, {backgroundColor: props.gradeColor}]}>
        <Text style={styles.gradeText}>{props.grade}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    flex: 1,
  },
  square: {
    width: 24,
    height: 24,
    backgroundColor: '#55BCF6',
    opacity: 0.4,
    borderRadius: 5,
    marginRight: 15,
  },
  textContainer: {
    flexDirection: 'column',
  },
  itemText: {
    maxWidth: '80%',
    fontSize: 16,
  },
  linkText: {
    color: '#55BCF6',
    fontSize: 12,
    marginTop: 2,
    textDecorationLine: 'underline',
  },
  gradeBadge: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  gradeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default Task;