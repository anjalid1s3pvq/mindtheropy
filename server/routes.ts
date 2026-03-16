import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMessageSchema } from "@shared/schema";
import { generateTherapyResponse } from "./openai";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.post("/api/sessions", async (req, res) => {
    try {
      const session = await storage.createSession();
      res.json(session);
    } catch (error: any) {
      console.error("Error creating session:", error);
      res.status(500).json({ error: "Failed to create session" });
    }
  });

  app.get("/api/sessions/:id/messages", async (req, res) => {
    try {
      const { id } = req.params;
      const messages = await storage.getMessagesBySession(id);
      res.json(messages);
    } catch (error: any) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  app.post("/api/sessions/:id/messages", async (req, res) => {
    try {
      const { id } = req.params;
      const validated = insertMessageSchema.parse({
        ...req.body,
        sessionId: id,
      });

      const userMessage = await storage.createMessage(validated);

      const conversationHistory = await storage.getMessagesBySession(id);
      const historyForAI = conversationHistory
        .filter(m => m.id !== userMessage.id)
        .map(m => ({
          role: m.role as "user" | "assistant",
          content: m.content
        }));

      const aiResponse = await generateTherapyResponse(historyForAI, validated.content);

      const assistantMessage = await storage.createMessage({
        sessionId: id,
        role: "assistant",
        content: aiResponse,
      });

      res.json({
        userMessage,
        assistantMessage,
      });
    } catch (error: any) {
      console.error("Error creating message:", error);
      res.status(500).json({ error: error.message || "Failed to create message" });
    }
  });

  return httpServer;
}
