import { describe, expect, test, vi } from "vitest";
import { render, screen, waitFor } from "./testUtils";
import SettingsForm from "@/components/settings/SettingsForm";

describe("SettingsForm", () => {
  test("data is shown and submit is enabled", async () => {
    const mockRefetch = vi.fn();

    render(
      <SettingsForm
        settings={{
          firstName: "John",
          lastName: "Doe",
          userId: 1,
          dependents: [
            { firstName: "Kid1", lastName: "One" },
            { firstName: "Kid2", lastName: "Two" },
          ],
        }}
        refetch={mockRefetch}
      />
    );

    // Check that form fields contain the expected values
    expect(screen.getByDisplayValue("John")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Doe")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Kid1")).toBeInTheDocument();

    // Check submit button is enabled
    await waitFor(() => {
      const submitButton = screen.getByRole("button", {
        name: /save settings/i,
      });
      expect(submitButton).not.toBeDisabled();
    });
  });

  test("with no data submit is disabled", async () => {
    const mockRefetch = vi.fn();

    render(
      <SettingsForm
        settings={{
          firstName: "",
          lastName: "",
          userId: 1,
          dependents: [],
        }}
        refetch={mockRefetch}
      />
    );

    // Form inputs should be empty
    expect(screen.getByPlaceholderText("First Name")).toHaveValue("");
    expect(screen.getByPlaceholderText("Last Name")).toHaveValue("");

    // Submit button should be disabled
    await waitFor(() => {
      const submitButton = screen.getByRole("button", { name: /save settings/i });
      expect(submitButton).toBeDisabled();
    });
  });
});
