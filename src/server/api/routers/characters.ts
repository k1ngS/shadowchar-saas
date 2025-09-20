import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { characters } from "~/server/db/schema";
import { eq, and } from "drizzle-orm";

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

export const charactersRouter = createTRPCRouter({
  // Listar personagens do usuário
  getMyCharacters: protectedProcedure.query(({ ctx }) => {
    return ctx.db.select().from(characters).where(eq(characters.userId, ctx.session.user.id));
  }),

  // Buscar personagem por ID (com todas as informações)
  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const [character] = await ctx.db.select().from(characters).where(
        and(
          eq(characters.id, input.id),
          eq(characters.userId, ctx.session.user.id)
        )
      );
      return character;
    }),

  // Criar novo personagem
  create: protectedProcedure
    .input(z.object({
      name: z.string().min(1).max(100),
      ancestry: z.string().min(1).max(50),
      campaignId: z.number().optional(),

      // Paths
      novicePath: z.string().max(50).optional(),
      expertPath: z.string().max(50).optional(),
      masterPath: z.string().max(50).optional(),
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
    }))
    .mutation(async ({ ctx, input }) => {
      const [character] = await ctx.db.insert(characters).values({
        ...input,
        userId: ctx.session.user.id,
      }).returning();
      return character;
    }),

  // Atualizar personagem
  update: protectedProcedure
    .input(z.object({
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
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;
      const [character] = await ctx.db.update(characters)
        .set(updateData)
        .where(
          and(
            eq(characters.id, id),
            eq(characters.userId, ctx.session.user.id)
          )
        ).returning();
      return character;
    }),

  // Deletar personagem
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(characters).where(
        and(
          eq(characters.id, input.id),
          eq(characters.userId, ctx.session.user.id)
        )
      );
    }),
});
