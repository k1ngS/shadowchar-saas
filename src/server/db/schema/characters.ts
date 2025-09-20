import { relations, sql } from "drizzle-orm";
import { index, integer, json, text, varchar } from "drizzle-orm/pg-core";
import { users } from "./auth";
import { campaigns } from "./campaigns";
import { createTable } from "./_base";

export const characters = createTable(
  "character",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    userId: d.varchar({ length: 255 }).notNull().references(() => users.id),
    campaignId: d.integer().references(() => campaigns.id),

    // Informações básicas
    name: d.varchar({ length: 100 }).notNull(),
    ancestry: d.varchar({ length: 50 }).notNull(),
    novicePath: d.varchar({ length: 50 }),
    expertPath: d.varchar({ length: 50 }),
    masterPath: d.varchar({ length: 50 }),
    level: d.integer().default(0).notNull(),

    // Atributos
    strength: d.integer().default(10).notNull(),
    agility: d.integer().default(10).notNull(),
    intellect: d.integer().default(10).notNull(),
    will: d.integer().default(10).notNull(),

    // Status
    health: d.integer().default(0).notNull(),
    insanity: d.integer().default(0).notNull(),
    corruption: d.integer().default(0).notNull(),

    // Notas e características
    background: d.text(),
    notes: d.text(),

    // Campos avançados (usando JSON para flexibilidade)
    talents: d.json().default([]),
    spells: d.json().default([]),
    equipment: d.json().default([]),

    // Metadata
    isPublic: d.boolean().default(false).notNull(),
    createdAt: d.timestamp({ withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [
    index("character_user_id_idx").on(t.userId),
    index("character_campaign_id_idx").on(t.campaignId),
    index("character_name_idx").on(t.name),
  ],
);

export const charactersRelations = relations(characters, ({ one, many }) => ({
  user: one(users, { fields: [characters.userId], references: [users.id] }),
  campaign: one(campaigns, { fields: [characters.campaignId], references: [campaigns.id] }),
}));