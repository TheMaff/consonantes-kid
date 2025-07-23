// src/app/Level.tsx
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { Box, Button, Heading, Image } from "@chakra-ui/react";

import DragLetters from "../components/DragLetters";
import { useState } from "react";
import { useData } from "../context/DataContext";
import { useProgress } from "../context/ProgressContext";


export default function Level() {
    const navigate = useNavigate();
    const { cons, word } = useParams(); // ej. "M", "mapa"
    const { consonants } = useData();

    const { completeWord } = useProgress();
    const [showNext, setShowNext] = useState(false);

    const consonant = consonants.find((c) => c.id === cons);
    const current = consonant?.words.find((w) => w.id === word);

    if (!consonant || !current) return <Navigate to="/" />;

    const handleDone = () => {
        completeWord(consonant.id, consonant.words.length)
            .then(() => setShowNext(true));
    };

    const goNext = () => {
        const idx = consonant.words.findIndex((w) => w.id === current.id);
        const nextIdx = idx + 1;

        if (nextIdx < consonant.words.length) {
            /* palabra siguiente del mismo nivel */
            const nextWord = consonant.words[nextIdx];
            navigate(`/level/${consonant.id}/${nextWord.id}`);
        } else {
            /* terminó el nivel → vuelve al mapa */
            navigate("/");
        }
    };

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

            <DragLetters word={current.text} onDone={handleDone} />

            {showNext && (
                <Button
                    mt={6}
                    colorScheme="teal"
                    onClick={goNext}
                >
                    Siguiente
                </Button>
            )}
        </Box>
    );
}
