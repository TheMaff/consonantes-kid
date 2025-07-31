// src/pages/Home.tsx
import { Box, Button, VStack, Heading, Spinner } from "@chakra-ui/react"
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
            <Heading mb={6} textAlign="center">Elige una consonante</Heading>
            
            <VStack spacing={4} gap={4} wrap="nowrap" direction="column" align="center">
                {consonants.map((c, idx) => {

                    const unlocked = isUnlocked(c.id, idx);
                    const done = progress[c.id]?.done;
                    const isActive = unlocked && !done;

                    return unlocked ? (
                        <LinkButton
                            key={c.id} size={isActive ? "lg" : "sm"}
                            isDisabled={!unlocked}
                            variant={done ? "solid" : "outline"}
                            colorScheme={done ? "yellow" : isActive ? "teal" : "gray"}

                            to={`/level/${c.id}/${c.words[0].id}`}
                        >
                            {c.id}
                        </LinkButton>
                    ) : (
                        <Button
                            key={c.id}
                            size="sm"
                                variant="ghost"
                                colorScheme="gray"
                                onClick={() => unlocked && navigate(`/level/${c.id}/${c.words[0].id}`)}
                                isDisabled={!unlocked}
                        >
                            {c.id}
                        </Button>
                    );
                })}
            </VStack>
            <BottomNav />
        </Box>
    )
}
