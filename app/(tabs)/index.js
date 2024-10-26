import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  FlatList,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Calendar } from "react-native-calendars";
import * as Animatable from "react-native-animatable";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useColorScheme } from 'react-native';

export default function App() {
  const [text, setText] = useState("");
  const [tasks, setTasks] = useState({});
  const [checkedTasks, setCheckedTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  // Load tasks from AsyncStorage
  const loadTasks = async () => {
    try {
      const savedTasks = await AsyncStorage.getItem("tasks");
      const savedCheckedTasks = await AsyncStorage.getItem("checkedTasks");
      if (savedTasks) setTasks(JSON.parse(savedTasks));
      if (savedCheckedTasks) setCheckedTasks(JSON.parse(savedCheckedTasks));
    } catch (error) {
      console.error("Failed to load tasks:", error);
    }
  };

  // Save tasks to AsyncStorage
  const saveTasks = async (updatedTasks) => {
    try {
      await AsyncStorage.setItem("tasks", JSON.stringify(updatedTasks));
    } catch (error) {
      console.error("Failed to save tasks:", error);
    }
  };

  // Save checked tasks to AsyncStorage
  const saveCheckedTasks = async (updatedCheckedTasks) => {
    try {
      await AsyncStorage.setItem(
        "checkedTasks",
        JSON.stringify(updatedCheckedTasks)
      );
    } catch (error) {
      console.error("Failed to save checked tasks:", error);
    }
  };

  // Add a new task
  const addTask = () => {
    if (text.trim() && selectedDate) {
      const updatedTasks = { ...tasks };
      if (!updatedTasks[selectedDate]) {
        updatedTasks[selectedDate] = [];
      }
      updatedTasks[selectedDate].push({ id: Date.now(), text });
      setTasks(updatedTasks);
      saveTasks(updatedTasks);
      setText("");
    }
  };

  // Delete a task
  const deleteTask = (id) => {
    const updatedTasks = { ...tasks };
    updatedTasks[selectedDate] = updatedTasks[selectedDate].filter(
      (task) => task.id !== id
    );
    if (updatedTasks[selectedDate].length === 0) {
      delete updatedTasks[selectedDate];
    }
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  // Check/Uncheck a task
  const toggleCheckTask = (id) => {
    const updatedCheckedTasks = [...checkedTasks];
    if (updatedCheckedTasks.includes(id)) {
      const taskIndex = updatedCheckedTasks.indexOf(id);
      updatedCheckedTasks.splice(taskIndex, 1);
    } else {
      updatedCheckedTasks.push(id);
    }
    setCheckedTasks(updatedCheckedTasks);
    saveCheckedTasks(updatedCheckedTasks);
  };

  const onDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <Text style={[styles.title, isDarkMode && styles.darkTitle]}>
        Select a Date and Add Your Task
      </Text>

      <Calendar
        theme={{
          backgroundColor: isDarkMode ? "#333" : "#fff",
          calendarBackground: isDarkMode ? "#333" : "#fff",
          textSectionTitleColor: isDarkMode ? "#b6c1cd" : "#2d4150",
          selectedDayBackgroundColor: isDarkMode ? "#6200ea" : "#f5f5f5",
          selectedDayTextColor: isDarkMode ? "#ffffff" : "#000000",
          dayTextColor: isDarkMode ? "#ffffff" : "#2d4150",
          textDisabledColor: isDarkMode ? "#d9e1e8" : "#d9e1e8",
        }}
        onDayPress={onDayPress}
        markedDates={{
          ...Object.keys(tasks).reduce((acc, date) => {
            acc[date] = { marked: true };
            return acc;
          }, {}),
          [selectedDate]: {
            selected: true,
            marked: tasks[selectedDate]?.length > 0,
          },
        }}
      />

      {/* Task Input */}
      <TextInput
        style={[styles.textInput, isDarkMode && styles.darkTextInput]}
        value={text}
        onChangeText={setText}
        placeholder="Enter your task"
        placeholderTextColor={isDarkMode ? "#ccc" : "#666"}
      />
      <TouchableOpacity style={[styles.addButton, isDarkMode && styles.darkAddButton]} onPress={addTask}>
        <Text style={styles.addButtonText}>Add Task</Text>
      </TouchableOpacity>

      {/* Task List for Selected Date */}
      <FlatList
        data={(tasks[selectedDate] || []).sort((a, b) => {
          const aChecked = checkedTasks.includes(a.id);
          const bChecked = checkedTasks.includes(b.id);
          return aChecked - bChecked;
        })}
        renderItem={({ item }) => {
          const isChecked = checkedTasks.includes(item.id);
          return (
            <Animatable.View
              animation="fadeIn"
              duration={500}
              style={[
                styles.taskItem,
                isChecked && styles.checkedTask,
                isDarkMode && styles.darkTaskItem,
              ]}
            >
              <TouchableOpacity onPress={() => toggleCheckTask(item.id)} style={styles.checkButton}>
                <FontAwesome
                  name={isChecked ? "check-square-o" : "square-o"}
                  size={24}
                  color={isDarkMode ? "#6200ea" : "#333"}
                />
              </TouchableOpacity>
              <Text style={[styles.taskText, isChecked && styles.checkedTaskText, isDarkMode && styles.darkTaskText]}>
                {item.text}
              </Text>
              <TouchableOpacity onPress={() => deleteTask(item.id)} style={styles.deleteButton}>
                <Animatable.Text animation="bounceIn" duration={800} style={styles.deleteButtonText}>
                  ❌
                </Animatable.Text>
              </TouchableOpacity>
            </Animatable.View>
          );
        }}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        ListEmptyComponent={<Text style={[styles.emptyText, isDarkMode && styles.darkEmptyText]}>No tasks for this day.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  darkContainer: {
    backgroundColor: "#121212",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  darkTitle: {
    color: "#fff",
  },
  textInput: {
    padding: 15,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 20,
    fontSize: 20,
    color: "#333",
  },
  darkTextInput: {
    backgroundColor: "#333",
    color: "#eee",
  },
  addButton: {
    backgroundColor: "#6200ea",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  darkAddButton: {
    backgroundColor: "#6200ea",
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  taskItem: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  darkTaskItem: {
    backgroundColor: "#333",
  },
  checkedTask: {
    backgroundColor: "#e0e0e0",
  },
  taskText: {
    fontSize: 18,
    color: "#333",
  },
  darkTaskText: {
    color: "#fff",
  },
  checkedTaskText: {
    textDecorationLine: "line-through",
    color: "#888",
  },
  emptyText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginTop: 20,
  },
  darkEmptyText: {
    color: "#bbb",
  },
  deleteButton: {
    marginLeft: 10,
  },
  deleteButtonText: {
    color: "red",
    fontSize: 18,
  },
});
