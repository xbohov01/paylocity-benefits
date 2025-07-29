import type { User } from "@/types/auth";

// Mock for an API, this would best be generated from openapi spec
export const sendLogin = async (
  username: string,
  password: string
): Promise<{ user: User | null; isSuccess: boolean; message: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (username === "admin" && password === "admin123") {
        resolve({
          user: {
            id: 0,
            username: "admin",
            firstName: "John",
            lastName: "Doe1",
            functions: ["ViewUsers"],
          },
          isSuccess: true,
          message: "",
        });
      } else if (username === "user" && password === "user123") {
        resolve({
          user: {
            id: 1,
            username: "user",
            firstName: "John",
            lastName: "Doe2",
            functions: [""],
          },
          isSuccess: true,
          message: "",
        });
      } else {
        resolve({
          user: null,
          isSuccess: false,
          message: "Invalid credentials",
        });
      }
    }, 1500); // 1.5s simulated delay
  });
};
