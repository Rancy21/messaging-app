import { createRootRoute, Outlet, Navigate } from '@tanstack/react-router'
import { useAuth } from '../context/AuthContext'


function RootComponent(){
    return <Outlet />
}

export const Route = createRootRoute({
    component: RootComponent
})

export function RequireAuth({children}: {children: React.ReactNode}){
    const {isAuthenticated} = useAuth();
    if(!isAuthenticated) return <Navigate to="/login"/>
    return <>{children}</>
}

export function RedirectIfAuth({children}: {children: React.ReactNode}){
    const {isAuthenticated} = useAuth()
    if(isAuthenticated) return <Navigate to="/chat"/>
    return <>{children}</>
}