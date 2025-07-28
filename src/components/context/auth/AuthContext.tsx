import { sendLogin } from "@/api/auth";
import type { AuthContextType, User } from "@/types/auth";
import { useMutation } from "@tanstack/react-query";
import { createContext, type ReactNode, useState } from "react";

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthContextProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);

  const loginMutation = useMutation({
    mutationFn: ({
      username,
      password,
    }: {
      username: string;
      password: string;
    }) => sendLogin(username, password),
    onSuccess: (data) => {
      if (!data.isSuccess) {
        setUser(null);
        setLoginError(data.message);
      } else {
        // note on the !, it's for mocking reasons, a real client would probably return a more sensible response for success/fail
        setUser({
          username: data.user!.username,
          functions: data.user!.functions,
          firstName: data.user!.firstName,
          lastName: data.user!.lastName,
          id: data.user!.id
        });
        setLoginError(null);
      }
    },
    onError: (err: unknown) => {
      setLoginError((err as Error).message || "Login failed");
    },
  });

  // The return type could be moved into a type declaration
  const login = async (username: string, password: string) => {
    await loginMutation.mutateAsync({ username, password });
  };

  const logout = () => {
    // Plus invalidate any local refresh tokens and send a request to the server to invalidate any tokens if needed
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loginError,
        isLoggingIn: loginMutation.isPending,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
