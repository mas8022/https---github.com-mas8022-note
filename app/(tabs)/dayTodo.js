import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, FlatList } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { MaterialIcons } from '@expo/vector-icons';

const ReminderPage = () => {
  const [reminderTime, setReminderTime] = useState(null); // Selected time
  const [reminderMessage, setReminderMessage] = useState(''); // User's message
  const [reminders, setReminders] = useState([]); // List of reminders
  const [isPickerVisible, setPickerVisibility] = useState(false); // Time picker visibility
  const [isDarkMode, setDarkMode] = useState(false); // Dark mode toggle

  // Show time picker
  const showTimePicker = () => {
    setPickerVisibility(true);
  };

  // Hide time picker
  const hideTimePicker = () => {
    setPickerVisibility(false);
  };

  // When user selects a time
  const handleConfirm = (selectedTime) => {
    setReminderTime(selectedTime);
    hideTimePicker();
  };

  // Set a new reminder
  const handleSetReminder = () => {
    if (!reminderTime) {
      return Alert.alert('Error', 'Please select a time');
    }

    const reminderTimestamp = reminderTime.getTime();
    const currentTime = new Date().getTime();

    if (reminderTimestamp <= currentTime) {
      return Alert.alert('Error', 'Selected time is in the past');
    }

    const newReminder = {
      id: Math.random().toString(), // Generate a unique ID
      time: reminderTimestamp,
      message: reminderMessage || 'Time to do your task!',
      isExpired: false,
    };

    // Add reminder to the list
    setReminders((prevReminders) => [...prevReminders, newReminder]);

    // Reset input fields
    setReminderMessage('');
    setReminderTime(null);

    // Set a timeout to mark the reminder as expired
    setTimeout(() => {
      setReminders((prevReminders) =>
        prevReminders.map((reminder) =>
          reminder.id === newReminder.id ? { ...reminder, isExpired: true } : reminder
        )
      );
    }, reminderTimestamp - currentTime);
  };

  // Remove a reminder
  const handleRemoveReminder = (id) => {
    setReminders((prevReminders) => prevReminders.filter((reminder) => reminder.id !== id));
  };

  // Sort reminders by time, placing expired ones at the end
  const sortedReminders = reminders.sort((a, b) => {
    if (a.isExpired && !b.isExpired) return 1; // a is expired, b is not
    if (!a.isExpired && b.isExpired) return -1; // a is not expired, b is
    return a.time - b.time; // Sort by time
  });

  const renderReminder = ({ item }) => {
    const backgroundColor = item.isExpired ? '#ffcccb' : '#90ee90'; // Light red for expired, light green for upcoming
    return (
      <View style={{ ...styles.reminderContainer, backgroundColor }}>
        <View style={styles.reminderContent}>
          <View>
            <Text style={styles.reminderText}>{item.message}</Text>
            <Text style={styles.reminderTime}>{new Date(item.time).toLocaleTimeString()}</Text>
          </View>
          <TouchableOpacity onPress={() => handleRemoveReminder(item.id)}>
            <MaterialIcons name="delete" size={30} color={isDarkMode ? '#ffffff' : '#6200ea'} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={isDarkMode ? styles.containerDark : styles.container}>
      <TouchableOpacity onPress={() => setDarkMode(!isDarkMode)}>
        <Text style={styles.toggleText}>{isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Set Reminder</Text>

      <TouchableOpacity style={styles.inputContainer} onPress={showTimePicker}>
        <Text style={styles.input}>
          {reminderTime ? reminderTime.toLocaleTimeString() : 'Select Reminder Time'}
        </Text>
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={isPickerVisible}
        mode="time"
        onConfirm={handleConfirm}
        onCancel={hideTimePicker}
      />

      <TextInput
        style={styles.textInput}
        placeholder="Enter your reminder message"
        value={reminderMessage}
        onChangeText={setReminderMessage}
        placeholderTextColor={isDarkMode ? '#cccccc' : '#aaaaaa'}
      />

      <TouchableOpacity style={styles.button} onPress={handleSetReminder}>
        <Text style={styles.buttonText}>Set Reminder</Text>
      </TouchableOpacity>

      <FlatList
        data={sortedReminders}
        renderItem={renderReminder}
        keyExtractor={(item) => item.id}
        style={styles.remindersList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  containerDark: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#1c1c1c',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  toggleText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#6200ea',
    marginBottom: 20,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  input: {
    fontSize: 18,
    textAlign: 'center',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
    backgroundColor: '#fff', // Add background color for light mode
  },
  button: {
    backgroundColor: '#6200ea',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  remindersList: {
    marginTop: 20,
  },
  reminderContainer: {
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    elevation: 2,
  },
  reminderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reminderText: {
    fontSize: 18,
    color: '#333',
  },
  reminderTime: {
    fontSize: 14,
    color: '#666',
  },
});

export default ReminderPage;
