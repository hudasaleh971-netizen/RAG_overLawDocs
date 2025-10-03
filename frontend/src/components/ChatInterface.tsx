import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Send, Mic, Volume2, Loader2, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import DisclaimerBanner from "./DisclaimerBanner";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface ChatInterfaceProps {
  onBack: () => void;
}

const ChatInterface = ({ onBack }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi! I'm your AI legal assistant specialized in UAE labor law. Ask me about your rights regarding contracts, wages, working hours, termination, or any other employment-related questions.",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: userMessage.content }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error("Failed to fetch AI response:", error);
      toast({
        title: "Error",
        description: "Failed to get a response from the AI. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };


  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleVoiceInput = () => {
    setIsRecording(!isRecording);
    toast({
      title: "Voice Feature",
      description: "Voice input will be available soon. This is a placeholder for STT integration.",
    });
  };

  const handleTextToSpeech = (text: string) => {
    toast({
      title: "Audio Feature",
      description: "Text-to-speech will be available soon. This is a placeholder for TTS integration.",
    });
  };

  const clearChat = () => {
    setMessages([
      {
        id: '1',
        content: "Hi! I'm your AI legal assistant specialized in UAE labor law. Ask me about your rights regarding contracts, wages, working hours, termination, or any other employment-related questions.",
        sender: 'ai',
        timestamp: new Date()
      }
    ]);
    setInputValue("");
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-chat">
      {/* Header */}
      <header className="bg-card shadow-soft border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="hover:bg-accent"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </div>
            <div className="text-center">
              <h1 className="text-lg font-semibold">AI Legal Assistant</h1>
              <p className="text-sm text-muted-foreground">UAE Labor Rights</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={clearChat}
              className="hover:bg-accent"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Clear
            </Button>
          </div>
        </div>
      </header>

      {/* Disclaimer Banner */}
      <DisclaimerBanner />

      {/* Messages Area */}
      <div className="flex-1 overflow-auto px-4 py-6 space-y-4">
        <div className="max-w-4xl mx-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} chat-message-enter`}
            >
              <div className={`max-w-[80%] md:max-w-[70%] ${message.sender === 'user' ? 'ml-16' : 'mr-16'}`}>
                <Card className={`p-4 ${
                  message.sender === 'user' 
                    ? 'bg-chat-user-bg text-chat-user-fg' 
                    : 'bg-card'
                }`}>
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className={`text-xs ${
                      message.sender === 'user' 
                        ? 'text-chat-user-fg/70' 
                        : 'text-muted-foreground'
                    }`}>
                      {message.timestamp.toLocaleTimeString('en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                    {message.sender === 'ai' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleTextToSpeech(message.content)}
                        className="h-6 w-6 p-0 hover:bg-accent"
                      >
                        <Volume2 className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </Card>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] md:max-w-[70%] mr-16">
                <Card className="p-4 bg-card">
                  <div className="flex items-center gap-2 chat-typing">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">AI is typing...</span>
                  </div>
                </Card>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-card border-t border-border shadow-soft">
        <div className="container mx-auto px-4 py-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-end gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={handleVoiceInput}
                className={`shrink-0 ${isRecording ? 'recording-pulse bg-destructive text-destructive-foreground' : ''}`}
                disabled={isLoading}
              >
                <Mic className="w-4 h-4" />
              </Button>
              
              <div className="flex-1">
                <Textarea
                  ref={textareaRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Ask about your UAE labor rights... (Press Enter to send, Shift+Enter for new line)"
                  className="min-h-[50px] max-h-32 resize-none"
                  disabled={isLoading}
                  maxLength={500}
                />
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-muted-foreground">
                    {inputValue.length}/500
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Enter to send • Shift+Enter for new line
                  </span>
                </div>
              </div>
              
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="shrink-0 bg-primary hover:bg-primary/90"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;