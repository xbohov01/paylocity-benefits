import { VStack } from "@chakra-ui/react/stack";
import { useParams } from "react-router-dom";
import AlertBox from "../alert/AlertBox";
import BenefitsCostTable from "../benefits/BenefitsCostTable";

export default function UserBenefits() {
  const params = useParams<{userId:string}>();

  // Could use the id to retrieve username or other info for better displaying from api

  return (
    <VStack
      id="user-benefits-list"
      minH="300px"
      backgroundColor="gray.800"
      borderRadius="8px"
      width="100%"
      padding="8px"
      marginTop="8px"
    >
      {params.userId === undefined && (
        <AlertBox
          status="warning"
          title="User context missing"
          message="User context missing"
        />
      )}
      {params.userId !== undefined && <BenefitsCostTable userId={parseInt(params.userId)} tableTitle={`Benefit costs for user ${params.userId}`}/>}
    </VStack>
  );
}
