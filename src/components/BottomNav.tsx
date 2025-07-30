// src/components/BottomNav.tsx
import { Box, Flex, Avatar, Text, HStack, Image } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { supabase } from '../lib/supabase';

export default function BottomNav() {
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        async function fetchUser() {
            const { data, error } = await supabase.auth.getUser();
            setUser(data?.user || null);
        }
        fetchUser();
    }, []);
    const userId = user?.id ?? "00000000-0000-0000-0000-000000000000";

    return (
        <Box
            as="nav"
            pos="fixed"
            bottom="0"
            w="100%"
            bg="white"
            boxShadow="0 -1px 6px rgba(0,0,0,0.1)"
            py={2}
        >
            <Flex align="center" justify="space-around">
                <HStack spacing={2}>
                    <Avatar size="sm" src={user?.user_metadata?.avatar_url} />
                    <Text>{user?.user_metadata?.alias || user?.email}</Text>
                </HStack>
                <HStack spacing={2}>
                    <Image boxSize="6" src="/medalla1.png" alt="Medalla" />
                    <Image boxSize="6" src="/medalla2.png" alt="Medalla" />
                </HStack>
            </Flex>
        </Box>
    );
}
