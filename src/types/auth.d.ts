export type User = {
  id: number; // can be guid depending on preference
  username: string;
  firstName: string;
  lastName: string;
  // middle name or array of additional names
  // any other relevant user data
  // could technically pull dependent and benefit data as well but having a separate api would be more performant
  functions: string[];
};

export type AuthContextType = {
  user: User | null;
  isLoggingIn: boolean,
  loginError: string | null,
  login: (username: string, password: string) => Promise;
  logout: () => void;
};
