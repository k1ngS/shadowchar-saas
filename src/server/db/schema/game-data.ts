import { text, integer, jsonb, varchar, index } from "drizzle-orm/pg-core";
import { createTable } from "./_base";
import { characters } from "./characters";
import { sql } from "drizzle-orm";

export const ancestries = createTable(
  "ancestries",
  (d) => ({
    id: d.integer().primaryKey().generatedByDefaultAsIdentity(),
    slug: d.varchar({ length: 100 }).unique().notNull(),
    name: d.varchar({ length: 100 }).notNull(),
    pt_br: d.varchar({ length: 100 }),
    short_description: d.varchar({ length: 100 }),
    ability_modifiers: d.json().default([]),
    talents_start: d.json().default([]),
    age_height_weight_table: d.json().default([]),
    languages: d.json().default([]),
    starting_items: d.json().default([]),
    source: d.varchar({ length: 100 }),
    source_page: d.varchar({ length: 100 }),

    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [index("ancestry_name_idx").on(t.name)],
);

export const paths = createTable(
  "paths",
  (d) => ({
    id: d.integer("id").primaryKey().generatedByDefaultAsIdentity(),
    slug: d.varchar({ length: 100 }).unique().notNull(),
    name: d.varchar({ length: 100 }).notNull(),
    pt_br: d.varchar({ length: 100 }),
    tier: d.varchar({ length: 20 }).notNull(), // novice, expert, master
    description: d.json().default([]),
    prerequisites: d.varchar({ length: 255 }),
    talents_by_level: d.json().default([]),
    source: d.varchar({ length: 255 }),
    source_page: d.varchar({ length: 255 }),

    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [index("path_name_idx").on(t.name)],
);

export const spells = createTable(
  "spells",
  (d) => ({
    id: d.integer("id").primaryKey().generatedByDefaultAsIdentity(),
    slug: d.varchar({ length: 100 }).unique().notNull(),
    name: d.varchar({ length: 100 }).notNull(),
    tradition: d.varchar({ length: 100 }),
    rank: d.integer().default(0).notNull(),
    type: d.varchar({ length: 100 }),
    source: d.varchar({ length: 100 }),
    source_page: d.varchar({ length: 100 }),

    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [index("spell_name_idx").on(t.name)],
);

export const items = createTable(
  "items",
  (d) => ({
    id: d.integer("id").primaryKey().generatedByDefaultAsIdentity(),
    slug: d.varchar({ length: 100 }).unique().notNull(),
    name: d.varchar({ length: 100 }).notNull(),
    type: d.varchar({ length: 100 }),
    price: d.varchar({ length: 100 }),
    weight: d.varchar({ length: 100 }),
    properties: d.json().default([]),
    damage: d.varchar({ length: 100 }),
    armor_defense: d.varchar({ length: 100 }),
    notes: d.varchar({ length: 100 }),
    source: d.varchar({ length: 100 }),
    source_page: d.varchar({ length: 100 }),

    createdAt: d
      .timestamp({ withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [index("item_name_idx").on(t.name)],
);
