import { Heading, Spinner, VStack } from "@chakra-ui/react";
import { useAuth } from "../context/auth/useAuth";
import { useQuery } from "@tanstack/react-query";
import { sendGetUserSettings } from "@/api/benefits";
import SettingsForm from "../settings/SettingsForm";

export default function MySettings() {
  const { user } = useAuth();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["settings"],
    queryFn: () => sendGetUserSettings(user!.id),
  });

  return (
    <VStack
      id="my-settings"
      minH="300px"
      backgroundColor="gray.800"
      borderRadius="8px"
      width="100%"
      padding="8px"
      marginTop="8px"
    >
      <VStack width="100%">
        <Heading size="md">Edit settings</Heading>
        {isLoading && <Spinner />}
        {data != undefined && <SettingsForm settings={data} refetch={refetch}/>}
        {/** Also maybe some error display */}
      </VStack>
    </VStack>
  );
}
