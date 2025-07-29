import { describe, expect, test } from "vitest";
import { render, screen } from "./testUtils";
import AlertBox from "@/components/alert/AlertBox";

describe("AlertBox", () => {
  test("renders correct status and content", () => {
    render(<AlertBox status="error" message="message" title="title" />);
    
    expect(screen.getByText("title")).toBeDefined();
    expect(screen.getByText("message")).toBeDefined();
  });
});
