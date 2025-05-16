
import React, { useState, useEffect, useRef } from "react";
import { Note } from "../types/note";
import { extractTitleFromContent, generateUniqueId } from "../lib/note-utils";

interface NoteEditorProps {
  activeNote: Note | null;
  onSave: (note: Note) => void;
  onCheckGrammar: () => void;
  onView: () => void;
}

const NoteEditor: React.FC<NoteEditorProps> = ({ 
  activeNote, 
  onSave,
  onCheckGrammar,
  onView
}) => {
  const [content, setContent] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (activeNote) {
      setContent(activeNote.content);
    } else {
      setContent("");
    }
  }, [activeNote]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [activeNote]);

  const handleSave = () => {
    if (!content.trim()) return;
    
    const now = new Date().toISOString();
    const title = extractTitleFromContent(content);
    
    const updatedNote: Note = activeNote 
      ? {
          ...activeNote,
          title,
          content,
          updatedAt: now
        }
      : {
          id: generateUniqueId(),
          title,
          content,
          createdAt: now,
          updatedAt: now
        };
    
    onSave(updatedNote);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow relative">
        <textarea
          ref={textareaRef}
          className="w-full h-full p-4 bg-black/20 text-white/90 resize-none outline-none border border-white/10 rounded-md focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/25 transition-all duration-200"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing in Markdown..."
        />
      </div>
      
      <div className="flex justify-between items-center mt-4 px-2">
        <div className="text-sm text-gray-400">
          {activeNote ? "Editing note" : "New note"}
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={onCheckGrammar}
            className="flex items-center px-3 py-2 bg-indigo-600/50 hover:bg-indigo-500/60 text-white rounded transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M9 11l3 3L22 4"></path><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
            Check Grammar
          </button>
          
          <button 
            onClick={handleSave}
            className="flex items-center px-3 py-2 bg-blue-600/50 hover:bg-blue-500/60 text-white rounded transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
            Save Note
          </button>
          
          <button 
            onClick={onView}
            className="flex items-center px-3 py-2 bg-purple-600/50 hover:bg-purple-500/60 text-white rounded transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            View Note
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteEditor;
