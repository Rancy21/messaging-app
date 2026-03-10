import { useCallback, useEffect, useRef } from "react";
import type { ChatEvent, ChatMessageRequest, MessageDTO } from "../types";
import { Client, type IMessage, type StompSubscription } from "@stomp/stompjs";
import SockJs from "sockjs-client";
interface UseStompOptions {
  conversationId: string | null;
  onMessage: (msg: MessageDTO) => void;
  onTyping?: (event: ChatEvent) => void;
}

export function useStomp({ conversationId, onMessage, onTyping }: UseStompOptions) {
  const clientRef = useRef<Client | null>(null);
  const subscriptionRef = useRef<StompSubscription | null>(null);
  const onMessageRef = useRef(onMessage);
  const onTypingRef = useRef(onTyping);

  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    onTypingRef.current = onTyping;
  }, [onTyping]);

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () =>
        new SockJs("http://localhost:8080/message-app-websocket"),
      reconnectDelay: 3000,
      onConnect: () => {
        if (conversationId !== null) {
          subscriptionRef.current = client.subscribe(
            `/topic/conversations/${conversationId}`,
            (frame: IMessage) => {
              try {
                const data = JSON.parse(frame.body);
                if (data.action === "is_typing") {
                  onTypingRef.current?.(data as ChatEvent);
                } else {
                  onMessageRef.current(data as MessageDTO);
                }
              } catch {
                console.error("Failed to parse STOMP message", frame.body);
              }
            },
          );
        }
      },
      onStompError: (frame) => {
        console.error("STOMP error", frame);
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      subscriptionRef.current?.unsubscribe();
      client.deactivate();
    };
  }, [conversationId]);

  const sendMessage = useCallback((payload: ChatMessageRequest) => {
    if (clientRef.current?.connected) {
      clientRef.current.publish({
        destination: "/app/chat",
        body: JSON.stringify(payload),
      });
    }
  }, []);

  const sendTyping = useCallback(() => {
    if (clientRef.current?.connected && conversationId) {
      clientRef.current.publish({
        destination: `/app/conversations/${conversationId}/typing`,
      });
    }
  }, [conversationId]);

  return { sendMessage, sendTyping };
}
