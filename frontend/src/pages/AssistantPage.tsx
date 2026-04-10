import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Trash2, Loader2 } from 'lucide-react';
import { sendChatMessage, type ChatMessage } from '../services/assistantService';

const SUGGESTIONS = [
  "Why did my credit score change?",
  "How can I earn more XP?",
  "What quests should I focus on?",
  "Tips to improve my trust score",
];

export default function AssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (messageText?: string) => {
    const text = (messageText || input).trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: text };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const reply = await sendChatMessage(text, messages);
      setMessages([...newMessages, { role: 'assistant', content: reply }]);
    } catch {
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: '⚠️ Something went wrong. Please try again in a moment.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  // Simple markdown-style rendering for bold and code
  const renderContent = (content: string) => {
    // Process the content line by line for better markdown support
    const lines = content.split('\n');
    return lines.map((line, lineIdx) => {
      // Process inline markdown
      const parts = line.split(/(\*\*.*?\*\*|`.*?`)/g);
      const rendered = parts.map((part, partIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={partIdx} style={{ color: 'var(--color-accent)' }}>
              {part.slice(2, -2)}
            </strong>
          );
        }
        if (part.startsWith('`') && part.endsWith('`')) {
          return (
            <code
              key={partIdx}
              style={{
                background: 'rgba(108, 92, 231, 0.15)',
                padding: '2px 6px',
                borderRadius: 4,
                fontSize: '0.85em',
                color: 'var(--color-primary-light)',
              }}
            >
              {part.slice(1, -1)}
            </code>
          );
        }
        return part;
      });
      return (
        <span key={lineIdx}>
          {rendered}
          {lineIdx < lines.length - 1 && <br />}
        </span>
      );
    });
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      {/* Header */}
      <div className="stagger-1" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background:
                'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 20px rgba(0, 210, 255, 0.3)',
            }}
          >
            <Sparkles size={24} color="white" />
          </div>
          <div>
            <h1
              style={{
                fontSize: '1.8rem',
                fontWeight: 800,
                margin: 0,
                background:
                  'linear-gradient(135deg, var(--color-text-primary), var(--color-accent))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              FinZen AI
            </h1>
            <p
              style={{
                margin: 0,
                color: 'var(--color-text-muted)',
                fontSize: '0.85rem',
              }}
            >
              Your personal financial wellness advisor
            </p>
          </div>
          {messages.length > 0 && (
            <button
              onClick={clearChat}
              className="btn-ghost"
              style={{
                marginLeft: 'auto',
                padding: '8px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: '0.8rem',
              }}
            >
              <Trash2 size={14} /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Chat Container */}
      <div
        className="glass-card stagger-2"
        style={{
          height: 'calc(100vh - 240px)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Messages Area */}
        <div
          className="chat-messages-area"
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '24px',
          }}
        >
          {messages.length === 0 ? (
            /* Empty state */
            <div
              style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 24,
              }}
            >
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 24,
                  background:
                    'linear-gradient(135deg, rgba(108,92,231,0.2), rgba(0,210,255,0.2))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  animation: 'float 4s ease-in-out infinite',
                }}
              >
                <Bot size={40} style={{ color: 'var(--color-accent)' }} />
              </div>
              <div style={{ textAlign: 'center' }}>
                <h3
                  style={{
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    margin: '0 0 8px',
                    color: 'var(--color-text-primary)',
                  }}
                >
                  What can I help you with?
                </h3>
                <p
                  style={{
                    color: 'var(--color-text-muted)',
                    fontSize: '0.9rem',
                    margin: 0,
                    maxWidth: 400,
                  }}
                >
                  I know about your Credit DNA, quests, badges, and XP
                  progress. Ask me anything about your financial health!
                </p>
              </div>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 8,
                  justifyContent: 'center',
                  maxWidth: 500,
                }}
              >
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSend(s)}
                    className="chat-suggestion-chip"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Messages */
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className="chat-message-bubble"
                  style={{
                    display: 'flex',
                    gap: 12,
                    alignItems: 'flex-start',
                    flexDirection:
                      msg.role === 'user' ? 'row-reverse' : 'row',
                    animation: 'slide-up 0.3s ease forwards',
                  }}
                >
                  {/* Avatar */}
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background:
                        msg.role === 'user'
                          ? 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))'
                          : 'linear-gradient(135deg, rgba(0,210,255,0.2), rgba(108,92,231,0.2))',
                      border:
                        msg.role === 'assistant'
                          ? '1px solid var(--color-border)'
                          : 'none',
                    }}
                  >
                    {msg.role === 'user' ? (
                      <User size={18} color="white" />
                    ) : (
                      <Sparkles
                        size={18}
                        style={{ color: 'var(--color-accent)' }}
                      />
                    )}
                  </div>

                  {/* Bubble */}
                  <div
                    style={{
                      maxWidth: '75%',
                      padding: '14px 18px',
                      borderRadius:
                        msg.role === 'user'
                          ? '16px 4px 16px 16px'
                          : '4px 16px 16px 16px',
                      background:
                        msg.role === 'user'
                          ? 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))'
                          : 'var(--color-bg-surface)',
                      border:
                        msg.role === 'assistant'
                          ? '1px solid var(--color-border)'
                          : 'none',
                      color: 'var(--color-text-primary)',
                      fontSize: '0.92rem',
                      lineHeight: 1.65,
                    }}
                  >
                    {renderContent(msg.content)}
                  </div>
                </div>
              ))}

              {/* Loading indicator */}
              {isLoading && (
                <div
                  style={{
                    display: 'flex',
                    gap: 12,
                    alignItems: 'flex-start',
                    animation: 'fade-in 0.3s ease',
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background:
                        'linear-gradient(135deg, rgba(0,210,255,0.2), rgba(108,92,231,0.2))',
                      border: '1px solid var(--color-border)',
                    }}
                  >
                    <Sparkles
                      size={18}
                      style={{ color: 'var(--color-accent)' }}
                    />
                  </div>
                  <div
                    style={{
                      padding: '14px 18px',
                      borderRadius: '4px 16px 16px 16px',
                      background: 'var(--color-bg-surface)',
                      border: '1px solid var(--color-border)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    <Loader2
                      size={16}
                      className="chat-spinner"
                      style={{ color: 'var(--color-accent)' }}
                    />
                    <span
                      style={{
                        color: 'var(--color-text-muted)',
                        fontSize: '0.85rem',
                      }}
                    >
                      Thinking...
                    </span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div
          style={{
            padding: '16px 24px 20px',
            borderTop: '1px solid var(--color-border)',
            background: 'rgba(10,10,26,0.5)',
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: 12,
              alignItems: 'flex-end',
            }}
          >
            <textarea
              ref={inputRef}
              id="chat-input"
              className="input-field"
              placeholder="Ask FinZen about your finances..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              rows={1}
              style={{
                flex: 1,
                resize: 'none',
                minHeight: 48,
                maxHeight: 120,
                paddingRight: 16,
              }}
            />
            <button
              id="chat-send"
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                border: 'none',
                cursor: input.trim() && !isLoading ? 'pointer' : 'default',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background:
                  input.trim() && !isLoading
                    ? 'linear-gradient(135deg, var(--color-primary), var(--color-accent))'
                    : 'var(--color-bg-surface)',
                transition: 'all 0.3s ease',
                flexShrink: 0,
                boxShadow:
                  input.trim() && !isLoading
                    ? '0 4px 16px rgba(0, 210, 255, 0.3)'
                    : 'none',
              }}
            >
              <Send
                size={20}
                color={
                  input.trim() && !isLoading
                    ? 'white'
                    : 'var(--color-text-muted)'
                }
              />
            </button>
          </div>
          <p
            style={{
              margin: '8px 0 0',
              fontSize: '0.7rem',
              color: 'var(--color-text-muted)',
              textAlign: 'center',
            }}
          >
            FinZen AI provides general financial guidance, not professional advice.
          </p>
        </div>
      </div>
    </div>
  );
}
