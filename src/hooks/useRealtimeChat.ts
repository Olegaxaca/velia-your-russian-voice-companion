import { useState, useCallback, useRef, useEffect } from "react";
import { RealtimeChat, RealtimeMessage } from "@/utils/RealtimeAudio";

interface Message {
  text: string;
  isUser: boolean;
}

interface UseRealtimeChatReturn {
  messages: Message[];
  isConnected: boolean;
  isConnecting: boolean;
  isSpeaking: boolean;
  isListening: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
}

export function useRealtimeChat(): UseRealtimeChatReturn {
  const [messages, setMessages] = useState<Message[]>([
    { text: "Привет! Я Велия, ваш голосовой помощник. Нажмите на микрофон, чтобы начать разговор.", isUser: false },
  ]);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  const chatRef = useRef<RealtimeChat | null>(null);
  const currentTranscriptRef = useRef<string>("");
  const currentResponseRef = useRef<string>("");

  const handleMessage = useCallback((event: RealtimeMessage) => {
    console.log("Processing event:", event.type);

    switch (event.type) {
      case "session.created":
        console.log("Session created");
        setMessages(prev => [
          ...prev,
          { text: "Соединение установлено! Говорите — я слушаю.", isUser: false }
        ]);
        setIsListening(true);
        break;

      case "input_audio_buffer.speech_started":
        console.log("User started speaking");
        setIsListening(true);
        currentTranscriptRef.current = "";
        break;

      case "input_audio_buffer.speech_stopped":
        console.log("User stopped speaking");
        setIsListening(false);
        break;

      case "conversation.item.input_audio_transcription.completed":
        const userTranscript = (event as unknown as { transcript: string }).transcript;
        if (userTranscript) {
          console.log("User transcript:", userTranscript);
          setMessages(prev => [...prev, { text: userTranscript, isUser: true }]);
        }
        break;

      case "response.audio_transcript.delta":
        const delta = (event as unknown as { delta: string }).delta;
        if (delta) {
          currentResponseRef.current += delta;
        }
        break;

      case "response.audio.delta":
        setIsSpeaking(true);
        break;

      case "response.audio.done":
        setIsSpeaking(false);
        break;

      case "response.audio_transcript.done":
        const fullTranscript = (event as unknown as { transcript: string }).transcript || currentResponseRef.current;
        if (fullTranscript) {
          console.log("Assistant response:", fullTranscript);
          setMessages(prev => [...prev, { text: fullTranscript, isUser: false }]);
        }
        currentResponseRef.current = "";
        break;

      case "response.done":
        setIsSpeaking(false);
        setIsListening(true);
        break;

      case "error":
        console.error("Realtime API error:", event);
        const errorMessage = (event as unknown as { error?: { message?: string } }).error?.message || "Произошла ошибка";
        setMessages(prev => [...prev, { text: `Ошибка: ${errorMessage}`, isUser: false }]);
        break;
    }
  }, []);

  const connect = useCallback(async () => {
    if (isConnecting || isConnected) return;
    
    setIsConnecting(true);
    
    try {
      chatRef.current = new RealtimeChat(handleMessage);
      await chatRef.current.init();
      setIsConnected(true);
    } catch (error) {
      console.error("Failed to connect:", error);
      setMessages(prev => [
        ...prev, 
        { text: `Не удалось подключиться: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`, isUser: false }
      ]);
    } finally {
      setIsConnecting(false);
    }
  }, [isConnecting, isConnected, handleMessage]);

  const disconnect = useCallback(() => {
    chatRef.current?.disconnect();
    chatRef.current = null;
    setIsConnected(false);
    setIsSpeaking(false);
    setIsListening(false);
    setMessages(prev => [
      ...prev,
      { text: "Соединение завершено. Нажмите на микрофон, чтобы начать снова.", isUser: false }
    ]);
  }, []);

  useEffect(() => {
    return () => {
      chatRef.current?.disconnect();
    };
  }, []);

  return {
    messages,
    isConnected,
    isConnecting,
    isSpeaking,
    isListening,
    connect,
    disconnect,
  };
}
