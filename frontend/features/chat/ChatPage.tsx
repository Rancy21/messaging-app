import { useState } from 'react'
import { ConversationList } from './ConversationList'
import { MessageThread } from './MessageThread'
import type { Discussion } from '../../types'

export function ChatPage() {
  const [selected, setSelected] = useState<Discussion | null>(null)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(true)

  const handleSelect = (conv: Discussion) => {
    setSelected(conv)
    setMobileSidebarOpen(false)
  }

  return (
    <div className="h-screen bg-ink-950 flex overflow-hidden">
      {/* Sidebar — desktop always visible, mobile toggleable */}
      <div
        className={`
          absolute inset-y-0 left-0 z-20 md:static md:block
          transition-transform duration-200
          ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <ConversationList selectedId={selected?.conversationId ?? null} onSelect={handleSelect} />
      </div>

      {/* Mobile overlay */}
      {mobileSidebarOpen && selected && (
        <button
          className="fixed inset-0 z-10 bg-ink-950/80 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
          aria-label="Close sidebar"
        />
      )}

      {/* Main content */}
      <main className="flex-1 flex flex-col h-full min-w-0">
        {selected ? (
          <>
            {/* Mobile back button */}
            <button
              className="md:hidden flex items-center gap-2 px-4 py-2 text-xs font-body text-ink-400 hover:text-signal border-b border-ink-800 bg-ink-900 transition-colors"
              onClick={() => setMobileSidebarOpen(true)}
              aria-label="Back to conversations"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M9 11L5 7l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              All conversations
            </button>
            <MessageThread key={selected.conversationId} conversation={selected} />
          </>
        ) : (
          <EmptyState onOpenSidebar={() => setMobileSidebarOpen(true)} />
        )}
      </main>
    </div>
  )
}

function EmptyState({ onOpenSidebar }: { onOpenSidebar: () => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-8">
      <div className="w-16 h-16 rounded-2xl bg-signal-muted border border-signal/20 flex items-center justify-center">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
          <path
            d="M4 6a2 2 0 012-2h16a2 2 0 012 2v12a2 2 0 01-2 2H8l-4 4V6z"
            stroke="#e8ff47"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div>
        <h2 className="font-display font-bold text-ink-100 text-lg">Select a conversation</h2>
        <p className="mt-1 font-body text-sm text-ink-500">
          Pick one from the sidebar or start a new one.
        </p>
      </div>
      <button
        className="md:hidden font-display text-sm font-semibold text-signal hover:text-signal-dim transition-colors"
        onClick={onOpenSidebar}
      >
        Open conversations →
      </button>
    </div>
  )
}
