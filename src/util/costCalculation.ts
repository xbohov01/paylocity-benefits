import type { Dependent } from "@/types/benefits";

// Could also accept different salaries and costs depending on jurisdiction
// Also might be better if handled on backend 
export const calculateCost = (firstName:string, lastName:string, dependents:Dependent[]) => {
  const base = 1000 / 26;
    const perDependent = 500 / 26;

    let result = 0;

    if (firstName.startsWith("A") || lastName.startsWith("A")) {
      result += base - base / 10;
    } else {
      result += base;
    }

    dependents.map((d) => {
      if (d.firstName.startsWith("A") || d.lastName.startsWith("A")) {
        result += perDependent - perDependent / 10;
      } else {
        result += perDependent;
      }
    });

    return result;
}