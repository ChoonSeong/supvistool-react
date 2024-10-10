import { Box, Flex} from "@chakra-ui/react";
import HeroSection from "../components/HeroSection";
import { Outlet } from "react-router-dom";

function LandingPage() {
  return (
    <Flex h="100vh" align="center" justify="center" bg="gray.100">
      {/* Left Side - Textual Content */}
      <Outlet />

      {/* Right Side - Video with Fade Overlay */}
      <Box
        w="50%"
        h="100%"
        position="relative" // Position relative to place the overlay
        overflow="hidden" // Hide overflow to maintain clean edges
      >
        <video
          style={{ width: "100%", height: "100%", objectFit: "cover" }} // Ensures video fits and covers the entire box
          autoPlay
          loop
          muted
        >
          <source src="/LandingPageVideo.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Fade Overlay */}
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          background="linear-gradient(to left, rgba(247, 250, 252, 0) 50%, rgba(247, 250, 252, 1) 100%)" // Right fade
        />
      </Box>
    </Flex>
  );
}

export default LandingPage;
