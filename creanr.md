# 1. Setting up server side Auth for Next.js

- You can check here: https://supabase.com/docs/guides/auth/server-side/nextjs

# 2. Best Way to call api end points in nextjs

- In Next.js, particularly with the App Router and Server Components, the recommended approach for data fetching is to directly fetch data from your database or external APIs within the Server Component itself, rather than calling your own Next.js API Routes.

## Why not call apis from server components?

Well this is because if an api route already reaches out to a database or an external api to retrieve data and then return it, calling it in a server component puts extra strain on the server.

You can just go ahead and make calls to db and api routes on the server components since they also live on the server. No need to worry about security.

Doing this eliminates the extra network request to your own API route which increases performance.

Now where can api route come into play, when you want to do things that have to be done on the frontend. Like submitting a form. A form requires events and state changing, this has to be done on the client side, so they need to reach out to api routes then.

# 3. Server Actions vs API Routes: When to Use Each?

- Check explanation here: https://chatgpt.com/g/g-p-68ac2923bcb081918f853596b455f140-creanr/c/68ae62c1-4484-8328-a6e0-ab8d0c5fd79a (search for: Server Actions vs API Routes: When to Use Each)

# 4. Why React calles your route APIs twice

- Check explanation here: https://chatgpt.com/g/g-p-68ac2923bcb081918f853596b455f140/c/68ad395d-9f64-832f-b637-0495db556441 (search for: You’re seeing this weird “it updated used_at on the first try” ) - in creanr project, under the chat "Error Explanations"

# 3. What is the difference between upsert and insert?

- Insert basically adds a new record to the table
- Upsert adds a new record conditionally. If the record with a matching key already exists, upsert updates it.
- To learn more, check: https://chatgpt.com/g/g-p-68ac2923bcb081918f853596b455f140-creanr/c/68ae5628-52b4-832f-892c-f76a8985d04f - (search for: PostgreSQL examples (using your profiles table) - under "database explanations" in creanr chat)

# 5. What is the difference between PUT and PATCH:

- PUT (Complete Replacement):
  Purpose: The PUT method is used to replace the entire resource at a specific URL with the new data provided in the request payload.
  Behavior: If the resource exists, it is completely overwritten with the new data. If the resource does not exist, a new resource might be created (though this behavior can vary depending on API implementation).
  Payload Requirement: A PUT request typically requires sending the full representation of the resource, even if only a few fields are being modified. Any fields not included in the payload will be effectively "nulled out" or removed from the resource on the server.
- PATCH (Partial Modification):
  Purpose: The PATCH method is used to apply partial modifications to an existing resource.
  Behavior: It modifies only the specific fields or properties of a resource that are included in the request payload, leaving other fields untouched.
  Payload Requirement: A PATCH request only requires sending the specific fields that need to be updated. This makes it more efficient for partial updates, as it reduces bandwidth usage.

# 6. To remember Argon2:

- Check explanation here: https://chatgpt.com/g/g-p-68ac2923bcb081918f853596b455f140-creanr/c/68ac2a31-60ec-8322-96fa-9b3e700c7fff (search for: "What is Argon2 (and which type to use)?” ) - in creanr project, under the chat "Explain TS/JS concepts..."

# 7. Understand Time in Javascriptin/Tyescrupt

- Check explanation here: https://chatgpt.com/g/g-p-68ac2923bcb081918f853596b455f140-creanr/c/68ac2a31-60ec-8322-96fa-9b3e700c7fff (search for: "What is Date in JavaScript/TypeScript?” ) - in creanr project, under the chat "Explain TS/JS concepts..."

# 8. To Understand how withdrawal pin table was created

- Check explanation here: https://chatgpt.com/g/g-p-68ac2923bcb081918f853596b455f140/c/68ae5628-52b4-832f-892c-f76a8985d04f (search for: "What each table is for” or "" ) - in creanr project, under the chat "Database Explanations..."

# 9. How to type the error in the catch block

- ```ts
  try {
  } catch (err) {
    console.log("Error resolving bank account name", err);
    return NextResponse.json(
      {
        error: "Error resolving bank account name",
        message: (err as Error).message,
      },
      { status: 500 }
    );
  }
  ```

# 10. STEPS TO SET UP AN EXPRESS SERVER

1. Crete an index.js file (this is going to be the entry point of your application)
2. Then run `npm init -y` to create a package.json file
3. Then run `npm install express` to install express.
4. Then set the type to "module" in package.json file
5. Then in the index.js file, write the following code:

