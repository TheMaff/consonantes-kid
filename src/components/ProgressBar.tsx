import { Progress, Box, Text, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

interface ProgressBarProps {
    current: number;
    total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
    const percent = Math.round((current / total) * 100);
    const navigate = useNavigate();
    return (
        <Box mb={10} gap={2} w="100%" display={"flex"} flexDirection={"row"} alignItems="center" position="relative">
            <Button size="sm" variant="ghost" colorScheme="gray" onClick={() => navigate("/")} > X </Button>
            <Progress value={percent} size="sm" borderRadius="md" display={"block"} width={"90%"} />
            <Text fontSize="sm">{percent}%</Text>
        </Box>
    );
}
