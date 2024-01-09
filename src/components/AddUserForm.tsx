import { useState } from "react";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import firebaseApp from "../axios/config";

interface AddUserFormProps {
  updateUsers: () => void;
}

const AddUserForm: React.FC<AddUserFormProps> = ({ updateUsers }) => {
  const [newUserName, setNewUserName] = useState<string>("");
  const [newUserEmail, setNewUserEmail] = useState<string>("");

  const db = getFirestore(firebaseApp);
  const UserCollectionRef: any = collection(db, "users");

  const addUser = async () => {
    try {
      // Verifica se os campos não estão vazios
      if (newUserName.trim() === "" || newUserEmail.trim() === "") {
        console.log("Por favor, preencha todos os campos");
        return;
      }

      // Faz a requisição apenas se os campos não estão vazios
      await addDoc(UserCollectionRef, { name: newUserName, email: newUserEmail });
      updateUsers();
      setNewUserName("");
      setNewUserEmail("");
    } catch (error) {
      console.error("Erro ao adicionar usuário:", error);
    }
  };

  return (
    <div className="addNote">
      <input
        type="text"
        placeholder="Nome"
        value={newUserName}
        onChange={(e) => setNewUserName(e.target.value)}
      />
      <button onClick={addUser}>Adicionar</button>
    </div>
  );
};

export default AddUserForm;