import { describe, expect, test, vi } from "vitest";
import { render, screen, waitFor } from "./testUtils";
import UserList from "@/components/manage/UserList";

vi.mock("@/api/users", () => ({
  sendGetUsers: vi.fn().mockResolvedValue({
    total: 1,
    page: [
      {
        id: 1,
        firstName: "first",
        lastName: "last",
        username: "user",
        functions: [],
      },
    ],
  }),
}));

describe("UserList", () => {
  test("shows data when given", async () => {
    render(<UserList />);
    await waitFor(() => {
      expect(screen.getByText("user")).toBeInTheDocument();
      expect(screen.getByText("first")).toBeInTheDocument();
      expect(screen.getByText("last")).toBeInTheDocument();
    });
  });

  //
});
