// src/pages/Login.tsx
import { useState } from "react";
import { signInWithEmail } from "../hooks/useAuth";
import { Container, VStack, Image, Heading, Input, Button, Box, Text } from "@chakra-ui/react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("sending");
        const error = await signInWithEmail(email);

        if (error) {
            alert(error.message);
            setStatus("idle");
        } else {
            setStatus("sent");
        }
    };

    return (
        
        <Container maxW="container.md" px={20}>
            <VStack spacing={6} mt="20">
            <Image
                src="https://ryumkozwsualtqwnfkvy.supabase.co/storage/v1/object/public/contenido/img/icon.png"
                alt="Icono"
                boxSize="80px"
            />
            <Heading size="md">Ingresa tu email</Heading>

            <Box maxW="sm" mx="auto" mt={5}>
                {status === "sent" ? (
                    <Text align={"center"}>Revisa tu correo y haz clic en el enlace para continuar.</Text>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <Input
                            type="email"
                            placeholder="tu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            mb={4}
                            isRequired
                        />
                        <Button type="submit" isLoading={status === "sending"} w="full">
                            Enviar enlace de acceso
                        </Button>
                    </form>
                )}
            </Box>
            </VStack>
        </Container>

    );
}