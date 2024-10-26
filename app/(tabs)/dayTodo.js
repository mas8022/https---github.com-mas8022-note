import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, FlatList, useColorScheme } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { MaterialIcons } from '@expo/vector-icons';

const ReminderPage = () => {
  const [reminderTime, setReminderTime] = useState(null);
  const [reminderMessage, setReminderMessage] = useState('');
  const [reminders, setReminders] = useState([]);
  const [isPickerVisible, setPickerVisibility] = useState(false);

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const styles = createStyles(isDarkMode);

  const showTimePicker = () => {
    setPickerVisibility(true);
  };

  const hideTimePicker = () => {
    setPickerVisibility(false);
  };

  const handleConfirm = (selectedTime) => {
    setReminderTime(selectedTime);
    hideTimePicker();
  };

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
      id: Math.random().toString(),
      time: reminderTimestamp,
      message: reminderMessage || 'Time to do your task!',
      isExpired: false,
    };

    setReminders((prevReminders) => [...prevReminders, newReminder]);

    setReminderMessage('');
    setReminderTime(null);

    setTimeout(() => {
      setReminders((prevReminders) =>
        prevReminders.map((reminder) =>
          reminder.id === newReminder.id ? { ...reminder, isExpired: true } : reminder
        )
      );
    }, reminderTimestamp - currentTime);
  };

  const handleRemoveReminder = (id) => {
    setReminders((prevReminders) => prevReminders.filter((reminder) => reminder.id !== id));
  };

  const sortedReminders = reminders.sort((a, b) => {
    if (a.isExpired && !b.isExpired) return 1;
    if (!a.isExpired && b.isExpired) return -1;
    return a.time - b.time;
  });

  const renderReminder = ({ item }) => {
    const backgroundColor = item.isExpired ? '#ffcccb' : '#90ee90';
    return (
      <View style={{ ...styles.reminderContainer, backgroundColor }}>
        <View style={styles.reminderContent}>
          <View>
            <Text style={styles.reminderText}>{item.message}</Text>
            <Text style={styles.reminderTime}>{new Date(item.time).toLocaleTimeString()}</Text>
          </View>
          <TouchableOpacity onPress={() => handleRemoveReminder(item.id)}>
            <MaterialIcons name="delete" size={30} color={isDarkMode ? '#6200ea' : '#6200ea'} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
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
        placeholderTextColor={isDarkMode ? '#b0b0b0' : '#666'}
        value={reminderMessage}
        onChangeText={setReminderMessage}
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

const createStyles = (isDarkMode) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      justifyContent: 'center',
      backgroundColor: isDarkMode ? '#121212' : '#f5f5f5',
    },
    title: {
      fontSize: 24,
      marginBottom: 20,
      textAlign: 'center',
      color: isDarkMode ? '#ffffff' : '#333',
    },
    inputContainer: {
      borderWidth: 1,
      borderColor: isDarkMode ? '#6200ea' : '#ccc',
      padding: 10,
      marginBottom: 20,
      borderRadius: 5,
    },
    input: {
      fontSize: 18,
      textAlign: 'center',
      color: isDarkMode ? '#ffffff' : '#333',
    },
    textInput: {
      borderWidth: 1,
      borderColor: isDarkMode ? '#6200ea' : '#ccc',
      padding: 10,
      marginBottom: 20,
      borderRadius: 5,
      fontSize: 16,
      color: isDarkMode ? '#ffffff' : '#333',
      textAlign: 'center',
    },
    button: {
      backgroundColor: isDarkMode ? '#6200ea' : '#6200ea',
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
      color: isDarkMode ? '#ffffff' : '#333',
    },
    reminderTime: {
      fontSize: 14,
      color: isDarkMode ? '#aaaaaa' : '#666',
    },
  });

export default ReminderPage;
