import { useState, useEffect, useRef } from 'react';
import { updateDoc, doc, deleteDoc, getFirestore, collection } from 'firebase/firestore';
import firebaseApp from '../axios/config';
import './PostIt.css';

interface PostItProps {
  user: {
    id: string;
    name: string;
  };
  updateUsers: () => void;
  deleteUser: (id: string) => void;
  setEditedUserName: React.Dispatch<React.SetStateAction<string | null>>; 
  UserCollectionRef: any; 
}

const PostIt: React.FC<PostItProps> = ({ user, updateUsers, deleteUser, setEditedUserName, UserCollectionRef }) => {
  const [editedUserName, setEditedUserNameLocal] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [displayedName, setDisplayedName] = useState<string>(user.name);
  const [isClicked, setIsClicked] = useState(false);

  const db = getFirestore(firebaseApp);

  const postItRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDisplayedName(user.name);
  }, [user.name]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (postItRef.current && !postItRef.current.contains(event.target as Node)) {
        if (isEditing) {
          updateUserName();
        }
        setIsClicked(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [postItRef, isEditing, updateUserName]);

  async function updateUserName() {
    try {
      if (editedUserName !== null) {
        const updatedUser = { ...user, name: editedUserName };
        await updateDoc(doc(db, 'users', user.id), updatedUser);
        await UserCollectionRef.doc(user.id).update({ name: editedUserName });
        updateUsers();
        setDisplayedName(editedUserName);
        setEditedUserName(null);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  }
  
  async function handleDeleteUser() {
    try {
      await deleteUser(user.id);
      await UserCollectionRef.doc(user.id).delete(); 
      updateUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  }

  return (
    <div
      ref={postItRef}
      className={`post-it ${isEditing ? 'editing' : ''} ${isClicked ? 'clicked' : ''}`}
      key={user.id}
      onClick={() => setIsClicked(true)}
    >
      <div className="post-it-buttons">
        {isEditing ? (
          <div>
            <button className="icon-button" onClick={() => updateUserName()}>
              &#10003;
            </button>
            <button className="icon-button" onClick={() => setEditedUserName(user.name)}>
              &#10007;
            </button>
          </div>
        ) : (
          <div>
            <button className="icon-button" onClick={() => setIsEditing(true)}>
              ✎
            </button>
            <button className="icon-button" onClick={handleDeleteUser}>
              ✖
            </button>
          </div>
        )}
      </div>
      <div className="post-it-textarea">
        <textarea
          value={isEditing ? editedUserName || '' : displayedName}
          onChange={(e) => setEditedUserNameLocal(e.target.value)}
          onBlur={updateUserName}
          placeholder="Clique para editar..."
          disabled={!isEditing}
        >{displayedName}</textarea>
      </div>
    </div>
  );
};

export default PostIt;
