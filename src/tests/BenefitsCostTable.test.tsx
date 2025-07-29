import BenefitsCostTable from "@/components/benefits/BenefitsCostTable";
import { describe, expect, test, vi } from "vitest";
import { render, screen, waitFor } from "./testUtils";

vi.mock("@/api/benefits", () => ({
  sendGetUserBenefits: vi.fn((userId: number, _year: string) => {
    if (userId === 1) {
      return Promise.reject(new Error("Failed to fetch"));
    }
    if (userId === 2) {
      return Promise.resolve([]);
    }
    if (userId === 3) {
      return Promise.resolve([
        { year: "2025", month: "January", week: "1", cost: 100 },
      ]);
    }
    return Promise.resolve([]);
  }),
}));

describe("BenefitsCostTable", () => {
  test("shows error message when fetch fails", async () => {
    render(<BenefitsCostTable userId={1} />);

    await waitFor(
      () => {
        expect(screen.getByText(/failed to fetch/i)).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });

  test("shows no data message when result is empty", async () => {
    render(<BenefitsCostTable userId={2} />);

    await waitFor(
      () => {
        expect(screen.getByText(/no data found/i)).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });

  test("renders table with data", async () => {
    render(<BenefitsCostTable userId={3} />);

    await waitFor(
      () => {
        expect(screen.getByText("January")).toBeInTheDocument();
        expect(screen.getByText("100 $")).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });
});
