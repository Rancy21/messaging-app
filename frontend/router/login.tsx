import { createRoute } from "@tanstack/react-router";
import {Route as rootRoute} from './__root'
import {LoginPage} from '../features/auth/LoginPage'

export const Route = createRoute({
    getParentRoute: () => rootRoute,
    path: '/login',
    component:LoginPage
})