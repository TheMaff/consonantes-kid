import { Progress, HStack, Icon, Box, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useLives } from "../context/LivesContext";

interface ProgressBarProps {
    current: number;
    total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {

    const percent = total ? Math.round(((current - 1) / total) * 100): 0;
        const { lives } = useLives();
    
    const navigate = useNavigate();

    return (
        <Box mb={10} gap={2} w="100%" display={"flex"} flexDirection={"row"} alignItems="center" position="relative">

            <Button size="lg" padding={0} variant="plain" colorScheme="gray" onClick={() => navigate("/")} > <i className="fa-regular fa-circle-xmark"></i> </Button>
            <Box display={"flex"} flexDirection={"column"} alignItems="end" width="100%">
                <Progress value={percent} size="sm" borderRadius="md" bg="gray.200" width={"100%"} colorScheme="teal" />
            </Box>
            <HStack spacing={1} background={"white"} borderRadius="md" padding={0} color={"red"}>
                {Array.from({ length: 4 }, (_, i) => (
                    <Icon
                        key={i}
                        as={() => (
                            <i className={i < lives ? "fa-solid fa-heart" : "fa-regular fa-heart"}></i>
                        )}
                        boxSize={5}
                    />
                ))}
            </HStack>
            {/* <Text color={"gold"} fontSize="sm"><i className="fa-solid fa-infinity"></i> </Text> */}
        </Box>
    );
}
