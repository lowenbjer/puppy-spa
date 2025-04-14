CREATE TABLE IF NOT EXISTS "puppies" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"breed" text NOT NULL,
	"owner_name" text NOT NULL,
	"contact_info" text NOT NULL,
	"service_type" text NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL,
	"date_key" text NOT NULL,
	"is_serviced" boolean DEFAULT false NOT NULL,
	"order" integer NOT NULL
);
