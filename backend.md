# Backend Knowledge & Learning Notes

This file documents new knowledge and insights about backend development, servers, and related topics learned while working on jobs.

## Contents

This includes:
- Backend concepts, patterns, and best practices discovered through research
- Server architecture and deployment learnings
- Google searches and reference materials worth keeping
- ChatGPT conversations and explanations that clarified backend concepts
- Code snippets, configuration details, and solutions to backend challenges
- API design patterns and database optimizations
- Performance tuning, security considerations, and system design notes

---

## Index

1. [Why Backend Code Lives on a Server & Server Security](#why-backend-code-lives-on-a-server--server-security)
2. [REST API Methods & Idempotency Explained](#rest-api-methods--idempotency-explained)

---

## Why Backend Code Lives on a Server & Server Security

### Topics
1. [Fundamental Concept](#1-fundamental-concept)
2. [The Environment is Hidden and Controlled](#2-the-environment-is-hidden-and-controlled)
3. [Trustworthy Input Validation](#3-trustworthy-input-validation)
4. [Secure Storage of Sensitive Data](#4-secure-storage-of-sensitive-data)
5. [Protection Against Manipulation](#5-protection-against-manipulation)
6. [Summary Table of Security Roles](#6-summary-table-of-security-roles)
7. [Important Nuance](#7-important-nuance)

---

### 1. Fundamental Concept

**Yes, in practical web development, all backend code lives on a server**—whether that is a physical machine, a virtual private server (VPS), or a serverless function hosted in the cloud.

**Why?** Backend logic must live on a server because it requires a secure, controlled environment to process data, connect to databases, and handle authentication, which cannot happen securely in a user's browser.

---

### 2. The Environment is Hidden and Controlled

**Server-Side:** 
- Your backend code is executed on a remote computer
- Users only see the result of the code (e.g., HTML, JSON)
- Users never see the source code, logic, or database credentials

**Client-Side:** 
- Everything that runs in the browser (JavaScript, HTML, CSS) is fully accessible to the user
- An attacker can use browser developer tools to inspect, reverse-engineer, and modify the code

---

### 3. Trustworthy Input Validation

**Server-Side:** 
- The backend acts as the "source of truth"
- Assumes all input from the client is potentially malicious or faulty
- Validates data (e.g., checking if a user is authorized to perform an action) **before** processing it

**Client-Side:** 
- Validation in the browser is only for user experience (e.g., showing a red border for an invalid email)
- It can be easily bypassed by attackers

---

### 4. Secure Storage of Sensitive Data

**Server-Side:** 
- Databases, API keys, and secret credentials are stored on the server
- The client never sees them

**Client-Side:** 
- You cannot safely store API keys or database passwords in the browser
- If you put them in your JavaScript, anyone can find them

---

### 5. Protection Against Manipulation

**Server-Side:** 
- Prevents attackers from changing hidden business rules
- A user cannot directly alter their account balance or permissions if that logic resides on the server

**Client-Side:** 
- Allows users to modify variables in memory or change JavaScript logic
- Could lead to attacks like "pass the hash" authentication attacks

---

### 6. Summary Table of Security Roles

| Feature | Client-Side (Frontend) | Server-Side (Backend) |
|---------|------------------------|----------------------|
| Code Visibility | Fully public | Hidden/Private |
| Logic Integrity | Can be tampered with | Secure/Unchangeable by user |
| Data Privacy | Cannot store secrets | Secure storage for keys/DB |
| Input Trust | Assumed malicious | Verified before processing |

---

### 7. Important Nuance

**A server is not automatically secure.** It is merely a *more secure* environment. If not configured properly, backend servers are vulnerable to:
- SQL injections
- Unauthorized access
- Misconfigurations

---

## REST API Methods & Idempotency Explained

### Topics
1. [What is Idempotency?](#1-what-is-idempotency)
2. [The Three HTTP Methods: POST, PUT, PATCH](#2-the-three-http-methods-post-put-patch)
3. [Key Differences Table](#3-key-differences-table)
4. [PUT vs PATCH - Detailed Comparison](#4-put-vs-patch--detailed-comparison)
5. [Why is PUT Idempotent?](#5-why-is-put-idempotent)
6. [HTTP Method Idempotency Summary](#6-http-method-idempotency-summary)
7. [Fixing Non-Idempotent Operations](#7-fixing-non-idempotent-operations)

---

### 1. What is Idempotency?

**Idempotency means "Safe to Retry."** It's a design rule for APIs that ensures making the same request multiple times has the **exact same effect** as making it once.

#### The Elevator Button Analogy
Imagine you are waiting for an elevator:
- You press the button **once** → The elevator is called
- You get impatient and press the button **10 more times** → The elevator still comes **once**

No matter how many times you press the button, the result is always the same: **one elevator arrives**.

#### Why Does This Matter?
Computers, internet connections, and servers are not perfect. Sometimes a request takes too long, and you might think it failed.

**Without Idempotency:** If you click "Pay Now" twice because the first time seemed to freeze, you might be charged twice.

**With Idempotency:** The server recognizes the second click is a "retry" and ignores it, so you are only charged once.

---

### 2. The Three HTTP Methods: POST, PUT, PATCH

#### POST (Create New)
Think of this like **"posting"** a letter or a new drawing on a fridge:
- You give the server something **new**
- The server finds a spot for it
- Every time you hit "POST," the server makes a **brand-new copy**
- **Example:** "Create a new profile for me"

#### PUT (Replace Entirely)
Think of this like **"putting"** a whole new toy in a box that already has one:
- You take the **old one out** and put a **complete new one in**
- You must send the **entire thing**, even the parts that didn't change
- **Example:** "Replace my whole profile with this new info"

#### PATCH (Fix a Part)
Think of this like putting a **"patch"** on a flat tire or a band-aid on a scrape:
- You don't replace the whole bike or the whole person
- You just fix the **one tiny part** that is broken
- **Example:** "Just change my profile picture"

---

### 3. Key Differences Table

| Feature | PUT | PATCH |
|---------|-----|-------|
| **Modification Scope** | Replaces the entire resource | Updates specific fields only |
| **Request Payload** | Must include all fields, even unchanged ones | Includes only the fields needing changes |
| **Idempotency** | Always idempotent | Not inherently idempotent |
| **Resource Creation** | Can create a new resource if the URI is not found | Generally fails (404) if the resource doesn't exist |
| **Bandwidth Usage** | Higher, sends full resource representation | Lower, only transmits the "delta" or changes |

---

### 4. PUT vs PATCH – Detailed Comparison

#### Practical Example
Imagine a user resource with three fields: `name`, `email`, and `age`.

**Goal:** Update only the email address to `new@example.com`

#### Using PUT:
You must send the **entire object**:
```json
{
  "name": "John",
  "email": "new@example.com",
  "age": 30
}
```
⚠️ If you omit `name`, it might be set to `null` on the server.

#### Using PATCH:
You only send the **specific field**:
```json
{
  "email": "new@example.com"
}
```
✅ The server leaves `name` and `age` untouched.

#### When to Use Which?
- **Use PUT** when you have a complete data set and want to ensure the resource state matches your request exactly
- **Use PATCH** for minor incremental updates or when bandwidth is limited (like in mobile applications)

---

### 5. Why is PUT Idempotent?

The **PUT HTTP method is inherently idempotent** because it replaces or fully updates a specific resource.

When you use PUT, you tell the server: **"Make the object at this URL look exactly like this data I'm sending."**

#### The Scenario
You want to update your profile. You send a PUT request to `/api/users/1` with this data:
```json
{
  "name": "Alice",
  "status": "Active"
}
```

- **First PUT Request:** Server updates User 1 to `{"name": "Alice", "status": "Active"}`
- **Second PUT Request (Duplicate):** Server sets User 1 to `{"name": "Alice", "status": "Active"}`
- **Third PUT Request (Duplicate):** Server sets User 1 to `{"name": "Alice", "status": "Active"}`

#### The End State
No matter how many times you send that same data, User 1 remains `{"name": "Alice", "status": "Active"}`. The data is overwritten, but it **never changes beyond that initial update**.

**Key Takeaway:** Overwriting data 10 times is the same as overwriting it 1 time.

---

### 6. HTTP Method Idempotency Summary

| Method | Job | Idempotent? | Why? |
|--------|-----|-------------|------|
| **GET** | Read | ✅ Yes | Reading something doesn't change it, no matter how many times you read it |
| **PUT** | Replace entire resource | ✅ Yes | Overwriting "Name: John" with "Name: John" 10 times still results in "John" |
| **DELETE** | Remove | ✅ Yes | Deleting an order once removes it. The second time, it's still gone |
| **HEAD** | Read (headers only) | ✅ Yes | Same as GET, just without the response body |
| **POST** | Create new | ❌ No | Creating a new order 5 times usually creates 5 separate orders |
| **PATCH** | Partial update | ❌ No* | Can give "relative" instructions; if you say "Add 1 to the score," 10 times = +10 |

**Note:** Some PATCH implementations can be designed to be idempotent (like "Set color to red"), but the rules don't force them to be.

---

### 7. Fixing Non-Idempotent Operations

To make "non-safe" actions (like POST) safe, developers use an **idempotency key**:

**Idempotency Key:** A unique ID (like a tracking number) that the developer sends with each request.

**How it works:**
- If the server sees that unique key **for the first time**, it processes the request
- If the server sees that unique key **again**, it says: *"I already did this, I won't do it again!"* and returns the same result

**Example:**
```json
{
  "idempotency_key": "unique-transaction-id-12345",
  "amount": 100,
  "currency": "USD"
}
```

Even if this request is sent 10 times, the server processes it only once because of the unique `idempotency_key`.

