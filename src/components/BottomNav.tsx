// src/components/BottomNav.tsx
import { Box, Flex, Avatar, Text, HStack, Icon } from "@chakra-ui/react";
import { useAuth } from "../context/AuthContext";
import { useBadges } from "../context/BadgeContext";

export default function BottomNav() {
    const { session } = useAuth();
    const { badges } = useBadges();

    // 🤓 Extraemos nombre y avatar desde user_metadata
    const name = session?.user.user_metadata.full_name ?? session?.user.email;
    const avatar = session?.user.user_metadata.avatar_url;

    return (
        <Box
            as="nav"
            pos="fixed" bottom="0" left="0"
            w="100%" bg="white"
            boxShadow="0 -1px 6px rgba(0,0,0,0.1)"
            py={2}
            zIndex={10}
        >
            <Flex align="center" justify="space-between" px={4}>
                {/* Avatar + nombre */}
                <HStack spacing={2}>
                    <Avatar size="sm" src={avatar || undefined} name={name ?? ""} />
                    <Text fontWeight="medium" noOfLines={1} maxW="100px">
                        {name}
                    </Text>
                </HStack>

                {/* Medallas acumuladas */}

                <HStack spacing={2} color={"gold"}>
                    {badges.map((b) => (
                        <Icon key={b.id} as={() => <i className="fa-solid fa-medal"></i>} boxSize={6} />
                    ))}
                </HStack>
            </Flex>
        </Box>
    );
}
