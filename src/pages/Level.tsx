// src/pages/Level.tsx
import { useScore } from "../context/ScoreContext";
import { keyframes } from "@emotion/react";

import { useParams, useNavigate, Navigate } from "react-router-dom";
import { Box, Button, Image, Text, Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import DragLetters from "../components/DragLetters";
import { useData } from "../context/DataContext";
import { useProgress } from "../context/ProgressContext";
import BottomNav from "../components/BottomNav";
import ProgressBar from "../components/ProgressBar";
import { useBadges } from "../context/BadgeContext";
import { useLives } from "../context/LivesContext";

const floatUp = keyframes`
  0% { opacity: 0; transform: translateY(20px) scale(0.8); }
  20% { opacity: 1; transform: translateY(0px) scale(1.2); }
  80% { opacity: 1; transform: translateY(-30px) scale(1); }
  100% { opacity: 0; transform: translateY(-50px) scale(1); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
`;

export default function Level() {
    const { grantBadge } = useBadges();
    const navigate = useNavigate();
    const { consonant, word } = useParams<{ consonant: string; word: string }>();

    const { consonants } = useData();
    const { completeWord } = useProgress();
    const { lives, loseLife } = useLives();
    const [showNext, setShowNext] = useState(false);

    /* objeto consonante y palabra actuales ---------------------- */
    const currentCons = consonants.find((c) => c.id === consonant);
    const current = currentCons?.words.find((w) => w.id === word);

    const speak = (text: string) => {
        if ("speechSynthesis" in window) {
            const utter = new SpeechSynthesisUtterance(text);
            utter.lang = "es-US"; // Configurar el idioma a español
            utter.rate = 0.7; // Velocidad normal
            utter.pitch = 0.8; // Ajuste de tono
            window.speechSynthesis.speak(utter);
        }
    };

    const { addPoints, commitPoints, discardPoints } = useScore();
    const [showPoints, setShowPoints] = useState(false); // <-- Estado para la animación

    // Restablece el botón "Siguiente" y pronuncia la palabra
    // cada vez que cambia la palabra actual.
    useEffect(() => {
        if (!current) return;
        setShowNext(false);
        speak(current.text);
    }, [current]);

    /* si algo no cuadra, vuelve al mapa ------------------------- */
    if (!currentCons || !current) return <Navigate to="/" />;

    /* cuando el usuario ordena bien las letras ------------------ */
    const handleDone = async () => {
        // 1️⃣ Completar la palabra
        await completeWord(currentCons.id, currentCons.words.length);

        // 2️⃣ Si era la última palabra del nivel, otorgar medalla
        const idx = currentCons.words.findIndex((w) => w.id === current.id);
        if (idx === currentCons.words.length - 1) {
            try {
                await grantBadge(currentCons.id);
            } catch (err) {
                console.error("Error al otorgar medalla:", err);
            }
        }

        // Sumar 10 puntos a Firestore
        addPoints(10);

        // Disparar la animación visual
        setShowPoints(true);

        // 3️⃣ Mostrar botón "Siguiente"
        setShowNext(true);
    };
  
    const goNext = async () => {
        setShowPoints(false);
        setShowNext(false);

        const idx = currentCons.words.findIndex((w) => w.id === current.id);
        const nextIdx = idx + 1;

        if (nextIdx < currentCons.words.length) {
            // Siguiente palabra
            const nextWord = currentCons.words[nextIdx];
            navigate(`/level/${currentCons.id}/${nextWord.id}`);
        } else {
            // Nivel completo
            await commitPoints();
            navigate("/level-complete");
        }
    };

    /* vista ----------------------------------------------------- */
    return (
        <Box p={6} textAlign="center">
            <Flex justify="center" gap="4" direction="row" align="center">
                <ProgressBar current={currentCons.words.findIndex(w => w.id === current.id) + 1} total={currentCons.words.length}/>
            </Flex>

            <Flex gap="4" direction="column" align="center" position="relative">

                {/* Animación del +10 Flotante */}
                {showPoints && (
                    <Box
                        position="absolute"
                        top="20%"
                        zIndex="10"
                        color="yellow.400"
                        fontSize="5xl"
                        fontWeight="black"
                        textShadow="0px 3px 0px #b7791f, 0px 5px 10px rgba(0,0,0,0.3)"
                        animation={`${floatUp} 1.5s ease-out forwards`}
                    >
                        +10
                    </Box>
                )}

                <Image
                    src={current.image}
                    alt={current.alt}
                    boxSize="200px"
                    mb={6}
                    objectFit="contain"
                    onClick={() => speak(current.text)}
                    cursor="pointer"
                />

                {!showNext ? (
                    // 1. Si no ha terminado, mostramos las fichas para jugar
                    <DragLetters
                        key={current.id}
                        word={current.text}
                        onDone={handleDone}
                        onError={() => {
                            loseLife();
                            if (lives - 1 <= 0) {
                                discardPoints(); // <-- Si pierde todas las vidas, se van los puntos
                                navigate("/level-incorrect");
                            }
                        }}
                    />
                ) : (
                    // 2. Si ya terminó, mostramos la palabra en Letra Ligada gigante
                    <Box
                            animation={`${fadeIn} 0.6s ease-out forwards`}
                        p={0}
                    >
                        <Text
                            fontFamily="'Dancing Script', cursive;"
                            fontSize="7xl"
                            color="#319895"
                            lineHeight="1"
                        >
                            {/* Convertimos a minúsculas porque la letra ligada escolar se enseña así */}
                            {current.text.toLowerCase()}
                        </Text>
                    </Box>
                )}

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