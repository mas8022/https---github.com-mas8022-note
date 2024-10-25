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

export default function TabTwoScreen() {
  const [note, setNote] = useState("");
  const [savedNotes, setSavedNotes] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);
  const fadeAnim = useRef(new Animated.Value(0)).current; // For fade-in animation
  const scaleAnim = useRef(new Animated.Value(0.8)).current; // For scaling animation

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
        // Edit existing note
        updatedNotes = [...savedNotes];
        updatedNotes[currentIndex].text = note;
        setIsEditing(false);
        setCurrentIndex(null);
      } else {
        // Create new note
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
    <View style={styles.container}>
      <Text style={styles.title}>Notes App</Text>

      {/* Display message if no notes exist */}
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
          <Text style={styles.emptyText}>There are no notes!</Text>
        </Animated.View>
      ) : (
        <ScrollView style={styles.notesContainer}>
          {savedNotes.map((item, index) => (
            <View key={index} style={styles.note}>
              <ScrollView style={styles.scrollableText}>
                <Text style={styles.noteText}>{item.text}</Text>
              </ScrollView>

              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => handleEditNote(index)}
                >
                  <Text style={styles.actionText}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteNote(index)}
                >
                  <Text style={styles.actionText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      {/* Input note section */}
      <TextInput
        style={styles.input}
        placeholder="Write your note..."
        value={note}
        onChangeText={setNote}
      />

      {/* Custom Create or Edit button */}
      <TouchableOpacity
        style={styles.addButton}
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
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
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
    color: "#6200ea",
    fontStyle: "italic",
  },
  input: {
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: "#f0f0f0",
    fontSize: 20,
  },
  notesContainer: {
    marginTop: 20,
  },
  note: {
    padding: 15,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    marginVertical: 5,
    borderColor: "#6200ea",
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 20,
  },
  scrollableText: {
    maxHeight: 200,
  },
  noteText: {
    fontSize: 20,
    color: "#333",
  },
  actions: {
    flexDirection: "row",
  },
  editButton: {
    backgroundColor: "#6200ea",
    padding: 8,
    borderRadius: 5,
    marginRight: 5,
  },
  deleteButton: {
    backgroundColor: "#ff4d4f",
    padding: 8,
    borderRadius: 5,
  },
  actionText: {
    color: "#fff",
    fontWeight: "bold",
  },
  addButton: {
    backgroundColor: "#6200ea",
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
