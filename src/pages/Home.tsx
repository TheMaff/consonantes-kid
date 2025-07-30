// src/pages/Home.tsx
import { Box, Button, Flex, Heading, Spinner } from "@chakra-ui/react"
import LinkButton from "../components/LinkButton"
import { useData } from "../context/DataContext"
import { useProgress } from "../context/ProgressContext"
import BottomNav from "../components/BottomNav";
import { useNavigate } from "react-router-dom";

export default function Home() {
    const navigate = useNavigate();
    const { consonants, loading } = useData();
    const { progress, isUnlocked } = useProgress();

    if (loading) return <Spinner size="xl" mt="40" />

    return (
        <Box p={6}>
            <Heading mb={6}>Elige una consonante</Heading>
            <Flex gap={4} wrap="wrap">
                {consonants.map((c, idx) => {
                    const unlocked = isUnlocked(c.id, idx);
                    const done = progress[c.id]?.done;

                    return unlocked ? (
                        <LinkButton
                            key={c.id}
                            size="lg"
                            variant={done ? "solid" : "outline"}
                            colorScheme={done ? "teal" : "gray"}
                            to={`/level/${c.id}/${c.words[0].id}`}
                        >
                            {c.id}
                        </LinkButton>
                    ) : (
                        <Button
                            key={c.id}
                            size="lg"
                            variant="outline"
                                colorScheme="gray"
                                onClick={() => unlocked && navigate(`/level/${c.id}/${c.words[0].id}`)}
                                isDisabled={!unlocked}
                        >
                            {c.id}
                        </Button>
                    );
                })}
            </Flex>
            <BottomNav />
        </Box>
    )
}
