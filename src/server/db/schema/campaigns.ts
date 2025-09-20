import { relations, sql } from "drizzle-orm";
import { index } from "drizzle-orm/pg-core";
import { users } from "./auth";
import { characters } from "./characters";
import { createTable } from "./_base";

export const campaigns = createTable(
  "campaign",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    name: d.varchar({ length: 100 }).notNull(),
    description: d.text(),
    gmId: d.varchar({ length: 255 }).notNull().references(() => users.id),
    isActive: d.boolean().default(true).notNull(),
    setting: d.text(),
    notes: d.text(),
    imageUrl: d.varchar({ length: 255 }),
    createdAt: d.timestamp({ withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [
    index("campaign_gm_id_idx").on(t.gmId),
    index("campaign_name_idx").on(t.name),
  ],
);

export const campaignsRelations = relations(campaigns, ({ one, many }) => ({
  gm: one(users, { fields: [campaigns.gmId], references: [users.id] }),
  characters: many(characters),
}));

export const campaignMembers = createTable(
  "campaign_member",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    campaignId: d.integer().notNull().references(() => campaigns.id),
    userId: d.varchar({ length: 255 }).notNull().references(() => users.id),
    role: d.varchar({ length: 50 }).default("player").notNull(), // player, assistant, spectator
    joinedAt: d.timestamp({ withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  }),
  (t) => [
    index("campaign_member_campaign_id_idx").on(t.campaignId),
    index("campaign_member_user_id_idx").on(t.userId),
  ],
);

export const campaignMembersRelations = relations(campaignMembers, ({ one }) => ({
  campaign: one(campaigns, { fields: [campaignMembers.campaignId], references: [campaigns.id] }),
  user: one(users, { fields: [campaignMembers.userId], references: [users.id] }),
}));