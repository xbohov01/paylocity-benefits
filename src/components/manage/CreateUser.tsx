import { sendPostUser } from "@/api/users";
import type { Dependent } from "@/types/benefits";
import { calculateCost } from "@/util/costCalculation";
import {
  Button,
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
import AlertBox from "../alert/AlertBox";
import SimpleField from "../field/SimpleField";

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
            <SimpleField
              invalid={!!errors.firstName}
              required
              error={errors.firstName?.message}
              label="First Name"
            >
              <Input
                placeholder="First Name"
                {...register("firstName", { required: true })}
                bgColor="gray.900"
              />
            </SimpleField>

            <SimpleField
              invalid={!!errors.lastName}
              required
              error={errors.lastName?.message}
              label="Last Name"
            >
              <Input
                placeholder="Last Name"
                {...register("lastName", { required: true })}
                bgColor="gray.900"
              />
            </SimpleField>

            <Heading size="sm" mt={4}>
              Dependents
            </Heading>

            {fields.map((field, index) => (
              <HStack key={field.id} align="start">
                <SimpleField
                  invalid={!!errors.dependents?.[index]?.firstName}
                  required
                  error={"Field is required"}
                  label="First Name"
                >
                  <Input
                    placeholder="First Name"
                    {...register(`dependents.${index}.firstName` as const, {
                      required: true,
                    })}
                    bgColor="gray.900"
                  />
                </SimpleField>
                <SimpleField
                  invalid={!!errors.dependents?.[index]?.lastName}
                  required
                  error={"Field is required"}
                  label="Last Name"
                >
                  <Input
                    placeholder="Last Name"
                    {...register(`dependents.${index}.lastName` as const, {
                      required: true,
                    })}
                    bgColor="gray.900"
                  />
                </SimpleField>

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
              <AlertBox
                status="error"
                title="User creation failed"
                message={createMutation.error.message}
              />
            )}
          </VStack>
        </form>
      </Box>
    </VStack>
  );
}
