import React, { useState, useRef, useEffect } from "react";
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useColorScheme } from "react-native";

export default function TabTwoScreen() {
  const [note, setNote] = useState("");
  const [savedNotes, setSavedNotes] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);
  const fadeAnim = useRef(new Animated.Value(0)).current; // For fade-in animation
  const scaleAnim = useRef(new Animated.Value(0.8)).current; // For scaling animation

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  
  // Load saved notes from AsyncStorage
  useEffect(() => {
    const loadNotes = async () => {
      try {
        const storedNotes = await AsyncStorage.getItem("notes");
        if (storedNotes) {
          setSavedNotes(JSON.parse(storedNotes));
        }
      } catch (error) {
        Alert.alert("Error", "Failed to load notes");
      }
    };

    loadNotes();
  }, []);

  // Save notes to AsyncStorage
  const saveNotesToStorage = async (notes) => {
    try {
      await AsyncStorage.setItem("notes", JSON.stringify(notes));
    } catch (error) {
      Alert.alert("Error", "Failed to save notes");
    }
  };

  // Animation effect for empty message
  const fadeIn = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();
  };

  useEffect(() => {
    if (savedNotes.length === 0) {
      fadeIn(); // Trigger animation when no notes
    }
  }, [savedNotes]);

  const handleCreateOrEditNote = () => {
    if (note.trim()) {
      let updatedNotes;
      if (isEditing && currentIndex !== null && !!savedNotes.length) {
        updatedNotes = [...savedNotes];
        updatedNotes[currentIndex].text = note;
        setIsEditing(false);
        setCurrentIndex(null);
      } else {
        updatedNotes = [...savedNotes, { text: note }];
      }

      setSavedNotes(updatedNotes);
      saveNotesToStorage(updatedNotes);
      setNote("");
    }
  };

  const handleEditNote = (index) => {
    setNote(savedNotes[index].text);
    setIsEditing(true);
    setCurrentIndex(index);
  };

  const handleDeleteNote = (index) => {
    const updatedNotes = savedNotes.filter((_, i) => i !== index);
    setSavedNotes(updatedNotes);
    saveNotesToStorage(updatedNotes);
  };

  return (
    <View style={[styles.container, isDarkMode ? styles.darkContainer : styles.lightContainer]}>
      <Text style={[styles.title, isDarkMode ? styles.darkText : styles.lightText]}>Notes App</Text>

      {savedNotes.length === 0 ? (
        <Animated.View
          style={[
            styles.emptyContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Text style={[styles.emptyText, isDarkMode ? styles.darkText : styles.lightText]}>
            There are no notes!
          </Text>
        </Animated.View>
      ) : (
        <ScrollView style={styles.notesContainer}>
          {savedNotes.map((item, index) => (
            <View key={index} style={[styles.note, isDarkMode ? styles.darkNote : styles.lightNote]}>
              <ScrollView style={styles.scrollableText}>
                <Text style={[styles.noteText, isDarkMode ? styles.darkText : styles.lightText]}>{item.text}</Text>
              </ScrollView>

              <View style={styles.actions}>
                <TouchableOpacity
                  style={[styles.editButton, isDarkMode ? styles.darkButton : styles.lightButton]}
                  onPress={() => handleEditNote(index)}
                >
                  <Text style={styles.actionText}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.deleteButton, isDarkMode ? styles.darkButton : styles.lightButton]}
                  onPress={() => handleDeleteNote(index)}
                >
                  <Text style={styles.actionText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      <TextInput
        style={[styles.input, isDarkMode ? styles.darkInput : styles.lightInput]}
        placeholder="Write your note..."
        placeholderTextColor={isDarkMode ? "#aaa" : "#888"}
        value={note}
        onChangeText={setNote}
      />

      <TouchableOpacity
        style={[styles.addButton, isDarkMode ? styles.darkButton : styles.lightButton]}
        onPress={handleCreateOrEditNote}
      >
        <Text style={styles.addButtonText}>
          {!isEditing || !savedNotes.length ? "Create Note" : "Edit Note"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "space-between",
  },
  darkContainer: {
    backgroundColor: "#121212",
  },
  lightContainer: {
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  darkText: {
    color: "#ffffff",
  },
  lightText: {
    color: "#6200ea",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: {
    fontSize: 22,
    fontStyle: "italic",
  },
  input: {
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
    fontSize: 20,
  },
  darkInput: {
    backgroundColor: "#333333",
    color: "#ffffff",
    borderColor: "#555555",
  },
  lightInput: {
    backgroundColor: "#f0f0f0",
    color: "#000000",
    borderColor: "#ddd",
  },
  notesContainer: {
    marginTop: 20,
  },
  note: {
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  darkNote: {
    backgroundColor: "#333333",
    borderColor: "#444444",
  },
  lightNote: {
    backgroundColor: "#ffffff",
    borderColor: "#6200ea",
  },
  noteText: {
    fontSize: 20,
  },
  actions: {
    flexDirection: "row",
  },
  editButton: {
    padding: 8,
    borderRadius: 5,
    marginRight: 5,
  },
  deleteButton: {
    padding: 8,
    borderRadius: 5,
  },
  darkButton: {
    backgroundColor: "#6200ea",
  },
  lightButton: {
    backgroundColor: "#6200ea",
  },
  actionText: {
    color: "#fff",
    fontWeight: "bold",
  },
  addButton: {
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
