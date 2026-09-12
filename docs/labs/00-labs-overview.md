# Labs Overview

Welcome to the hands-on labs section. Each lab builds on previous concepts and includes executable code, exercises, and solutions.

---

## Lab Structure

Each lab includes:

- **Theory Review** — Quick recap of concepts
- **Starter Code** — Incomplete exercises to implement
- **Full Solution** — Reference implementation
- **Exercises** — Extra challenges to deepen understanding
- **Key Learnings** — What you should remember

---

## Labs at a Glance

| Lab | Title | Focus | Level | Core Concepts |
|:----|:------|:------|:------|:-------------|
| **01** | Thread Creation & Lifecycle | Runnable, Callable, Thread states | Beginner | Thread creation, lifecycle states |
| **02** | Synchronization Basics | synchronized, volatile, race conditions | Beginner | Mutual exclusion, visibility |
| **03** | Locks & Deadlock Prevention | ReentrantLock, timeout, deadlock recovery | Intermediate | Explicit locking |
| **04** | Executor Framework | Thread pools, submit, shutdown | Intermediate | Task submission, lifecycle |
| **05** | CompletableFuture | Async chains, combining, composition | Intermediate | AsyncAsync pipelines |
| **06** | Concurrent Collections | ConcurrentHashMap, BlockingQueue | Intermediate | Thread-safe data structures |
| **07** | Virtual Threads Basics | Creating, running, direct hand-off | Advanced | Virtual thread benefits |
| **08** | Structured Concurrency | StructuredTaskScope, scope management | Advanced | Structured parent-child |
| **09** | Real-World Scenarios | Web request handler, producer-consumer | Advanced | Integration patterns |

---

## How to Use These Labs

### Beginner Path (Weeks 1-2)

1. Start with **Lab 01**: Build intuition about thread creation
2. Complete **Lab 02**: Understand synchronization and racing
3. **Review** sections 01-06 of theory
4. Practice code writing, don't just read

### Intermediate Path (Weeks 2-3)

5. Complete **Lab 03**: Understand locks deeply
6. Complete **Lab 04**: Master thread pools
7. Complete **Lab 05**: Async programming
8. Complete **Lab 06**: Concurrent collections
9. **Review** sections 07-10 of theory

### Advanced Path (Weeks 3-4)

10. Complete **Lab 07**: Virtual threads introduction
11. Complete **Lab 08**: Structured concurrency patterns
12. Complete **Lab 09**: Real-world integration scenarios
13. **Review** sections 13-15 of theory

---

## Running Labs Locally

### Setup

```bash
# Clone or download the hub
cd java-multithreading-hub

# Each lab is standalone Java class
# Compile and run (Java 21+)
javac docs/labs/lab01_solution.java
java lab01_solution
```

### IDE Integration (IntelliJ/VS Code)

1. Open lab file in your IDE
2. Mark project root as **Sources Root**
3. Run directly from IDE (⌘R or Ctrl+Shift+F10)
4. Use debugger to step through execution

---

## Lab Execution Guarantees

Each lab is designed to:

- ✅ Compile on Java 21+
- ✅ Execute without errors
- ✅ Demonstrate core concurrency concepts
- ✅ Provide meaningful output for verification

---

## Learning Checklist

After completing each lab, verify you can:

**Lab 01:**

- [ ] Create threads using Runnable
- [ ] Create threads using Callable
- [ ] Understand thread lifecycle states
- [ ] Demonstrate thread name and ID

**Lab 02:**

- [ ] Reproduce a race condition
- [ ] Fix it with synchronized
- [ ] Fix it with volatile
- [ ] Fix it with Atomic types

**Lab 03:**

- [ ] Use ReentrantLock with try-finally
- [ ] Implement timeout-based lock acquisition
- [ ] Demonstrate and prevent deadlock
- [ ] Use Condition variables

**Lab 04:**

- [ ] Create fixed thread pool
- [ ] Submit Runnable and Callable tasks
- [ ] Retrieve results with Future
- [ ] Gracefully shutdown executor

**Lab 05:**

- [ ] Chain operations with thenApply
- [ ] Combine futures with thenCombine
- [ ] Handle exceptions with exceptionally
- [ ] Use anyOf/allOf

