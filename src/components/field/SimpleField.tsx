import { Field } from "@chakra-ui/react";
import type { ReactNode } from "react";

type SimpleFieldProps = {
  invalid: boolean;
  label: string;
  required: boolean;
  error: string | undefined;
  children: ReactNode;
};

export default function SimpleField(props: SimpleFieldProps) {
  return (
    <Field.Root invalid={props.invalid} required={props.required}>
      <Field.Label>
        {props.required && <Field.RequiredIndicator />}
        {props.label}
      </Field.Label>
      {props.children}
      <Field.ErrorText>{props.error}</Field.ErrorText>
    </Field.Root>
  );
}
