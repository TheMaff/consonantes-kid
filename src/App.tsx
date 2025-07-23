// src/App.tsx
import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Level from "./pages/Level";
import Login from "./pages/Login";
import AuthCallback from "./pages/AuthCallback";

import { useState, useEffect } from 'react';


export default function App() {

  const [session, setSession] = useState<boolean>(false);
  return (
    <>
      <Routes>
        {!session && <Route path="/*" element={<Login />} />}
        {session && (
          <>
            <Route path="/" element={<Home />} />
            <Route path="/level/:consonant/:word" element={<Level />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
          </>
        )}

        {/* <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="level/:cons/:word" element={<Level />} />
          
        <Route path="*" element={<Navigate to="/" />} />
         */}
        
      </Routes>
    </>
  );
}

/* Layout simple con cabecera opcional */
function Layout() {
  return (
    <>
      {/* puedes poner un Header aquí */}
      <Outlet />
    </>
  );
}
