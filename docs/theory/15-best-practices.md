# 15 · Best Practices & Patterns

> **Level:** Advanced
>
> **Pre-reading:** All previous sections

---

## Design Patterns for Concurrency

### 1. Producer-Consumer

```java
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;

BlockingQueue<Task> queue = new LinkedBlockingQueue<>();

// Producer
new Thread(() -> {
    for (int i = 0; i < 100; i++) {
        try {
            queue.put(new Task(i));
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
}).start();

// Consumers
for (int i = 0; i < 4; i++) {
    new Thread(() -> {
        while (!Thread.currentThread().isInterrupted()) {
            try {
                Task task = queue.take();
                process(task);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
    }).start();
}
```

### 2. Worker Pool

```java
ExecutorService pool = Executors.newFixedThreadPool(10);

// Submit tasks
for (Task task : tasks) {
    pool.submit(() -> processTask(task));
}

// Graceful shutdown
pool.shutdown();
try {
    if (!pool.awaitTermination(60, TimeUnit.SECONDS)) {
        pool.shutdownNow();
    }
} catch (InterruptedException e) {
    pool.shutdownNow();
}
```

### 3. Future<T> for Result Aggregation

```java
List<Future<Integer>> futures = new ArrayList<>();

ExecutorService executor = Executors.newFixedThreadPool(4);

for (int i = 0; i < 10; i++) {
    final int taskId = i;
    futures.add(executor.submit(() -> compute(taskId)));
}

// Aggregate results
int total = 0;
for (Future<Integer> future : futures) {
    try {
        total += future.get();
    } catch (ExecutionException e) {
        System.err.println("Task failed: " + e.getCause());
    }
}
```

### 4. Read-Write Separation

```java
import java.util.concurrent.locks.ReadWriteLock;
import java.util.concurrent.locks.ReentrantReadWriteLock;

class Cache<K, V> {
    private final Map<K, V> data = new HashMap<>();
    private final ReadWriteLock lock = new ReentrantReadWriteLock();
    
    V get(K key) {
        lock.readLock().lock();
        try {
            return data.get(key);  // Many readers
        } finally {
            lock.readLock().unlock();
        }
    }
    
    void put(K key, V value) {
        lock.writeLock().lock();
        try {
            data.put(key, value);  // Single writer
        } finally {
            lock.writeLock().unlock();
        }
    }
}
```

### 5. Fire-and-Forget Tasks

```java
// Submit without waiting for result
executor.submit(() -> sendNotification(user));

// Fire-and-forget, but with exception handling
executor.submit(() -> {
    try {
        dangerousOperation();
    } catch (Exception e) {
        logger.error("Operation failed", e);
    }
});
```

---

## Anti-Patterns (What NOT to Do)

### ❌ Anti-Pattern 1: Creating Threads in a Loop

```java
// ❌ BAD: Creates too many threads
for (int i = 0; i < 1000; i++) {
    new Thread(() -> task(i)).start();  // 1000 threads!
}

// ✅ GOOD: Use thread pool
ExecutorService pool = Executors.newFixedThreadPool(10);
for (int i = 0; i < 1000; i++) {
    pool.submit(() -> task(i));  // 10 threads handle all
}
```

### ❌ Anti-Pattern 2: Relying on Thread.sleep()

```java
// ❌ BAD: Busy-waiting with sleep
while (!done) {
    Thread.sleep(100);  // CPU churn
}

// ✅ GOOD: Use CountDownLatch
CountDownLatch latch = new CountDownLatch(1);
// ... task calls latch.countDown() when done
latch.await();  // Blocks efficiently
```

### ❌ Anti-Pattern 3: Synchronizing Large Methods

```java
// ❌ BAD: Entire method locked
synchronized void process() {
    readFromDisk();  // Slow, lock held entire time
    updateMemory();
    writeToDisk();  // Others blocked during all I/O
}

// ✅ GOOD: Lock only critical sections
void process() {
    readFromDisk();      // No lock
    synchronized (THIS) {
        updateMemory();  // Lock only here
    }
    writeToDisk();       // No lock
}
```

### ❌ Anti-Pattern 4: Catching InterruptedException Silently

