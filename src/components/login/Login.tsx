import { useForm } from "react-hook-form";
import {
  Box,
  Button,
  Input,
  Heading,
  VStack,
  Field,
  Text,
} from "@chakra-ui/react";
import { useAuth } from "../context/auth/useAuth";
import { useNavigate } from "react-router-dom";
import AlertBox from "../alert/AlertBox";

type LoginFormInputs = {
  username: string;
  password: string;
};

export default function Login() {
  const { login, isLoggingIn, loginError } = useAuth();

  const navigate = useNavigate();

  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
  } = useForm<LoginFormInputs>();

  const onSubmit = async (data: LoginFormInputs) => {
    await login(data.username, data.password);

    // Navigate after login, will send the user to the appropirate home page
    if (loginError == null) navigate("/", { replace: true });
  };

  return (
    <Box padding="8px" width="50%">
      <Heading size="md" mb="8px">
        Log In
      </Heading>

      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack gap={2}>
          <Field.Root invalid={!!errors.username}>
            <Field.Label>
              <Field.RequiredIndicator />
              Username
            </Field.Label>
            <Input
              type="text"
              placeholder="Enter your username"
              {...register("username", { required: "Username is required" })}
            />
            <Field.ErrorText>{errors.username?.message}</Field.ErrorText>
          </Field.Root>
          <Field.Root invalid={!!errors.password}>
            <Field.Label>
              <Field.RequiredIndicator />
              Username
            </Field.Label>
            <Input
              type="password"
              placeholder="Enter your password"
              {...register("password", { required: "Password is required" })}
            />
            <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
          </Field.Root>

          {loginError && (
            <AlertBox status="error" title="Login Failed" message={loginError}/>
          )}

          <Button
            type="submit"
            backgroundColor="green.300"
            loading={isLoggingIn}
            disabled={!isValid}
            width="100%"
          >
            Log In
          </Button>
        </VStack>
      </form>
      <>
        <Text>For demo purposes:</Text>
        <Text>- user/user123 for user login</Text>
        <Text>- admin/admin123 for admin login</Text>
        <Text>- any other combination to see the error</Text>
      </>
    </Box>
  );
}
