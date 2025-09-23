import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { characters } from "~/server/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { db } from "../../db/index";
import { paths as gamePaths } from "~/server/db/schema";
import { TRPCError } from "@trpc/server";

// Schema de validação para talents, spells, equipment
const talentSchema = z.object({
  name: z.string(),
  description: z.string(),
  type: z.string().optional(),
});

const spellSchema = z.object({
  name: z.string(),
  tradition: z.string(),
  rank: z.number(),
  description: z.string(),
  castingTime: z.string().optional(),
  range: z.string().optional(),
});

const equipmentSchema = z.object({
  name: z.string(),
  type: z.string(),
  description: z.string().optional(),
  quantity: z.number().default(1),
});

const PATH_UNLOCK = { novice: 1, expert: 3, master: 7 } as const;
type Tier = keyof typeof PATH_UNLOCK;

async function validatePathSlug(ctx: any, slug: string, expectedTier: Tier) {
  const rows = await ctx.db
    .select({ id: gamePaths.id, tier: gamePaths.tier, slug: gamePaths.slug })
    .from(gamePaths)
    .where(
      sql`lower(${gamePaths.tier}) = ${expectedTier} AND ${gamePaths.slug} = ${slug}`,
    )
    .limit(1);
  if (!rows[0]) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Invalid path slug for tier ${expectedTier}: ${slug}`,
    });
  }
}

export const charactersRouter = createTRPCRouter({
  // Listar personagens do usuário
  getMyCharacters: protectedProcedure.query(({ ctx }) => {
    return ctx.db
      .select()
      .from(characters)
      .where(eq(characters.userId, ctx.session.user.id));
  }),

  // Buscar personagem por ID (com todas as informações)
  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const [character] = await ctx.db
        .select()
        .from(characters)
        .where(
          and(
            eq(characters.id, input.id),
            eq(characters.userId, ctx.session.user.id),
          ),
        );
      return character;
    }),

  // Criar novo personagem
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(100),
        ancestry: z.string().min(1).max(50),
        campaignId: z.number().optional(),

        // Paths
        novicePath: z.string().max(100).optional(),
        expertPath: z.string().max(100).optional(),
        masterPath: z.string().max(100).optional(),
        level: z.number().min(0).default(0),

        // Atributos
        strength: z.number().min(1).max(20).default(10),
        agility: z.number().min(1).max(20).default(10),
        intellect: z.number().min(1).max(20).default(10),
        will: z.number().min(1).max(20).default(10),

        // Status
        health: z.number().min(0).default(0),
        insanity: z.number().min(0).default(0),
        corruption: z.number().min(0).default(0),

        // Textos
        background: z.string().optional(),
        notes: z.string().optional(),

        // Arrays JSON
        talents: z.array(talentSchema).default([]),
        spells: z.array(spellSchema).default([]),
        equipment: z.array(equipmentSchema).default([]),

        isPublic: z.boolean().default(false),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Validações de Paths
      if (input.novicePath) {
        if (input.level < PATH_UNLOCK.novice)
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Level too low for novice path",
          });
        await validatePathSlug(ctx, input.novicePath, "novice");
      }
      if (input.expertPath) {
        if (input.level < PATH_UNLOCK.expert)
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Level too low for expert path",
          });
        await validatePathSlug(ctx, input.expertPath, "expert");
      }
      if (input.masterPath) {
        if (input.level < PATH_UNLOCK.master)
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Level too low for master path",
          });
        await validatePathSlug(ctx, input.masterPath, "master");
      }

      const [character] = await ctx.db
        .insert(characters)
        .values({
          ...input,
          userId: ctx.session.user.id,
        })
        .returning();
      return character;
    }),

  // Atualizar personagem
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1).max(100).optional(),
        ancestry: z.string().max(50).optional(),

        // Paths
        novicePath: z.string().max(50).optional(),
        expertPath: z.string().max(50).optional(),
        masterPath: z.string().max(50).optional(),
        level: z.number().min(0).optional(),

        // Atributos
        strength: z.number().min(1).max(20).optional(),
        agility: z.number().min(1).max(20).optional(),
        intellect: z.number().min(1).max(20).optional(),
        will: z.number().min(1).max(20).optional(),

        // Status
        health: z.number().min(0).optional(),
        insanity: z.number().min(0).optional(),
        corruption: z.number().min(0).optional(),

        // Textos
        background: z.string().optional(),
        notes: z.string().optional(),

        // Arrays JSON
        talents: z.array(talentSchema).optional(),
        spells: z.array(spellSchema).optional(),
        equipment: z.array(equipmentSchema).optional(),

        isPublic: z.boolean().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Carregar personagem atual para validações
      const [current] = await ctx.db
        .select()
        .from(characters)
        .where(
          and(
            eq(characters.id, input.id),
            eq(characters.userId, ctx.session.user.id),
          ),
        );
      if (!current)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Character not found",
        });

      const nextLevel = input.level ?? current.level;

      // Validações de Paths
      if (
        input.novicePath !== undefined &&
        input.novicePath !== null &&
        input.novicePath !== ""
      ) {
        if (nextLevel < PATH_UNLOCK.novice)
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Level too low for novice path",
          });
        await validatePathSlug(ctx, input.novicePath, "novice");
      }
      if (
        input.expertPath !== undefined &&
        input.expertPath !== null &&
        input.expertPath !== ""
      ) {
        if (nextLevel < PATH_UNLOCK.expert)
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Level too low for expert path",
          });
        await validatePathSlug(ctx, input.expertPath, "expert");
      }
      if (
        input.masterPath !== undefined &&
        input.masterPath !== null &&
        input.masterPath !== ""
      ) {
        if (nextLevel < PATH_UNLOCK.master)
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Level too low for master path",
          });
        await validatePathSlug(ctx, input.masterPath, "master");
      }

      const { id, ...updateData } = input;
      const [character] = await ctx.db
        .update(characters)
        .set(updateData)
        .where(
          and(
            eq(characters.id, id),
            eq(characters.userId, ctx.session.user.id),
          ),
        )
        .returning();
      return character;
    }),

  // Deletar personagem
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(characters)
        .where(
          and(
            eq(characters.id, input.id),
            eq(characters.userId, ctx.session.user.id),
          ),
        );
    }),
});