```java
// ❌ BAD: Swallows interruption
try {
    Thread.sleep(1000);
} catch (InterruptedException e) {
    // ❌ Do nothing — thread won't know it was interrupted
}

// ✅ GOOD: Restore interrupt flag
try {
    Thread.sleep(1000);
} catch (InterruptedException e) {
    Thread.currentThread().interrupt();  // Restore
    // or throw RuntimeException
}
```

### ❌ Anti-Pattern 5: Using Thread.stop()

```java
// ❌ BAD: Deprecated and dangerous
thread.stop();  // Leaves resources uncleaned, unpredictable

// ✅ GOOD: Use interrupt + flag
thread.interrupt();
// ... in thread: check isInterrupted() and clean up
```

---

## Performance Optimization

### Choose Right Synchronization

```
Low Contention:        synchronized > ReentrantLock > Atomic
High Contention:       Atomic > ReentrantLock > synchronized
Read-Heavy:            ReadWriteLock > synchronized
Just Visibility:       volatile > synchronized
```

### Lock Granularity Trade-Off

```
Coarse Locks: Simple ┌─── Choose Based on ──┐ Less Lock Contention
              Easy   │   Your Access        │ Complexity
              Wrong  │   Patterns           │ Possible Scalability
Fine Locks:   Complex└────────────────────┘
```

### Collection Choice

```
Few Threads:       synchronizedMap / synchronizedList
Many Readers:      CopyOnWriteArrayList
Many Writers:      ConcurrentHashMap
Queue Operations:  BlockingQueue / ConcurrentLinkedQueue
```

---

## Common Pitfalls & Solutions

| Pitfall | Problem | Solution |
|:--------|:--------|:---------|
| **Lost notifies** | notify() called before wait() | Use Lock + Condition |
| **Spurious wakeups** | wait() returns unexpectedly | Check condition in loop: `while (!condition)` |
| **Stale reads** | Cached value not updated | Use `volatile` or synchronize |
| **Deadlock** | Circular lock dependency | Use consistent lock ordering |
| **Memory leaks** | ThreadLocal not cleaned | Use ScopedValue or manual cleanup |
| **Thundering herd** | All threads wake, only one proceeds | Use notifyOne() or Condition.signal() |

---

## Concurrency Testing

### Use jcstress for Concurrency Tests

```bash
# Java Concurrency Stress test framework
mvn archetype:generate -DinteractiveMode=false \
    -DarchetypeGroupId=org.openjdk.jcstress \
    -DarchetypeArtifactId=jcstress-test-archetype
```

### Basic Stress Test Pattern

```java
@JCStressTest
@Outcome(id = "1", expect = ACCEPTABLE, desc = "Counter incremented once")
@Outcome(id = "0", expect = FORBIDDEN, desc = "No increment (race condition)")
@State
public class CounterRaceTest {
    private int counter = 0;
    
    @Actor
    public void actor1() { counter++; }
    
    @Actor
    public void actor2() { counter++; }
    
    @Arbiter
    public void arbiter(I_Result r) {
        r.r1 = counter;
    }
}
```

---

## Key Takeaways

| Principle | Application |
|:----------|:------------|
| **Use executors** | Not raw threads |
| **Preferred: minimal locks** | Immutability, volatile, ConcurrentHashMap |
| **Control scope** | StructuredTaskScope |
| **Interrupt properly** | Check/restore interrupt flag |
| **Test concurrency** | Use jcstress or stress testing |
| **Monitor production** | Thread count, deadlocks, GC pauses |

---

## 📚 Read the Original Blog Post

For more details and examples, read:

- **[Best Practices & Patterns](https://nitinkc.github.io/java/multithreading/concurrency/best-practices-patterns/)** — Production-ready patterns and anti-patterns

---

??? question "What's the best way to stop a thread?"
    Use interrupt() and check isInterrupted(). The thread checks the flag and cleans up voluntarily.

??? question "Should I always lock at method level?"
    No. Lock only the minimum code needed (critical sections). Fine-grained locking allows better concurrency.

??? question "Why use executors instead of new Thread()?"
    Automatic pooling, reuse, resource limits, easy shutdown, exception handling, Future support.

---
