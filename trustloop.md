# Trustloop Commands & Learning Notes

This file documents things I have learnt while working at Trustloop.

## Contents

1. # NestJS — Classes, Constructors, Providers, and Injection

---

# NestJS — Classes, Constructors, Providers, and Injection

A complete walkthrough of how NestJS wires things together, written for someone who already knows JavaScript classes but is new to NestJS.

---

## 1. Classes and objects — what you already know

Everything in NestJS is built on classes. The basics first, just to confirm what you already know is right:

- A class is a blueprint.
- You initialise a class into an object (an instance).
- A constructor is a special function that runs automatically when a class is initialised.
- Whatever you pass into the constructor can become a property of the object — but only if you assign it to `this` inside the constructor body.

Standard JavaScript would look like:

```javascript
class Car {
  constructor(engine) {
    this.engine = engine;
  }
}

const myCar = new Car('V8');
console.log(myCar.engine); // 'V8'
```

Two steps happen here:
1. The `engine` parameter is received.
2. The parameter gets assigned to `this.engine` so the object actually has that property.

---

## 2. Can a class be used as a type in TypeScript?

Yes. This is the first thing that trips people up.

In TypeScript, a class is **two things at the same time**:

1. A blueprint for creating objects (what you already know).
2. A type that describes the shape of an object made from that class.

So when you write:

```typescript
constructor(private readonly sessionsService: SessionsService) {}
```

`SessionsService` here is being used as a **type**. TypeScript is saying: *"whatever value comes into this parameter must be an object that was made from the SessionsService class, because that is the only thing that will have all the right methods on it."*

It is exactly like writing `name: string`. `string` is a type. `SessionsService` is also a type — just a more complex one that you defined yourself by writing that class.

---

## 3. The constructor shorthand trick (`private readonly`)

This is purely a TypeScript convenience feature.

Normally — without the shorthand — you would write two steps like this:

```typescript
class SessionsController {
  private sessionsService: SessionsService; // step 1: declare the property

  constructor(service: SessionsService) {
    this.sessionsService = service; // step 2: assign it
  }
}
```

TypeScript has a shortcut. If you put `private`, `public`, or `readonly` **directly inside the constructor parameter**, TypeScript automatically does both steps in one line:

```typescript
constructor(private readonly sessionsService: SessionsService) {}
```

This is identical to the longer version above. TypeScript silently declares the property AND assigns the parameter to `this` for you.

### Important rule about this shorthand

This `private readonly` shortcut **only works inside a constructor**. You cannot do this in a regular method. Only the constructor gets this special power.

So writing this in any other method would be invalid:

```typescript
// NOT ALLOWED — this is only a constructor trick
doSomething(private readonly x: string) {}
```

---

## 4. Why is NestJS hard to understand in the first place?

Because NestJS solves a problem you have not personally felt yet.

If you have never built a large backend before, the solutions NestJS provides look like unnecessary complications. But once the problem is shown clearly, the solutions start to make sense.

---

## 5. The problem NestJS is solving — the warehouse story

Imagine you are building a house. You need:

- A carpenter
- A plumber
- An electrician

Each one needs tools. The carpenter needs a hammer. The plumber needs a wrench. The electrician needs a voltage tester.

You are the site manager. Every morning you have to:

1. Buy a hammer → give it to the carpenter
2. Buy a wrench → give it to the plumber
3. Buy a voltage tester → give it to the electrician

That is manageable for 3 workers. But what if you have 50 workers, each needing 5 tools, and some tools are shared? You would spend your whole day just fetching and handing out tools instead of actually managing the building.

**That is the exact problem NestJS solves.**

In code without NestJS, you would have to write code like this everywhere:

```typescript
const repo = new SessionsRepository(databaseConnection);
const logger = new PinoLogger('SessionsService');
const service = new SessionsService(repo, logger);
const controller = new SessionsController(service);
```

You are manually creating every object and handing it to whoever needs it. In a big app with 50 files doing this, it becomes a nightmare. And if you ever change how `SessionsRepository` is created, you would have to update every single place that creates one.

---

