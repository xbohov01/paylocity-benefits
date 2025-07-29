import { describe, expect, test, vi } from "vitest";
import { render, screen } from "./testUtils";
import userEvent from "@testing-library/user-event";
import DefaultLayout from "@/components/routing/layout/DefaultLayout";

// navigate mock outside of describe due to scope and hoisting sorcery
const navigateMock = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

describe("DefaultLayout", () => {
  test("user only sees appropriate tabs", () => {
    render(<DefaultLayout />, {
      authContextValue: {
        user: {
          username: "user",
          id: 42,
          firstName: "user",
          lastName: "user",
          functions: [],
        },
      },
    });

    expect(screen.queryByText("Manage Users")).toBeNull();
    expect(screen.getByText("My Benefits")).toBeDefined();
    expect(screen.getByText("My Settings")).toBeDefined();
  });

  test("admin sees all tabs", () => {
    render(<DefaultLayout />, {
      authContextValue: {
        user: {
          username: "admin",
          id: 42,
          firstName: "admin",
          lastName: "admin",
          functions: ["ViewUsers"],
        },
      },
    });

    expect(screen.getByText("Manage Users")).toBeDefined();
    expect(screen.getByText("My Benefits")).toBeDefined();
    expect(screen.getByText("My Settings")).toBeDefined();
  });

  test("clicking logout triggers handler", async () => {
    const logoutMock = vi.fn();

    render(<DefaultLayout />, {
      authContextValue: {
        user: {
          username: "user",
          id: 42,
          firstName: "user",
          lastName: "user",
          functions: [],
        },
        logout: logoutMock,
      },
    });

    const button = screen.getByRole("button", { name: /log out/i });
    await userEvent.click(button);

    expect(logoutMock).toHaveBeenCalled();
    expect(navigateMock).toHaveBeenCalledWith("/");
  });
});
