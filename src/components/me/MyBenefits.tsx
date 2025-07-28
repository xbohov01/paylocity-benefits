import {
  Button,
  Heading,
  HStack,
  Menu,
  Portal,
  Spinner,
  Table,
  VStack,
} from "@chakra-ui/react";
import { useAuth } from "../context/auth/useAuth";
import { useQuery } from "@tanstack/react-query";
import { sendGetUserBenefits } from "@/api/benefits";
import { useState } from "react";

export default function MyBenefits() {
  const { user } = useAuth();

  const [year, setYear] = useState("2025"); // or get current with date-fns

  const { data, isLoading } = useQuery({
    queryKey: ["benefits", year],
    queryFn: () => sendGetUserBenefits(user!.id, year),
  });

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
      <HStack width="100%">
        <Heading size="md">Benefit cost overview</Heading>
        <Menu.Root onSelect={(selection) => setYear(selection.value)}>
          <Menu.Trigger asChild>
            <Button variant="outline" size="sm">
              {year}
            </Button>
          </Menu.Trigger>
          <Portal>
            <Menu.Positioner>
              <Menu.Content>
                {
                  // Mock hardcoded years, would be better to retrieve some information for how long the user was employed and list those years
                  ["2020", "2021", "2022", "2023", "2024", "2025"].map((y) => (
                    <Menu.Item key={y} value={y}>
                      {y}
                    </Menu.Item>
                  ))
                }
              </Menu.Content>
            </Menu.Positioner>
          </Portal>
        </Menu.Root>
      </HStack>

      {isLoading && <Spinner></Spinner>}
      {data != undefined && data.length == 0 && (
        <HStack>
          <Heading size="md">No data found</Heading>
        </HStack>
      )}
      {data != undefined && data.length > 0 && (
        <VStack width="100%" overflow="scroll" height="70vh">
          <Table.Root size="sm">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>Year</Table.ColumnHeader>
                <Table.ColumnHeader>Month</Table.ColumnHeader>
                <Table.ColumnHeader>Week</Table.ColumnHeader>
                <Table.ColumnHeader textAlign="end">Cost</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {data.map((item) => (
                <Table.Row key={Math.random()}>
                  <Table.Cell>{item.year}</Table.Cell>
                  <Table.Cell>{item.month}</Table.Cell>
                  <Table.Cell>{item.week}</Table.Cell>
                  <Table.Cell textAlign="end">{item.cost} $</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </VStack>
      )}
    </VStack>
  );
}
