// src/App.tsx
import { HashRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Level from "./pages/Level";
import Login from "./pages/Login";
import AuthCallback from "./pages/AuthCallback";

import { useState } from 'react';


export default function App() {

  const [session] = useState<boolean>(false);
  return (
        
    <Routes>
        
        {!session && <Route path="/*" element={<Login />} />}

        {session && (
          <>
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Home />} />
            <Route path="/level/:consonant/:word" element={<Level />} />
          </>
        )}
        
      </Routes>
  );
}
