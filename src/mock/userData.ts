import type { User } from "@/types/auth";

export const mockUsers = () => {
  const existing = localStorage.getItem("mockUsers");

  if (!existing) {
    const data: User[] = [
      {
        id: 0,
        username: "admin",
        firstName: "John",
        lastName: "Doe1",
        functions: ["ViewUsers"],
      },
      {
        id: 1,
        username: "user",
        firstName: "John",
        lastName: "Doe2",
        functions: [""],
      },
    ];
    localStorage.setItem("mockUsers", JSON.stringify(data));
  }
};
