# 14 · Structured Concurrency & Scoped Values

> **Level:** Advanced
>
> **Pre-reading:** [13 · Virtual Threads](13-virtual-threads.md)
>
> **Requires:** Java 21+ (preview)

---

## The Problem with Unstructured Concurrency

### Legacy Approach

```java
// ❌ Unstructured: threads outlive their scope
ExecutorService executor = Executors.newFixedThreadPool(4);

// Submit tasks
executor.submit(() -> task1());
executor.submit(() -> task2());

// Main continues... but when do tasks finish?
// Main thread can exit while tasks still running
// Need manual join/shutdown logic
```

### Structured Concurrency (Java 21+)

```java
// ✅ Structured: clear scope and lifecycle
try (var scope = StructuredTaskScope.open(Joiner.awaitAll())) {
    // Tasks are scoped to this try-with-resources
    scope.fork(() -> task1());
    scope.fork(() -> task2());
    // Main is blocked until all tasks complete
}  // Guaranteed: all tasks finished before continuing

// No lingering threads, clear resource management
```

**Benefits:**

- Clear parent-child relationship
- Guaranteed completion before scope exits
- Easier error handling
- No accidental thread leaks

---

## StructuredTaskScope

### Basic Usage

```java
import java.util.concurrent.StructuredTaskScope.*;

try (var scope = StructuredTaskScope.open(Joiner.awaitAll())) {
    Subtask<String> subtask1 = scope.fork(() -> "result1");
    Subtask<String> subtask2 = scope.fork(() -> "result2");
    
    // Implicitly joins here when scope closes
}  // All subtasks guaranteed complete

// Retrieve results
String result1 = subtask1.get();
String result2 = subtask2.get();
```

### Joiner Strategies

**awaitAll() — Wait for all, fail if any exception**

```java
try (var scope = StructuredTaskScope.open(Joiner.awaitAll())) {
    scope.fork(() -> task1());
    scope.fork(() -> task2());
}  // Throws exception if any task fails
```

**failFast() — Stop on first failure**

```java
try (var scope = StructuredTaskScope.open(Joiner.failFast())) {
    scope.fork(() -> task1());
    scope.fork(() -> task2());  // If task1 fails, task2 cancelled
}  // Throws immediately on first failure
```

**Custom Joiner — Fine-grained control**

```java
class BestResult<T> implements StructuredTaskScope.Joiner<T, T> {
    @Override
    public T result() { /* ... */ }
    
    @Override
    public void onComplete(Subtask<? extends T> subtask) { /* ... */ }
}

try (var scope = StructuredTaskScope.open(new BestResult<>())) {
    // ...
}
```

---

## Virtual Threads + Structured Concurrency

```java
try (var scope = StructuredTaskScope.open(Joiner.awaitAll())) {
    // Each fork creates a virtual thread automatically
    for (int i = 0; i < 1000; i++) {
        scope.fork(() -> blockingIoTask());
    }
}  // Waits for all 1000 virtual threads
```

---

## ThreadLocal vs ScopedValue

### ThreadLocal (Old, Not Ideal)

```java
private static ThreadLocal<RequestContext> context = new ThreadLocal<>();

public void handle(Request req) {
    context.set(new RequestContext(req.getId()));
    try {
        // Can access value from anywhere in call stack
        String id = context.get().id();
    } finally {
        context.remove();  // Manual cleanup needed
    }
}
```

**Problems:**

- Must manually clean up (forget cleanup = leak)
- Thread pool threads carry values from previous requests
- Doesn't work well with virtual threads (unpredictable inheritance)

### ScopedValue (New, Preferred)

```java
import java.lang.ScopedValue;

private static final ScopedValue<RequestContext> context = ScopedValue.newInstance();

public void handle(Request req) {
    // Scoped explicitly — automatic cleanup
    context.set(new RequestContext(req.getId()), () -> {
        // Value available in this scope and all called methods
        String id = context.get().id();
        process();  // Can still call context.get() here
    });
    // Value cleaned up automatically after lambda
}
```

**Advantages:**

- Automatic cleanup (no leaks)
- Works perfectly with virtual threads
- Clear scope boundaries
- Immutable (cannot be changed mid-scope)

### Comparison

| Feature | ThreadLocal | ScopedValue |
|:--------|:-----------|:-----------|
| **Cleanup** | Manual | Automatic |
| **Virtual threads** | ❌ Poor | ✅ Perfect |
| **Constants** | Mutable | Immutable |
| **Scope** | Unbounded | Explicit |

---

## Error Handling in Structured Concurrency

### Handling Task Failures

```java
import java.util.concurrent.StructuredTaskScope.*;

try (var scope = StructuredTaskScope.open(Joiner.awaitAll())) {
    Subtask<String> task1 = scope.fork(() -> task1("ok"));
    Subtask<String> task2 = scope.fork(() -> task2("fail"));  // Throws
    
}  // Throws StructuredTaskScope.JoinedException
catch (StructuredTaskScope.JoinedException e) {
    for (Subtask<?> subtask : e.getExceptions()) {
        System.err.println("Task failed: " + subtask.exception());
    }
}
```

### failFast — Cancel Other Tasks

```java
try (var scope = StructuredTaskScope.open(Joiner.failFast())) {
    scope.fork(() -> longRunningTask());
    scope.fork(() -> quickFailingTask());
    // If quickFailingTask fails immediately, longRunningTask is cancelled
}
catch (StructuredTaskScope.ShutdownException e) {
    // One task failed; others cancelled
}
```

---

## Key Takeaways

| Concept | Benefit |
|:--------|:--------|
| **Structured Concurrency** | Clear scope, guaranteed completion |
| **StructuredTaskScope** | Parent-child relationships |
| **Joiner** | Customizable completion logic |
| **ScopedValue** | Automatic cleanup, virtual-thread safe |

---

## 📚 Read the Original Blog Post

For more details and examples, read:

- **[Structured Concurrency & Scoped Values](https://nitinkc.github.io/java/multithreading/concurrency/11-structured-concurrency-scoped-values/)** — Modern API for managing concurrent tasks

---

??? question "What happens if I forget to close StructuredTaskScope?"
    It throws an error at scope exit. Tasks won't hang; the scope ensures cleanup.

??? question "Can I nest StructuredTaskScopes?"
    Yes, allowing hierarchical task structures with clear parent-child relationships.

??? question "Why is ScopedValue immutable?"
    Immutability prevents accidental modifications and makes concurrency reasoning easier.

---
