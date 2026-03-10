import { useEffect, useRef, useState } from 'react'
import { Client, type IMessage, type StompSubscription } from '@stomp/stompjs'
import SockJs from 'sockjs-client'
import { useAuth } from '../../context/AuthContext'

interface PresenceEvent {
  userId: string
  status: string
  receivedAt: string
}

export function PresenceTestPage() {
  const { username } = useAuth()
  const [connected, setConnected] = useState(false)
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set())
  const [events, setEvents] = useState<PresenceEvent[]>([])
  const clientRef = useRef<Client | null>(null)
  const subscriptionsRef = useRef<StompSubscription[]>([])

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () =>
        new SockJs('http://localhost:8080/message-app-websocket'),
      reconnectDelay: 3000,
      onConnect: () => {
        setConnected(true)

        // Subscribe to user queue first so it's ready to receive the initial online users list
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

        // Subscribe to live presence events (triggers backend to send initial list)
        const presenceSub = client.subscribe(
          '/topic/presence',
          (frame: IMessage) => {
            try {
              const data = JSON.parse(frame.body) as { userId: string; status: string }
              setEvents((prev) => [
                { ...data, receivedAt: new Date().toLocaleTimeString() },
                ...prev,
              ])
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

        subscriptionsRef.current = [presenceSub, initSub]
      },
      onDisconnect: () => setConnected(false),
      onStompError: (frame) => {
        console.error('STOMP error', frame)
        setConnected(false)
      },
    })

    client.activate()
    clientRef.current = client

    return () => {
      subscriptionsRef.current.forEach((s) => s.unsubscribe())
      client.deactivate()
    }
  }, [])

  return (
    <div className="h-screen bg-ink-950 flex flex-col items-center p-8">
      <div className="w-full max-w-xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="font-display font-bold text-2xl text-ink-100">
            Presence Test
          </h1>
          <p className="font-body text-sm text-ink-500">
            Subscribed to <code className="text-signal">/topic/presence</code>
          </p>
        </div>

        {/* Connection status */}
        <div className="flex items-center justify-center gap-3 rounded-xl border border-ink-800 bg-ink-900 px-5 py-3">
          <span
            className={`h-2.5 w-2.5 rounded-full ${connected ? 'bg-green-400 shadow-[0_0_6px_rgba(74,222,128,.5)]' : 'bg-red-400 shadow-[0_0_6px_rgba(248,113,113,.5)]'}`}
          />
          <span className="font-body text-sm text-ink-300">
            {connected ? 'Connected' : 'Disconnected'}
          </span>
          {username && (
            <span className="ml-auto font-body text-xs text-ink-500">
              Logged in as <span className="text-signal">{username}</span>
            </span>
          )}
        </div>

        {/* Online users */}
        <div className="rounded-xl border border-ink-800 bg-ink-900 px-5 py-4 space-y-3">
          <span className="font-display text-sm font-semibold text-ink-300">
            Online Users ({onlineUsers.size})
          </span>
          {onlineUsers.size === 0 ? (
            <p className="font-body text-sm text-ink-500">No users online.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {[...onlineUsers].map((user) => (
                <span
                  key={user}
                  className="inline-flex items-center gap-1.5 rounded-full bg-ink-800 px-3 py-1 font-body text-sm text-ink-200"
                >
                  <span className="h-2 w-2 rounded-full bg-green-400" />
                  {user}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <span className="font-display text-sm font-semibold text-ink-300">
            Events ({events.length})
          </span>
          <button
            onClick={() => setEvents([])}
            className="font-body text-xs text-ink-500 hover:text-signal transition-colors"
          >
            Clear
          </button>
        </div>

        {/* Event log */}
        <div className="rounded-xl border border-ink-800 bg-ink-900 divide-y divide-ink-800 max-h-[60vh] overflow-y-auto">
          {events.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <p className="font-body text-sm text-ink-500">
                No presence events yet. Connect/disconnect users to see events appear here.
              </p>
            </div>
          ) : (
            events.map((ev, i) => (
              <div key={i} className="flex items-center gap-3 px-5 py-3">
                <span
                  className={`h-2 w-2 rounded-full ${ev.status === 'online' ? 'bg-green-400' : 'bg-red-400'}`}
                />
                <span className="font-body text-sm text-ink-200 flex-1">
                  <span className="font-semibold text-ink-100">{ev.userId}</span>
                  {' '}went{' '}
                  <span
                    className={
                      ev.status === 'online' ? 'text-green-400' : 'text-red-400'
                    }
                  >
                    {ev.status}
                  </span>
                </span>
                <span className="font-body text-xs text-ink-600">{ev.receivedAt}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
