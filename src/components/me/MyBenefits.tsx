import { VStack } from "@chakra-ui/react";
import { useAuth } from "../context/auth/useAuth";

export default function MyBenefits() {
  const { user } = useAuth();
  return <VStack id="my-benefits-list"></VStack>;
}
