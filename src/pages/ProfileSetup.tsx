// src/pages/ProfileSetup.tsx
import { Box, Heading, SimpleGrid, Image, Input, Button, Flex, useToast } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { updateProfile } from "firebase/auth"; // <-- Magia de Firebase
import { useNavigate } from "react-router-dom";

const AVATARS = [
    "/assets/avatars/avatar17.png", "/assets/avatars/avatar01.png", "/assets/avatars/avatar02.png",
    "/assets/avatars/avatar03.png", "/assets/avatars/avatar04.png", "/assets/avatars/avatar05.png",
    "/assets/avatars/avatar06.png", "/assets/avatars/avatar07.png", "/assets/avatars/avatar08.png",
    "/assets/avatars/avatar09.png", "/assets/avatars/avatar10.png", "/assets/avatars/avatar11.png",
    "/assets/avatars/avatar12.png", "/assets/avatars/avatar13.png", "/assets/avatars/avatar14.png",
    "/assets/avatars/avatar15.png", "/assets/avatars/avatar16.png",
];

export default function ProfileSetup() {
    const { user } = useAuth();
    // Pre-llenamos con el nombre del padre (Google) o vacío, y dejamos el avatar en blanco para obligar a elegir
    const [name, setName] = useState(user?.displayName || "");
    const [avatar, setAvatar] = useState("");
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) navigate("/login", { replace: true });
    }, [user, navigate]);

    const handleSubmit = async () => {
        if (!name || !avatar) {
            toast({ title: "Completa nombre y avatar", status: "warning" });
            return;
        }
        try {
            setLoading(true);

            // Actualizamos el perfil nativo de Firebase
            if (user) {
                await updateProfile(user, {
                    displayName: name,
                    photoURL: avatar
                });
            }

            toast({ title: "¡Perfil listo!", status: "success", duration: 1500 });
            // Forzamos la recarga suave para que la app lea los nuevos datos al ir al Home
            window.location.href = "/";

        } catch (err: any) {
            toast({ title: "Error al guardar", description: err.message, status: "error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box p={6}>
            <Heading mb={4} textAlign="center">¡Bienvenido!</Heading>
            <Heading size="sm" mb={2}>Elige tu nombre de jugador:</Heading>
            <Input
                placeholder="Tu nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                mb={6}
                size="lg"
            />

            <Heading size="sm" mb={2}>Selecciona tu avatar:</Heading>
            <SimpleGrid columns={[4, 5]} spacing={3} mb={8}>
                {AVATARS.map((src) => (
                    <Image
                        key={src}
                        src={src}
                        alt="avatar"
                        borderRadius="full"
                        objectFit="cover"
                        cursor="pointer"
                        boxSize="70px"
                        border={avatar === src ? "4px solid #319795" : "2px solid transparent"}
                        transform={avatar === src ? "scale(1.1)" : "none"}
                        transition="all 0.2s"
                        onClick={() => setAvatar(src)}
                    />
                ))}
            </SimpleGrid>

            <Flex justify="center">
                <Button colorScheme="teal" size="lg" w="full" onClick={handleSubmit} isLoading={loading}>
                    ¡A Jugar!
                </Button>
            </Flex>
        </Box>
    );
}