```js
import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

<b>To create an express server in typescript, check this chatgpt prompt here: https://chatgpt.com/g/g-p-68eea67c116c8191a9e11a0fdfb76aaa-set-ups/c/68eea6e0-1494-8327-b7f9-bf0f38cbd901</b>

# 11. What is the supabase service role key and the supabase publishable key

    Supabase utilizes different API keys for various access levels and security considerations. While "service role key" and "publishable key" are the current recommended terms, you might also encounter "anon key" and "secret key" as older, but still functional, equivalents.
    1. Supabase Publishable Key (formerly Anon Key):
        This key is designed for client-side applications (e.g., web browsers, mobile apps).
        It provides public access to your Supabase project's API.
        It respects Row Level Security (RLS) policies, meaning that a user's access to data is restricted based on the policies you define in your database.
        It is safe to embed in your client-side code because it relies on RLS for data protection.
    2. Supabase Service Role Key (formerly Secret Key):
        This key is intended for server-side applications and backend operations (e.g., API routes, serverless functions, background jobs).
        It provides elevated privileges and bypasses Row Level Security (RLS).
        This means it can access and modify all data in your database, regardless of RLS policies.
        It is crucial to keep this key secret and never expose it in client-side code or public repositories. Treat it as a sensitive environment variable.
    In summary:
    Use the Publishable Key (or Anon Key) for operations in your client-side applications where RLS protects your data.
    Use the Service Role Key (or Secret Key) for server-side operations requiring full access to your database, and ensure it remains strictly confidential.

# 12. In Express, what’s the NextResponse.json(...) equivalent?

- Check explanation here: https://chatgpt.com/g/g-p-68ac2923bcb081918f853596b455f140/c/68ac2a31-60ec-8322-96fa-9b3e700c7fff (search for: "In Express, what’s the NextResponse.json(...) equivalent?" ) - in creanr project, under the chat "Explain TS/JS concepts..."

# 13. When to use try/catch vs simple if (error) checks

- Check explanation here: https://chatgpt.com/g/g-p-68ac2923bcb081918f853596b455f140/c/68ac2a31-60ec-8322-96fa-9b3e700c7fff (search for: "When to use try/catch vs simple if (error) checks" and "How to use try/catch without getting lost (and fix the session scope bug)" ) - in creanr project, under the chat "Explain TS/JS concepts..."

# 14. Why people use !!value (double-bang) in JS/TS

- Check explanation here: https://chatgpt.com/g/g-p-68ac2923bcb081918f853596b455f140/c/68ac2a31-60ec-8322-96fa-9b3e700c7fff (search for: "Why people use !!value (double-bang) in JS/TS" ) - in creanr project, under the chat "Explain TS/JS concepts..."

# 15. Difference between Services and Controllers in an express web folder structure.

- Check explanation here: https://chatgpt.com/g/g-p-68ac2923bcb081918f853596b455f140/c/68ed969a-7a54-8325-bf62-0a290461a71b (search for: "what is “polling”? (the guard walking back and forth)" ) - in creanr project, under the chat "Building Telegram Bot in js..."

# 16. Understanding polling and graceful stop in express server

- Check explanation here: https://chatgpt.com/g/g-p-68eea67c116c8191a9e11a0fdfb76aaa-set-ups/c/68eea6e0-1494-8327-b7f9-bf0f38cbd901 (search for: "Implement a polling mechanism that checks for new tasks every X seconds" ) - in set ups project.

# 17. How to alter a table to add a unique constraint for two columns

    To make two columns unique for every row in a Supabase table, you need to add a unique constraint that spans both columns. This is often referred to as a composite unique constraint.
    Here's how to do it using SQL in the Supabase SQL Editor:
    Execute the ALTER TABLE statement: Use the following SQL command, replacing your_table_name, column_name_1, and column_name_2 with your actual table and column names:
```sql
    ALTER TABLE your_table_name
    ADD CONSTRAINT unique_columns_constraint UNIQUE (column_name_1, column_name_2);
```
- your_table_name: The name of the table you want to modify.
- unique_columns_constraint: A descriptive name for your unique constraint.
- column_name_1, column_name_2: The names of the two columns that, when combined, must be unique for each row.

# LINES I CAN USE

- // return NextResponse.json({message: "Not implemented"}, {status: 501});
- const { launchBotDev } = await import("./bot/bot.js");

# THINGS TO LEARN

- How does refresh token and access token work
- const frames = (await import('@/helpers/graph-helpers/build-frames.helpers')).default(startISO, endISO, bucket); - understand this dynamic import
- Understand the code for dashboard graph route
