import { Image, Heading, Box, Flex, Button, VStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import ProgressBar from "../components/ProgressBar";
import { useEffect } from "react";
import fanfare from "/public/sounds/fanfare.mp3";

export default function LevelComplete() {
    const navigate = useNavigate();
    useEffect(() => {
        new Audio(fanfare).play();
    }, []);

    return (
        <>
            <Box p={6} textAlign="center">
                <Flex gap="4" direction="row" align="center">
                    <ProgressBar current={11} total={10} />
                </Flex>
            </Box>
            <VStack spacing={6} mt={12}>
                <Image
                    src="https://ryumkozwsualtqwnfkvy.supabase.co/storage/v1/object/public/contenido/img/medal.gif"
                    alt="Medalla"
                    boxSize="150px"
                />
                <Heading>¡Felicidades!</Heading>
                <Image
                    src="https://ryumkozwsualtqwnfkvy.supabase.co/storage/v1/object/public/contenido/img/celebration.gif"
                    alt="¡Nivel completado!"
                    boxSize="100px"
                />
                <Button colorScheme="teal" onClick={() => navigate("/")}>
                    Continuar
                </Button>
            </VStack>
        </>

    );
}
    