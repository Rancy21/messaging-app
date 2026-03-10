import { useState, useEffect, useRef, useCallback } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { conversationsApi } from '../../api/conversation'
import { useStomp } from '../../hooks/useStomp'
import { useAuth } from '../../context/AuthContext'
import { Avatar, Spinner, ErrorMessage } from '../../components/ui/Misc'
import type { ChatEvent, Discussion, MessageDTO } from '../../types'

interface MessageThreadProps {
  conversation: Discussion
  onlineUsers: Set<string>
}

export function MessageThread({ conversation, onlineUsers }: MessageThreadProps) {
  const { username } = useAuth()
  const qc = useQueryClient()
  const bottomRef = useRef<HTMLDivElement>(null)
  const [input, setInput] = useState('')
  const [optimisticMsgs, setOptimisticMsgs] = useState<MessageDTO[]>([])
  const [typingUser, setTypingUser] = useState<string | null>(null)
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const sendTypingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const { data: messages, isLoading, isError, error } = useQuery({
    queryKey: ['messages', conversation.conversationId],
    queryFn: () => conversationsApi.getMessages(conversation.conversationId),
    refetchOnWindowFocus: false,
  })

  // Reset state when conversation changes
  useEffect(() => {
    setOptimisticMsgs([])
    setInput('')
    setTypingUser(null)
  }, [conversation.conversationId])

  const handleIncomingMessage = useCallback(
    (msg: MessageDTO) => {
      setOptimisticMsgs((prev) => {
        const alreadyExists = prev.some((m) => m.id === msg.id)
        if (alreadyExists) return prev
        return [...prev, msg]
      })
      void qc.invalidateQueries({ queryKey: ['conversations'] })
    },
    [qc]
  )

  const handleTypingEvent = useCallback(
    (event: ChatEvent) => {
      if (event.senderUsername === username) return
      setTypingUser(event.senderUsername)
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
      typingTimeoutRef.current = setTimeout(() => setTypingUser(null), 2000)
    },
    [username]
  )

  const { sendMessage, sendTyping } = useStomp({
    conversationId: conversation.conversationId,
    onMessage: handleIncomingMessage,
    onTyping: handleTypingEvent,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
    if (!sendTypingTimeoutRef.current) {
      sendTyping()
      sendTypingTimeoutRef.current = setTimeout(() => {
        sendTypingTimeoutRef.current = null
      }, 1000)
    }
  }

  // Scroll to bottom whenever messages update
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, optimisticMsgs])

  const allMessages: MessageDTO[] = [
    ...(messages ?? []),
    ...optimisticMsgs.filter(
      (om) => !(messages ?? []).some((m) => m.id === om.id)
    ),
  ]

  const handleSend = (e: React.SubmitEvent) => {
    e.preventDefault()
    const content = input.trim()
    if (!content || !username) return

    sendMessage({
      conversationId: conversation.conversationId,
      content,
    })


    setInput('')
  }

  function formatMessageTime(iso: string): string {
    return new Date(iso).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const otherUser = conversation.otherParticipantUsername ?? '?'
  const isOnline = onlineUsers.has(otherUser)

  return (
    <div className="flex flex-col h-full">
      {/* Thread header */}
      <div className="px-6 py-4 border-b border-ink-800 flex items-center gap-3 bg-ink-900/80 backdrop-blur-sm">
        <Avatar username={otherUser} size="md" />
        <div>
          <h2 className="font-display font-semibold text-ink-50 text-sm">{otherUser}</h2>
          <p className="text-[11px] font-mono text-ink-500 flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full inline-block ${isOnline ? 'bg-green-400 animate-blink' : 'bg-ink-600'}`} aria-hidden="true" />
            {isOnline ? 'online' : 'offline'}
          </p>
        </div>
      </div>

      {/* Messages area */}
      <div
        className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-3"
        role="log"
        aria-live="polite"
        aria-label="Message history"
      >
        {isLoading && (
          <div className="flex items-center justify-center py-10">
            <Spinner />
          </div>
        )}
        {isError && (
          <ErrorMessage
            message={error instanceof Error ? error.message : 'Failed to load messages'}
          />
        )}
        {!isLoading && allMessages.length === 0 && (
          <p className="text-center text-sm font-body text-ink-600 py-10">
            No messages yet. Say hello 👋
          </p>
        )}

        {allMessages.map((msg, i) => {
          const isMine = msg.sender === username
          const prevMsg = allMessages[i - 1]
          const showAvatar = !prevMsg || prevMsg.sender !== msg.sender

          return (
            <div
              key={msg.id}
              className={`flex items-end gap-2.5 ${isMine ? 'flex-row-reverse' : 'flex-row'} animate-fade-up`}
            >
              {/* Avatar placeholder to keep alignment */}
              <div className="w-7 shrink-0">
                {showAvatar && !isMine && <Avatar username={msg.sender} size="sm" />}
              </div>

              <div className={`flex flex-col gap-0.5 max-w-[70%] ${isMine ? 'items-end' : 'items-start'}`}>
                {showAvatar && !isMine && (
                  <span className="text-[10px] font-body text-ink-500 px-1">{msg.sender}</span>
                )}
                <div
                  className={`px-4 py-2.5 rounded-2xl text-sm font-body leading-relaxed ${
                    isMine
                      ? 'bg-signal text-ink-950 rounded-br-sm'
                      : 'bg-ink-800 text-ink-100 rounded-bl-sm border border-ink-700'
                  }`}
                >
                  {msg.content}
                </div>
                <time
                  className="text-[10px] font-mono text-ink-600 px-1"
                  dateTime={msg.time}
                >
                  {formatMessageTime(msg.time)}
                </time>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} aria-hidden="true" />
      </div>

      {/* Typing indicator */}
      {typingUser && (
        <div className="px-6 py-1.5 flex items-center gap-2 text-[11px] font-body text-ink-500 animate-fade-up">
          <span className="flex gap-0.5">
            <span className="w-1 h-1 rounded-full bg-ink-500 animate-bounce [animation-delay:0ms]" />
            <span className="w-1 h-1 rounded-full bg-ink-500 animate-bounce [animation-delay:150ms]" />
            <span className="w-1 h-1 rounded-full bg-ink-500 animate-bounce [animation-delay:300ms]" />
          </span>
          {typingUser} is typing
        </div>
      )}

      {/* Input bar */}
      <form
        onSubmit={handleSend}
        className="px-5 py-4 border-t border-ink-800 flex items-center gap-3 bg-ink-900/80 backdrop-blur-sm"
        aria-label="Send message"
      >
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder={`Message ${otherUser}…`}
          aria-label="Message input"
          className="flex-1 bg-ink-800 border border-ink-700 rounded-xl px-4 py-2.5 text-sm font-body text-ink-100 placeholder:text-ink-500 focus:outline-none focus:border-signal focus:ring-1 focus:ring-signal transition-colors"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          aria-label="Send"
          className="w-10 h-10 rounded-xl bg-signal text-ink-950 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-signal-dim active:scale-95 transition-all"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M14 8L2 2l2 6-2 6 12-6z" fill="currentColor" />
          </svg>
        </button>
      </form>
    </div>
  )
}
