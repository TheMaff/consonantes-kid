// src/components/DragLetters.tsx
import { useState } from "react";
import {
    DndContext,
    PointerSensor,
    useSensor,
    useSensors,
    useDraggable,
    useDroppable,
    type DragEndEvent
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Box, Button, Flex, Text } from "@chakra-ui/react";

interface Props {
    word: string;
    onDone: () => void;
}

export default function DragLetters({ word, onDone }: Props) {
    const letters = word.split("");
    const shuffled = [...letters].sort(() => Math.random() - 0.5);

    const [slots, setSlots] = useState<(string | null)[]>(
        Array(letters.length).fill(null)
    );

    const sensors = useSensors(useSensor(PointerSensor));

    const handleDragEnd = (e: DragEndEvent) => {
        const { active, over } = e;
        if (!over) return;

        const draggedLetter = active.id as string;
        const targetIndex = Number(over.id);

        const next = [...slots];
        next[targetIndex] = draggedLetter;
        setSlots(next);

        if (next.every((l, i) => l === letters[i])) onDone();
    };

    return (
        <Box>
            {/* casillas */ }
            <Flex gap={2} justify="center" mb={6}>
            {
                letters.map((_,i)=>(
                    <Slot key={i} id={i.toString()} letter={slots[i]}/>
                ))
            }
            </Flex>

            {/* letras arrastrables */ }
            <DndContext sensors={sensors} onDragEnd={handleDragEnd} >
                <Flex gap={2} wrap="wrap" justify="center">
                {
                    shuffled.map((l,i) => (
                        <DraggableLetter
                            key={`${l}-${i}`} 
                            id={`${l}-${i}`}>
                        {l.toUpperCase()}
                        </DraggableLetter>
                    ))
                }
                </Flex>
            </DndContext>
        </Box>
    );
}

/* ---------- sub-componentes ---------- */

function DraggableLetter({id,children}:
    {
        id: string;
        children: React.ReactNode;
    }
)
{
    const {attributes, listeners, setNodeRef, transform, isDragging}=useDraggable({ id });
    return (
        <Button
            ref= {setNodeRef}
            {...listeners}
            {...attributes}
            size="lg"
            aria-label={`Letra ${id}`}
            style={{
                transform:CSS.Translate.toString(transform),
                opacity:isDragging ? 0.5 : 1,
            }}
        >
            { children }
        </Button>
    );
}

function Slot({ id, letter, }:
    {
        id: string;
        letter: string | null;
    })
{
    const { setNodeRef, isOver }=useDroppable({ id });
    return (
        <Box
            ref={setNodeRef}
            w="64px"
            h="64px"
            bg={ isOver? "teal.100": "gray.100" }
            border="2px dashed"
            borderColor="gray.400"
            borderRadius="md"
            display="flex"
            alignItems="center"
            justifyContent="center"
            aria-label={
                letter ? `Letra ${letter}` : "Casilla vacía"
            }
        >
        <Text fontSize="2xl" fontWeight="bold" >
            { letter?.toUpperCase() ?? "" }
        </Text>
        </Box>
    );
}
