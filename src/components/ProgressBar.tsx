import { Progress, HStack, Icon, Box, Button, Text, Flex } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useLives } from "../context/LivesContext";
import { useScore } from "../context/ScoreContext";

interface ProgressBarProps {
    current: number;
    total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {

    const percent = total ? Math.round(((current - 1) / total) * 100): 0;
    const { lives } = useLives();
    const { score } = useScore();
    const navigate = useNavigate();

    return (
        <Box mb={10} gap={2} w="100%" display={"flex"} flexDirection={"row"} alignItems="center" position="relative">

            <Button size="lg" padding={0} variant="plain" colorScheme="gray" onClick={() => navigate("/")} > <i className="fa-regular fa-circle-xmark"></i> </Button>
            <Box display={"flex"} flexDirection={"column"} alignItems="end" width="100%">
                <Progress value={percent} size="sm" borderRadius="md" bg="gray.200" width={"100%"} colorScheme="teal" />
            </Box>

            {/* Ficha de Puntos y Vidas */}
            <Flex gap={3} align="center" bg="white" px={3} py={1} borderRadius="full" boxShadow="sm">

                {/* Puntaje */}
                <HStack spacing={1} color="yellow.400" fontWeight="bold">
                    <Text fontSize="md">{score}</Text>
                    <Icon as={() => <i className="fa-solid fa-star"></i>} boxSize={4} />
                </HStack>

                {/* Vidas */}
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

            {/* <Text color={"gold"} fontSize="sm"><i className="fa-solid fa-infinity"></i> </Text> */}
        </Box>
    );
}
