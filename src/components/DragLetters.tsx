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
  useDraggable,
  useDroppable,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import correct from "/public/sounds/collect-points.mp3";
import errorSound from "/public/sounds/error.mp3"


interface Props {
  word: string;
  onDone: () => void;
}
type Position = "bank" | number;
interface Tile {
  id: string;
  letter: string;
  pos: Position;
}

export default function DragLetters({ word, onDone }: Props) {
  const letters = word.split("");

  // 1️⃣ inicializa y baraja
  const initTiles: Tile[] = letters
    .map((l, i) => ({ id: `t-${i}`, letter: l, pos: "bank" as Position }))
    .sort(() => Math.random() - 0.5);

  const [tiles, setTiles] = useState<Tile[]>(initTiles);
  const [errorSlots, setErrorSlots] = useState<Set<number>>(new Set());
  const [isCompleted, setIsCompleted] = useState(false);

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 5 } })
  );

  // helper: tile en slot i
  const tileInSlot = (i: number) =>
    tiles.find((t) => t.pos === i) ?? null;

  // centraliza validación
  const validate = (next: Tile[]) => {
    const filled = letters.map((_, i) => next.find((t) => t.pos === i)?.letter ?? null);
    const allFull = filled.every((l) => l !== null);

    if (!allFull) {
      setErrorSlots(new Set());
      return;
    }
    const wrong = new Set<number>();
    filled.forEach((l, i) => {
      if (l !== letters[i]) wrong.add(i);
    });
    setErrorSlots(wrong);
    if (wrong.size > 0) {
      const audio = new Audio(errorSound);
      audio.play().catch(() => {
        console.error("Error al reproducir el sonido de error");
      }
      );
      return;
    }

    if (wrong.size === 0) {
        setIsCompleted(true);
        new Audio(correct).play();
        onDone();
    } else {
      console.log("Incorrecto, slots erróneos:", Array.from(wrong));
      
    }
  };

  // 2️⃣ click handler
  const handleClickTile = (id: string) => {
    if (isCompleted) return;
    setTiles((prev) => {
      const next = [...prev];
      const idx = next.findIndex((t) => t.id === id);
      if (idx === -1) return prev;
      const tile = next[idx];

      if (tile.pos === "bank") {
        // primer slot vacío
        const empty = letters.findIndex((_, i) => !next.some((t) => t.pos === i));
        if (empty >= 0) tile.pos = empty;
      } else {
        tile.pos = "bank";
      }

      validate(next);
      return next;
    });
  };

  // 3️⃣ drag end handler
  const handleDragEnd = (e: DragEndEvent) => {
    if (isCompleted) return;
    const { active, over } = e;
    if (!over) return;

    const tileId = active.id.toString();
    const targetId = over.id.toString(); // "bank" o índice
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
          // swap
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
    <Box>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        {/* Slots */}
        <Flex gap={2} justify="center" mb={6}>
          {letters.map((_, i) => (
            <Slot
              key={i}
              id={String(i)}
              wrong={errorSlots.has(i)}
              glow={isCompleted}
            >
              {tileInSlot(i) && (
                <TileBtn
                  id={tileInSlot(i)!.id}
                  letter={tileInSlot(i)!.letter}
                  onClick={() => handleClickTile(tileInSlot(i)!.id)}
                  disabled={isCompleted}
                />
              )}
            </Slot>
          ))}
        </Flex>

        {/* Banco (oculto tras completar) */}
        {!isCompleted && (
          <Bank>
            {tiles
              .filter((t) => t.pos === "bank")
              .map((t) => (
                <TileBtn
                  key={t.id}
                  id={t.id}
                  letter={t.letter}
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

function TileBtn({
  id,
  letter,
  onClick,
  disabled,
}: {
  id: string;
  letter: string;
  onClick: () => void;
  disabled: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id });

  return (
    <Button
      ref={setNodeRef}
      {...(!disabled ? { ...listeners, ...attributes } : {})}
      size="lg"
      cursor={disabled ? "default" : "grab"}
      onClick={onClick}
      isDisabled={disabled}
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
  glow,
  children,
}: {
  id: string;
  wrong: boolean;
  glow: boolean;
  children?: React.ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <Box
      ref={setNodeRef}
      layerStyle={glow ? "glow" : undefined}
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
