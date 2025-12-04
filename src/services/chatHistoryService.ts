import { db, ChatConversation, ChatMessage } from '@/db/database';

export const chatHistoryService = {
  // Create a new conversation
  async createConversation(title: string): Promise<string> {
    const id = crypto.randomUUID();
    await db.conversations.add({
      id,
      title,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return id;
  },

  // Get all conversations, sorted by most recent
  async getConversations(): Promise<ChatConversation[]> {
    return await db.conversations.orderBy('updatedAt').reverse().toArray();
  },

  // Get a specific conversation
  async getConversation(id: string): Promise<ChatConversation | undefined> {
    return await db.conversations.get(id);
  },

  // Update conversation title and timestamp
  async updateConversation(id: string, title?: string): Promise<void> {
    const updates: Partial<ChatConversation> = {
      updatedAt: new Date()
    };
    if (title) {
      updates.title = title;
    }
    await db.conversations.update(id, updates);
  },

  // Delete a conversation and all its messages
  async deleteConversation(id: string): Promise<void> {
    await db.messages.where('conversationId').equals(id).delete();
    await db.conversations.delete(id);
  },

  // Add a message to a conversation
  async addMessage(conversationId: string, role: 'user' | 'assistant', content: string): Promise<void> {
    await db.messages.add({
      id: crypto.randomUUID(),
      conversationId,
      role,
      content,
      timestamp: new Date()
    });
    await this.updateConversation(conversationId);
  },

  // Get all messages for a conversation
  async getMessages(conversationId: string): Promise<ChatMessage[]> {
    return await db.messages
      .where('conversationId')
      .equals(conversationId)
      .sortBy('timestamp');
  },

  // Clear all chat history
  async clearAllHistory(): Promise<void> {
    await db.messages.clear();
    await db.conversations.clear();
  }
};
