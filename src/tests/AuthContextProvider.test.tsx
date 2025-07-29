import AuthContextProvider from "@/components/context/auth/AuthContextProvider";
import { useAuth } from "@/components/context/auth/useAuth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook } from "@testing-library/react";
import { describe, expect, test } from "vitest";

describe("AuthContextProvider", () => {
  test("context exposes expected values", async () => {
    const queryClient = new QueryClient();

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>
        <AuthContextProvider>{children}</AuthContextProvider>
      </QueryClientProvider>
    );

    // might as well use the hook as accessor for convenience and bonus coverage
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.user).toBeNull();

    // Try valid user
    await act(async () => {
      await result.current.login("user", "user123");
    });

    expect(result.current.user).not.toBeNull();
    expect(result.current.user?.username).toBe("user");

    act(() => {
      result.current.logout();
    });

    expect(result.current.user).toBeNull();

    // Try invalid user
    await act(async () => {
      await result.current.login("bad", "bad123");
    });

    expect(result.current.user).toBeNull();
    // expect some error message
    expect(result.current.loginError).not.toBe("");
  });
});
