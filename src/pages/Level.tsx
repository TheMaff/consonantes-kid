// src/app/Level.tsx
import { useParams, Navigate } from "react-router-dom";
import { Box, Heading, Image } from "@chakra-ui/react";
import LinkButton from "../components/LinkButton";

import { useState } from "react";
import DragLetters from "../components/DragLetters";
import { useData } from "../context/DataContext";

export default function Level() {
    const { cons, word } = useParams();        // ej. "M", "mapa"
    const { consonants } = useData();
    const [done, setDone] = useState(false);

    const consonant = consonants.find((c) => c.id === cons);
    const current = consonant?.words.find((w) => w.id === word);

    if (!consonant || !current) return <Navigate to="/" />;

    return (
        <Box p={6}>
            <Heading mb={4}>{current.text.toUpperCase()}</Heading>

            <Image
                src={current.image}
                alt={current.alt}
                boxSize="200px"
                mb={6}
                objectFit="contain"
            />

            {!done ? (
                <DragLetters word={current.text} onDone={() => setDone(true)} />
            ) : (
                <>
                    <Heading color="green.500" mb={4}>
                        ¡Excelente! ⭐
                    </Heading>
                        <LinkButton to="/" colorScheme="teal">
                            Volver al mapa
                        </LinkButton>

                </>
            )}
        </Box>
    );
}
