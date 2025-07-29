import { AuthContext } from "@/components/context/auth/AuthContext";
import { Provider } from "@/components/ui/provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

type AuthContextMockValues = React.ComponentProps<
  typeof AuthContext.Provider
>["value"];

interface RenderOptions {
  authContextValue?: Partial<AuthContextMockValues>;
}

const defaultAuthContext: AuthContextMockValues = {
  user: null,
  login: (_username: string, _password: string) => Promise,
  logout: () => {},
  isLoggingIn: false,
  loginError: "",
};

const customRender = (
  ui: React.ReactElement,
  { authContextValue = {} }: RenderOptions = {}
) => {
  return render(
    <MemoryRouter>
      <AuthContext.Provider
        value={{ ...defaultAuthContext, ...authContextValue }}
      >
        <QueryClientProvider client={createTestQueryClient()}>
          <Provider>{ui}</Provider>
        </QueryClientProvider>
      </AuthContext.Provider>
    </MemoryRouter>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export * from "@testing-library/react";
export { customRender as render };
