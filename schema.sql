CREATE TABLE note (
	note_id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
	note_text text NOT NULL
);

CREATE TABLE quiz (
	quiz_id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
	quiz_data jsonb NOT NULL,
	note_id uuid NOT NULL REFERENCES note
);

