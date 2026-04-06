// src/components/DecodableText.tsx
import React, { useState } from "react";
import {
    DndContext,
    PointerSensor,
    TouchSensor,
    useSensor,
    useSensors,
    closestCenter,
    type DragEndEvent,
    useDraggable,
    useDroppable,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { type SentencePart } from "../context/DataContext";

// Ajusta estas rutas si tus sonidos están en otra parte
import correctSound from "/public/sounds/collect-points.mp3";
import errorSound from "/public/sounds/error.mp3";

interface Props {
    parts: SentencePart[];
    options: string[];
    onDone: () => void;
    onError: () => void;
}

type Position = "bank" | number;

interface Tile {
    id: string;
    text: string;
    pos: Position;
}

export default function DecodableText({ parts, options, onDone, onError }: Props) {
    // 1️⃣ Inicializa las fichas (opciones) en el banco
    const initTiles: Tile[] = options.map((opt, i) => ({
        id: `opt-${i}`,
        text: opt,
        pos: "bank" as Position,
    }));

    const [tiles, setTiles] = useState<Tile[]>(initTiles);
    const [errorSlots, setErrorSlots] = useState<Set<number>>(new Set());
    const [isCompleted, setIsCompleted] = useState(false);

    // DnD sensors (Idénticos a DragLetters)
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 5 } })
    );

    // Helper: Encuentra qué ficha está en el hueco i
    const tileInSlot = (i: number) => tiles.find((t) => t.pos === i) ?? null;

    // Extraemos solo los índices que son "huecos" (blanks)
    const blankIndices = parts
        .map((p, i) => (p.type === "blank" ? i : -1))
        .filter((i) => i !== -1);

    // Centraliza validación
    const validate = (next: Tile[]) => {
        // Verificamos si todos los huecos están ocupados por alguna ficha
        const filled = blankIndices.map((idx) => next.find((t) => t.pos === idx) ?? null);
        const allFull = filled.every((t) => t !== null);

        if (!allFull) {
            setErrorSlots(new Set());
            return;
        }

        const wrong = new Set<number>();

        // Validamos si la ficha en cada hueco coincide con el valor esperado
        filled.forEach((tile, arrayIndex) => {
            const originalPartsIndex = blankIndices[arrayIndex];
            const expectedValue = parts[originalPartsIndex].value;

            if (tile && tile.text !== expectedValue) {
                wrong.add(originalPartsIndex);
            }
        });

        setErrorSlots(wrong);

        if (wrong.size > 0) {
            onError();
            const audio = new Audio(errorSound);
            audio.play().catch(() => console.error("Error audio"));
            return;
        }

        if (wrong.size === 0) {
            setIsCompleted(true);
            const audio = new Audio(correctSound);
            audio.play().catch(() => console.error("Error audio"));
            onDone();
        }
    };

    // 2️⃣ Click handler (Para mover haciendo tap)
    const handleClickTile = (id: string) => {
        if (isCompleted) return;
        setTiles((prev) => {
            const next = [...prev];
            const idx = next.findIndex((t) => t.id === id);
            if (idx === -1) return prev;
            const tile = next[idx];

            if (tile.pos === "bank") {
                // Busca el primer hueco vacío
                const emptySlotIndex = blankIndices.find((blankIdx) => !next.some((t) => t.pos === blankIdx));
                if (emptySlotIndex !== undefined) {
                    tile.pos = emptySlotIndex;
                }
            } else {
                tile.pos = "bank";
            }

            validate(next);
            return next;
        });
    };

    // 3️⃣ Drag end handler
    const handleDragEnd = (e: DragEndEvent) => {
        if (isCompleted) return;
        const { active, over } = e;
        if (!over) return;

        const tileId = active.id.toString();
        const targetId = over.id.toString(); // "bank" o el índice del hueco
        const nextPos: Position = targetId === "bank" ? "bank" : Number(targetId);

        setTiles((prev) => {
            const next = [...prev];
            const srcIdx = next.findIndex((t) => t.id === tileId);
            if (srcIdx === -1) return prev;

            if (nextPos === "bank") {
                next[srcIdx].pos = "bank";
            } else {
                const tgtIdx = next.findIndex((t) => t.pos === nextPos);
                if (tgtIdx === -1) {
                    next[srcIdx].pos = nextPos as number;
                } else {
                    // Swap (intercambio) si el hueco ya tiene una palabra
                    const tmp = next[srcIdx].pos;
                    next[srcIdx].pos = next[tgtIdx].pos;
                    next[tgtIdx].pos = tmp;
                }
            }

            validate(next);
            return next;
        });
    };

    return (
        <Box w="100%">
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>

                {/* 1. LA ORACIÓN (Zonas de Drop y Texto Mixto) */}
                <Flex wrap="wrap" justify="center" align="center" gap={2} mb={10} fontSize={{ base: "2xl", md: "4xl" }} fontWeight="bold">
                    {parts.map((p, i) => {
                        if (p.type === "text") {
                            return <Text key={`text-${i}`} as="span">{p.value}</Text>;
                        }

                        // Si es un hueco, renderizamos el Slot
                        const tile = tileInSlot(i);
                        return (
                            <WordSlot key={`slot-${i}`} id={String(i)} wrong={errorSlots.has(i)} glow={isCompleted}>
                                {tile && (
                                    <WordBtn
                                        id={tile.id}
                                        text={tile.text}
                                        onClick={() => handleClickTile(tile.id)}
                                        disabled={isCompleted}
                                    />
                                )}
                            </WordSlot>
                        );
                    })}
                </Flex>

                {/* 2. EL BANCO DE PALABRAS */}
                {!isCompleted && (
                    <Bank>
                        {tiles
                            .filter((t) => t.pos === "bank")
                            .map((t) => (
                                <WordBtn
                                    key={t.id}
                                    id={t.id}
                                    text={t.text}
                                    onClick={() => handleClickTile(t.id)}
                                    disabled={isCompleted}
                                />
                            ))}
                    </Bank>
                )}
            </DndContext>
        </Box>
    );
}

