import { createRoute } from '@tanstack/react-router'
import { Route as rootRoute } from './__root'
import { PresenceTestPage } from '../features/presence/PresenceTestPage'
import { RequireAuth } from './__root'

function PresenceTestRoute() {
  return (
    <RequireAuth>
      <PresenceTestPage />
    </RequireAuth>
  )
}

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/presence-test',
  component: PresenceTestRoute,
})
