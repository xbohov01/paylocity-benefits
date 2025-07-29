import { calculateCost } from "@/util/costCalculation";
import { describe, expect, test } from "vitest";

describe("costCalculation", () => {
  const base = 1000 / 26;
  const perDependent = 500 / 26;

  test("no A, no dependents", () => {
    const result = calculateCost("bbb", "bbb", []);

    expect(result).toBe(base);
  });

  test("A, no dependents", () => {
    const result = calculateCost("AAA", "AAA", []);

    expect(result).toBe(base - base/10);
  });

  test("no A, 1 no A dependent", () => {
    const result = calculateCost("bbb", "bbb", [
      {
        firstName: "bbb",
        lastName: "bb"
      }
    ]);

    expect(result).toBe(base + perDependent);
  });

  test("no A, 1 A dependent", () => {
    const result = calculateCost("bbb", "bbb", [
      {
        firstName: "AAA",
        lastName: "AAA"
      }
    ]);

    expect(result).toBe(base + (perDependent - perDependent/10));
  });
})