// src/pages/Level.tsx
import { useState } from "react";
import { Box, Heading } from "@chakra-ui/react";
import DragLetters from "../components/DragLetters";


export default function Level() {
    const [finished, setFinished] = useState(false);

    return (
        <Box p={6}>
            <Heading mb={4}>Forma la palabra</Heading>

            {!finished ? (
                <DragLetters word="mapa" onDone={() => setFinished(true)} />
            ) : (
                <Heading color="green.500">¡Muy bien! 😃</Heading>
            )}
        </Box>
    );
}
