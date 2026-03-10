import { useEffect, useRef, useState } from 'react'
import { Client, type IMessage, type StompSubscription } from '@stomp/stompjs'
import SockJs from 'sockjs-client'

export function usePresence() {
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set())
  const subscriptionsRef = useRef<StompSubscription[]>([])
  const clientRef = useRef<Client | null>(null)

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () =>
        new SockJs('http://localhost:8080/message-app-websocket'),
      reconnectDelay: 3000,
      onConnect: () => {
        const initSub = client.subscribe(
          '/user/queue/presence/online-users',
          (frame: IMessage) => {
            try {
              const users = JSON.parse(frame.body) as string[]
              setOnlineUsers(new Set(users))
            } catch {
              console.error('Failed to parse online users list', frame.body)
            }
          },
        )

        const presenceSub = client.subscribe(
          '/topic/presence',
          (frame: IMessage) => {
            try {
              const data = JSON.parse(frame.body) as { userId: string; status: string }
              setOnlineUsers((prev) => {
                const next = new Set(prev)
                if (data.status === 'online') next.add(data.userId)
                else next.delete(data.userId)
                return next
              })
            } catch {
              console.error('Failed to parse presence message', frame.body)
            }
          },
        )

        subscriptionsRef.current = [initSub, presenceSub]
      },
    })

    client.activate()
    clientRef.current = client

    return () => {
      subscriptionsRef.current.forEach((s) => s.unsubscribe())
      client.deactivate()
    }
  }, [])

  return onlineUsers
}
