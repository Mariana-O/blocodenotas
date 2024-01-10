import React, { useState, useEffect, useRef } from 'react';
import { updateDoc, doc, getFirestore, deleteDoc } from 'firebase/firestore';
import firebaseApp from '../../axios/config';
import './PostIt.css';

interface Note {
  id: string;
  content: string;
}

interface PostItProps {
  note: Note;
  updateNotes: () => void;
}

const PostIt: React.FC<PostItProps> = ({ note, updateNotes }) => {
  const [editedNoteContent, setEditedNoteContent] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [displayedContent, setDisplayedContent] = useState<string>(note.content);
  const [isClicked, setIsClicked] = useState(false);

  const db = getFirestore(firebaseApp);
  const noteCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDisplayedContent(note.content);
  }, [note.content]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (noteCardRef.current && !noteCardRef.current.contains(event.target as Node)) {
        if (isEditing) {
          updateNoteContent();
        }
        setIsClicked(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [noteCardRef, isEditing, updateNoteContent]);

  async function updateNoteContent() {
    try {
      if (editedNoteContent !== null) {
        const updatedNote = { ...note, content: editedNoteContent };
        await updateDoc(doc(db, 'notes', note.id), updatedNote);
        updateNotes();
        setDisplayedContent(editedNoteContent);
        setEditedNoteContent(null);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating note:', error);
    }
  }

  const handleDeleteNote = async () => {
    try {
      await deleteDoc(doc(db, 'notes', note.id));
      updateNotes();
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  }

  if (!note.id) {
    return null; // Não renderiza se não houver bloco de notas
  }

  return (
    <div
      ref={noteCardRef}
      className={`post-it ${isEditing ? 'editing' : ''} ${isClicked ? 'clicked' : ''}`}
      key={note.id}
      onClick={() => setIsClicked(true)}
    >
      <div className="post-it-buttons">
        {isEditing ? (
          <div>
            <button className="icon-button" onClick={updateNoteContent}>
              &#10003;
            </button>
            <button className="icon-button" onClick={() => setEditedNoteContent(note.content)}>
              &#10007;
            </button>
          </div>
        ) : (
          <div>
            <button className="icon-button" onClick={() => setIsEditing(true)}>
              ✎
            </button>
            <button className="icon-button" onClick={handleDeleteNote}>
              ✖
            </button>
          </div>
        )}
      </div>
      <div className="post-it-textarea">
        <textarea
          value={isEditing ? editedNoteContent || '' : displayedContent}
          onChange={(e) => setEditedNoteContent(e.target.value)}
          onBlur={isEditing ? updateNoteContent : undefined}
          placeholder="Clique para editar..."
          disabled={!isEditing}
        />
      </div>
    </div>
  );
};

export default PostIt;






