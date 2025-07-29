import { describe, expect, test, vi } from "vitest";
import { render, screen, waitFor, fireEvent } from "./testUtils";
import CreateUser from "@/components/manage/CreateUser";
import { sendPostUser } from "@/api/users";

vi.mock("@/api/users", () => ({
  sendPostUser: vi.fn(),
}));

const navigateMock = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

describe("CreateUser", () => {
  test("submit button is disabled when no fields are filled", () => {
    render(<CreateUser />);
    const submitButton = screen.getByRole("button", { name: /save settings/i });
    expect(submitButton).toBeDisabled();
  });

  test("form is valid when filled out, submits correctly", async () => {
    render(<CreateUser />);

    fireEvent.change(screen.getByPlaceholderText("First Name"), {
      target: { value: "John" },
    });

    fireEvent.change(screen.getByPlaceholderText("Last Name"), {
      target: { value: "Doe" },
    });

    fireEvent.click(screen.getByRole("button", { name: /add dependent/i }));

    const depFirstName = screen.getAllByPlaceholderText("First Name")[1];
    const depLastName = screen.getAllByPlaceholderText("Last Name")[1];

    fireEvent.change(depFirstName, { target: { value: "Kid" } });
    fireEvent.change(depLastName, { target: { value: "Doe" } });

    const submitButton = screen.getByRole("button", { name: /save settings/i });

    await waitFor(() => expect(submitButton).toBeEnabled());

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(sendPostUser).toHaveBeenCalledWith({
        firstName: "John",
        lastName: "Doe",
        dependents: [{ firstName: "Kid", lastName: "Doe" }],
      });
      expect(navigateMock).toHaveBeenCalledWith("/manage");
    });
  });
});
