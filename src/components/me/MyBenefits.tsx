import {
  VStack,
} from "@chakra-ui/react";
import { useAuth } from "../context/auth/useAuth";
import BenefitsCostTable from "../benefits/BenefitsCostTable";
import AlertBox from "../alert/AlertBox";

export default function MyBenefits() {
  const { user } = useAuth();

  return (
    <VStack
      id="my-benefits-list"
      minH="300px"
      backgroundColor="gray.800"
      borderRadius="8px"
      width="100%"
      padding="8px"
      marginTop="8px"
    >
      {user === null && <AlertBox status="warning" title="User context missing" message="User context missing" />}
      {user !== null && <BenefitsCostTable userId={user.id} />}
    </VStack>
  );
}
