import { relations, sql } from "drizzle-orm";
import { index } from "drizzle-orm/pg-core";

import { createTable } from "./_base";
import { users } from "./auth";

export const plans = createTable(
  "plan",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    name: d.varchar({ length: 50 }).notNull(),
    description: d.text(),
    priceInCents: d.integer().notNull(), // ← Preço em centavos (ex: 999 = $9.99)
    currency: d.varchar({ length: 3 }).default('USD').notNull(), // ← Adicione moeda
    interval: d.varchar({ length: 20 }).notNull(), // monthly, yearly
    features: d.json().default([]),
    isActive: d.boolean().default(true).notNull(),
    maxCharacters: d.integer().default(5),
    maxCampaigns: d.integer().default(2),
    stripePriceId: d.varchar({ length: 255 }), // ← ID do preço no Stripe
    createdAt: d.timestamp({ withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [
    index("plan_name_idx").on(t.name),
    index("plan_stripe_price_id_idx").on(t.stripePriceId),
  ],
);

export const subscriptions = createTable(
  "subscription",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    userId: d.varchar({ length: 255 }).notNull().references(() => users.id),
    planId: d.integer().notNull().references(() => plans.id),
    status: d.varchar({ length: 20 }).notNull(), // active, canceled, past_due, unpaid
    currentPeriodStart: d.timestamp({ withTimezone: true }).notNull(),
    currentPeriodEnd: d.timestamp({ withTimezone: true }).notNull(),
    cancelAtPeriodEnd: d.boolean().default(false).notNull(),
    canceledAt: d.timestamp({ withTimezone: true }),
    stripeCustomerId: d.varchar({ length: 255 }),
    stripeSubscriptionId: d.varchar({ length: 255 }).unique(),
    createdAt: d.timestamp({ withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [
    index("subscription_user_id_idx").on(t.userId),
    index("subscription_plan_id_idx").on(t.planId),
    index("subscription_stripe_subscription_id_idx").on(t.stripeSubscriptionId),
  ],
);

export const plansRelations = relations(plans, ({ many }) => ({
  subscriptions: many(subscriptions),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(users, { fields: [subscriptions.userId], references: [users.id] }),
  plan: one(plans, { fields: [subscriptions.planId], references: [plans.id] }),
}));