CREATE TABLE quiz (
	id uuid NOT NULL DEFAULT gen_random_uuid() CONSTRAINT firstkey PRIMARY KEY,
	quizData jsonb NOT NULL
);
