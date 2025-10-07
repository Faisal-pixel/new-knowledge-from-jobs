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
            { error: "Error resolving bank account name", message: (err as Error).message },
            { status: 500 }
        );
    }

```


# LINES I CAN USE
- // return NextResponse.json({message: "Not implemented"}, {status: 501});

# THINGS TO LEARN
- How does refresh token and access token work
- const frames = (await import('@/helpers/graph-helpers/build-frames.helpers')).default(startISO, endISO, bucket); - understand this dynamic import
- Understand the code for dashboard graph route