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

