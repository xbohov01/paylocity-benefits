import { sendPostUser } from "@/api/users";
import type { Dependent } from "@/types/benefits";
import { calculateCost } from "@/util/costCalculation";
import {
  Alert,
  Button,
  Field,
  Heading,
  HStack,
  Input,
  VStack,
  Text,
  Box,
} from "@chakra-ui/react";

import { useMutation } from "@tanstack/react-query";
import { useMemo } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

// Would likely have more fields depending on what backend requires
type CreateUserInputs = {
  firstName: string;
  lastName: string;
  dependents: Dependent[];
};

export default function CreateUser() {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<CreateUserInputs>({
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "dependents",
  });

  const navigate = useNavigate();

  const createMutation = useMutation({
    mutationFn: (user: CreateUserInputs) => sendPostUser(user),
    onSuccess: () => {
      navigate("/manage");
    },
  });

  const onSubmit = async (values: CreateUserInputs) => {
    await createMutation.mutateAsync(values);
  };

  const values = watch();
  const estimatedCost = useMemo(() => {
    return calculateCost(values.firstName, values.lastName, values.dependents);
  }, [values]);

  return (
    <VStack
      id="create-user"
      minH="300px"
      backgroundColor="gray.800"
      borderRadius="8px"
      width="100%"
      padding="8px"
      marginTop="8px"
    >
      <Heading size="md">Create a new user</Heading>
      <Box width="100%">
        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack gap={3} align="stretch" width="100%">
            <Field.Root invalid={!!errors.firstName}>
              <Field.Label>
                <Field.RequiredIndicator />
                First name
              </Field.Label>
              <Input
                placeholder="First Name"
                {...register("firstName", { required: true })}
                bgColor="gray.900"
              />
              <Field.ErrorText>{errors.firstName?.message}</Field.ErrorText>
            </Field.Root>

            <Field.Root invalid={!!errors.lastName}>
              <Field.Label>
                <Field.RequiredIndicator />
                Last name
              </Field.Label>
              <Input
                placeholder="Last Name"
                {...register("lastName", { required: true })}
                bgColor="gray.900"
              />
              <Field.ErrorText>{errors.lastName?.message}</Field.ErrorText>
            </Field.Root>

            <Heading size="sm" mt={4}>
              Dependents
            </Heading>

            {fields.map((field, index) => (
              <HStack key={field.id} align="start">
                <Field.Root invalid={!!errors.dependents?.[index]?.firstName}>
                  <Field.Label>
                    <Field.RequiredIndicator />
                    Last name
                  </Field.Label>
                  <Input
                    placeholder="First Name"
                    {...register(`dependents.${index}.firstName` as const, {
                      required: true,
                    })}
                    bgColor="gray.900"
                  />
                  <Field.ErrorText>{"Field is required"}</Field.ErrorText>
                </Field.Root>
                <Field.Root invalid={!!errors.dependents?.[index]?.lastName}>
                  <Field.Label>
                    <Field.RequiredIndicator />
                    Last name
                  </Field.Label>
                  <Input
                    placeholder="Last Name"
                    {...register(`dependents.${index}.lastName` as const, {
                      required: true,
                    })}
                    bgColor="gray.900"
                  />
                  <Field.ErrorText>{"Field is required"}</Field.ErrorText>
                </Field.Root>

                <Button
                  type="button"
                  onClick={() => remove(index)}
                  bgColor="red.300"
                  size="sm"
                  alignSelf="flex-end"
                >
                  Remove
                </Button>
              </HStack>
            ))}

            <Button
              type="button"
              bgColor="yellow.300"
              onClick={() => append({ firstName: "", lastName: "" })}
            >
              Add Dependent
            </Button>

            <Text fontWeight="bold" mt={4}>
              Estimated Cost Next Paycheck: ${estimatedCost.toFixed(2)}
            </Text>

            <Button
              type="submit"
              bgColor="green.400"
              disabled={!isValid}
              loading={createMutation.isPending}
            >
              Save Settings
            </Button>

            {createMutation.isError && (
              <Alert.Root status="error">
                <Alert.Indicator />
                <Alert.Content>
                  <Alert.Title>User creation failed</Alert.Title>
                  <Alert.Description>
                    {createMutation.error.message}
                  </Alert.Description>
                </Alert.Content>
              </Alert.Root>
            )}
          </VStack>
        </form>
      </Box>
    </VStack>
  );
}
