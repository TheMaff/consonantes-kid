// src/App.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import { Center, Spinner } from '@chakra-ui/react';
import { useAuth } from "./context/AuthContext";
import Home from "./pages/Home";
import Level from "./pages/Level";
import Login from "./pages/Login";
import Splash from "./pages/Splash";
import LevelComplete from "./pages/LevelComplete";
import LevelIncorrect from "./pages/LevelIncorrect";
import Profile from "./pages/Profile";
import ProfileSetup from "./pages/ProfileSetup";



export default function App() {

  // const [initializing, setInitializing] = useState(true);
  // const [session, setSession] = useState<Session | null>(null);
  const { session, loading } = useAuth();
  // const { session } = useAuth();

  if (loading) {
    return (
      <>
        <Center h="100vh" bg="#2bb5f8">
          <Spinner thickness="4px" speed="0.65s" emptyColor="blue.200" color="white" size="xl" />
          <Splash />
        </Center>
      </>
    );
  }

  return (
    <Routes>
      {/* rutas privadas */}
      {session ? (
        <>
          <Route path="/" element={<Home />} />
          <Route path="/level/:consonant/:word" element={<Level />} />
          <Route path="/level-complete" element={<LevelComplete />} />
          <Route path="/level-incorrect" element={<LevelIncorrect />} />
          <Route path="/profile-setup" element={<ProfileSetup />} />
          <Route path="/profile" element={<Profile />} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </>
      ) : (
        /* si NO hay sesión, todo te manda al login */
        <>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </>
      )}
    </Routes>
  );
}
