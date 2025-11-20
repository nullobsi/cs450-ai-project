# Next.JS

/ -> text box with input for notes, click button to generate 'quiz'
 - Calls nextJS 'server action' which calls LLM API and generates a quiz
   object
 - save that quiz object to the database as {UUID}
 - redirect to quiz page /quiz/{UUID}


/quiz/{UUID} -> the interactive quiz page with NextJS. fetches the
    'quiz' from the database based on ID and generates a frontend with a
    template.


# Database
Postgres. Vercel offers a 'free tier'?
https://vercel.com/marketplace/neon
