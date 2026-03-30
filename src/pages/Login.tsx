import { useState, useEffect } from 'react';
import { Container, VStack, Button, Box, Text, useToast, Image } from "@chakra-ui/react";
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom'; // <-- Importamos el router

export default function Login() {
    // Traemos 'user' del contexto para saber si ya está logueado
    const { user, signInWithGoogle } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();
    const navigate = useNavigate(); // <-- Instanciamos el router

    // EFECTO OBSERVADOR: Si el usuario existe, lo mandamos al Home de inmediato
    useEffect(() => {
        if (user) {
            navigate('/', { replace: true });
        }
    }, [user, navigate]);

    const handleGoogleLogin = async () => {
        try {
            setIsLoading(true);
            await signInWithGoogle();
            // Nota: No necesitamos poner navigate('/') aquí porque el useEffect 
            // de arriba se disparará automáticamente en cuanto signInWithGoogle termine.
        } catch (error: any) {
            console.error("Error en login:", error);
            toast({
                title: "Error de conexión",
                description: "No pudimos iniciar sesión con Google. Intenta de nuevo.",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
            setIsLoading(false); // Solo apagamos el loading si falla
        }
    };

    return (
        <Box minH="100vh" bg="#2bb5f8" display="flex" alignItems="center" justifyContent="center" p={4}>
            <Container maxW="md" bg="white" p={10} rounded="3xl" boxShadow="2xl" textAlign="center">
                <VStack spacing={6}>

                        <Image
                            src="/img/Logo.png"
                            alt="MathiLearn Logo"
                            maxW="200px"
                            // mt={4}
                            objectFit="contain"
                        />

                    <Box>
                        <Text color="gray.500" fontSize="md" fontWeight="medium">
                            Tu aventura de aprendizaje continúa aquí.
                        </Text>
                    </Box>

                    <Button
                        size="lg"
                        w="full"
                        bg="#2bb5f8" // <-- 3. Tu celeste personalizado en el botón
                        color="white"
                        height="14"
                        fontSize="lg"
                        isLoading={isLoading}
                        loadingText="Conectando..."
                        onClick={handleGoogleLogin}
                        boxShadow="md"
                        // Para el hover, usamos un celeste ligeramente más oscuro para que se note el clic
                        _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg', bg: "#1ea4e6" }}
                        _active={{ transform: 'translateY(0)' }}
                        transition="all 0.2s"
                    >
                        Entrar con Google
                    </Button>

                </VStack>
            </Container>
        </Box>
    );
}