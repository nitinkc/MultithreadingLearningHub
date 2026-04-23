# Interview Questions: Self-Assessment

Use this quiz to test your understanding of multithreading concepts. Mark your answers, then check against the Interview Q&A section.

---

## Level 1: Foundational (Should know after Sections 01-06)

**1. What is the primary difference between a process and a thread?**

- A: Threads process multiple instructions; processes can't
- B: Processes are OS-level isolation; threads share memory
- C: Threads use more memory than processes
- D: Processes are faster than threads

<details>
<summary>Answer</summary>
**B** — Processes are OS-level with isolated memory. Threads are lightweight, within a process, sharing memory.
</details>

**2. Why would you use daemon threads?**

- A: They run faster than non-daemon threads
- B: JVM exits immediately if only daemon threads remain
- C: They can access shared data safely
- D: They consume less memory

<details>
<summary>Answer</summary>
**B** — Daemon threads are for background work. JVM doesn't wait for them. Non-daemon threads are the default; JVM waits for them to finish.
</details>

**3. What happens if you call `run()` instead of `start()` on a thread?**

- A: Nothing; they're equivalent
- B: Exception is thrown
- C: Code executes in current thread, not new thread
- D: Thread is created but not started

<details>
<summary>Answer</summary>
**C** — `run()` executes inline. `start()` creates a new thread. Always call `start()`.
</details>

**4. Is `volatile` sufficient for thread-safe counters?**

- A: Yes, volatile guarantees atomicity
- B: No, volatile ensures visibility but not atomicity
- C: Yes, but only for simple types
- D: No, threads can never share counters safely

<details>
<summary>Answer</summary>
**B** — `volatile count++` is still NOT atomic. It's three operations: read, add, write. Use AtomicInteger.
</details>

**5. What is a race condition?**

- A: Two threads running at the same time
- B: Non-deterministic outcome from unsynchronized access
- C: Exception thrown when threads conflict
- D: Thread priority conflict

<details>
<summary>Answer</summary>
**B** — Race condition: multiple threads, shared mutable data, no synchronization, non-deterministic outcome.
</details>

---

## Level 2: Intermediate (After Sections 07-10)

**6. What's the main advantage of using ConcurrentHashMap over synchronized HashMap?**

- A: ConcurrentHashMap is faster in all cases
- B: ConcurrentHashMap uses segment-based locking (partial locking)
- C: ConcurrentHashMap never blocks
- D: ConcurrentHashMap uses less memory

<details>
<summary>Answer</summary>
**B** — ConcurrentHashMap divides into segments. Multiple threads can write to different segments simultaneously. synchronizedMap locks entire map.
</details>

**7. When should you use ReentrantLock instead of synchronized?**

- A: Always; it's more modern
- B: When you need timeout, fairness, or multiple conditions
- C: For better performance (always faster)
- D: For simpler code

<details>
<summary>Answer</summary>
**B** — ReentrantLock offers:  `tryLock(timeout)`, fairness guarantee, multiple Condition variables. Own synchronization is simpler for basic cases.
</details>

**8. What's the difference between `execute()` and `submit()` on ExecutorService?**

- A: No difference; they're aliases
- B: execute() returns Future; submit() returns void
- C: submit() returns Future; execute() returns void
- D: submit() doesn't throw exceptions

<details>
<summary>Answer</summary>
**C** — `execute()` returns void. `submit()` returns `Future` for result/exception handling. Why use submit() for Callables.
</details>

**9. In a deadlock scenario with locks A and B, what's the fix?**

- A: Use nested locks only once
- B: Always acquire locks in consistent order
- C: Use synchronized instead of locks
- D: Increase thread priorities

<details>
<summary>Answer</summary>
**B** — If every thread acquires A then B (never B then A), circular wait is impossible.
</details>

**10. When is `CopyOnWriteArrayList` better than `Collections.synchronizedList`?**

- A: Always; it's always better
- B: When you have many readers, few writers
- C: When you have many writers
- D: When order doesn't matter

<details>
<summary>Answer</summary>
**B** — CopyOnWriteArrayList: reads are lock-free (iterate on snapshot), writes are expensive (copy array). Good for read-heavy.
</details>

---

## Level 3: Advanced (After Sections 11-15)

**11. What's the difference between thenApply() and thenApplyAsync() on CompletableFuture?**

- A: No difference; they're aliases
- B: thenApply runs on same thread, thenApplyAsync on executor
- C: thenApply is deprecated
- D: thenApplyAsync always slower

<details>
<summary>Answer</summary>
**B** — thenApply runs on same thread that produced the value. thenApplyAsync uses ForkJoinPool (parallelism).
</details>

**12. When should you use virtual threads?**

- A: Always; they're always better
- B: For I/O-bound workloads (blocking I/O)
- C: For CPU-bound work
- D: Never; they're just hype

<details>
<summary>Answer</summary>
**B** — Virtual threads: cheap JVM-managed, perfect for I/O. NOT for CPU-bound (still need parallelism from cores).
</details>

**13. What are the advantages of StructuredTaskScope?**

- A: It replaces ExecutorService completely
- B: Clear parent-child relationships, guaranteed completion before scope exits
- C: It's always faster
- D: Eliminates all deadlocks

<details>
<summary>Answer</summary>
**B** — StructuredTaskScope scopes tasks to try-with-resources. Tasks complete before scope exits. Clear resource management.
</details>

**14. Why is ScopedValue preferred over ThreadLocal for virtual threads?**

- A: ScopedValue is more powerful
- B: ScopedValue is automatic cleanup, works predictably with virtual threads
- C: ThreadLocal is deprecated
- D: ScopedValue is faster

<details>
<summary>Answer</summary>
**B** — ScopedValue: automatic cleanup, immutable, designed for virtual threads. ThreadLocal: manual cleanup, mutable, legacy.
</details>

**15. What's a common anti-pattern in multi-threaded code?**

- A: Using too many threads
- B: Relying on Thread.sleep() for synchronization
- C: Creating thread pools
- D: Using volatile flags

<details>
<summary>Answer</summary>
**B** — Using sleep() for synchronization is busy-waiting. Use CountDownLatch, Condition, or BlockingQueue instead.
</details>

---

## Scoring

- **1-5 correct**: Review Sections 01-06 (Foundations)
- **6-10 correct**: Review Sections 07-10 (Synchronization & Executors)
- **11-15 correct**: Strong understanding; focus on practice with Labs

---

## Next Steps

1. Review missed questions in [Interview Q&A](interview-prep.md)
2. Complete corresponding Lab exercises
3. Study relevant theory sections
4. Practice explaining concepts out loud (prepares for real interviews)

---
