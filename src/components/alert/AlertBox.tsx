import { Alert } from "@chakra-ui/react";

type AlertBoxProps = {
  status: "error" | "info" | "warning" | "success" | "neutral";
  title: string;
  message: string;
};

// Wrapper over the Chakra alert, also simplifies the structure
// If you wanted to be fancy you could have multiple components that export common errors
export default function AlertBox(props: AlertBoxProps) {
  return (
    <Alert.Root status={props.status}>
      <Alert.Indicator />
      <Alert.Content>
        <Alert.Title>{props.title}</Alert.Title>
        <Alert.Description>{props.message}</Alert.Description>
      </Alert.Content>
    </Alert.Root>
  );
}
