import React, { useState, useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import styled from "styled-components";
import { chatApi } from "../../api/chat";
import { ChatMessage, MessageType } from "../../types/chat/Chat";
import { useUser } from "../../hooks/useUser";

const ChatContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
`;

const MessageList = styled.div`
  height: 400px;
  overflow-y: auto;
  border: 1px solid #eee;
  padding: 10px;
  margin-bottom: 10px;
`;

const MessageInput = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
`;

const SendButton = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
`;

const ChatRoom: React.FC = () => {
  const { user } = useUser();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const stompClientRef = useRef<Client | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 기존 채팅 메시지 가져오기
    const fetchMessages = async () => {
      try {
        const previousMessages = await chatApi.getAllMessages();
        setMessages(previousMessages);
      } catch (error) {
        console.error("Error fetching messages", error);
      }
    };

    // WebSocket 연결 설정
    const socket = new SockJS("http://localhost:8080/ws-chat");
    const stompClient = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        console.log("Connected to WebSocket");

        // 사용자 추가 이벤트 전송
        stompClient.publish({
          destination: "/app/chat.addUser",
          body: JSON.stringify({
            user: user,
            type: MessageType.JOIN,
          }),
        });

        // 구독: 서버에서 메시지 수신
        stompClient.subscribe("/topic/public", (message) => {
          const receivedMessage: ChatMessage = JSON.parse(message.body);
          setMessages((prevMessages) => [...prevMessages, receivedMessage]);
        });
      },
      onStompError: (error) => {
        console.error("STOMP Error:", error);
      },
    });

    stompClient.activate();
    stompClientRef.current = stompClient;

    fetchMessages();

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
      }
    };
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() && stompClientRef.current) {
      const messagePayload: ChatMessage = {
        user: user,
        content: inputMessage,
        type: MessageType.CHAT,
      };

      // 서버로 메시지 전송
      stompClientRef.current.publish({
        destination: "/app/chat.sendMessage",
        body: JSON.stringify(messagePayload),
      });
      setInputMessage("");
    }
  };

  return (
    <ChatContainer>
      <MessageList>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.user}: </strong>
            {msg.content}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </MessageList>
      <form onSubmit={sendMessage}>
        <MessageInput
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <SendButton type="submit">Send</SendButton>
      </form>
    </ChatContainer>
  );
};

export default ChatRoom;
