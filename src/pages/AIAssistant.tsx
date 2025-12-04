import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ArrowLeft, Send, Loader2, WifiOff, Sparkles, History, Trash2, Plus } from 'lucide-react';
import { useOfflineStatus } from '@/hooks/useOfflineStatus';
import { streamSurvivalChat, type Message } from '@/utils/survivalChat';
import { getOfflineSurvivalAdvice, QUICK_PROMPTS } from '@/utils/offlineSurvivalRules';
import { useToast } from '@/hooks/use-toast';
import { chatHistoryService } from '@/services/chatHistoryService';
import { ChatConversation } from '@/db/database';

/**
 * AI-Powered Survival Assistant
 * Works online with AI, falls back to rules offline
 */
const AIAssistant = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const isOffline = useOfflineStatus();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
  }, []);

  // Show mode notification on mount
  useEffect(() => {
    if (isOffline) {
      toast({
        title: '📱 Offline Mode Active',
        description: 'Using rule-based survival responses. Responses may be limited.',
        duration: 4000,
      });
    }
  }, [isOffline, toast]);

  const loadConversations = async () => {
    const convos = await chatHistoryService.getConversations();
    setConversations(convos);
  };

  const startNewConversation = async () => {
    const title = `Chat ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`;
    const id = await chatHistoryService.createConversation(title);
    setCurrentConversationId(id);
    setMessages([]);
    await loadConversations();
    toast({
      title: '💬 New Chat Started',
      description: 'Ready for your survival questions',
    });
  };

  const loadConversation = async (id: string) => {
    const msgs = await chatHistoryService.getMessages(id);
    setMessages(msgs.map(m => ({
      role: m.role,
      content: m.content
    })));
    setCurrentConversationId(id);
    setIsHistoryOpen(false);
  };

  const deleteConversation = async (id: string) => {
    await chatHistoryService.deleteConversation(id);
    if (currentConversationId === id) {
      setCurrentConversationId(null);
      setMessages([]);
    }
    await loadConversations();
    toast({
      title: '🗑️ Conversation Deleted',
      description: 'Chat history has been removed',
    });
  };

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || isLoading) return;

    // Create conversation if needed
    let conversationId = currentConversationId;
    if (!conversationId) {
      const title = textToSend.slice(0, 50) + (textToSend.length > 50 ? '...' : '');
      conversationId = await chatHistoryService.createConversation(title);
      setCurrentConversationId(conversationId);
      await loadConversations();
    }

    const userMessage: Message = { role: 'user', content: textToSend };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Save user message
    await chatHistoryService.addMessage(conversationId, 'user', textToSend);

    if (isOffline) {
      // Offline mode: use rule-based system
      setTimeout(async () => {
        const response = getOfflineSurvivalAdvice(textToSend);
        setMessages(prev => [...prev, { role: 'assistant', content: response }]);
        await chatHistoryService.addMessage(conversationId!, 'assistant', response);
        setIsLoading(false);
      }, 500);
    } else {
      // Online mode: use AI streaming
      let assistantContent = '';
      
      const updateAssistantMessage = (content: string) => {
        assistantContent = content;
        setMessages(prev => {
          const last = prev[prev.length - 1];
          if (last?.role === 'assistant') {
            return prev.map((m, i) => 
              i === prev.length - 1 ? { ...m, content: assistantContent } : m
            );
          }
          return [...prev, { role: 'assistant', content: assistantContent }];
        });
      };

      await streamSurvivalChat({
        messages: [...messages, userMessage],
        onDelta: (chunk) => {
          assistantContent += chunk;
          updateAssistantMessage(assistantContent);
        },
        onDone: async () => {
          await chatHistoryService.addMessage(conversationId!, 'assistant', assistantContent);
          setIsLoading(false);
        },
        onError: async (error) => {
          console.error('AI error:', error);
          // Fallback to offline mode on error
          const fallbackResponse = getOfflineSurvivalAdvice(textToSend);
          const errorMessage = `⚠️ ${error}\n\nSwitching to offline mode:\n\n${fallbackResponse}`;
          setMessages(prev => [...prev, { 
            role: 'assistant', 
            content: errorMessage
          }]);
          await chatHistoryService.addMessage(conversationId!, 'assistant', errorMessage);
          setIsLoading(false);
        },
      });
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    handleSend(prompt);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-4xl mx-auto p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">AI Survival Assistant</h1>
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                {isOffline ? (
                  <>
                    <WifiOff className="h-3 w-3" />
                    <span>Offline Mode - Rule-based responses</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3 w-3" />
                    <span>AI Mode - Powered by advanced AI</span>
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button onClick={startNewConversation} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Chat
            </Button>

            <Sheet open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                  <History className="h-4 w-4 mr-2" />
                  History ({conversations.length})
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Chat History</SheetTitle>
                </SheetHeader>
                <ScrollArea className="h-[calc(100vh-8rem)] mt-4">
                  {conversations.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      No conversations yet. Start chatting to save history!
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {conversations.map((conv) => (
                        <Card
                          key={conv.id}
                          className={`p-3 cursor-pointer hover:bg-accent transition-colors ${
                            currentConversationId === conv.id ? 'border-primary' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div
                              onClick={() => loadConversation(conv.id)}
                              className="flex-1 min-w-0"
                            >
                              <p className="text-sm font-medium truncate">{conv.title}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(conv.updatedAt).toLocaleDateString()} at{' '}
                                {new Date(conv.updatedAt).toLocaleTimeString()}
                              </p>
                            </div>
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteConversation(conv.id);
                              }}
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 hover:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-4xl mx-auto w-full flex flex-col p-4 gap-4">
        {/* Quick Prompts */}
        {messages.length === 0 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-sm font-semibold mb-2 text-muted-foreground">Quick Prompts</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {QUICK_PROMPTS.map((prompt, index) => (
                  <Button
                    key={index}
                    onClick={() => handleQuickPrompt(prompt.prompt)}
                    variant="outline"
                    className="justify-start h-auto py-3 text-left"
                  >
                    <span className="text-2xl mr-2">{prompt.icon}</span>
                    <span className="text-sm">{prompt.label}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Messages */}
        <ScrollArea className="flex-1" ref={scrollRef}>
          <div className="space-y-4 pb-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-3 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <Card
                  className={`max-w-[85%] p-4 ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </Card>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3">
                <Card className="bg-card p-4">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                </Card>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="border-t border-border pt-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a survival question..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
