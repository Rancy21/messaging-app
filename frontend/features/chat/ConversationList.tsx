import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { conversationsApi } from '../../api/conversation'
import { useAuth } from '../../context/AuthContext'
import { Avatar, Spinner, ErrorMessage } from '../../components/ui/Misc'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/input'
import type { Discussion } from '../../types'

interface ConversationListProps {
  selectedId: string | null
  onSelect: (conv: Discussion) => void
}

export function ConversationList({ selectedId, onSelect }: ConversationListProps) {
  const { username, logout } = useAuth()
  const qc = useQueryClient()
  const [newRecipient, setNewRecipient] = useState('')
  const [showNew, setShowNew] = useState(false)
  const [newError, setNewError] = useState('')

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['conversations'],
    queryFn: conversationsApi.getAll,
    refetchInterval: 5000,
  })

  const createMutation = useMutation({
    mutationFn: (recipient: string) =>
      conversationsApi.getOrCreate({ username: username!, recipient: recipient }),
    onSuccess: (conv) => {
      void qc.invalidateQueries({ queryKey: ['conversations'] })
      setNewRecipient('')
      setShowNew(false)
      setNewError('')
      onSelect({
        conversationId: conv.conversationId,
        lastMessageContent: '',
        otherParticipantUsername: newRecipient.trim(),
      })
    },
    onError: (err) => {
      setNewError(err instanceof Error ? err.message : 'Failed to start conversation')
    },
  })

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newRecipient.trim()) return
    createMutation.mutate(newRecipient.trim())
  }

  function otherParticipant(conv: Discussion): string {
    return conv.otherParticipantUsername ?? '?'
  }

  return (
    <aside
      className="w-72 shrink-0 h-full bg-ink-900 border-r border-ink-800 flex flex-col"
      aria-label="Conversations"
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-ink-800 flex items-center justify-between">
        <h1 className="font-display font-extrabold text-lg text-ink-50 tracking-tight">
          relay<span className="text-signal">.</span>
        </h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowNew((v) => !v)}
            aria-label="New conversation"
            title="New conversation"
            className="w-8 h-8 flex items-center justify-center rounded-lg text-ink-400 hover:text-signal hover:bg-ink-800 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          <button
            onClick={logout}
            aria-label="Sign out"
            title="Sign out"
            className="w-8 h-8 flex items-center justify-center rounded-lg text-ink-400 hover:text-red-400 hover:bg-ink-800 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M6 2H3a1 1 0 00-1 1v10a1 1 0 001 1h3M11 11l3-3-3-3M14 8H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Logged in as */}
      <div className="px-5 py-2.5 border-b border-ink-800 flex items-center gap-2.5">
        <Avatar username={username ?? ''} size="sm" />
        <span className="text-xs font-body text-ink-400 truncate">{username}</span>
      </div>

      {/* New conversation form */}
      {showNew && (
        <form
          onSubmit={handleCreate}
          className="px-4 py-3 border-b border-ink-800 flex flex-col gap-2 animate-fade-up"
          aria-label="Start new conversation"
        >
          <Input
            placeholder="Recipient username"
            value={newRecipient}
            onChange={(e) => setNewRecipient(e.target.value)}
            autoFocus
            error={newError}
          />
          <Button type="submit" loading={createMutation.isPending} fullWidth>
            Start chat
          </Button>
        </form>
      )}

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto" role="list">
        {isLoading && (
          <div className="flex items-center justify-center py-10">
            <Spinner />
          </div>
        )}
        {isError && (
          <div className="p-4">
            <ErrorMessage
              message={error instanceof Error ? error.message : 'Failed to load conversations'}
            />
          </div>
        )}
        {data?.length === 0 && !isLoading && (
          <p className="text-center text-sm font-body text-ink-500 py-10 px-4">
            No conversations yet.
            <br />
            Start one with the <strong className="text-signal">+</strong> button.
          </p>
        )}
        {data?.map((conv) => {
          const other = otherParticipant(conv)
          const isSelected = conv.conversationId === selectedId
          return (
            <button
              key={conv.conversationId}
              role="listitem"
              onClick={() => onSelect(conv)}
              aria-current={isSelected ? 'true' : undefined}
              className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-signal ${
                isSelected
                  ? 'bg-signal-muted border-l-2 border-signal'
                  : 'hover:bg-ink-800 border-l-2 border-transparent'
              }`}
            >
              <Avatar username={other} size="md" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span
                    className={`font-display text-sm font-semibold truncate ${
                      isSelected ? 'text-signal' : 'text-ink-100'
                    }`}
                  >
                    {other}
                  </span>
                </div>
                {conv.lastMessageContent && (
                  <p className="text-xs font-body text-ink-500 truncate mt-0.5">
                    {conv.lastMessageContent}
                  </p>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </aside>
  )
}
