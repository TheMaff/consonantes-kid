// src/components/DragLetters.tsx
import React, { useState } from "react";
import {
    DndContext,
    PointerSensor,
    TouchSensor,
    useSensor,
    useSensors,
    closestCenter,
    type DragEndEvent,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import {
    Box,
    Button,
    Flex,
    Text
} from "@chakra-ui/react";
import { useDraggable, useDroppable } from "@dnd-kit/core";

interface Props {
    word: string;
    onDone: () => void;
}

type Position = "bank" | number; // slot index

interface Tile {
    id: string;
    letter: string;
    pos: Position;
}

export default function DragLetters({ word, onDone }: Props) {
    const letters = word.split("");

    // initialize a shuffled bank
    const initTiles: Tile[] = [...letters]
        .sort(() => Math.random() - 0.5)
        .map((l, i) => ({ id: `t-${i}`, letter: l, pos: "bank" }));

    const [tiles, setTiles] = useState<Tile[]>(initTiles);
    const [errorSlots, setErrorSlots] = useState<Set<number>>(new Set());

    /** helpers */
    const tileInSlot = (idx: number) =>
        tiles.find((t) => t.pos === idx) ?? null;

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 5 } })
    );

    /** click handler: place or return */
    function handleClickTile(id: string) {
        setTiles((prev) => {
            const next = [...prev];
            const i = next.findIndex((t) => t.id === id);
            if (i === -1) return prev;
            const tile = next[i];

            if (tile.pos === "bank") {
                // find first empty slot
                const emptyIndex = letters.findIndex((_, slot) =>
                    !next.some((t) => t.pos === slot)
                );
                if (emptyIndex >= 0) {
                    tile.pos = emptyIndex;
                }
            } else {
                // return to bank
                tile.pos = "bank";
            }

            // re-validate just like on drag
            const filled = letters.map(
                (_, idx) => next.find((t) => t.pos === idx)?.letter ?? null
            );
            const allFull = filled.every(Boolean);
            if (!allFull) {
                setErrorSlots(new Set());
            } else {
                const wrong = new Set<number>();
                filled.forEach((l, idx) => {
                    if (l !== letters[idx]) wrong.add(idx);
                });
                setErrorSlots(wrong);
                if (wrong.size === 0) onDone();
            }

            return next;
        });
    }

    /** drag end: unchanged except for state update */
    function handleDragEnd(e: DragEndEvent) {
        const { active, over } = e;
        if (!over) return;
        const tileId = active.id.toString();
        const targetId = over.id.toString(); // “bank” or “slot-N”
        const nextPos: Position =
            targetId === "bank"
                ? "bank"
                : +targetId.replace("slot-", "");

        setTiles((prev) => {
            const next = [...prev];
            const src = next.findIndex((t) => t.id === tileId);
            if (src === -1) return prev;

            if (nextPos === "bank") {
                next[src].pos = "bank";
            } else {
                const occupied = next.findIndex((t) => t.pos === nextPos);
                if (occupied === -1) {
                    // empty slot
                    next[src].pos = nextPos;
                } else {
                    // swap
                    const tmp = next[src].pos;
                    next[src].pos = next[occupied].pos;
                    next[occupied].pos = tmp;
                }
            }

            // same validation as in click
            const filled = letters.map(
                (_, idx) => next.find((t) => t.pos === idx)?.letter ?? null
            );
            const allFull = filled.every(Boolean);
            if (!allFull) {
                setErrorSlots(new Set());
            } else {
                const wrong = new Set<number>();
                filled.forEach((l, idx) => {
                    if (l !== letters[idx]) wrong.add(idx);
                });
                setErrorSlots(wrong);
                if (wrong.size === 0) onDone();
            }

            return next;
        });
    }

    return (
        <Box>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                {/* slots */}
                <Flex gap={2} justify="center" mb={6}>
                    {letters.map((_, idx) => (
                        <Slot key={idx} id={`slot-${idx}`} wrong={errorSlots.has(idx)}>
                            {tileInSlot(idx) && (
                                <TileBtn
                                    id={tileInSlot(idx)!.id}
                                    letter={tileInSlot(idx)!.letter}
                                    onClick={() => handleClickTile(tileInSlot(idx)!.id)}
                                />
                            )}
                        </Slot>
                    ))}
                </Flex>

                {/* bank */}
                <Bank>
                    {tiles
                        .filter((t) => t.pos === "bank")
                        .map((t) => (
                            <TileBtn
                                key={t.id}
                                id={t.id}
                                letter={t.letter}
                                onClick={() => handleClickTile(t.id)}
                            />
                        ))}
                </Bank>
            </DndContext>
        </Box>
    );
}

/** a draggable letter button */
function TileBtn({
    id,
    letter,
    onClick,
}: {
    id: string;
    letter: string;
    onClick: () => void;
}) {
    const { attributes, listeners, setNodeRef, transform, isDragging } =
        useDraggable({ id });

    return (
        <Button
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            size="lg"
            cursor="grab"
            onClick={onClick}
            style={{
                transform: CSS.Translate.toString(transform),
                opacity: isDragging ? 0.5 : 1,
            }}
        >
            {letter.toUpperCase()}
        </Button>
    );
}

/** a drop slot */
function Slot({
    id,
    wrong,
    children,
}: {
    id: string;
    wrong: boolean;
    children?: React.ReactNode;
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

/** the bank container */
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
            sx={{ touchAction: "none" }}
        >
            {empty ? <Text opacity={0.4}>Banco vacío</Text> : children}
        </Flex>
    );
}
