import { describe, expect, test, vi } from "vitest";
import { render, screen } from "./testUtils";
import Login from "@/components/login/Login";
import userEvent from "@testing-library/user-event";

describe("Login", () => {
  test("fields are rendered", () => {
    render(<Login />);

    expect(screen.getByText("Username")).toBeDefined();
    expect(screen.getByText("Password")).toBeDefined();
    expect(screen.getByPlaceholderText("Enter your username")).toBeDefined();
    expect(screen.getByPlaceholderText("Enter your password")).toBeDefined();
  });

  test("cannot submit without input", async () => {
    render(<Login />);

    const button = screen.getByRole("button", { name: /log in/i });
    expect(button).toBeDisabled();
    //await userEvent.click(button);
  });

  test("can submit with input", async () => {
    const mockLogin = vi.fn();
    render(<Login />, {
      authContextValue: {
        login: mockLogin,
      },
    });

    const usernameInput = screen.getByPlaceholderText("Enter your username");
    const passwordInput = screen.getByPlaceholderText("Enter your password");

    await userEvent.type(usernameInput, "Username");
    await userEvent.type(passwordInput, "Password");

    const button = screen.getByRole("button", { name: /log in/i });
    expect(button).toBeEnabled();
    await userEvent.click(button);

    expect(mockLogin).toHaveBeenCalled();
  });
});
