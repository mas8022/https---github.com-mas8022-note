import React, { useState, useRef } from "react";
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  TouchableOpacity,
} from "react-native";

export default function TabTwoScreen() {
  const [note, setNote] = useState("");
  const [savedNotes, setSavedNotes] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);
  const fadeAnim = useRef(new Animated.Value(0)).current; // For animation

  // Animation effect
  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const handleCreateOrEditNote = () => {
    if (note.trim()) {
      if (isEditing && currentIndex !== null && !!savedNotes.length) {
        // Edit existing note
        const updatedNotes = [...savedNotes];
        updatedNotes[currentIndex].text = note;
        setSavedNotes(updatedNotes);
        setIsEditing(false);
        setCurrentIndex(null);
      } else {
        // Create new note
        setSavedNotes([...savedNotes, { text: note }]);
      }
      setNote("");
      fadeIn(); // Trigger fade in animation
    }
  };

  const handleEditNote = (index) => {
    setNote(savedNotes[index].text);
    setIsEditing(true);
    setCurrentIndex(index);
  };

  const handleDeleteNote = (index) => {
    setSavedNotes(savedNotes.filter((_, i) => i !== index));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notes App</Text>

      {/* Display saved notes with delete/edit options */}
      <ScrollView style={styles.notesContainer}>
        {savedNotes.map((item, index) => (
          <Animated.View key={index} style={{ opacity: fadeAnim }}>
            <View style={styles.note}>
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
          </Animated.View>
        ))}
      </ScrollView>

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
    backgroundColor: "#ffffff", // White background
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#6200ea", // Theme color
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
    borderColor: "#6200ea", // Theme color border
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 20,
  },
  scrollableText: {
    maxHeight: 200, // Limit height to avoid overflowing
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
