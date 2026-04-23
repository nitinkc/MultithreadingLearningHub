# Interview Q&A: Multithreading & Concurrency

This section contains common interview questions curated from real interview experiences. Each answer is concise (1-3 sentences) and focuses on practical understanding.

---

## Fundamentals

??? question "What's the difference between concurrency and parallelism?"
    **Concurrency** is managing multiple tasks (can happen on single core via time-slicing). **Parallelism** is simultaneous execution on multiple cores. You can have concurrency without parallelism, but not vice versa.

??? question "Explain process vs thread."
    **Processes** are OS-level, isolated, with separate memory (~50MB each). **Threads** are lightweight, within a process, share memory (~1MB stack each). Threads are cheaper to create and context-switch.

??? question "What is the Java Memory Model?"
    The JMM defines how threads interact through memory and when changes become visible. It ensures even on multi-CPU systems, Java code behaves predictably through "happens-before" relationships.

??? question "What does 'volatile' do?"
    **volatile** ensures visibility (memory barriers, no caching) and prevents reordering, but does NOT provide atomicity. Use for flags; use `Atomic*` or `synchronized` for shared mutable data.

??? question "Is `count++` atomic?"
    No. It's actually three operations: read, add, write. Threads can interleave, causing lost updates. Use `AtomicInteger.incrementAndGet()` instead.

---

## Thread Creation & Lifecycle

??? question "Should I extend Thread or implement Runnable?"
    Implement **Runnable** (or use lambda). Extending Thread is inflexible since Java doesn't support multiple inheritance. Reserve extension for truly Thread-specific behavior (rare).

??? question "What's the difference between Runnable and Callable?"
    **Runnable** returns void, cannot throw checked exceptions. **Callable** returns V, can throw checked exceptions. Use Callable when you need a result or expect checked exceptions.

??? question "What are thread states?"
    NEW → RUNNABLE → (BLOCKED/WAITING/TIMED_WAITING) → TERMINATED. RUNNABLE means ready or running, BLOCKED waits for lock, WAITING waits for notify, TIMED_WAITING waits with timeout.

??? question "What happens if I call run() instead of start()?"
    It executes in the current thread (not a separate thread). You must call `start()` to create a new thread.

??? question "What's the difference between daemon and non-daemon threads?"
    JVM exits immediately if only daemon threads remain. Use non-daemon for important work (default), daemon for background tasks (cleanup, monitoring). Must call `setDaemon()` before `start()`.

---

## Synchronization

??? question "Explain synchronized block vs method."
    **Synchronized method** locks the entire method; lock is `this` for instance, `Class` for static. **Synchronized block** locks a specific section; you choose the lock object. Block is more fine-grained.

??? question "What is a race condition?"
    Multiple threads access shared mutable data without synchronization, causing non-deterministic outcomes. Example: `count++` on shared counter can yield wrong final count due to interleaving.

??? question "What is a data race?"
    Unsynchronized access to same memory location where at least one thread writes. Data races violate the Java Memory Model and cause visibility issues.

??? question "When should I use ReentrantLock instead of synchronized?"
    When you need timeout (`tryLock(timeout)`), fairness guarantee, or multiple condition variables. Otherwise, use `synchronized` (simpler, automatic release).

??? question "What's a deadlock?"
    Circular lock dependency: Thread A waits for lock held by B, B waits for lock held by A. Prevent by: consistent lock ordering, timeouts, or avoiding nested locks.

---

## Executor Framework

??? question "Why use ExecutorService instead of creating threads manually?"
    **ExecutorService** provides thread pooling (reuse), resource limits, graceful shutdown, `Future` support, exception handling. Managing threads manually is error-prone.

??? question "What's the difference between submit() and execute()?"
    **execute()** returns void, no exception handling. **submit()** returns `Future`, allows result retrieval and exception handling via `get()`.

??? question "How do I gracefully shutdown an executor?"
    Call `shutdown()` (stop accepting new tasks), then `awaitTermination()` to wait for in-flight tasks. Use `shutdownNow()` to force if timeout.

??? question "What's an unbounded queue problem?"
    If you didn't specify queue size in ThreadPoolExecutor, it grows unbounded. With 1M tasks and small thread pool, the queue consumes all memory. Always specify bounded queues or use cached pool carefully.

---

## Concurrent Collections

??? question "Why use ConcurrentHashMap instead of synchronized HashMap?"
    **ConcurrentHashMap** uses segment-based locking (partial locking), allowing multiple threads to write to different segments. **Synchronized** locks entire map, worse contention.

??? question "When is CopyOnWriteArrayList better than synchronized?"
    When you have many readers and few writers. Reads are lock-free (iterate on snapshot), writes are expensive (copy entire array). For balanced read-write, use `synchronizedList`.

