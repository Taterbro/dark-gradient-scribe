
import { Note } from "../types/note";

const STORAGE_KEY = "markdown-notes";

export function getAllNotes(): Note[] {
  const notesJson = localStorage.getItem(STORAGE_KEY);
  if (!notesJson) return [];
  
  try {
    return JSON.parse(notesJson);
  } catch (e) {
    console.error("Failed to parse notes from localStorage", e);
    return [];
  }
}

export function saveNote(note: Note): void {
  const notes = getAllNotes();
  const existingNoteIndex = notes.findIndex(n => n.id === note.id);
  
  if (existingNoteIndex >= 0) {
    // Update existing note
    notes[existingNoteIndex] = note;
  } else {
    // Add new note
    notes.push(note);
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

export function getNoteById(id: string): Note | undefined {
  const notes = getAllNotes();
  return notes.find(note => note.id === id);
}

export function deleteNote(id: string): void {
  const notes = getAllNotes();
  const filteredNotes = notes.filter(note => note.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredNotes));
}

export function generateUniqueId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

export function extractTitleFromContent(content: string): string {
  // Find first heading or first sentence
  const headingMatch = content.match(/^#\s+(.*)/);
  if (headingMatch && headingMatch[1]) {
    return headingMatch[1].trim();
  }
  
  // Get first line if no heading
  const firstLine = content.split('\n')[0];
  if (firstLine) {
    return firstLine.length > 30 ? firstLine.substring(0, 30) + '...' : firstLine;
  }
  
  return "Untitled Note";
}
