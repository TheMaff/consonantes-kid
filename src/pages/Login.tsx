import { useState, useEffect } from 'react';
import { Container, VStack, Heading, Button, Box, Text, useToast } from "@chakra-ui/react";
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
        <Box minH="100vh" bg="blue.400" display="flex" alignItems="center" justifyContent="center" p={4}>
            <Container maxW="md" bg="white" p={10} rounded="3xl" boxShadow="2xl" textAlign="center">
                <VStack spacing={6}>

                    <Box w="100px" h="100px" bg="blue.50" rounded="2xl" display="flex" alignItems="center" justifyContent="center" boxShadow="inner">
                        <Text fontSize="5xl">🚀</Text>
                    </Box>

                    <Box>
                        <Heading size="xl" color="blue.600" mb={2} fontWeight="black">
                            MathiLearn
                        </Heading>
                        <Text color="gray.500" fontSize="md" fontWeight="medium">
                            Tu aventura de aprendizaje continúa aquí.
                        </Text>
                    </Box>

                    <Button
                        size="lg"
                        w="full"
                        colorScheme="blue"
                        bg="blue.500"
                        color="white"
                        height="14"
                        fontSize="lg"
                        isLoading={isLoading}
                        loadingText="Conectando..."
                        onClick={handleGoogleLogin}
                        boxShadow="md"
                        _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg', bg: "blue.600" }}
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