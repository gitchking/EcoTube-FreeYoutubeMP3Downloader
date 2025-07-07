import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertMessageSchema = createInsertSchema(messages).pick({
  name: true,
  email: true,
  message: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

// YouTube conversion schemas
export const convertRequestSchema = z.object({
  url: z.string().url().refine((url) => {
    return url.includes('youtube.com') || url.includes('youtu.be');
  }, "Must be a valid YouTube URL"),
  quality: z.enum(['64k', '128k', '192k', '256k', '320k']).default('128k'),
});

export type ConvertRequest = z.infer<typeof convertRequestSchema>;

export const convertResponseSchema = z.object({
  success: z.boolean(),
  title: z.string().optional(),
  downloadUrl: z.string().optional(),
  error: z.string().optional(),
});

export type ConvertResponse = z.infer<typeof convertResponseSchema>;
