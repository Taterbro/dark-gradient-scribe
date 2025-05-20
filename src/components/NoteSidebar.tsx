import React from "react";
import { Note } from "../types/note";

interface NoteSidebarProps {
  notes: Note[];
  activeNoteId: string | null;
  onSelectNote: (note: Note) => void;
  onCreateNote: () => void;
  onDeleteNote: (id: string) => void;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

const NoteSidebar: React.FC<NoteSidebarProps> = ({
  notes,
  activeNoteId,
  onSelectNote,
  onCreateNote,
  onDeleteNote,
  isSidebarOpen,
  onToggleSidebar,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year:
        date.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
    });
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full transition-all duration-300 ${
        isSidebarOpen ? "w-64" : "w-10"
      } bg-black/30 border-l border-white/10 flex flex-col backdrop-blur-sm z-10`}
    >
      {/* Sidebar toggle */}
      <button
        onClick={onToggleSidebar}
        className="absolute top-4 left-0 transform -translate-x-full bg-black/40 hover:bg-black/60 p-2 rounded-l-md transition-colors"
      >
        {isSidebarOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        )}
      </button>

      {/* Sidebar content */}
      {isSidebarOpen && (
        <>
          <div className="flex justify-between items-center p-4 border-b border-white/10">
            <h2 className="font-semibold text-white/90">Your Notes</h2>
            <button
              onClick={onCreateNote}
              className="p-1 bg-purple-500/30 hover:bg-purple-500/50 rounded transition-colors"
              aria-label="Create new note"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
          </div>

          <div className="flex-grow overflow-y-auto scrollbar-hide">
            {notes?.length > 0 ? (
              <ul>
                {notes.map((note, index) => (
                  <li
                    key={index}
                    className={`p-3 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-colors ${
                      activeNoteId === note.id ? "bg-white/10" : ""
                    }`}
                  >
                    <div
                      className="flex justify-between items-start"
                      onClick={() => onSelectNote(note)}
                    >
                      <div className="flex-1 mr-2">
                        <h3 className="text-sm font-medium text-white/90 line-clamp-1">
                          {note.title}
                        </h3>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteNote(note.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 rounded transition-all"
                        aria-label="Delete note"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-red-400"
                        >
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                      </button>
                    </div>

                    <p className="text-xs text-white/60 mt-1 line-clamp-2">
                      {note.body.text.substring(0, 100)}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-4 text-center text-white/60 text-sm">
                <p>No notes yet</p>
                <button
                  onClick={onCreateNote}
                  className="mt-2 text-purple-400 hover:text-purple-300"
                >
                  Create your first note
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default NoteSidebar;
