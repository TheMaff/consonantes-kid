// src/pages/Profile.tsx

import {
    Box,
    Avatar,
    Heading,
    SimpleGrid,
    Icon,
    Button,
    Flex,
    Text,
} from "@chakra-ui/react";
import { useAuth } from "../context/AuthContext";
import { useBadges } from "../context/BadgeContext";
import { useNavigate } from "react-router-dom";

export default function Profile() {
    const { session, profile } = useAuth();
    const { badges } = useBadges();
    const navigate = useNavigate();

    // Si no hay sesión, redirige al login
    if (!session) {
        navigate("/login", { replace: true });
        return null;
    }

    // Si el user_metadata no tiene nombre o avatar, va a ProfileSetup
    if (!profile.full_name || !profile.avatar_url) {
        navigate("/profile-setup", { replace: true });
        return null;
    }

    return (
        <Box p={6}>
            <Flex direction="column" align="center" gap={4}>
                <Avatar
                    size="2xl"
                    src={profile.avatar_url}
                    name={profile.full_name}
                />
                <Heading>{profile.full_name}</Heading>
            </Flex>

            <Heading size="md" mt={8} mb={4}>
                Tus medallas
            </Heading>
            {badges.length === 0 ? (
                <Text>No tienes medallas todavía.</Text>
            ) : (
                <SimpleGrid columns={[3, 5]} spacing={4}>
                    {badges.map((b) => (
                        <Icon
                            key={b.level_id}
                            as={() => <i className="fa-solid fa-medal"></i>}
                            boxSize={12}
                            color="gold"
                        />
                    ))}
                </SimpleGrid>
            )}

            <Button
                mt={8}
                colorScheme="teal"
                onClick={() => navigate("/", { replace: true })}
            >
                Volver al inicio
            </Button>
        </Box>
    );
}
