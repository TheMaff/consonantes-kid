// src/pages/Profile.tsx
import { Box, Avatar, Heading, SimpleGrid, Icon, Button } from "@chakra-ui/react";
import { useAuth } from "../context/AuthContext";
import { useBadges } from "../context/BadgeContext";

export default function Profile() {
    const { profile } = useAuth();
    const { badges } = useBadges();

    if (!profile) return null;

    return (
        <Box p={6}>
            <Avatar size="2xl" src={profile.avatar_url} mb={4} name={profile.full_name} />
            <Heading>{profile.full_name}</Heading>
            <Heading size="md" mt={6}>
                Tus medallas
            </Heading>
            <SimpleGrid columns={[3, 5]} spacing={4} mt={4}>
                {badges.map((_, i) => (
                    <Icon key={i} as={() => <i className="fa-solid fa-medal"></i>} boxSize={12} />
                ))}
            </SimpleGrid>
            <Button mt={6} colorScheme="teal">
                Compartir en redes
            </Button>
        </Box>
    );
}
