import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';

const Task = (props) => {

  const handleLinkPress = () => {
    if (props.link) {
      // This opens the URL in the phone's default browser or app
      Linking.openURL(props.link).catch(err => console.error("Couldn't load page", err));
    }
  };

  return (
    <View style={styles.item}>
      <View style={styles.itemLeft}>
        <View style={styles.square}></View>
        <Text style={styles.itemText}>{props.text}</Text>
      </View>
      
      {/* Only show the link icon if a link exists */}
      {props.link ? (
        <TouchableOpacity onPress={handleLinkPress}>
          <Text style={styles.linkIcon}>🔗</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.circular}></View>
      )}
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
    flexWrap: 'wrap'
  },
  square: {
    width: 24,
    height: 24,
    backgroundColor: '#55BCF6',
    opacity: 0.4,
    borderRadius: 5,
    marginRight: 15,
  },
  itemText: {
    maxWidth: '80%',
  },
  circular: {
    width: 12,
    height: 12,
    borderColor: '#55BCF6',
    borderWidth: 2,
    borderRadius: 5,
  },
  linkIcon: {
    fontSize: 18,
    padding: 5,
  }
});

export default Task;