import type { BenefitsSettings } from "@/types/benefits";
import {
  Box,
  Button,
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
import SimpleField from "../field/SimpleField";

export default function SettingsForm(props: {
  settings: BenefitsSettings;
  refetch: () => void;
}) {
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
    await settingsMutation.mutateAsync(values);
  };

  const estimatedCost = useMemo(() => {
    return calculateCost(values.firstName, values.lastName, values.dependents);
  }, [values]);

  return (
    <Box width="100%" p={4} borderRadius="8px">
      <Heading size="md" mb={4}>
        Benefits Settings
      </Heading>
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack gap={3} align="stretch">
          {/* Maybe don't let users change their name freely */}

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

          {/**Maybe disable submit unless changes were made */}
          <Button
            type="submit"
            bgColor="green.400"
            disabled={!isValid}
            loading={settingsMutation.isPending}
          >
            Save Settings
          </Button>

          {settingsMutation.isError && (
            <AlertBox
              status="error"
              title="Save failed"
              message={settingsMutation.error.message}
            />
          )}
        </VStack>
      </form>
    </Box>
  );
}
