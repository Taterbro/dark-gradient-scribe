import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import NoteEditor from "@/components/NoteEditor";
import NoteSidebar from "@/components/NoteSidebar";
import { Note } from "@/types/note";
import { getAllNotes, saveNote, deleteNote } from "@/lib/note-utils";
import axios from "axios";

const Index = () => {
  const apiUrl = "https://markdownnotesappbackend.onrender.com";
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [grammarChecking, setGrammar] = useState("");
  const [grammarErrors, setErrors] = useState<any[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  const getNotes = () => {
    axios
      .get(`${apiUrl}/text`, {
        withCredentials: true, // This is required
      })
      .then((res) => {
        setNotes(res.data.notes);
        console.log("notes: ", res.data);
      });
  };

  const handleSaveNote = async (note: Note) => {
    try {
      await axios
        .post(
          `${apiUrl}/text`,
          { text: note.body },
          {
            withCredentials: true, // This is required
          }
        )
        .then((res) => {
          console.log(res);
          toast({
            title: "Note saved",
            description: res.data.message,
          });
        })
        .then(() => getNotes());
      setActiveNote(note);
    } catch (error) {
      toast({
        title: "Error",
        variant: "destructive",
        description: error.message,
      });
    }
  };

  useEffect(() => {
    axios.get(`${apiUrl}/text`, { withCredentials: true }).then((res) => {
      console.log(res);
      setNotes(res.data.notes);
    });
  }, []);

  const handleSelectNote = (note: Note) => {
    setActiveNote(note.body);
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

  const handleCheckGrammar = async (note: string) => {
    try {
      const response = await axios.post(
        `${apiUrl}/errorCheck`,
        { text: note },
        {
          withCredentials: true, // This is required
        }
      );
      console.log("Grammar check Response: ", response);
      setGrammar(response.data.text);
      setErrors(response.data.errors);
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleViewNote = async () => {
    if (!activeNote) {
      toast({
        title: "No note to view",
        description: "Please save your note first",
        variant: "destructive",
      });
      return;
    }
    axios
      .post(`${apiUrl}/rendered`, { text: activeNote.body })
      .then((response) => {
        console.log(response.data);
        navigate(`/view/${activeNote.id}`, {
          state: { marked: response.data },
        });
      });
  };

  const underlineText = (badText: string) => {
    if (!grammarErrors) return badText;

    const offsets = grammarErrors.map((err) => ({
      offset: err.offset,
      length: err.length,
    }));

    return [...badText].map((char, index) => {
      const isUnderlined = offsets.some(
        (off) => index >= off.offset && index < off.offset + off.length
      );

      return isUnderlined ? (
        <u key={index} className="decoration-red-700">
          {char}
        </u>
      ) : (
        <span key={index}>{char}</span>
      );
    });
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-dark overflow-hidden">
      <header className="px-6 py-4 border-b border-white/10">
        <h1 className="text-2xl font-bold text-white">Markdown Notes</h1>
      </header>

      <main className="flex-grow flex relative overflow-hidden flex-col md:flex-row mr-4 md:mr-0">
        <div className="max-h-96 overflow-hidden">
          <div className="h-full p-4 flex">
            <NoteEditor
              activeNote={activeNote}
              onSave={handleSaveNote}
              onCheckGrammar={handleCheckGrammar}
              onView={handleViewNote}
            />
          </div>
        </div>
        {grammarErrors.length > 0 && (
          <div className="max-h-80">
            <div className="border-2 border-slate-300 max-h-40 md:max-h-full md:min-h-52 mt-3 p-3 max-w-80 overflow-auto">
              <h2 className="text-xl">Text Preview</h2>
              {underlineText(grammarChecking)}
            </div>
            <div className="flex flex-col items-center pl-3 pr-10 py-10 max-h-72 overflow-auto ">
              <ol className="space-y-4">
                {grammarErrors.map((err, index) => {
                  const context = grammarChecking.slice(
                    err?.context?.offset,
                    err?.context?.offset + err.context.length
                  );
                  return (
                    <li key={index}>
                      <h1 className="text-xl">Check {index}:</h1>
                      <span>{`${err?.message}\n`} </span>
                      <span className="italic">{`"${context}"`}</span>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
        )}

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