## 6. NestJS's solution — "tell me what exists, I will handle the rest"

NestJS says:

> *"Tell me what exists. Tell me what each thing needs. I will handle the rest."*

The "tell me what exists" part is the `providers` array inside the module file:

```typescript
providers: [SessionsService, SessionsRepository]
```

This is you telling NestJS: *"These two things exist. Store them in your warehouse."*

Then when `SessionsService` declares in its constructor:

```typescript
constructor(private readonly repo: SessionsRepository)
```

NestJS reads that and says: *"Oh, SessionsService needs a SessionsRepository. I have one in my warehouse. I will go get it and pass it in automatically."*

That automatic fetching and passing — the whole process — is called **dependency injection**.

The word `inject` literally means "push something in from outside." NestJS injects the dependency into your class so you do not have to create it yourself.

---

## 7. What is a provider?

A provider is simply: **anything you put in the warehouse.**

That is it. If it is listed in the `providers` array of a module, it is a provider. NestJS will create one instance of it and make it available to be injected anywhere that asks for it.

```typescript
providers: [SessionsService, SessionsRepository]
```

Both of these are providers. Both live in the warehouse. Both can be injected into other classes automatically.

### Key facts about providers

- A provider is created **once** by NestJS. The same instance is reused everywhere it is needed.
- Providers can depend on other providers (NestJS resolves the chain automatically).
- A provider is private to its own module by default. To share it across modules, the module must `export` it.

---

## 8. How does NestJS actually know what to inject?

This part is clever and worth understanding.

When TypeScript compiles your code, it leaves behind **hidden metadata** that says: *"this constructor expects a parameter of type SessionsService."* NestJS reads those hidden notes at runtime.

Then NestJS looks at your module file:

```typescript
providers: [SessionsService, SessionsRepository]
```

NestJS thinks: *"I have a SessionsService in my providers list. The controller's constructor is asking for a SessionsService. I will create one and pass it in."*

So the answer to "how does NestJS know to create the object?" is:

1. TypeScript metadata tells NestJS what type each constructor parameter expects.
2. The module's `providers` array tells NestJS what is available.
3. NestJS matches them up, creates the object, and assigns it to the class instance — exactly as if you had written `this.sessionsService = new SessionsService()` yourself.

The `private readonly` shorthand handles the assignment to `this`. NestJS handles the creation.

---

## 9. What is `@Inject`?

Normally, NestJS figures out what to inject by reading the TypeScript type:

```typescript
constructor(private readonly repo: SessionsRepository)
```

NestJS sees the type `SessionsRepository` and goes: *"I have that in the warehouse. Here you go."*

But sometimes NestJS gets confused. Specifically when:

1. The thing you want **is not a class** — for example a string, a config value, or an interface.
2. **Multiple versions of the same type exist** and you need a specific one.

In those cases, TypeScript types alone are not enough to identify which item from the warehouse you want. So you use `@Inject()` as a **specific label**:

```typescript
constructor(@Inject('DATABASE_CONFIG') private config: DatabaseConfig)
```

This says: *"Do not find me just any DatabaseConfig. Find me specifically the one labelled 'DATABASE_CONFIG'."*

### Summary

| Style | When to use |
|---|---|
| **Normal injection** — no decorator, just the type | When the type alone is enough to identify what you want. Most cases. |
| **`@Inject('SOMETHING')`** — explicit label | When the type is not enough — strings, interfaces, or multiple instances of the same type. |

---

## 10. What is `@InjectPinoLogger`?

`@InjectPinoLogger` is **not part of NestJS**. The team that built the `nestjs-pino` library created it themselves.

Here is why it exists. Pino creates a separate logger instance for every service — one for `SessionsService`, one for `AuthService`, one for `IdentityService`. Each log line automatically knows which service it came from.

But every one of these loggers has the same TypeScript type: `PinoLogger`. If NestJS just read the type, it would not know which specific instance to give you.

So `nestjs-pino` created its own custom decorator as a shortcut:

```typescript
@InjectPinoLogger('SessionsService') private readonly logger: PinoLogger
```

