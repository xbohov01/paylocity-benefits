import type { User } from "@/types/auth";

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

export const sendPostUser = async (user: User): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const raw = localStorage.getItem("mockUsers");
      const users: User[] = raw ? JSON.parse(raw) : [];

      const existingIndex = users.findIndex((u) => u.id === user.id);
      if (existingIndex >= 0) {
        users[existingIndex] = user; // Update
      } else {
        users.push(user); // Insert
      }

      localStorage.setItem("mockUsers", JSON.stringify(users));
      resolve();
    }, 500);
  });
};
