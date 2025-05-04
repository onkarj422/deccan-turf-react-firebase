import { createRoute } from "@tanstack/react-router";
import { appRoute } from "./app";
import { Booking } from "@/pages/booking";

export const bookRoute = createRoute({
  path: '/book/$turfId',
  component: Booking,
  getParentRoute: () => appRoute,
  staticData: {
    title: 'Book a slot',
  }
})