This is exactly the same idea as `@Inject()` — just a custom version built by the `nestjs-pino` team so developers do not have to type the full `@Inject` label every time. It is convenience packaging. Under the hood it does exactly the same job as `@Inject`.

### Important naming clarification

`InjectPinoLogger` is **not** `Inject` + `PinoLogger` automatically combined. It is one single custom decorator created by the `nestjs-pino` library. The name just follows the same pattern as `@Inject` because it performs the same kind of job. The authors named it that way deliberately, so its purpose is obvious.

Other libraries do the same with their own names:

- `@InjectRepository()` — from TypeORM
- `@InjectQueue()` — from Bull
- `@InjectRedis()` — from Redis libraries
- `@InjectModel()` — from Mongoose

All the same pattern. All mean: *"go find this specific thing in the warehouse and give it to me."*

---

## 11. What gets logged and when (with PinoLogger)

PinoLogger does NOT come with NestJS. It is a separate package called `nestjs-pino` installed on top of NestJS.

Logging means writing a record of what happened and when. Like a security guard's notebook — every time something important happens, the guard writes it down with a timestamp.

### Why Pino specifically?

NestJS has its own basic logger built in, but it is slow and not very powerful. Pino is:

- One of the fastest Node.js loggers in existence.
- Writes logs in JSON format so tools like Grafana/Loki can read them.
- Can write to multiple destinations at once — terminal, file, and a remote server simultaneously.

In Trustloop's `app.module.ts`, you will see Pino configured to log to three places at the same time:

```typescript
LoggerModule.forRoot({
  pinoHttp: {
    transport: {
      targets: [
        { target: 'pino-pretty' },     // terminal (coloured, readable)
        { target: 'pino-loki' },        // Loki (remote log storage)
        { target: 'pino-roll' },        // disk file
      ]
    }
  }
})
```

One log call → three destinations. That is why Pino was chosen.

### What gets logged

In code, the developer writes calls like:

```typescript
this.logger.info({ sessionId, tenantId }, 'Session created');
this.logger.warn({ sessionId }, 'Session already exists for this user');
this.logger.error({ err, tenantId }, 'Failed to create session');
```

Each log line includes:

- A **level** (info, warn, error)
- A **message** (the human-readable text)
- A **context object** (extra data like session ID, tenant ID)
- A **timestamp** added automatically

These logs help you trace what happened during a request, especially when something goes wrong in production.

---

## 12. Parameter decorators vs constructor shorthand — they are different things

In code like this:

```typescript
constructor(
  @InjectPinoLogger(SessionsService.name) private readonly logger: PinoLogger,
) {}
```

There are two completely different things happening side by side. They are easy to confuse because they live in the same line.

### `@InjectPinoLogger(...)` — a parameter decorator

- Comes from a library (`nestjs-pino`).
- Goes **immediately before the parameter**.
- Tells NestJS what to inject.
- Parameter decorators are only allowed in **constructors and regular methods** — not on properties defined outside a constructor.

### `private readonly` — TypeScript shorthand

- A pure TypeScript feature.
- Tells TypeScript to silently declare the property on the class and assign the parameter to it.
- Only works **inside a constructor** — nowhere else.

They come from different worlds (NestJS vs TypeScript) but happen to sit on the same line, which is why it looks alien at first.

### Can decorators be arranged anyhow?

No. The decorator must go **directly before the parameter it belongs to**:

```typescript
// CORRECT — decorator is right before its parameter
@InjectPinoLogger(SessionsService.name) private readonly logger: PinoLogger

// WRONG — cannot put it somewhere random
private readonly logger: @InjectPinoLogger(SessionsService.name) PinoLogger
```

And parameters in the constructor can be in any order you want — there is no NestJS rule forcing one to come before another. The developer chooses the order.

---

## 13. The one-sentence summary

**Dependency injection** = NestJS is the warehouse manager. You list what exists (`providers`). Each class declares what it needs (constructor parameters). NestJS connects them automatically. `@Inject` and its cousins (`@InjectPinoLogger`, `@InjectRepository`, etc.) are just more specific delivery addresses for cases when the TypeScript type alone is not enough to identify the right item.
