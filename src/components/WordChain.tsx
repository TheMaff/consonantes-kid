// src/components/WordChain.tsx
import React, { useState, useEffect } from "react";
import { Box, Flex, Text, Button } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import {
    DndContext, PointerSensor, TouchSensor, useSensor, useSensors,
    closestCenter, type DragEndEvent, useDraggable, useDroppable
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

import DragLetters from "./DragLetters"; // ¡Reutilizamos tu componente base!
import { type Word } from "../context/DataContext";

import correctSound from "/public/sounds/collect-points.mp3";
import errorSound from "/public/sounds/error.mp3";

const fadeSlideUp = keyframes`
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
`;

interface WordChainProps {
    wordData: Word;
    onDone: () => void;
    onError: () => void;
    onImageChange: (newImage: string) => void; // Función para cambiar la imagen arriba
    onTextChange: (newText: string) => void;
}

export default function WordChain({ wordData, onDone, onError, onImageChange, onTextChange }: WordChainProps) {
    // -1 = Armando palabra base | 0, 1, 2 = Eslabones de la cadena
    const [stepIndex, setStepIndex] = useState<number>(-1);
    const [droppedLetter, setDroppedLetter] = useState<string | null>(null);
    const [isAnimating, setIsAnimating] = useState(false);

    const steps = wordData.chainSteps || [];
    const isBasePhase = stepIndex === -1;

    // ¿Cuál era la palabra antes de este paso? (ej: si estamos en paso 0, es la base "sol")
    const previousWord = stepIndex === -1 ? "" : stepIndex === 0 ? wordData.text : steps[stepIndex - 1].word;
    const currentStepData = stepIndex >= 0 ? steps[stepIndex] : null;

    // Resetear todo si cambia el nivel
    useEffect(() => {
        setStepIndex(-1);
        setDroppedLetter(null);
        onImageChange(wordData.image);
    }, [wordData]);

    // Sensores Drag and Drop
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 5 } })
    );

    // 1️⃣ Cuando termina de armar la palabra base ("SOL")
    const handleBaseDone = () => {
        if (steps.length > 0) {
            // Ir al primer eslabón y cambiar la imagen a "SAL"
            setStepIndex(0);
            onImageChange(steps[0].image);
            onTextChange(steps[0].word);
        } else {
            onDone(); // Por si acaso no hay cadena, termina normal
        }
    };

    // Validación unificada (Arrastrar o Tocar)
    const validateChoice = (letter: string) => {
        if (isAnimating || !currentStepData) return;
        const expectedLetter = currentStepData.word[currentStepData.changeIndex];

        if (letter.toLowerCase() === expectedLetter.toLowerCase()) {
            // ¡Acierto!
            setDroppedLetter(letter);
            new Audio(correctSound).play().catch(() => { });
            setIsAnimating(true);

            // Pausa de 1.5s para que el niño vea su logro antes de cambiar a "MAL"
            setTimeout(() => {
                setDroppedLetter(null);
                setIsAnimating(false);
                const nextStep = stepIndex + 1;

                if (nextStep < steps.length) {
                    setStepIndex(nextStep);
                    onImageChange(steps[nextStep].image); // Cambiar imagen
                    onTextChange(steps[nextStep].word);
                } else {
                    onDone(); // ¡Cadena completada!
                }
            }, 1500);
        } else {
            // Error
            new Audio(errorSound).play().catch(() => { });
            onError();
        }
    };

    // 2️⃣ Drag handler
    const handleDragEnd = (e: DragEndEvent) => {
        const { active, over } = e;
        if (!over || over.id !== "target-slot") return;

        // active.id viene como "opt-A", sacamos la letra "A"
        const letter = active.id.toString().split("-")[1];
        validateChoice(letter);
    };

    // Si estamos en fase base, mostramos tu componente clásico
    if (isBasePhase) {
        return <DragLetters word={wordData.text} onDone={handleBaseDone} onError={onError} />;
    }

    if (!currentStepData) return null;

    const lettersArray = previousWord.split("");

    return (
        <Box w="100%" animation={`${fadeSlideUp} 0.5s ease-out forwards`}>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>

                {/* 1. PALABRA CON HUECO */}
                <Flex gap={2} justify="center" mb={10}>
                    {lettersArray.map((l, i) => {
                        const isTarget = i === currentStepData.changeIndex;

                        // Letras que se quedan congeladas
                        if (!isTarget) {
                            return (
                                <Box key={i} w="64px" h="64px" bg="gray.100" border="2px solid" borderColor="gray.400" borderRadius="md" display="flex" alignItems="center" justifyContent="center">
                                    <Text fontSize="3xl" fontWeight="bold" color="gray.600">{l.toUpperCase()}</Text>
                                </Box>
                            );
                        }

                        // El hueco donde se cayó la letra
                        return <TargetSlot key={i} filledLetter={droppedLetter} />;
                    })}
                </Flex>

                {/* 2. OPCIONES DE LETRAS (BANCO) */}
                {!isAnimating && (
                    <Flex gap={4} wrap="wrap" justify="center" p={4} borderWidth="2px" borderStyle="dashed" borderColor="teal.400" borderRadius="xl" bg="white">
                        {currentStepData.options.map((opt, i) => (
                            <OptionBtn key={`opt-${opt}-${i}`} id={`opt-${opt}`} letter={opt} onClick={() => validateChoice(opt)} />
                        ))}
                    </Flex>
                )}
            </DndContext>
        </Box>
    );
}

/* -------- subcomponentes -------- */

function TargetSlot({ filledLetter }: { filledLetter: string | null }) {
    const { setNodeRef, isOver } = useDroppable({ id: "target-slot" });

    return (
        <Box
            ref={setNodeRef} w="64px" h="64px"
            bg={isOver ? "teal.100" : "gray.50"}
            border="3px dashed"
            borderColor={isOver ? "teal.400" : "teal.500"}
            borderRadius="md" display="flex" alignItems="center" justifyContent="center"
        >
            {filledLetter ? (
                <Text fontSize="4xl" fontWeight="black" color="teal.500">{filledLetter.toUpperCase()}</Text>
            ) : (
                <Text opacity={0.3} fontSize="3xl">?</Text>
            )}
        </Box>
    );
}

function OptionBtn({ id, letter, onClick }: { id: string; letter: string; onClick: () => void }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id });

    return (
        <Button
            ref={setNodeRef} {...listeners} {...attributes}
            size="lg" colorScheme="blue" variant="outline" borderWidth="2px" bg="white"
            onClick={onClick} w="64px" h="64px" fontSize="2xl"
            style={{
                transform: CSS.Translate.toString(transform),
                opacity: isDragging ? 0.5 : 1,
                zIndex: isDragging ? 10 : 1,
            }}
        >
            {letter.toUpperCase()}
        </Button>
    );
}