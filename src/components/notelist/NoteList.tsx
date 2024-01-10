import React, { useState } from 'react';
import { addDoc, collection, getFirestore } from 'firebase/firestore';
import firebaseApp from '../../axios/config';
import './NoteList.css';

interface NoteListProps {
  addNote: (content: string) => void;
  onNoteAdded: () => void;
}

const NoteList: React.FC<NoteListProps> = ({ addNote, onNoteAdded }) => {
  const [newNote, setNewNote] = useState('');
  const db = getFirestore(firebaseApp);

  const handleAddNote = async () => {
    try {
      const docRef = await addDoc(collection(db, 'notes'), { content: newNote });
      const addedNote = { id: docRef.id, content: newNote };
      addNote(addedNote);
      setNewNote('');
      onNoteAdded(); // Notifique que uma nota foi adicionada
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  return (
    <div className='addNote'>
      <input
        type="text"
        placeholder="Nova anotação:"
        value={newNote}
        onChange={(e) => setNewNote(e.target.value)}
      />
      <button onClick={handleAddNote}>Adicionar</button>
    </div>
  );
};

export default NoteList;


