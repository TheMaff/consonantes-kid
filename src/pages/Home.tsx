// src/app/Home.tsx
import { Box, Flex, Heading, Spinner } from "@chakra-ui/react";
import LinkButton from "../components/LinkButton";
import { useData } from "../context/DataContext";
import { useProgress } from "../context/ProgressContext";

export default function Home() {
    const { consonants, loading } = useData();
    const { progress, isUnlocked } = useProgress();

    if (loading) return <Spinner size="xl" mt="40" />;

    return (
        <Box p={6}>
            <Heading mb={6}>Elige una consonante</Heading>
            <Flex gap={4} wrap="wrap">
                {consonants.map((c,idx) => (

                    // Home.tsx
                    <LinkButton
                        key={c.id}
                        size="lg"

                        isDisabled={!isUnlocked(c.id, idx)}
                        variant={progress[c.id]?.done ? "solid" : "outline"}
                        colorScheme={progress[c.id]?.done ? "teal" : "gray"}
                        to={`/level/${c.id}/${c.words[0].id}`}
                    >
                        {c.id}
                    </LinkButton>

                ))}
            </Flex>
        </Box>
    );
}