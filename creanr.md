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