/* -------- subcomponentes -------- */

function WordBtn({ id, text, onClick, disabled }: { id: string; text: string; onClick: () => void; disabled: boolean }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id });

    return (
        <Button
            ref={setNodeRef}
            {...(!disabled ? { ...listeners, ...attributes } : {})}
            size="lg"
            colorScheme="blue"
            variant="solid"
            cursor={disabled ? "default" : "grab"}
            onClick={onClick}
            isDisabled={disabled}
            minW="80px"
            style={{
                transform: CSS.Translate.toString(transform),
                opacity: isDragging ? 0.5 : 1,
                zIndex: isDragging ? 10 : 1,
            }}
        >
            {text}
        </Button>
    );
}

function WordSlot({ id, wrong, glow, children }: { id: string; wrong: boolean; glow: boolean; children?: React.ReactNode }) {
    const { setNodeRef, isOver } = useDroppable({ id });

    return (
        <Box
            ref={setNodeRef}
            layerStyle={glow ? "glow" : undefined}
            minW="100px" // Más ancho que el Slot de letras
            h="60px"
            bg={wrong ? "red.200" : isOver ? "teal.100" : "gray.50"}
            borderBottom="4px dashed"
            borderColor={wrong ? "red.400" : isOver ? "teal.400" : "gray.400"}
            borderRadius="md"
            display="flex"
            alignItems="center"
            justifyContent="center"
            sx={{ touchAction: "none" }}
            px={2}
        >
            {children || <Text opacity={0}>.</Text>}
        </Box>
    );
}

function Bank({ children }: { children: React.ReactNode }) {
    const { setNodeRef, isOver } = useDroppable({ id: "bank" });
    const empty = React.Children.count(children) === 0;

    return (
        <Flex
            ref={setNodeRef}
            gap={4}
            wrap="wrap"
            justify="center"
            mt={4}
            p={4}
            borderWidth="2px"
            borderStyle="dashed"
            borderColor={isOver ? "teal.400" : "gray.300"}
            borderRadius="xl"
            minH="88px"
            bg="white"
            sx={{ touchAction: "none" }}
        >
            {empty ? <Text opacity={0.4} fontWeight="medium">Arrastra las palabras a los huecos</Text> : children}
        </Flex>
    );
}