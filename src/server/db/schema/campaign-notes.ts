import { relations, sql } from "drizzle-orm";
import { index } from "drizzle-orm/pg-core";

import { createTable } from "./_base";
import { campaigns } from "./campaigns";
import { users } from "./auth";

export const campaignNotes = createTable(
  "campaign_note",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    campaignId: d.integer().notNull().references(() => campaigns.id),
    authorId: d.varchar({ length: 255 }).notNull().references(() => users.id),
    title: d.varchar({ length: 100 }).notNull(),
    content: d.text().notNull(),
    isPrivate: d.boolean().default(false).notNull(), // visível apenas para o autor se true
    category: d.varchar({ length: 50 }).default("general"),
    createdAt: d.timestamp({ withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [
    index("campaign_note_campaign_id_idx").on(t.campaignId),
    index("campaign_note_author_id_idx").on(t.authorId),
  ],
);

export const campaignNotesRelations = relations(campaignNotes, ({ one }) => ({
  campaign: one(campaigns, { fields: [campaignNotes.campaignId], references: [campaigns.id] }),
  author: one(users, { fields: [campaignNotes.authorId], references: [users.id] }),
}));