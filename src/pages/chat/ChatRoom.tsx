import React, { useState, useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import styled from "styled-components";
import { chatApi } from "../../api/chat";
import { ChatMessage, MessageType } from "../../types/chat/Chat";
import { useUser } from "../../hooks/useUser";
import Button from "../../components/Button";

const ChatContainer = styled.div`
  max-width: 600px;
  margin: 50px auto 0;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
`;

const MessageList = styled.div`
  height: 70vh;
  overflow-y: auto;
  border: 1px solid #eee;
  padding: 10px;
  margin-bottom: 10px;
`;

const Message = styled.div<{ isOwnMessage: boolean }>`
  display: flex;
  justify-content: ${(props) =>
    props.isOwnMessage ? "flex-end" : "flex-start"};
  margin-bottom: 5px;

  & > div {
    max-width: 60%;
    padding: 10px;
    border-radius: 8px;
    background-color: ${(props) =>
      props.isOwnMessage ? "#ff5733" : "#f1f1f1"};
    color: ${(props) => (props.isOwnMessage ? "white" : "black")};
  }
`;

const MessageInput = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
`;

const SendButton = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #ff5733;
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
    const fetchMessages = async () => {
      try {
        const previousMessages = await chatApi.getAllMessages();
        setMessages(previousMessages);
      } catch (error) {
        console.error("Error fetching messages", error);
      }
    };

    const socket = new SockJS("http://localhost:8080/ws-chat");
    const stompClient = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        console.log("Connected to WebSocket");

        stompClient.publish({
          destination: "/app/chat.addUser",
          body: JSON.stringify({
            user: user,
            type: MessageType.JOIN,
          }),
        });

        stompClient.subscribe("/topic/public", (message) => {
          const receivedMessage: ChatMessage = JSON.parse(message.body);

          if (receivedMessage.content.trim() !== "") {
            setMessages((prevMessages) => [...prevMessages, receivedMessage]);
          }
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
    const trimmedMessage = inputMessage.trim();

    if (trimmedMessage && stompClientRef.current) {
      const messagePayload: ChatMessage = {
        user: user,
        content: trimmedMessage,
        type: MessageType.CHAT,
      };

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
          <Message key={index} isOwnMessage={msg.user === user}>
            <div>
              <strong>{msg.user}: </strong>
              {msg.content}
            </div>
          </Message>
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
        <Button type="submit">Send</Button>
      </form>
    </ChatContainer>
  );
};

export default ChatRoom;
