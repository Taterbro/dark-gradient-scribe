import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getNoteById } from "@/lib/note-utils";
import NoteViewer from "@/components/NoteViewer";
import { Note } from "@/types/note";
import { useLocation } from "react-router-dom";

const ViewNote = () => {
  const { id } = useParams<{ id: string }>();
  const [note, setNote] = useState<Note | null>(null);
  // const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { marked } = location.state || {};

  // useEffect(() => {
  //   if (id) {
  //     const foundNote = getNoteById(id);

  //     if (marked) {
  //       setNote(foundNote);
  //     } else {
  //       // Note not found, redirect to home
  //       navigate('/', { replace: true });
  //     }
  //   }

  //   setIsLoading(false);
  // }, [id, navigate]);

  const handleBack = () => {
    navigate("/");
  };

  // if (isLoading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-gradient-dark">
  //       <p className="text-white">Loading note...</p>
  //     </div>
  //   );
  // }

  // if (!note) {
  //   return (
  //     <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-dark">
  //       <p className="text-xl text-white mb-4">Note not found</p>
  //       <button
  //         onClick={handleBack}
  //         className="px-4 py-2 bg-purple-600/50 hover:bg-purple-500/60 text-white rounded"
  //       >
  //         Go back
  //       </button>
  //     </div>
  //   );
  // }

  return <NoteViewer note={marked} onBack={handleBack} />;
};

export default ViewNote;
