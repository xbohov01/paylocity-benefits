import type { BenefitsSettings } from "@/types/benefits";
import {
  Box,
  Button,
  Field,
  Heading,
  HStack,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useForm, useFieldArray } from "react-hook-form";
import { useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import { sendPostUserSettings } from "@/api/benefits";
import { calculateCost } from "@/util/costCalculation";
import AlertBox from "../alert/AlertBox";

export default function SettingsForm(props: { settings: BenefitsSettings, refetch: () => void }) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<BenefitsSettings>({
    defaultValues: {
      firstName: props.settings.firstName,
      lastName: props.settings.lastName,
      userId: props.settings.userId,
      dependents: props.settings.dependents,
    },
    mode: "onChange",
  });

  const settingsMutation = useMutation({
    mutationFn: (settings: BenefitsSettings) => sendPostUserSettings(settings),
    onSuccess: () => {
      props.refetch();
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "dependents",
  });

  const values = watch();

  const onSubmit = async (values: BenefitsSettings) => {
    await settingsMutation.mutateAsync(values)
  };

  const estimatedCost = useMemo(() => {
    return calculateCost(values.firstName, values.lastName, values.dependents)
  }, [values]);

  return (
    <Box width="100%" p={4} borderRadius="8px">
      <Heading size="md" mb={4}>
        Benefits Settings
      </Heading>
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack gap={3} align="stretch">
          {/* Maybe don't let users change their name freely */}
          <Field.Root invalid={!!errors.firstName}>
            <Field.Label>
              <Field.RequiredIndicator />
              First name
            </Field.Label>
            <Input
              placeholder="First Name"
              {...register("firstName", { required: true })}
              defaultValue={props.settings.firstName}
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
              defaultValue={props.settings.lastName}
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
                  defaultValue={field.firstName}
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
                  defaultValue={field.lastName}
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

          <Button type="submit" bgColor="green.400" disabled={!isValid} loading={settingsMutation.isPending}>
            Save Settings
          </Button>

          {settingsMutation.isError && (
            <AlertBox status="error" title="Save failed" message={settingsMutation.error.message}/>
          )}
        </VStack>
      </form>
    </Box>
  );
}
