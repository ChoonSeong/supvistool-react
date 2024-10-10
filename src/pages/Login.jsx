import React from "react";
import {
  Box,
  Button,
  Link,
  IconButton,
  Heading,
  Input,
  FormControl,
  FormLabel,
  Flex,
  Text
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { IoArrowBackCircleOutline } from "react-icons/io5";

export default function Login() {
  const navigate = useNavigate(); // Initialize the navigate function

  const handleBack = () => {
    navigate("/"); // Go back to the previous page
  };

  const handleRegister = () => {
    navigate("/register"); // Go back to the previous page
  };

  const handleLogin = () => {
    navigate("/dashboard"); // Go back to the previous page
  };
  return (
    <Flex w="50%" h="100%" align="center" justify="center">
      <IconButton
        position="absolute"
        top={4}
        left={4}
        colorScheme="gray"
        icon={<IoArrowBackCircleOutline style={{ fontSize: "2rem" }}/>}
        onClick={handleBack}
      />
      <Box w="60%" p={8} bg="white" boxShadow="md" borderRadius="lg">
        <Heading as="h1" size="xl" mb={6} textAlign="center">
          Login
        </Heading>

        {/* Login Form */}
        <FormControl id="email" mb={4}>
          <FormLabel>Email address</FormLabel>
          <Input type="email" placeholder="Enter your email" />
        </FormControl>

        <FormControl id="password" mb={6}>
          <FormLabel>Password</FormLabel>
          <Input type="password" placeholder="Enter your password" />
        </FormControl>

        <Button onClick={handleLogin}  colorScheme="teal" size="lg" w="100%">
          Login
        </Button>

        <Text fontSize="md" textAlign="center">
          Don't have an account yet?{" "}
          <Link color="teal.500" onClick={handleRegister} cursor="pointer">
            Register
          </Link>
        </Text>
      </Box>
    </Flex>
  );
}
