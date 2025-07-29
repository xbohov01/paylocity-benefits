import { Heading, HStack, VStack } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <VStack
      id="vert-stack"
      width="100vw"
      height="100vh"
      backgroundColor="gray.600"
    >
      <VStack
        id="content-wrapper"
        maxWidth="1200px"
        minWidth="400px"
        width="60vw"
        backgroundColor="gray.900"
        borderRadius="8px"
        margin="8px"
        padding="8px"
      >
        <HStack
          id="header"
          backgroundColor="gray.800"
          borderRadius="8px"
          alignContent="left"
          width="100%"
          padding="8px"
        >
          <Heading size="lg">Benefits</Heading>
        </HStack>
        <Outlet />
      </VStack>
    </VStack>
  );
}
