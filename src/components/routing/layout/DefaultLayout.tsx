import { useAuth } from "@/components/context/auth/useAuth";
import { Button, Heading, HStack, Text, VStack } from "@chakra-ui/react";
import { Outlet, useNavigate } from "react-router-dom";

export default function DefaultLayout() {
  const { user, logout } = useAuth();

  const navigate = useNavigate();

  // logout() might be async if we want to wait for the server
  const onLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <VStack
      id="vert-stack"
      width="100vw"
      height="100vh"
      backgroundColor="gray.600"
    >
      <VStack
        id="content-wrapper"
        maxWidth="1400px"
        minWidth="800px"
        width="60vw"
        backgroundColor="gray.900"
        borderRadius="8px"
        margin="8px"
        padding="8px"
        height="90vh"
      >
        <HStack
          id="header"
          backgroundColor="gray.800"
          borderRadius="8px"
          justifyContent="space-between"
          width="100%"
          padding="8px"
        >
          <Heading size="lg">Benefits</Heading>
          <HStack gap={4}>
            <Text>Welcome {user?.username}</Text>
            <Button backgroundColor="red.500" onClick={onLogout}>
              Log out
            </Button>
          </HStack>
        </HStack>
        <HStack
          id="menu"
          backgroundColor="gray.800"
          borderRadius="8px"
          width="100%"
          padding="8px"
          marginTop="8px"
          divideX="2px"
        >
          {user?.functions.includes("ViewUsers") && (
            <Button
              backgroundColor="gray.200"
              onClick={() => navigate("/manage")}
            >
              Manage Users
            </Button>
          )}
          <Button backgroundColor="gray.200" onClick={() => navigate("/me")}>
            My Benefits
          </Button>
          <Button
            backgroundColor="gray.200"
            onClick={() => navigate("/me/settings")}
          >
            My Settings
          </Button>
        </HStack>
        <Outlet />
      </VStack>
      <HStack
        backgroundColor="gray.900"
        borderRadius="8px"
        padding="8px"
        maxWidth="1400px"
        minWidth="800px"
        width="60vw"
      >
        Some footer information
      </HStack>
    </VStack>
  );
}
