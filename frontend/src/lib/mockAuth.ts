import { v4 as uuidv4 } from 'uuid';

interface MockUser {
  id: string;
  username: string;
  email: string;
  password: string; // Added password field
}

const LS_USERS_KEY = "mockUsers";
const LS_CURRENT_USER_KEY = "mockCurrentUser";

// --- Helper functions for localStorage ---
const getStoredUsers = (): MockUser[] => {
  if (typeof window === "undefined") return [];
  const usersJson = localStorage.getItem(LS_USERS_KEY);
  return usersJson ? JSON.parse(usersJson) : [];
};

const setStoredUsers = (users: MockUser[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(LS_USERS_KEY, JSON.stringify(users));
  }
};

const getStoredCurrentUser = (): MockUser | null => {
  if (typeof window === "undefined") return null;
  const userJson = localStorage.getItem(LS_CURRENT_USER_KEY);
  return userJson ? JSON.parse(userJson) : null;
};

const setStoredCurrentUser = (user: MockUser | null) => {
  if (typeof window !== "undefined") {
    if (user) {
      localStorage.setItem(LS_CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(LS_CURRENT_USER_KEY);
    }
  }
};

// --- Mock Authentication Functions ---

export const mockRegister = (username: string, email: string, password: string): { success: boolean; user?: MockUser; error?: string } => {
  const users = getStoredUsers();
  if (users.some(u => u.email === email)) { // Check for existing email
    return { success: false, error: "Email already registered." };
  }
  if (users.some(u => u.username === username)) { // Check for existing username
    return { success: false, error: "Username already taken." };
  }

  const newUser: MockUser = {
    id: uuidv4(),
    username,
    email,
    password, // Store password (insecurely for mock)
  };
  setStoredUsers([...users, newUser]);
  setStoredCurrentUser(newUser); // Log in immediately after registration
  return { success: true, user: newUser };
};

export const mockLogin = (email: string, password: string): { success: boolean; user?: MockUser; error?: string } => {
  const users = getStoredUsers();
  const user = users.find(u => u.email === email && u.password === password); // Match email and password

  if (user) {
    setStoredCurrentUser(user);
    return { success: true, user };
  } else {
    return { success: false, error: "Invalid email or password." };
  }
};

export const mockLogout = () => {
  setStoredCurrentUser(null);
};

export const getCurrentMockUser = (): MockUser | null => {
  return getStoredCurrentUser();
};

// Initialize some mock users if none exist
if (typeof window !== "undefined" && getStoredUsers().length === 0) {
  setStoredUsers([
    { id: uuidv4(), username: "testuser", email: "test@example.com", password: "password123" },
    { id: uuidv4(), username: "admin", email: "admin@example.com", password: "adminpassword" },
  ]);
}