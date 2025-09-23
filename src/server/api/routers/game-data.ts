import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { ancestries, paths, spells, items } from "~/server/db/schema";
import { eq, like, and } from "drizzle-orm";

export const gameDataRouter = createTRPCRouter({
  // ANCESTRALIDADES
  getAllAncestries: publicProcedure.query(({ ctx }) => {
    return ctx.db.select().from(ancestries);
  }),

  getAncestryBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db
        .select()
        .from(ancestries)
        .where(eq(ancestries.slug, input.slug));
    }),

  // CAMINHOS
  getAllPaths: publicProcedure.query(({ ctx }) => {
    return ctx.db.select().from(paths);
  }),

  getPathsByTier: publicProcedure
    .input(z.object({ tier: z.enum(["novice", "expert", "master"]) }))
    .query(({ ctx, input }) => {
      return ctx.db.select().from(paths).where(eq(paths.tier, input.tier));
    }),

  getPathBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.select().from(paths).where(eq(paths.slug, input.slug));
    }),

  // MAGIAS
  getAllSpells: publicProcedure.query(({ ctx }) => {
    return ctx.db.select().from(spells);
  }),

  getSpellsByTradition: publicProcedure
    .input(z.object({ tradition: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db
        .select()
        .from(spells)
        .where(eq(spells.tradition, input.tradition));
    }),

  getSpellsByRank: publicProcedure
    .input(z.object({ rank: z.number().min(0).max(10) }))
    .query(({ ctx, input }) => {
      return ctx.db.select().from(spells).where(eq(spells.rank, input.rank));
    }),

  searchSpells: publicProcedure
    .input(
      z.object({
        search: z.string().optional(),
        tradition: z.string().optional(),
        rank: z.number().optional(),
      }),
    )
    .query(({ ctx, input }) => {
      const conditions = [];

      if (input.search) {
        conditions.push(like(spells.name, `%${input.search}%`));
      }
      if (input.tradition) {
        conditions.push(eq(spells.tradition, input.tradition));
      }
      if (input.rank !== undefined) {
        conditions.push(eq(spells.rank, input.rank));
      }

      const whereCondition =
        conditions.length > 0 ? and(...conditions) : undefined;

      return ctx.db.select().from(spells).where(whereCondition);
    }),

  // ITENS/EQUIPAMENTOS
  getAllItems: publicProcedure.query(({ ctx }) => {
    return ctx.db.select().from(items);
  }),

  getItemsByType: publicProcedure
    .input(z.object({ type: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.select().from(items).where(eq(items.type, input.type));
    }),

  searchItems: publicProcedure
    .input(
      z.object({
        search: z.string().optional(),
        type: z.string().optional(),
      }),
    )
    .query(({ ctx, input }) => {
      const conditions = [];

      if (input.search) {
        conditions.push(like(items.name, `%${input.search}%`));
      }
      if (input.type) {
        conditions.push(eq(items.type, input.type));
      }

      const whereCondition =
        conditions.length > 0 ? and(...conditions) : undefined;

      return ctx.db.select().from(items).where(whereCondition);
    }),

  // TRADIÇÕES MÁGICAS (lista única)
  getUniqueTraditions: publicProcedure.query(async ({ ctx }) => {
    const result = await ctx.db
      .selectDistinct({ tradition: spells.tradition })
      .from(spells)
      .where(eq(spells.tradition, spells.tradition)); // Remove nulls

    return result.map((r) => r.tradition).filter(Boolean);
  }),

  // TIPOS DE ITENS (lista única)
  getUniqueItemTypes: publicProcedure.query(async ({ ctx }) => {
    const result = await ctx.db
      .selectDistinct({ type: items.type })
      .from(items)
      .where(eq(items.type, items.type)); // Remove nulls

    return result.map((r) => r.type).filter(Boolean);
  }),
});
