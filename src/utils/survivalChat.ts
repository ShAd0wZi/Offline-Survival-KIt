import { supabase } from '@/integrations/supabase/client';

export type Message = {
  role: 'user' | 'assistant';
  content: string;
};

interface StreamChatOptions {
  messages: Message[];
  onDelta: (deltaText: string) => void;
  onDone: () => void;
  onError: (error: string) => void;
}

/**
 * Stream chat responses from survival AI assistant
 */
export const streamSurvivalChat = async ({
  messages,
  onDelta,
  onDone,
  onError,
}: StreamChatOptions): Promise<void> => {
  try {
    const { data, error } = await supabase.functions.invoke('survival-chat', {
      body: { messages },
    });

    if (error) {
      throw error;
    }

    // Check if response is ReadableStream (streaming response)
    if (data instanceof ReadableStream) {
      const reader = data.getReader();
      const decoder = new TextDecoder();
      let textBuffer = '';
      let streamDone = false;

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        
        textBuffer += decoder.decode(value, { stream: true });

        // Process line-by-line
        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') {
            streamDone = true;
            break;
          }

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) onDelta(content);
          } catch {
            // Incomplete JSON - put it back and wait for more data
            textBuffer = line + '\n' + textBuffer;
            break;
          }
        }
      }

      // Flush remaining buffer
      if (textBuffer.trim()) {
        for (let raw of textBuffer.split('\n')) {
          if (!raw) continue;
          if (raw.endsWith('\r')) raw = raw.slice(0, -1);
          if (raw.startsWith(':') || raw.trim() === '') continue;
          if (!raw.startsWith('data: ')) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === '[DONE]') continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) onDelta(content);
          } catch {
            // Ignore partial leftovers
          }
        }
      }

      onDone();
    } else if (data?.error) {
      // Handle error responses
      throw new Error(data.error);
    } else {
      throw new Error('Unexpected response format');
    }
  } catch (error: any) {
    console.error('Survival chat error:', error);
    
    if (error?.message?.includes('429')) {
      onError('Rate limit exceeded. Please try again in a moment.');
    } else if (error?.message?.includes('402')) {
      onError('AI service credits exhausted. Using offline mode.');
    } else {
      onError(error?.message || 'Failed to connect to AI assistant');
    }
  }
};
