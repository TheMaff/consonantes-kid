import { Image, Heading, Button, VStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export default function LevelComplete() {
    const nav = useNavigate();
    return (
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
            <Button colorScheme="teal" onClick={() => nav("/")}>
                Continuar
            </Button>
        </VStack>
    );
}
