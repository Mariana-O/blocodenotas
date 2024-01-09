import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from './App.tsx';
import Home  from './routes/Home.tsx';
import PostIt from './routes/Postit.tsx';
import './index.css';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          {/* Index route for Home */}
          <Route
            index
            element={<Home updateUsers={() => { /* implemente a lógica para atualizar usuários */ }} />}
          />
          {/* Route for PostIt */}
          <Route path="/new" element={<PostIt setEditedUserName={() => { } } UserCollectionRef={{}} user={{
            id: '',
            name: ''
          }} updateUsers={function (): void {
            throw new Error('Function not implemented.');
          } } deleteUser={function (id: string): void {
            throw new Error('Function not implemented.');
          } } />} /> 
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);;
