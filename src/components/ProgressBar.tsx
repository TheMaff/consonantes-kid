// src/components/ProgressBar.tsx
import { Progress, HStack, Icon, Box, Button, Text, Flex, AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay, useDisclosure } from "@chakra-ui/react";
import { useRef } from "react"; // <-- Importante
import { useNavigate } from "react-router-dom";
import { useLives } from "../context/LivesContext";
import { useScore } from "../context/ScoreContext";

interface ProgressBarProps {
    current: number;
    total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
    const percent = total ? Math.round(((current - 1) / total) * 100) : 0;
    const { lives } = useLives();

    // Traemos discardPoints también
    const { score, discardPoints } = useScore();
    const navigate = useNavigate();

    // Hooks para el Popup de advertencia
    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = useRef<HTMLButtonElement>(null);

    // Función al confirmar la salida
    const handleExit = () => {
        discardPoints(); // Tiramos a la basura los puntos temporales
        onClose();
        navigate("/"); // Volvemos al mapa
    };

    return (
        <>
            <Box mb={10} gap={2} w="100%" display="flex" flexDirection="row" alignItems="center" position="relative">

                {/* Botón X ahora abre el Popup en lugar de navegar directo */}
                <Button size="lg" padding={0} variant="plain" colorScheme="gray" onClick={onOpen}>
                    <i className="fa-regular fa-circle-xmark"></i>
                </Button>

                <Box display="flex" flexDirection="column" alignItems="end" width="100%">
                    <Progress value={percent} size="sm" borderRadius="md" bg="gray.200" width="100%" colorScheme="teal" />
                </Box>

                <Flex gap={3} align="center" bg="white" px={3} py={1} borderRadius="full" boxShadow="sm">
                    <HStack spacing={1} color="yellow.400" fontWeight="bold">
                        <Text fontSize="md">{score}</Text>
                        <Icon as={() => <i className="fa-solid fa-star"></i>} boxSize={4} />
                    </HStack>

                    <HStack spacing={1} color="red.500">
                        {Array.from({ length: 4 }, (_, i) => (
                            <Icon
                                key={i}
                                as={() => <i className={i < lives ? "fa-solid fa-heart" : "fa-regular fa-heart"}></i>}
                                boxSize={4}
                            />
                        ))}
                    </HStack>
                </Flex>
            </Box>

            {/* POPUP DE ADVERTENCIA */}
            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
                isCentered
            >
                <AlertDialogOverlay>
                    <AlertDialogContent borderRadius="2xl" mx={4}>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold" color="red.500">
                            ¿Quieres salir del nivel?
                        </AlertDialogHeader>

                        <AlertDialogBody fontWeight="medium">
                            Si sales ahora, perderás las palabras que ya completaste y los <b>puntos</b> que ganaste en este nivel.
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onClose} borderRadius="xl">
                                Quedarme a jugar
                            </Button>
                            <Button colorScheme="red" onClick={handleExit} ml={3} borderRadius="xl">
                                Sí, salir
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    );
}