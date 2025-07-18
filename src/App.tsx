// src/App.tsx
import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Level from "./pages/Level";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="level/:cons/:word" element={<Level />} />
          {/* fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
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
