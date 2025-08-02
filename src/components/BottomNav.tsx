// src/components/BottomNav.tsx

import { Box, Flex, Avatar, Text, HStack, Icon, Button } from "@chakra-ui/react";
import { useAuth } from "../context/AuthContext";
import { useBadges } from "../context/BadgeContext";
import { useNavigate } from "react-router-dom";

export default function BottomNav() {
    const { session } = useAuth();
    const { badges } = useBadges();

    const navigate = useNavigate();


    // 🤓 Extraemos nombre y avatar desde user_metadata
    const name = session?.user.user_metadata.full_name ?? session?.user.email;
    const email = session?.user.email;
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

                <Button variant="plain" gap={2} padding={0} onClick={() => { navigate("/profile") }}>
                    <Avatar size="sm" src={avatar || undefined} name={name ?? ""} />
                    <Flex direction="column" align={"flex-start"} maxW="150px">
                        <Text fontWeight="medium" fontSize={"sm"} noOfLines={1} maxW="100px"> {name} </Text>
                        <Text fontWeight="light" fontSize={"xs"} noOfLines={1}> {email} </Text>
                    </Flex>
                </Button>

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
