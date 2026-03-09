import { createRouter } from "@tanstack/react-router";
import { Route as rootRoute } from "./__root";
import { Route as indexRoute } from "./index";
import { Route as loginRoute } from "./login";
import { Route as registerRoute } from "./register";
import { Route as chatRoute } from "./chat";

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  registerRoute,
  chatRoute,
]);

export const router = createRouter({
  routeTree,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
