import { createRoute } from '@tanstack/react-router'
import { Route as rootRoute } from './__root'
import { ChatPage } from '../features/chat/ChatPage'
import { RequireAuth } from './__root'

function ChatRoute() {
  return (
    <RequireAuth>
      <ChatPage />
    </RequireAuth>
  )
}

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/chat',
  component: ChatRoute,
})
