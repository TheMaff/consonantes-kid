import { Image, Heading, Button, VStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useLives } from "../context/LivesContext";
import error from "/public/sounds/error.mp3";

export default function LevelIncorrect() {
    const navigate = useNavigate();
    useEffect(() => {
        new Audio(error).play();
    }, []);

    const { resetLives } = useLives();
    
    const handleRestart = () => {
        resetLives();
        navigate("/");
    };

    return (
        <>
            {/* <Box p={6} textAlign="center">
                <Flex gap="4" direction="row" align="center">
                    <ProgressBar current={11} total={10} />
                </Flex>
            </Box> */}

            <VStack spacing={6} mt={12}>
                <Image
                    src="https://cdn-icons-png.flaticon.com/512/564/564619.png"
                    alt="Error"
                    boxSize="100px"
                />
                <Heading>¡oh-oh!</Heading>
                <Image
                    src="https://ryumkozwsualtqwnfkvy.supabase.co/storage/v1/object/public/contenido/img/error.png"
                    alt="¡Nivel Incorrecto!"
                    boxSize="250px"
                />
                <Button colorScheme="teal" onClick={handleRestart}>
                    Volver al inicio
                </Button>
            </VStack>
        </>

    );
}
    