??? question "What's BlockingQueue used for?"
    Producer-consumer pattern. `put()` blocks if full, `take()` blocks if empty. Automatic coordination, no manual wait/notify needed.

---

## CompletableFuture

??? question "What's the difference between thenApply and thenApplyAsync?"
    **thenApply** runs on same thread that produced the value. **thenApplyAsync** runs on executor (default ForkJoinPool). Use async when you want parallel execution.

??? question "How do I combine two async operations?"
    Use **thenCombine**: `future1.thenCombine(future2, (r1, r2) -> combine(r1, r2))`. Use **thenCompose** for dependent futures (flat mapping).

??? question "How do I handle exceptions in CompletableFuture?"
    Use **exceptionally** to recover with default value. Use **handle** for both success and error cases. Use **whenComplete** for cleanup.

---

## Virtual Threads

??? question "When should I use virtual threads?"
    For I/O-bound workloads (blocking I/O). Create millions, let JVM schedule. NOT for CPU-bound work (no CPU advantage, scheduling overhead wasted).

??? question "Can I create millions of virtual threads?"
    Yes, but each has a stack frame. Millions of virtual threads = millions of stacks (still memory). More practical than millions of platform threads though.

??? question "What's the mount/unmount mechanism?"
    Virtual threads "mount" on carrier (platform) threads to execute. When blocked on I/O, they "unmount" (carrier available for other virtual threads). No OS context switching.

??? question "Should I use ThreadLocal with virtual threads?"
    Prefer **ScopedValue** (new, automatic cleanup). ThreadLocal still works but semantics are different with virtual threads. ScopedValue is intended for virtual threads.

---

## Design & Anti-Patterns

??? question "What's the producer-consumer pattern?"
    One thread(s) produce data into shared queue, other thread(s) consume. Decouples production rate from consumption. Use `BlockingQueue` for automatic coordination.

??? question "What should I NOT do with threads?"
    ❌ Never call `Thread.stop()` (deprecated, dangerous). ❌ Don't rely on thread priority (OS-dependent). ❌ Don't synchronize entire methods (lock only critical sections). ❌ Don't swallow `InterruptedException`.

??? question "How do I properly stop a thread?"
    Call `interrupt()`. In thread, check `isInterrupted()` and clean up voluntarily. Never force-stop.

??? question "Should I synchronize entire methods?"
    No. Lock only critical sections to minimize contention. Synchronize entire method only if entire method is critical or simple.

??? question "What's the lock ordering rule?"
    Always acquire locks in consistent order. If Thread A acquires lock1 then lock2, Thread B must also acquire lock1 then lock2. Prevents circular deadlock.

---

## Performance

??? question "When is synchronized faster than AtomicInteger?"
    On **low contention** (few threads competing), synchronized can be faster due to lock biasing and optimization. On **high contention**, Atomic (CAS) wins.

??? question "Why do virtual threads help with high concurrency?"
    Platform threads are expensive to create/schedule (OS overhead). Virtual threads are cheap, JVM-scheduled. 100K concurrent connections with virtual threads possible; platform threads would need 100K OS threads = ~100GB RAM.

??? question "How do I debugging thread deadlocks?"
    Use `jcmd <pid> Thread.dump` or JVM debugger. Look for cycles in lock dependencies. Use `tryLock()` with timeout to detect and recover.

---

## Trade-Off Questions

??? question "When should I use synchronized vs AtomicInteger vs Volatile?"
    **volatile**: Just visibility (flags). **AtomicInteger**: Single value, high frequency. **synchronized**: Complex critical sections, multiple memory locations. Choose based on contention and complexity.

??? question "Platform threads vs Virtual threads: when to pick?"
    **Platform**: CPU-bound work (match core count), or when OS integration needed. **Virtual**: I/O-bound services, want simplicity at scale. Modern Java: virtual threads usually win for services.

??? question "When is blocking I/O vs non-blocking I/O appropriate?"
    **Blocking**: Simple code, few concurrent connections. **Non-blocking**: High concurrency (10K+ connections). **Virtual threads + blocking**: Best of both (Java 21+).

---

## Verification Checklist

After reviewing these Q&As, verify you can:

- [ ] Explain concurrency vs parallelism with real examples
- [ ] Describe race conditions and how to prevent them
- [ ] Compare synchronization mechanisms (trade-offs)
- [ ] Design executor-based task processing
- [ ] Explain when to use which collection type
- [ ] Debug deadlocks and race conditions
- [ ] Recommend virtual threads vs platform threads
- [ ] Review code for common concurrency bugs

---

## Resources for Deep Dives

- "Effective Java" by Joshua Bloch (Chapter on Concurrency)
- "Java Concurrency in Practice" by Brian Goetz
- Official Java Concurrency Tutorial
- Project Loom documentation

---
