import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";

export function DragLetters({ word, onDone }: { word: string; onDone: () => void }) {
    const letters = word.split("");
    // …render slots y letras barajadas
    // al completar, llama onDone()
    return <DndContext>{/* tu magia aquí */ } </DndContext>;
}
