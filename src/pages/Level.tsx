// src/pages/Level.tsx
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { Box, Button, Image, Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import DragLetters from "../components/DragLetters";
import { useData } from "../context/DataContext";
import { useProgress } from "../context/ProgressContext";
import BottomNav from "../components/BottomNav";
import ProgressBar from "../components/ProgressBar";

export default function Level() {
    const navigate = useNavigate();
    const { consonant, word } = useParams<{ consonant: string; word: string }>();

    const { consonants } = useData();
    const { completeWord } = useProgress();
    const [showNext, setShowNext] = useState(false);

    /* objeto consonante y palabra actuales ---------------------- */
    const currentCons = consonants.find((c) => c.id === consonant);
    const current = currentCons?.words.find((w) => w.id === word);

    /* si algo no cuadra, vuelve al mapa ------------------------- */
    if (!currentCons || !current) return <Navigate to="/" />;

    useEffect(() => setShowNext(false), [current.id]);

    /* cuando el usuario ordena bien las letras ------------------ */
    const handleDone = () => {
        completeWord(currentCons.id, currentCons.words.length)
            .then(() => setShowNext(true));
    };

    /* botón SIGUIENTE ------------------------------------------ */
    const goNext = () => {
        const idx = currentCons.words.findIndex((w) => w.id === current.id);
        const nextIdx = idx + 1;

        if (nextIdx < currentCons.words.length) {
            const nextWord = currentCons.words[nextIdx];
            setShowNext(false);
            navigate(`/level/${currentCons.id}/${nextWord.id}`);
        } else {
            navigate("/level-complete");            // terminó el nivel
        }
    };

    /* vista ----------------------------------------------------- */
    return (
        <Box p={6} textAlign="center">
            <Flex gap="4" direction="row" align="center">
                <ProgressBar current={currentCons.words.findIndex(w => w.id === current.id) + 1} total={currentCons.words.length}/>
            </Flex>

            <Flex gap="4" direction="column" align="center">

                <Image
                    src={current.image}
                    alt={current.alt}
                    boxSize="200px"
                    mb={6}
                    objectFit="contain"
                />

                <DragLetters key={current.id} word={current.text} onDone={handleDone} />

                {showNext && (
                    <Button mt={6} colorScheme="teal" onClick={goNext}>
                        Siguiente
                    </Button>
                )}

            </Flex>
            <BottomNav />
        </Box>
    );
}