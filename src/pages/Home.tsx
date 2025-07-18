// src/app/Home.tsx
import { Box, Flex, Heading, Spinner } from "@chakra-ui/react";
import LinkButton from "../components/LinkButton";
import { useData } from "../context/DataContext";

export default function Home() {
    const { consonants, loading } = useData();

    if (loading) return <Spinner size="xl" mt="40" />;

    return (
        <Box p={6}>
            <Heading mb={6}>Elige una consonante</Heading>
            <Flex gap={4} wrap="wrap">
                {consonants.map((c) => (

                    // Home.tsx
                    <LinkButton
                        key={c.id}
                        to={`/level/${c.id}/${c.words[0].id}`}
                        colorScheme="teal"
                        size="lg"
                    >
                        {c.id}
                    </LinkButton>

                ))}
            </Flex>
        </Box>
    );
}
