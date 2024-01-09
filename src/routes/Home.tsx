import React, { useState, useEffect } from 'react';
import { updateDoc, doc, deleteDoc, getFirestore, collection, addDoc,getDocs } from 'firebase/firestore';
import firebaseApp from '../axios/config';
import PostIt from './Postit';

interface User {
  id: string;
  name: string;
  email: string;
}

interface UserManagerProps {
  updateUsers: () => void;
}

const Home: React.FC<UserManagerProps> = ({ updateUsers }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [newUserName, setNewUserName] = useState<string>('');
  const [newUserEmail, setNewUserEmail] = useState<string>('');
  const [editedUserName, setEditedUserName] = useState<string | null>(null);

  const db = getFirestore(firebaseApp);
  const UserCollectionRef = collection(db, 'users');

  const addUser = async () => {
    await addDoc(UserCollectionRef, { name: newUserName, email: newUserEmail });
    updateUsers(); // Atualiza os usuários após a adição
    setNewUserName('');
    setNewUserEmail('');
  };

  const deleteUser = async (id: string) => {
    const userDoc = doc(db, 'users', id);
    await deleteDoc(userDoc);
    updateUsers(); // Atualiza os usuários após a exclusão
  };

  const updateUserName = async (userId: string) => {
    if (editedUserName !== null) {
      const updatedUser = { ...users.find((user) => user.id === userId), name: editedUserName };
      await updateDoc(doc(db, 'users', userId), updatedUser);
      updateUsers(); // Atualiza os usuários após a atualização
    }
    setEditedUserName(null);
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await getDocs(UserCollectionRef);
      setUsers(data.docs.map((doc: any) => ({ ...doc.data(), id: doc.id } as User)));
    };

    fetchData();
  }, [UserCollectionRef, updateUsers]); // Adiciona updateUsers à dependência para garantir a atualização

  return (
    <div>
      {users.map((user) => (
        <PostIt
          key={user.id}
          user={user}
          updateUsers={updateUsers}
          deleteUser={deleteUser}
          setEditedUserName={(editedName) => setEditedUserName(editedName)}
          UserCollectionRef={UserCollectionRef}
        />
      ))}
    </div>
  );
};

export default Home;