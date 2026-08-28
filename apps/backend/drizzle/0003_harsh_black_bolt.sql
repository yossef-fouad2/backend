ALTER TABLE "courses" ALTER COLUMN "price" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "category" text DEFAULT 'general' NOT NULL;