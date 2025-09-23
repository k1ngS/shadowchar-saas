ALTER TABLE "shadowchar-saas_ancestries" ALTER COLUMN "ability_modifiers" SET DATA TYPE json;--> statement-breakpoint
ALTER TABLE "shadowchar-saas_ancestries" ALTER COLUMN "ability_modifiers" SET DEFAULT '[]'::json;--> statement-breakpoint
ALTER TABLE "shadowchar-saas_ancestries" ALTER COLUMN "talents_start" SET DATA TYPE json;--> statement-breakpoint
ALTER TABLE "shadowchar-saas_ancestries" ALTER COLUMN "talents_start" SET DEFAULT '[]'::json;--> statement-breakpoint
ALTER TABLE "shadowchar-saas_ancestries" ALTER COLUMN "age_height_weight_table" SET DATA TYPE json;--> statement-breakpoint
ALTER TABLE "shadowchar-saas_ancestries" ALTER COLUMN "age_height_weight_table" SET DEFAULT '[]'::json;--> statement-breakpoint
ALTER TABLE "shadowchar-saas_ancestries" ALTER COLUMN "languages" SET DATA TYPE json;--> statement-breakpoint
ALTER TABLE "shadowchar-saas_ancestries" ALTER COLUMN "languages" SET DEFAULT '[]'::json;--> statement-breakpoint
ALTER TABLE "shadowchar-saas_ancestries" ALTER COLUMN "starting_items" SET DATA TYPE json;--> statement-breakpoint
ALTER TABLE "shadowchar-saas_ancestries" ALTER COLUMN "starting_items" SET DEFAULT '[]'::json;--> statement-breakpoint
ALTER TABLE "shadowchar-saas_items" ALTER COLUMN "properties" SET DEFAULT '[]'::json;--> statement-breakpoint
ALTER TABLE "shadowchar-saas_paths" ALTER COLUMN "description" SET DEFAULT '[]'::json;--> statement-breakpoint
ALTER TABLE "shadowchar-saas_paths" ALTER COLUMN "talents_by_level" SET DEFAULT '[]'::json;