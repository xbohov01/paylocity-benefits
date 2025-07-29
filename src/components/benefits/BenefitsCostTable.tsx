import { sendGetUserBenefits } from "@/api/benefits";
import {
  Box,
  Button,
  Heading,
  HStack,
  Menu,
  Portal,
  Spinner,
  Table,
  VStack,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import AlertBox from "../alert/AlertBox";

type BenefitsCostTableProps = {
  userId: number;
  tableTitle?: string;
};

export default function BenefitsCostTable(props: BenefitsCostTableProps) {
  const [year, setYear] = useState("2025"); // or get current with date-fns

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["benefits", year, props.userId],
    queryFn: () => sendGetUserBenefits(props.userId, year),
  });

  return (
    <VStack width="100%" height="100%">
      <HStack width="100%">
        <Heading size="md">
          {props.tableTitle || "Benefit cost overview"}
        </Heading>
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
      {isLoading && (
        <Box width="100%" height="200px">
          <Spinner size="lg"></Spinner>
        </Box>
      )}
      {data != undefined && data.length == 0 && (
        <HStack>
          <Heading size="md">No data found</Heading>
        </HStack>
      )}
      {isError && (
        <AlertBox
          status="error"
          title="Failed to fetch"
          message={error.message}
        />
      )}
      {data != undefined && data.length > 0 && (
        <VStack width="100%" overflow="scroll">
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
