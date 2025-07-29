import type { User } from "@/types/auth";
import type { Dependent } from "@/types/benefits";

export const sendGetUsers = async (
  page: number = 1,
  pageSize: number = 10
): Promise<{ page: User[]; total: number }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const raw = localStorage.getItem("mockUsers");
      const users: User[] = raw ? JSON.parse(raw) : [];

      const total = users.length;
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const paginated = users.slice(start, end);

      resolve({ page: paginated, total });
    }, 500);
  });
};

// a bit janky since it's mocked
// needs to create a user entry and also benefit settings
// not making it possible to log in as the new user - that's a backend problem
export const sendPostUser = async (inputs: {
  firstName: string;
  lastName: string;
  dependents: Dependent[];
}): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const raw = localStorage.getItem("mockUsers");
      const users: User[] = raw ? JSON.parse(raw) : [];

      const id = users.length; // hacky way to get the next id since lenght will always be +1

      users.push({
        id: id,
        username: `${inputs.firstName}.${inputs.lastName}`,
        firstName: inputs.firstName,
        lastName: inputs.lastName,
        functions: []
      });

      localStorage.setItem("mockUsers", JSON.stringify(users));
      resolve();
    }, 500);
  });
};
