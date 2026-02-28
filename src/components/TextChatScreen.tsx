import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, ChevronDown, ChevronUp } from "lucide-react";
import { processCommand, commandsList } from "@/utils/veliaCommands";

interface ChatMessage {
  text: string;
  isUser: boolean;
}

const TextChatScreen = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { text: "Привет! Я Велия 💜 Напиши `помощь` чтобы увидеть список команд!", isUser: false },
  ]);
  const [input, setInput] = useState("");
  const [showCommands, setShowCommands] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMsg: ChatMessage = { text: trimmed, isUser: true };
    const result = processCommand(trimmed);
    const botMsg: ChatMessage = { text: result.text, isUser: false };

    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInput("");
    inputRef.current?.focus();
  };

  const handleCommandClick = (cmd: string) => {
    setInput(cmd);
    setShowCommands(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const renderMessageText = (text: string) => {
    // Simple markdown-like rendering for bold and spoilers
    let rendered = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\|\|(.*?)\|\|/g, '<span class="spoiler bg-muted-foreground/30 hover:bg-transparent transition-colors rounded px-1 cursor-pointer select-all">$1</span>')
      .replace(/`(.*?)`/g, '<code class="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">$1</code>')
      .replace(/\n/g, '<br/>');
    return <span dangerouslySetInnerHTML={{ __html: rendered }} />;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center pt-8 pb-4 px-4"
      >
        <h1 className="text-3xl font-bold text-gradient mb-1">Велия</h1>
        <p className="text-muted-foreground text-sm">Текстовый режим</p>
      </motion.div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="max-w-md mx-auto space-y-3">
          <AnimatePresence mode="popLayout">
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.isUser
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "glass rounded-bl-md"
                  }`}
                >
                  {renderMessageText(msg.text)}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Commands panel */}
      <AnimatePresence>
        {showCommands && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-border/30"
          >
            <div className="glass p-3 max-h-48 overflow-y-auto">
              <div className="grid grid-cols-2 gap-2 max-w-md mx-auto">
                {commandsList.map((c) => (
                  <button
                    key={c.cmd}
                    onClick={() => handleCommandClick(c.cmd)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/50 hover:bg-muted transition-colors text-left"
                  >
                    <span className="text-base">{c.icon}</span>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-foreground truncate">{c.cmd}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{c.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input area */}
      <div className="p-4 pb-24 border-t border-border/30">
        <div className="max-w-md mx-auto flex items-center gap-2">
          <button
            onClick={() => setShowCommands((v) => !v)}
            className="flex-shrink-0 w-10 h-10 rounded-xl glass flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            {showCommands ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
          </button>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Напиши команду..."
            className="flex-1 h-10 rounded-xl bg-muted/50 border border-border/30 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center disabled:opacity-40 transition-opacity"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TextChatScreen;
