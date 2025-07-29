import { Heading, Spinner, VStack } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import AlertBox from "../alert/AlertBox";
import { sendGetUserSettings } from "@/api/benefits";
import { useQuery } from "@tanstack/react-query";
import SettingsForm from "../settings/SettingsForm";

export default function EditUser() {
  const params = useParams<{ userId: string }>();

  const { data, isLoading, refetch, isError, error } = useQuery({
    queryKey: ["settings", params.userId],
    queryFn: () => sendGetUserSettings(parseInt(params.userId!)),
    enabled: params.userId != undefined,
  });

  return (
    <VStack
      id="user-benefits-settings"
      minH="300px"
      backgroundColor="gray.800"
      borderRadius="8px"
      width="100%"
      padding="8px"
      marginTop="8px"
    >
      <Heading size="md">Edit settings for {params.userId}</Heading>
      {params.userId === undefined && (
        <AlertBox
          status="warning"
          title="User context missing"
          message="User context missing"
        />
      )}
      {isError && (
        <AlertBox status="error" title="Fetch failed" message={error.message} />
      )}
      {isLoading && <Spinner />}
      {data != undefined && <SettingsForm settings={data} refetch={refetch}/>}
    </VStack>
  );
}