**Lab 06:**

- [ ] Use ConcurrentHashMap
- [ ] Demonstrate BlockingQueue producer-consumer
- [ ] Compare CopyOnWriteArrayList with synchronized
- [ ] Understand concurrent collection semantics

**Lab 07:**

- [ ] Create virtual threads with ofVirtual()
- [ ] Run millions of virtual threads
- [ ] Measure performance advantage for I/O
- [ ] Understand mount/unmount

**Lab 08:**

- [ ] Use StructuredTaskScope
- [ ] Structure parent-child tasks
- [ ] Handle failures with Joiner
- [ ] Use ScopedValue

**Lab 09:**

- [ ] Implement producer-consumer pipeline
- [ ] Build web request handler
- [ ] Combine multiple concurrent patterns
- [ ] Demonstrate real-world scalability

---

## Common Issues & Debugging

### Thread Not Starting

```
Issue: Code doesn't execute concurrently

- Is thread.start() called? (not thread.run())
- Are all threads completed before program exits?
- Use thread.join() to wait
```

### Race Condition Not Reproduced

```
Issue: Expected race condition doesn't happen

- Race conditions are timing-dependent
- Run the test multiple times
- Adjust sleep times or loop counts
- Use stress testing tools (jcstress)
```

### Deadlock Hang

```
Issue: Locks are held circularly

- Check lock acquisition order
- Use timeout: lock.tryLock(5, TimeUnit.SECONDS)
- Use deadlock detector tools
- Press Ctrl+C and review thread dump
```

### Out of Memory

```
Issue: "Could not reserve enough space for heap"

- Limit number of threads/futures
- Use smaller buffers for labs
- Check for memory leaks (ThreadLocal not cleaned)
```

---

## 📚 Blog Series Reference

These labs correspond to the comprehensive **[Java Multithreading Blog Series](https://nitinkc.github.io/java/multithreading/concurrency/series-overview/)** at **nitinkc.github.io**.

### Lab-to-Blog Mapping

| Lab | Corresponds To | Blog Link |
|:----|:---------------|:----------|
| Lab 01 · Thread Creation | Section 04 | [Thread Creation Methods](https://nitinkc.github.io/java/multithreading/concurrency/02-thread-creation-methods/) |
| Lab 02 · Synchronization | Sections 07-08 | [Race Conditions](https://nitinkc.github.io/java/multithreading/concurrency/04-race-conditions-critical-sections/) & [Synchronization](https://nitinkc.github.io/java/multithreading/concurrency/05-synchronization-mechanisms/) |
| Lab 03 · Locks | Section 09 | [Locks & Advanced Sync](https://nitinkc.github.io/java/multithreading/concurrency/06-locks-and-advanced-sync/) |
| Lab 04 · Executor | Section 10 | [Executor Framework](https://nitinkc.github.io/java/multithreading/concurrency/07-executor-framework/) |
| Lab 05 · CompletableFuture | Section 11 | [CompletableFuture Mastery](https://nitinkc.github.io/java/multithreading/concurrency/08-completable-future-mastery/) |
| Lab 06 · Concurrent Collections | Section 12 | [Concurrent Collections](https://nitinkc.github.io/java/multithreading/concurrency/09-concurrent-collections/) |
| Lab 07 · Virtual Threads | Section 13 | [Virtual Threads](https://nitinkc.github.io/java/multithreading/concurrency/10-virtual-threads/) |
| Lab 08 · Structured Concurrency | Section 14 | [Structured Concurrency](https://nitinkc.github.io/java/multithreading/concurrency/11-structured-concurrency-scoped-values/) |
| Lab 09 · Real-World Scenarios | Sections 15 + others | [Best Practices & Patterns](https://nitinkc.github.io/java/multithreading/concurrency/12-best-practices-patterns/) |

---

## Next Steps After Labs

1. **Implement mini-project**: Build a task scheduler or simple web server
2. **Code review real Java libraries** (e.g., ExecutorService implementations)
3. **Interview preparation**: Use labs to explain concepts to others
4. **Production patterns**: Apply these patterns to real codebases
5. **Read the blog series**: Each blog post has more depth and real-world examples

---

Good luck! 🚀 Work through labs systematically, and you'll master Java concurrency.
