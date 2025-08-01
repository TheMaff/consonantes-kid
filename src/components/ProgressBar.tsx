import { Progress, Box, Text, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

interface ProgressBarProps {
    current: number;
    total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {

    const percent = total ? Math.round(((current - 1) / total) * 100): 0;
    const navigate = useNavigate();

    return (
        <Box mb={10} gap={2} w="100%" display={"flex"} flexDirection={"row"} alignItems="center" position="relative">
            <Button size="lg" padding={0} variant="plain" colorScheme="gray" onClick={() => navigate("/")} > <i className="fa-regular fa-circle-xmark"></i> </Button>
            {/* <Progress value={percent} size="sm" borderRadius="md" display={"block"} width={"90%"} /> */}
            <Progress
                value={percent}
                size="sm"
                borderRadius="md"
                bg="gray.200"
                width={"90%"}
                colorScheme="teal"
            />
            <Text color={"gold"} fontSize="sm"><i className="fa-solid fa-infinity"></i> </Text>
        </Box>
    );
}
