import React from "react";
import { Box, Button, Heading, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export default function HeroSection() {
    const navigate = useNavigate(); // Initialize the navigate function

    const handleGetStarted = () => {
      navigate("/login"); // Replace "/dashboard" with your desired route
    };
  return (
    <Box w="50%" p={8}>
      <Heading as="h1" size="2xl" mb={6}>
        Hospital Asset Tracking
      </Heading>
      <Text fontSize="lg" mb={6}>
        Track and manage your hospital assets reliably in real-time, enhancing
        operational efficiency.
      </Text>
      <Button colorScheme="teal" size="lg" onClick={handleGetStarted}>
        Get Started
      </Button>
    </Box>
  );
}
