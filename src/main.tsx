import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { getDocs, collection } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import firebaseApp from './axios/config';
import App from './App.tsx';
import PostIt from './components/postit/PostIt.tsx';
import NoteList from './components/notelist/NoteList.tsx';
import Navbar from './components/navbar/Navbar.tsx';
import './App.css';

const Main = () => {
  const [notes, setNotes] = useState([]);

  const fetchNotes = async () => {
    const db = getFirestore(firebaseApp);
    const notesCollection = collection(db, 'notes');
    const notesSnapshot = await getDocs(notesCollection);
    const notesData = notesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setNotes(notesData);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <React.StrictMode>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <div>
                <Navbar />
                {notes.map((note) => (
                  <PostIt
                    key={note.id}
                    note={note}
                    updateNotes={fetchNotes}
                  />
                ))}
              </div>
            }
          />
          <Route
            path="/new"
            element={
              <div>
              <Navbar />
                <NoteList
                  addNote={(newUserName: string) => {
                    console.log('New user added:', newUserName);
                  }}
                  onNoteAdded={fetchNotes} // Atualize as notas após adicionar uma nova
                />
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </React.StrictMode>
  );
};

ReactDOM.render(<Main />, document.getElementById('root'));
