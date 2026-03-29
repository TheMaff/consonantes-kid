// src/pages/Profile.tsx
import { Box, Avatar, Heading, SimpleGrid, Icon, Button, Flex, Text, VStack } from "@chakra-ui/react";
import { useAuth } from "../context/AuthContext";
import { useBadges } from "../context/BadgeContext";
import { useNavigate } from "react-router-dom";

export default function Profile() {
    const { user, signOut } = useAuth(); // Traemos user directo y signOut
    const { badges } = useBadges();
    const navigate = useNavigate();

    // 1. Guardia de Seguridad
    if (!user) {
        navigate("/login", { replace: true });
        return null;
    }

    // 2. Inteligencia de UX: Si la foto viene de Google, significa que el niño no ha elegido su avatar
    const isGooglePhoto = user.photoURL?.includes("googleusercontent.com");
    if (!user.displayName || !user.photoURL || isGooglePhoto) {
        navigate("/profile-setup", { replace: true });
        return null;
    }

    const handleLogout = async () => {
        try {
            await signOut();
            navigate("/login", { replace: true });
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    };

    return (
        <Box p={6} pb={24}>
            <Flex direction="column" align="center" gap={4} mt={8}>
                <Avatar size="2xl" src={user.photoURL} name={user.displayName} boxShadow="lg" />
                <Heading size="xl">{user.displayName}</Heading>
            </Flex>

            <Heading size="md" mt={10} mb={4} color="gray.600">
                Tus medallas ganadas
            </Heading>

            {/* Validamos que badges exista por si el contexto aún está cargando */}
            {!badges || badges.length === 0 ? (
                <Text color="gray.500" fontStyle="italic">Aún no tienes medallas. ¡Sigue jugando!</Text>
            ) : (
                <SimpleGrid columns={[3, 5]} spacing={6}>
                    {badges.map((b) => (
                        <Flex key={b.level_id} direction="column" align="center">
                            <Icon as={() => <i className="fa-solid fa-medal"></i>} boxSize={12} color="yellow.400" />
                        </Flex>
                    ))}
                </SimpleGrid>
            )}

            <VStack spacing={4} mt={12}>
                <Button w="full" size="lg" colorScheme="teal" onClick={() => navigate("/", { replace: true })}>
                    Volver al mapa
                </Button>
                <Button w="full" size="lg" colorScheme="red" variant="ghost" onClick={handleLogout}>
                    Cerrar Sesión
                </Button>
            </VStack>
        </Box>
    );
}