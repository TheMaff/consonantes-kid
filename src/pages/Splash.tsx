// src/pages/Splash.tsx
import { Image, VStack, Text } from "@chakra-ui/react";

export default function Splash() {
    return (
        <VStack spacing={6} h="100vh" justify="center" bg="white">
            
                <Image
                    src="https://ryumkozwsualtqwnfkvy.supabase.co/storage/v1/object/public/contenido/img/Logo.png"
                    alt="Logo"
                    boxSize="150px"
                    height="188px"
                    />
                <Image
                    src="https://ryumkozwsualtqwnfkvy.supabase.co/storage/v1/object/public/contenido/img/Loading.gif"
                    alt="Cargando…"
                    boxSize="100px"
                    />
                <Text>¡Cargando...!</Text>
        </VStack>
    );
}
