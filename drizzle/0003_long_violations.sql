ALTER TABLE "shadowchar-saas_ancestries" ADD COLUMN "slug" varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE "shadowchar-saas_items" ADD COLUMN "slug" varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE "shadowchar-saas_paths" ADD COLUMN "slug" varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE "shadowchar-saas_spells" ADD COLUMN "slug" varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE "shadowchar-saas_ancestries" ADD CONSTRAINT "shadowchar-saas_ancestries_slug_unique" UNIQUE("slug");--> statement-breakpoint
ALTER TABLE "shadowchar-saas_items" ADD CONSTRAINT "shadowchar-saas_items_slug_unique" UNIQUE("slug");--> statement-breakpoint
ALTER TABLE "shadowchar-saas_paths" ADD CONSTRAINT "shadowchar-saas_paths_slug_unique" UNIQUE("slug");--> statement-breakpoint
ALTER TABLE "shadowchar-saas_spells" ADD CONSTRAINT "shadowchar-saas_spells_slug_unique" UNIQUE("slug");