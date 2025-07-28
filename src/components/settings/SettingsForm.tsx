import type { BenefitsSettings } from "@/types/benefits";
import {
  Alert,
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
    const base = 1000 / 26;
    const perDependent = 500 / 26;

    let result = 0;

    if (values.firstName.startsWith("A") || values.lastName.startsWith("A")) {
      result += base - base / 10;
    } else {
      result += base;
    }

    values.dependents.map((d) => {
      if (d.firstName.startsWith("A") || d.lastName.startsWith("A")) {
        result += perDependent - perDependent / 10;
      } else {
        result += perDependent;
      }
    });

    return result;
  }, [values]);

  return (
    <Box width="100%" p={4} borderWidth={1} borderRadius="8px">
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
            <Alert.Root status="error">
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Title>Save failed</Alert.Title>
                <Alert.Description>{settingsMutation.error.message}</Alert.Description>
              </Alert.Content>
            </Alert.Root>
          )}
        </VStack>
      </form>
    </Box>
  );
}
