# 11 · CompletableFuture & Async Pipelines

> **Level:** Intermediate
>
> **Pre-reading:** [10 · Executor Framework](10-executor-framework.md)

---

## CompletableFuture Basics

### Creating CompletableFuture

```java
// Completed immediately with value
CompletableFuture<Integer> future = CompletableFuture.completedFuture(42);

// Run async, returns void
CompletableFuture<Void> future2 = CompletableFuture.runAsync(() -> {
    System.out.println("Running async");
});

// Run async, returns value
CompletableFuture<String> future3 = CompletableFuture.supplyAsync(() -> {
    return "Hello";
});

// Manual completion
CompletableFuture<Integer> manual = new CompletableFuture<>();
// ... later ...
manual.complete(99);  // or manual.completeExceptionally(exception);
```

---

## Chaining Operations

### thenApply() — Transform Result

```java
CompletableFuture<Integer> future = CompletableFuture.supplyAsync(() -> 5);

future.thenApply(x -> x * 2)        // 10
      .thenApply(x -> x + 1)        // 11
      .thenAccept(x -> System.out.println(x));  // 11
```

### thenCombine() — Combine Two Futures

```java
CompletableFuture<Integer> future1 = CompletableFuture.supplyAsync(() -> 5);
CompletableFuture<Integer> future2 = CompletableFuture.supplyAsync(() -> 3);

future1.thenCombine(future2, (x, y) -> x + y)
       .thenAccept(sum -> System.out.println("Sum: " + sum));  // 8
```

### thenCompose() — Flatten Nested Futures

```java
CompletableFuture<Integer> future = CompletableFuture.supplyAsync(() -> 5)
    .thenCompose(x -> CompletableFuture.supplyAsync(() -> x * 2));  // Flat 10
    
// vs thenApply would wrap it twice
```

### anyOf() / allOf()

```java
CompletableFuture<Integer> f1 = CompletableFuture.supplyAsync(() -> 1);
CompletableFuture<Integer> f2 = CompletableFuture.supplyAsync(() -> 2);

// Returns when ANY completes
CompletableFuture<Object> any = CompletableFuture.anyOf(f1, f2);

// Returns when ALL complete
CompletableFuture<Void> all = CompletableFuture.allOf(f1, f2);
all.join();  // Wait for all
```

---

## Exception Handling

### exceptionally()

```java
CompletableFuture.supplyAsync(() -> {
    throw new RuntimeException("Oops");
})
.exceptionally(ex -> {
    System.err.println("Error: " + ex.getMessage());
    return 0;  // Default value
})
.thenAccept(x -> System.out.println("Got: " + x));
```

### handle()

```java
CompletableFuture.supplyAsync(() -> 42)
.handle((result, ex) -> {
    if (ex != null) {
        return 0;  // Error case
    }
    return result * 2;  // Success case
})
.thenAccept(x -> System.out.println(x));
```

---

## Executing On Specific Executor

```java
ExecutorService executor = Executors.newFixedThreadPool(4);

CompletableFuture.supplyAsync(() -> "data", executor)
    .thenApply(x -> x.toUpperCase())  // May run on different thread
    .thenApplyAsync(x -> process(x), executor)  // Explicitly on executor
    .thenAccept(x -> System.out.println(x));
```

---

## Real-World Example

```java
class DataFetcher {
    private ExecutorService executor = Executors.newFixedThreadPool(4);
    
    // Fetch user data from remote service
    CompletableFuture<User> fetchUser(int userId) {
        return CompletableFuture.supplyAsync(() -> {
            return callRemoteUserService(userId);
        }, executor);
    }
    
    // Fetch user's friends
    CompletableFuture<List<Friend>> fetchFriends(int userId) {
        return CompletableFuture.supplyAsync(() -> {
            return callRemoteFriendsService(userId);
        }, executor);
    }
    
    // Combined: fetch user and friends in parallel
    CompletableFuture<UserProfile> fetchUserProfile(int userId) {
        return fetchUser(userId)
            .thenCombine(
                fetchFriends(userId),
                (user, friends) -> new UserProfile(user, friends)
            );
    }
    
    // Usage
    void printProfile(int userId) {
        fetchUserProfile(userId)
            .exceptionally(ex -> {
                System.err.println("Failed to fetch profile: " + ex);
                return null;
            })
            .thenAccept(profile -> {
                if (profile != null) {
                    System.out.println(profile);
                }
            });
    }
}
```

---

## Key Takeaways

- **CompletableFuture**: Programmatic control over async operations
- **thenApply()**: Transform result
- **thenCombine()**: Combine two futures
- **thenCompose()**: Chain dependent futures
- **exceptionally()**: Error handling
- **Executor parameter**: Control which thread runs the operation

---

## 📚 Read the Original Blog Post

For more details and examples, read:

- **[CompletableFuture Mastery](https://nitinkc.github.io/java/multithreading/concurrency/completable-future-mastery/)** — Async composition and chaining

---

??? question "What's the difference between thenApply and thenApplyAsync?"
    thenApply runs on the same thread that produced the value. thenApplyAsync runs on an executor thread (default ForkJoinPool).

??? question "When should I use CompletableFuture vs Future?"
    CompletableFuture adds composition, chaining, and manual completion. Use CompletableFuture for modern async code.

??? question "Can I cancel a CompletableFuture?"
    Yes, with complete()/completeExceptionally(), but not after it's already completed.

---
