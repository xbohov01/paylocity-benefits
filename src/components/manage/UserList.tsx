import { sendGetUsers } from "@/api/users";
import {
  Button,
  createListCollection,
  Heading,
  HStack,
  Portal,
  Select,
  Spinner,
  StackSeparator,
  Table,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function UserList() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["users", page, pageSize],
    queryFn: () => sendGetUsers(page, pageSize),
  });

  const totalPages = data != undefined ? Math.ceil(data.total / pageSize) : 0;

  const sizes = createListCollection({
    items: [
      { value: 5, label: "5" },
      { value: 10, label: "10" },
      { value: 20, label: "20" },
    ],
  });

  return (
    <VStack
      minH="300px"
      backgroundColor="gray.800"
      borderRadius="8px"
      width="100%"
      padding="8px"
      marginTop="8px"
    >
      <HStack width="100%" justifyContent="space-between">
        <Heading size="md">Users</Heading>
        <Button size="sm" bgColor="yellow.300" onClick={() => navigate("user/create")}>Create a new user</Button>
        {/* Could add some user filtering options */}
      </HStack>

      {isLoading && <Spinner />}
      {data != undefined && data.page.length == 0 && (
        <HStack>
          <Heading size="md">No data found</Heading>
        </HStack>
      )}

      {!isLoading && data != undefined && data.page.length > 0 && (
        <VStack width="100%" overflowX="auto">
          <Table.Root size="sm">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>Username</Table.ColumnHeader>
                <Table.ColumnHeader>First Name</Table.ColumnHeader>
                <Table.ColumnHeader>Last Name</Table.ColumnHeader>
                <Table.ColumnHeader>Actions</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {data.page.map((user) => (
                <Table.Row key={user.id}>
                  <Table.Cell>{user.username}</Table.Cell>
                  <Table.Cell>{user.firstName}</Table.Cell>
                  <Table.Cell>{user.lastName}</Table.Cell>
                  <Table.Cell>
                    <HStack gap="4px" separator={<StackSeparator/>}>
                      <Link to={`user/${user.id}/settings`}>Edit</Link>
                      <Link to={`user/${user.id}/calculations`}>Benefits</Link>
                    </HStack>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>

          <HStack justify="space-between" width="100%" pt={4}>
            <Button
              size="sm"
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              bgColor="blue.300"
            >
              Previous
            </Button>

            <HStack>
              <Text>
                Page {page} of {totalPages} | Page size:
              </Text>
              <Select.Root
                size="sm"
                collection={sizes}
                onSelect={(selection) => setPageSize(parseInt(selection.value))}
                width="150px"
              >
                <Select.HiddenSelect />
                <Select.Control>
                  <Select.Trigger>
                    <Select.ValueText placeholder={`${pageSize}`} />
                  </Select.Trigger>
                  <Select.IndicatorGroup>
                    <Select.Indicator />
                  </Select.IndicatorGroup>
                </Select.Control>
                <Portal>
                  <Select.Positioner>
                    <Select.Content>
                      {sizes.items.map((size) => (
                        <Select.Item item={size} key={size.value}>
                          {`Page size: ${size.label}`}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Positioner>
                </Portal>
              </Select.Root>
            </HStack>
            <Button
              size="sm"
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= totalPages}
              bgColor="blue.300"
            >
              Next
            </Button>
          </HStack>
        </VStack>
      )}
    </VStack>
  );
}
