// src/components/DragLetters.tsx
import { useState } from "react";
import {
    DndContext,
    PointerSensor,
    closestCenter,
    TouchSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
    useDraggable,
    useDroppable,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import React from "react";

/* ---------- tipos ---------- */
interface Props {
    word: string;
    onDone: () => void;
}

type Position = "bank" | number;     // índice del slot
type Tile = { id: string; letter: string; pos: Position };

/* ---------- componente ---------- */
export default function DragLetters({ word, onDone }: Props) {
    const letters = word.split("");

    /* banco barajado */
    const initTiles: Tile[] = [...letters]
        .sort(() => Math.random() - 0.5)
        .map((l, i) => ({ id: `t-${i}`, letter: l, pos: "bank" }));

    const [tiles, setTiles] = useState<Tile[]>(initTiles);
    const [errorSlots, setErrorSlots] = useState<Set<number>>(new Set());

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 5 }
        }),
        useSensor(TouchSensor, {
            activationConstraint: { delay: 100, tolerance: 5 },
        })
    );

    /* ficha en slot i */
    const tileInSlot = (idx: number) =>
        tiles.find((t) => t.pos === idx) ?? null;

    /* ------------ drag end ------------- */
    const handleDragEnd = (e: DragEndEvent) => {
        const { active, over } = e;
        if (!over) return;

        const tileId = active.id.toString();
        const targetId = over.id.toString(); // "bank" | "slot-n"
        const nextPos: Position =
            targetId === "bank" ? "bank" : +targetId.replace("slot-", "");

        /* actualiza tiles y calcula errores en el mismo callback */
        setTiles((prev) => {
            const srcIdx = prev.findIndex((t) => t.id === tileId);
            if (srcIdx === -1) return prev;

            const nextTiles = [...prev];

            const swap = (a: number, b: number) => {
                const tmp = nextTiles[a].pos;
                nextTiles[a].pos = nextTiles[b].pos;
                nextTiles[b].pos = tmp;
            };

            if (nextPos === "bank") {
                nextTiles[srcIdx].pos = "bank";            // slot → banco
            } else {
                const tgtIdx = nextTiles.findIndex((t) => t.pos === nextPos);
                if (tgtIdx === -1) {
                    /* slot libre */
                    nextTiles[srcIdx].pos = nextPos;
                } else {
                    /* slot ocupado -> intercambia */
                    swap(srcIdx, tgtIdx);
                }
            }

            /* --------- validación ---------- */
            const filled = letters.map(
                (_, i) => nextTiles.find((t) => t.pos === i)?.letter ?? null
            );

            const allFull = filled.every(Boolean);
            if (!allFull) {
                setErrorSlots(new Set());
            } else {
                const wrong = new Set<number>();
                filled.forEach((l, i) => {
                    if (l !== letters[i]) wrong.add(i);
                });
                setErrorSlots(wrong);
                if (wrong.size === 0) onDone();
            }

            return nextTiles;
        });
    };

    /* -------------- JSX -------------- */
    return (
        <Box>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                {/* slots */}
                <Flex gap={2} justify="center" mb={6}>
                    {letters.map((_, i) => (
                        <Slot key={i} id={`slot-${i}`} wrong={errorSlots.has(i)}>
                            {tileInSlot(i) && (
                                <TileBtn
                                    id={tileInSlot(i)!.id}
                                    letter={tileInSlot(i)!.letter}
                                />
                            )}
                        </Slot>
                    ))}
                </Flex>

                {/* banco */}
                <Bank>
                    {tiles
                        .filter((t) => t.pos === "bank")
                        .map((t) => (
                            <TileBtn key={t.id} id={t.id} letter={t.letter} />
                        ))}
                </Bank>
            </DndContext>
        </Box>
    );
}

/* ========= sub-componentes ========= */

function TileBtn({ id, letter }: { id: string; letter: string }) {
    const { setNodeRef, listeners, attributes, transform, isDragging } =
        useDraggable({ id });

    return (
        <Button
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            size="lg"
            cursor="grab"
            style={{
                transform: CSS.Translate.toString(transform),
                opacity: isDragging ? 0.5 : 1,
            }}
        >
            {letter.toUpperCase()}
        </Button>
    );
}

function Slot({
    id,
    wrong,
    children,
}: {
    id: string;
    wrong: boolean;
    children: React.ReactNode;
}) {
    const { setNodeRef, isOver } = useDroppable({ id });
    return (
        <Box
            ref={setNodeRef}
            w="64px"
            h="64px"
            bg={wrong ? "red.200" : isOver ? "teal.100" : "gray.100"}
            border="2px dashed"
            borderColor={wrong ? "red.400" : "gray.400"}
            borderRadius="md"
            display="flex"
            alignItems="center"
            justifyContent="center"
            sx={{ touchAction: "none" }}
        >
            {children}
        </Box>
    );
}

function Bank({ children }: { children: React.ReactNode }) {
    const { setNodeRef, isOver } = useDroppable({ id: "bank" });
    const empty = React.Children.count(children) === 0;

    return (
        <Flex
            ref={setNodeRef}
            gap={2}
            wrap="wrap"
            justify="center"
            mt={4}
            p={2}
            borderWidth="2px"
            borderStyle="dashed"
            borderColor={isOver ? "teal.400" : "gray.300"}
            borderRadius="md"
            minH="68px"
            sx={{ touchAction: "none" }} // evita scroll en móviles
        >
            {empty ? <Text opacity={0.4}>Banco vacío</Text> : children}
        </Flex>
    );
}
