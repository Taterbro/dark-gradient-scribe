
import React, { useEffect } from 'react';
import { marked } from 'marked';
import { Note } from '../types/note';
import { useNavigate } from 'react-router-dom';

interface NoteViewerProps {
  note: Note;
  onBack: () => void;
}

const NoteViewer: React.FC<NoteViewerProps> = ({ note, onBack }) => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Set the document title to the note title
    document.title = `${note.title} | Markdown Notes`;
    
    // Reset title when component unmounts
    return () => {
      document.title = 'Markdown Notes';
    };
  }, [note.title]);

  const renderMarkdown = () => {
    return { __html: marked(note.content) };
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-dark text-white/90">
      <header className="border-b border-white/10 p-4 flex items-center">
        <button
          onClick={onBack}
          className="mr-4 p-2 hover:bg-white/10 rounded transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
        </button>
        <h1 className="text-xl font-medium truncate">{note.title}</h1>
      </header>
      
      <div className="flex-grow overflow-y-auto p-4 md:p-8 max-w-4xl mx-auto w-full">
        <div
          className="prose prose-invert prose-sm sm:prose-base max-w-none markdown-content"
          dangerouslySetInnerHTML={renderMarkdown()}
        />
      </div>
      
      <footer className="border-t border-white/10 p-4 text-sm text-white/60">
        <p>Last updated: {new Date(note.updatedAt).toLocaleString()}</p>
      </footer>
    </div>
  );
};

export default NoteViewer;
