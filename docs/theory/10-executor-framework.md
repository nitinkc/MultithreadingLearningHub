# 10 · Executor Framework & Thread Pools

> **Level:** Intermediate
>
> **Pre-reading:** [04 · Thread Creation & Lifecycle](04-thread-creation.md)

---

## Why Thread Pools?

### Problem with Uncontrolled Threading

```java
// ❌ Creates too many threads
ServerSocket serverSocket = new ServerSocket(8080);
while (true) {
    Socket client = serverSocket.accept();
    // Create new thread for each request (bad!)
    new Thread(() -> handleClient(client)).start();
}

// With 10,000 concurrent requests:
// 10,000 threads × 1MB = ~10GB RAM
// Context switching overhead skyrockets
```

### Solution: Thread Pool

```java
// ✅ Reuse threads
ExecutorService executor = Executors.newFixedThreadPool(100);  // Max 100 threads
ServerSocket serverSocket = new ServerSocket(8080);

while (true) {
    Socket client = serverSocket.accept();
    executor.submit(() -> handleClient(client));  // Reuse threads
}
```

---

## ExecutorService Types

### Fixed Thread Pool

```java
ExecutorService executor = Executors.newFixedThreadPool(10);

// Submit tasks
for (int i = 0; i < 100; i++) {
    executor.submit(() -> doWork());  // Tasks queue up if all threads busy
}

executor.shutdown();
executor.awaitTermination(60, TimeUnit.SECONDS);
```

**Behavior:**

- Maintains exactly 10 threads
- Tasks queue if all busy
- Reuses threads (efficient)

### Cached Thread Pool

```java
ExecutorService executor = Executors.newCachedThreadPool();

// Creates new thread for each task initially
// Reuses idle threads
// Threads timeout if unused (default 60 seconds)

executor.submit(() -> fastTask());        // Reuses existing thread
executor.submit(() -> anotherFastTask()); // Reuses existing thread

// After 60s of no activity, threads are removed
```

**Behavior:**

- Grows unbounded (dangerous!)
- Good for short-lived tasks

### Single Thread Executor

```java
ExecutorService executor = Executors.newSingleThreadExecutor();

// All tasks execute sequentially in single thread
// Guarantees ordering
executor.submit(() -> task1());
executor.submit(() -> task2());  // Waits for task1
executor.submit(() -> task3());  // Waits for task2
```

### Scheduled Executor

```java
ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(3);

// Delay execution
scheduler.schedule(() -> {
    System.out.println("Run after 5 seconds");
}, 5, TimeUnit.SECONDS);

// Repeat periodically
scheduler.scheduleAtFixedRate(() -> {
    System.out.println("Run every 10 seconds");
}, 0, 10, TimeUnit.SECONDS);

// Repeat with delay between runs
scheduler.scheduleWithFixedDelay(() -> {
    System.out.println("Run with 5 second delay");
}, 0, 5, TimeUnit.SECONDS);
```

---

## Submitting Tasks

### submit() vs execute()

```java
ExecutorService executor = Executors.newFixedThreadPool(4);

// execute() - returns void
executor.execute(() -> System.out.println("Task"));

// submit() - returns Future
Future<?> future = executor.submit(() -> System.out.println("Task"));

// Check if done
System.out.println("Done: " + future.isDone());

// Wait for completion
future.get();  // Blocks until done
```

### submit() with Callable

```java
ExecutorService executor = Executors.newFixedThreadPool(4);

Callable<Integer> task = () -> {
    Thread.sleep(1000);
    return 42;
};

Future<Integer> future = executor.submit(task);

try {
    Integer result = future.get();
    System.out.println("Result: " + result);
} catch (ExecutionException e) {
    System.err.println("Task failed: " + e.getCause());
}
```

---

## Shutting Down Executor

### Graceful Shutdown

```java
ExecutorService executor = Executors.newFixedThreadPool(10);

// Submit tasks...

executor.shutdown();  // Stop accepting new tasks

// Wait for in-flight tasks
try {
    if (!executor.awaitTermination(60, TimeUnit.SECONDS)) {
        System.err.println("Timeout waiting for tasks");
        executor.shutdownNow();  // Force shutdown
    }
} catch (InterruptedException e) {
    executor.shutdownNow();  // Force if interrupted
}

System.out.println("All tasks done");
```

### Immediate Shutdown

```java
ExecutorService executor = Executors.newFixedThreadPool(10);

// Submit tasks...

List<Runnable> pending = executor.shutdownNow();  // Stop immediately
System.out.println("Tasks cancelled: " + pending.size());
```

---

## Future<T>

### Getting Results

```java
ExecutorService executor = Executors.newFixedThreadPool(4);

Future<String> future = executor.submit(() -> {
    Thread.sleep(2000);
    return "Result";
});

// Non-blocking check
boolean done = future.isDone();
System.out.println("Done: " + done);

// Blocking get
String result = future.get();  // Waits indefinitely

// Get with timeout
try {
    String result = future.get(5, TimeUnit.SECONDS);
} catch (TimeoutException e) {
    System.out.println("Task still running");
}
```

### Cancellation

```java
Future<Void> future = executor.submit(() -> {
    // Long running task
    for (int i = 0; i < 1000; i++) {
        if (Thread.currentThread().isInterrupted()) {
            return;
        }
        doWork();
    }
});

// Later, cancel task
boolean cancelled = future.cancel(true);  // true = interrupt if running
if (cancelled) {
    System.out.println("Task cancelled");
}
```

---

## Key Takeaways

| Pool | Threads | Use Case |
|:-----|:--------|:---------|
| **Fixed** | Exact count | General work, balanced load |
| **Cached** | Unbounded growth | Short-lived tasks |
| **Single** | 1 | Sequential execution |
| **Scheduled** | N | Periodic/delayed tasks |

---

## 📚 Read the Original Blog Post

For more details and examples, read:

- **[Executor Framework](https://nitinkc.github.io/java/multithreading/concurrency/07-executor-framework/)** — Thread pools and ExecutorService

---

??? question "Why would I use executor instead of creating threads manually?"
    Automatic resource management, reuse, pooling, graceful shutdown, Future support.

??? question "What happens if I submit 1000 tasks to a fixed pool of 10 threads?"
    Tasks queue up. The 10 threads process them sequentially. Queue backed by LinkedBlockingQueue (unbounded by default).

??? question "Can I increase thread pool size dynamically?"
    Use ThreadPoolExecutor directly for configuration. ExecutorService via Executors factory methods have fixed sizes.

---
