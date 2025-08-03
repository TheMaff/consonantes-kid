// src/pages/ProfileSetup.tsx
import {
    Box,
    Heading,
    SimpleGrid,
    Image,
    Input,
    Button,
    Flex,
    useToast,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

// Lista de avatares de ejemplo (puedes apuntar a tu storage)
const AVATARS = [
    "/assets/avatars/avatar17.png",
    "/assets/avatars/avatar01.png",
    "/assets/avatars/avatar02.png",
    "/assets/avatars/avatar03.png",
    "/assets/avatars/avatar04.png",
    "/assets/avatars/avatar05.png",
    "/assets/avatars/avatar06.png",
    "/assets/avatars/avatar07.png",
    "/assets/avatars/avatar08.png",
    "/assets/avatars/avatar09.png",
    "/assets/avatars/avatar10.png",
    "/assets/avatars/avatar11.png",
    "/assets/avatars/avatar12.png",
    "/assets/avatars/avatar13.png",
    "/assets/avatars/avatar14.png",
    "/assets/avatars/avatar15.png",
    "/assets/avatars/avatar16.png",
];

export default function ProfileSetup() {
    const { session, profile, refreshProfile } = useAuth();
    const [name, setName] = useState(profile.full_name || "");
    const [avatar, setAvatar] = useState(profile.avatar_url || "");
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        if (!session) navigate("/login", { replace: true });
    }, [session]);

    const handleSubmit = async () => {
        if (!name || !avatar) {
            toast({ title: "Completa nombre y avatar", status: "warning" });
            return;
        }
        try {
            setLoading(true);
            // Actualiza user_metadata en Supabase Auth
            const { error } = await supabase.auth.updateUser({
                data: { full_name: name, avatar_url: avatar },
            });
            if (error) throw error;
            // Refresca el context de Auth
            await refreshProfile();
            toast({ title: "Perfil actualizado", status: "success", duration: 1000 });
            navigate("/", { replace: true });
        } catch (err: any) {
            toast({ title: err.message, status: "error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box p={6}>
            <Heading mb={4} textAlign="center">
                ¡Bienvenido!
            </Heading>
            <Heading size="sm" mb={2}>
                Elige tu nombre:
            </Heading>
            <Input
                placeholder="Tu nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                mb={6}
            />

            <Heading size="sm" mb={2}>
                Selecciona un avatar:
            </Heading>
            <SimpleGrid columns={[5, 4]} spacing={2} mb={6}>
                {AVATARS.map((src) => (
                    <Image
                        key={src}
                        src={src}
                        alt="avatar"
                        borderRadius="full"
                        objectFit="cover"
                        cursor="pointer"
                        border={avatar === src ? "3px solid teal" : "1px solid gray"}
                        onClick={() => setAvatar(src)}
                    />
                ))}
            </SimpleGrid>

            <Flex justify="center">
                <Button
                    colorScheme="teal"
                    onClick={handleSubmit}
                    isLoading={loading}
                >
                    Guardar perfil
                </Button>
            </Flex>
        </Box>
    );
}
