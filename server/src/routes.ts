import userRoutes from "./components/users/routes";
const routes = [userRoutes];

export type Route = (typeof routes)[number][number];

// Create a union of all route paths for type safety
export type AppRoutes = Route;
