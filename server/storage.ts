import { type User, type InsertUser, type Session, type InsertSession, type Message, type InsertMessage, sessions, messages } from "@shared/schema";
import { db } from "../db";
import { eq, desc } from "drizzle-orm";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createSession(): Promise<Session>;
  getSession(id: string): Promise<Session | undefined>;
  
  createMessage(message: InsertMessage): Promise<Message>;
  getMessagesBySession(sessionId: string): Promise<Message[]>;
}

export class DbStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    return undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    throw new Error("Not implemented");
  }

  async createSession(): Promise<Session> {
    const [session] = await db.insert(sessions).values({}).returning();
    return session;
  }

  async getSession(id: string): Promise<Session | undefined> {
    const [session] = await db.select().from(sessions).where(eq(sessions.id, id)).limit(1);
    return session;
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const [newMessage] = await db.insert(messages).values(message).returning();
    return newMessage;
  }

  async getMessagesBySession(sessionId: string): Promise<Message[]> {
    return await db.select().from(messages).where(eq(messages.sessionId, sessionId)).orderBy(messages.timestamp);
  }
}

export const storage = new DbStorage();
