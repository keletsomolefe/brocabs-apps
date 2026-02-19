import { animationIn } from "./animations";

export const MODAL_ROUTES = {
  popup: { animationIn, animationOut: "slideOutDown" },
} as const;

export type Route = keyof typeof MODAL_ROUTES;
