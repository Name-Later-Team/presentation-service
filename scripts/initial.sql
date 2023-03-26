CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- DROP TABLE IF EXISTS public.presentations;
CREATE TABLE IF NOT EXISTS public.presentations (
	"id" SERIAL,
	"name" CHARACTER VARYING(100) NOT NULL,
	identifier UUID DEFAULT uuid_generate_v4(),
	owner_identifier CHARACTER VARYING(120) NOT NULL,
	owner_display_name CHARACTER VARYING(120),
	pace JSON NOT NULL, -- includes: mode, active_slide_id, state, counter
	closed_for_voting BOOLEAN DEFAULT FALSE,
	total_slides SMALLINT DEFAULT 0 CHECK (total_slides > -1),
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),

	CONSTRAINT presentations_pkey PRIMARY KEY ("id")
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

-- DROP INDEX IF EXISTS presentations_identifier_index;
CREATE INDEX IF NOT EXISTS presentations_identifier_index
ON public.presentations
USING btree (identifier) TABLESPACE pg_default;

-- DROP TABLE IF EXISTS public.presentation_voting_codes;
CREATE TABLE IF NOT EXISTS public.presentation_voting_codes (
	"id" SERIAL,
	presentation_identifier UUID NOT NULL,
	code CHARACTER VARYING(10) NOT NULL,
	is_valid BOOLEAN DEFAULT TRUE,
	expires_at TIMESTAMP WITH TIME ZONE DEFAULT now(),

	CONSTRAINT presentation_voting_codes_pkey PRIMARY KEY ("id")
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

-- DROP TABLE IF EXISTS public.presentation_slides;
CREATE TABLE IF NOT EXISTS public.presentation_slides (
	"id" SERIAL,
	presentation_id INTEGER NOT NULL CHECK (presentation_id > 0),
	presentation_identifier UUID NOT NULL,
	question CHARACTER VARYING(150),
	question_description CHARACTER VARYING(250), -- default max lenght: 250
	question_image_url TEXT,
	question_video_embed_url TEXT,
	slide_type CHARACTER VARYING(40) NOT NULL,
	speaker_notes TEXT,
	is_active BOOLEAN DEFAULT TRUE, -- enable voting in this slide
	show_result BOOLEAN DEFAULT TRUE,
	hide_instruction_bar BOOLEAN DEFAULT FALSE,
	extras_config TEXT,
	"position" SMALLINT NOT NULL,
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
	updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),

	CONSTRAINT presentation_slides_pkey PRIMARY KEY ("id")
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

-- DROP TABLE IF EXISTS public.slide_choices;
CREATE TABLE IF NOT EXISTS public.slide_choices (
	"id" SERIAL,
	"label" CHARACTER VARYING(150), -- default max lenght: 150
	"position" SMALLINT NOT NULL CHECK ("position" > -1),
	slide_id INTEGER NOT NULL CHECK (slide_id > 0),
	"type" CHARACTER VARYING(40) NOT NULL, -- reaction, bullet, option
	is_correct_answer BOOLEAN DEFAULT FALSE,
	metadata TEXT,

	CONSTRAINT slide_choices_pkey PRIMARY KEY ("id")
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

-- DROP TABLE IF EXISTS public.slide_voting_results;
CREATE TABLE IF NOT EXISTS public.slide_voting_results (
	"id" SERIAL,
	slide_id INTEGER NOT NULL CHECK (slide_id > 0),
	user_identifier text,
	user_display_name CHARACTER VARYING (120),
	choice_id INTEGER NOT NULL CHECK (choice_id > 0),
	voted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
	present_no INTEGER NOT NULL CHECK (present_no > 0),

	CONSTRAINT slide_voting_results_pkey PRIMARY KEY ("id")
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;
