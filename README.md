# AI Quizzes

Upload your class notes in PDF or image or text format to get a quiz
generated on the spot for you.

## Architecture
Text is passed directly to Kimi K2 LLM. If a PDF or image is uploaded,
it is processed by OlmOCR to be converted to simple Markdown text. This
is all fed with a system prompt for structured output generation, which
is stored into a serverless Postgres database. Next.JS handles caching
of the generated quiz pages.

The Quiz object is a simple description of a multiple-choice exam. This
object is static once generated, and is used with React/NextJS to
provide simple interactivity and feedback like an actual quiz.

