import React from 'react';

import { Routes, Route } from 'react-router-dom';
import Main from './pages/Main';
import Repositorio from './pages/Repositorio';

import GlobalStyle from './styles/global';

function App() {

  return (
    <>
    <GlobalStyle/>
      <Routes>
        <Route path="/" element={<Main/>} />
        <Route path="/repositorio/*" element={<Repositorio/>} />
      </Routes>
    </>
  );
}

export default App;
