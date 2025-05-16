
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import NoteEditor from "@/components/NoteEditor";
import NoteSidebar from "@/components/NoteSidebar";
import { Note } from "@/types/note";
import { getAllNotes, saveNote, deleteNote } from "@/lib/note-utils";

const Index = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const storedNotes = getAllNotes();
    setNotes(storedNotes);
  }, []);

  const handleSaveNote = (note: Note) => {
    saveNote(note);
    setActiveNote(note);
    
    const updatedNotes = getAllNotes();
    setNotes(updatedNotes);
    
    toast({
      title: "Note saved",
      description: "Your note has been saved successfully",
    });
  };

  const handleSelectNote = (note: Note) => {
    setActiveNote(note);
  };

  const handleCreateNote = () => {
    setActiveNote(null);
  };

  const handleDeleteNote = (id: string) => {
    deleteNote(id);
    
    if (activeNote?.id === id) {
      setActiveNote(null);
    }
    
    const updatedNotes = getAllNotes();
    setNotes(updatedNotes);
    
    toast({
      title: "Note deleted",
      description: "Your note has been deleted",
      variant: "destructive",
    });
  };

  const handleCheckGrammar = () => {
    toast({
      title: "Grammar check",
      description: "Grammar checking feature coming soon!",
      variant: "default",
    });
  };

  const handleViewNote = () => {
    if (!activeNote) {
      toast({
        title: "No note to view",
        description: "Please save your note first",
        variant: "destructive",
      });
      return;
    }
    
    navigate(`/view/${activeNote.id}`);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-dark overflow-hidden">
      <header className="px-6 py-4 border-b border-white/10">
        <h1 className="text-2xl font-bold text-white">Markdown Notes</h1>
      </header>
      
      <main className="flex-grow flex relative overflow-hidden">
        <div className="flex-grow h-full overflow-hidden">
          <div className="h-full p-4">
            <NoteEditor
              activeNote={activeNote}
              onSave={handleSaveNote}
              onCheckGrammar={handleCheckGrammar}
              onView={handleViewNote}
            />
          </div>
        </div>
        
        <NoteSidebar
          notes={notes}
          activeNoteId={activeNote?.id || null}
          onSelectNote={handleSelectNote}
          onCreateNote={handleCreateNote}
          onDeleteNote={handleDeleteNote}
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />
      </main>
    </div>
  );
};

export default Index;
