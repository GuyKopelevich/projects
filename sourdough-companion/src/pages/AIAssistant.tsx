import { useState, useRef, useEffect } from 'react';
import Anthropic from '@anthropic-ai/sdk';
import { Bot, Send, Loader2, ChefHat, Sparkles, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { IconBadge } from '@/components/ui/IconBadge';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const SYSTEM_PROMPT = `אתה עוזר אפייה מומחה למחמצת (sourdough). אתה עוזר לאנשים לאפות לחם מחמצת מושלם.
אתה מדבר עברית בצורה טבעית ומקצועית.
אתה מכיר לעומק את:
- תהליכי הכנת מחמצת (starter)
- יחסי הידרציה ומשמעותם
- טכניקות לישה ועיצוב בצק
- זמני התפחה ותנאי טמפרטורה אידיאלים
- קמחים שונים ותכונותיהם
- פתרון בעיות נפוצות באפייה
- מתכונים קלאסיים ומתקדמים

תן עצות מעשיות, ברורות ומדויקות. אם שואלים אותך על בעיה, אבחן אותה ותן פתרון ספציפי.`;

const WELCOME_MESSAGES = [
  'שאל אותי על מחמצת!',
  'איך לדעת שהמחמצת מוכנה?',
  'מה עושים אם הבצק לא תופח?',
  'מהי הידרציה מומלצת למתחילים?',
];

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [streamingText, setStreamingText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY as string | undefined;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingText]);

  const handleSend = async (text?: string) => {
    const messageText = text ?? input.trim();
    if (!messageText || loading) return;

    setError(null);
    setInput('');
    setStreamingText('');

    const userMessage: Message = { role: 'user', content: messageText };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setLoading(true);

    if (!apiKey) {
      setError('מפתח API חסר. הוסף VITE_ANTHROPIC_API_KEY לקובץ .env');
      setLoading(false);
      return;
    }

    try {
      const client = new Anthropic({
        apiKey,
        dangerouslyAllowBrowser: true,
      });

      let fullText = '';

      const stream = client.messages.stream({
        model: 'claude-opus-4-6',
        max_tokens: 1024,
        thinking: { type: 'adaptive' },
        system: SYSTEM_PROMPT,
        messages: updatedMessages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      });

      for await (const event of stream) {
        if (
          event.type === 'content_block_delta' &&
          event.delta.type === 'text_delta'
        ) {
          fullText += event.delta.text;
          setStreamingText(fullText);
        }
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: fullText,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setStreamingText('');
    } catch (err) {
      console.error(err);
      setError('שגיאה בחיבור לעוזר. בדוק את מפתח ה-API ונסה שנית.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const autoResize = () => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = 'auto';
      ta.style.height = `${Math.min(ta.scrollHeight, 120)}px`;
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] -mx-4 -mt-4">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-border/30 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(145deg, hsl(25 25% 18%) 0%, hsl(25 20% 14%) 100%)',
              border: '1px solid hsl(42 60% 45% / 0.3)',
              boxShadow: '0 0 20px hsl(42 85% 55% / 0.15)',
            }}
          >
            <Bot className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="font-bold font-rubik text-lg text-gold">עוזר מחמצת</h1>
            <p className="text-xs text-muted-foreground">מופעל על ידי Claude AI</p>
          </div>
          <Sparkles className="h-4 w-4 text-primary/60 mr-auto animate-pulse-slow" />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 && !loading && (
          <div className="space-y-6 animate-fade-in">
            {/* Welcome */}
            <div className="text-center pt-4">
              <div className="w-16 h-16 mx-auto mb-4 rounded-3xl flex items-center justify-center"
                style={{
                  background: 'linear-gradient(145deg, hsl(25 25% 18%) 0%, hsl(25 20% 12%) 100%)',
                  border: '2px solid hsl(42 60% 45% / 0.3)',
                  boxShadow: '0 0 40px hsl(42 85% 55% / 0.2)',
                }}
              >
                <ChefHat className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-xl font-bold font-rubik text-foreground mb-2">שלום! אני כאן לעזור</h2>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                שאל אותי כל שאלה על אפיית לחם מחמצת — מהכנת הבסיס ועד אפייה מושלמת
              </p>
            </div>

            {/* Quick prompts */}
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground text-center mb-3">שאלות מהירות:</p>
              {WELCOME_MESSAGES.map((msg, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(msg)}
                  className="faq-item w-full animate-fade-in"
                  style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'both' }}
                >
                  <span className="text-sm text-foreground">{msg}</span>
                  <Send className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                </button>
              ))}
            </div>

            {!apiKey && (
              <div className="section-card-compact flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">מפתח API חסר</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    הוסף <code className="text-primary">VITE_ANTHROPIC_API_KEY=...</code> לקובץ <code className="text-primary">.env</code>
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={cn(
              'flex gap-2 animate-fade-in',
              msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
            )}
          >
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-1"
                style={{
                  background: 'hsl(42 85% 55% / 0.15)',
                  border: '1px solid hsl(42 60% 45% / 0.2)',
                }}
              >
                <Bot className="h-4 w-4 text-primary" />
              </div>
            )}
            <div
              className={cn(
                'max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
                msg.role === 'user'
                  ? 'rounded-tl-sm text-foreground'
                  : 'rounded-tr-sm text-foreground'
              )}
              style={
                msg.role === 'user'
                  ? {
                      background: 'linear-gradient(135deg, hsl(42 85% 55%) 0%, hsl(38 85% 45%) 100%)',
                      color: 'hsl(25 30% 8%)',
                    }
                  : {
                      background: 'hsl(25 25% 14% / 0.9)',
                      border: '1px solid hsl(42 50% 40% / 0.15)',
                    }
              }
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}

        {/* Streaming message */}
        {streamingText && (
          <div className="flex gap-2 animate-fade-in flex-row">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-1"
              style={{
                background: 'hsl(42 85% 55% / 0.15)',
                border: '1px solid hsl(42 60% 45% / 0.2)',
              }}
            >
              <Bot className="h-4 w-4 text-primary" />
            </div>
            <div
              className="max-w-[85%] rounded-2xl rounded-tr-sm px-4 py-3 text-sm leading-relaxed text-foreground"
              style={{
                background: 'hsl(25 25% 14% / 0.9)',
                border: '1px solid hsl(42 50% 40% / 0.15)',
              }}
            >
              <p className="whitespace-pre-wrap">{streamingText}</p>
              <span className="inline-block w-1.5 h-4 bg-primary/60 rounded-sm animate-pulse ml-0.5 align-middle" />
            </div>
          </div>
        )}

        {/* Loading dots */}
        {loading && !streamingText && (
          <div className="flex gap-2 flex-row animate-fade-in">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: 'hsl(42 85% 55% / 0.15)',
                border: '1px solid hsl(42 60% 45% / 0.2)',
              }}
            >
              <Loader2 className="h-4 w-4 text-primary animate-spin" />
            </div>
            <div className="rounded-2xl rounded-tr-sm px-4 py-3"
              style={{
                background: 'hsl(25 25% 14% / 0.9)',
                border: '1px solid hsl(42 50% 40% / 0.15)',
              }}
            >
              <div className="flex gap-1 items-center h-5">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 150}ms` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex items-start gap-3 section-card-compact animate-fade-in">
            <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div
        className="px-4 py-3 border-t border-border/30 flex-shrink-0"
        style={{ background: 'hsl(25 25% 10% / 0.95)', backdropFilter: 'blur(12px)' }}
      >
        <div
          className="flex items-end gap-2 rounded-2xl p-2 pr-3"
          style={{
            background: 'hsl(25 25% 14%)',
            border: '1px solid hsl(42 50% 40% / 0.2)',
          }}
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              autoResize();
            }}
            onKeyDown={handleKeyDown}
            placeholder="שאל שאלה על מחמצת..."
            disabled={loading}
            rows={1}
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none py-2 leading-relaxed"
            style={{ maxHeight: '120px', direction: 'rtl' }}
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            className={cn(
              'w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200',
              input.trim() && !loading
                ? 'bg-gradient-to-br from-primary to-amber-600 shadow-[0_0_15px_hsl(42_85%_55%_/_0.3)] hover:scale-105'
                : 'bg-muted opacity-50 cursor-not-allowed'
            )}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 text-primary-foreground animate-spin" />
            ) : (
              <Send className="h-4 w-4 text-primary-foreground" style={{ transform: 'rotate(180deg)' }} />
            )}
          </button>
        </div>
        <p className="text-[10px] text-muted-foreground text-center mt-2">
          מופעל על ידי Claude AI · Enter לשליחה · Shift+Enter לשורה חדשה
        </p>
      </div>
    </div>
  );
}
