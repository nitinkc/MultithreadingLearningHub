# Java Multithreading & Concurrency Hub

Welcome to the **comprehensive learning path** for mastering Java multithreading, concurrency, and modern async patterns. This hub combines **theory**, **hands-on labs**, and **interview prep** in a structured progression from beginner to advanced.

---

## 🎯 What You'll Learn

| Phase | Topics | Labs |
|:------|:-------|:-----|
| **Foundations** | Concurrency vs Parallelism, Process vs Thread, Memory Model, I/O Types | Understanding fundamentals |
| **Thread Essentials** | Thread Creation, Lifecycle, Control, Priority, Daemon Threads | Creating and managing threads |
| **Synchronization** | Race Conditions, synchronized, volatile, Atomic Types | Preventing data corruption |
| **Locks & Coordination** | ReentrantLock, ReadWriteLock, Semaphore, Deadlock Prevention | Advanced synchronization |
| **Concurrency Utilities** | Executor Framework, Thread Pools, Future, CompletableFuture | Modern async programming |
| **Collections** | ConcurrentHashMap, CopyOnWriteArrayList, BlockingQueue | Thread-safe data structures |
| **Modern Java** | Virtual Threads (Loom), Structured Concurrency, Scoped Values | Next-generation concurrency |
| **Best Practices** | Patterns, Anti-patterns, Common Pitfalls, Interview Q&A | Production-ready code |

---

## � Blog Series

This hub is based on the **[Complete Java Multithreading Blog Series](https://nitinkc.github.io/java/multithreading/concurrency/series-overview/)** at **nitinkc.github.io**.

✨ **Each theory section links to the original detailed blog post** for deeper exploration and additional examples.

---

## �🚀 Quick Start

### Setup

```bash
# Clone or download this hub
cd java-multithreading-hub

# Install dependencies (MkDocs + plugins)
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# Start local server (hot reload)
python3 -m mkdocs serve
# → http://127.0.0.1:8000
```

### Learning Path Recommendations

**🟢 Beginner (1-2 weeks):**

- Read: Foundations → Thread Essentials (Sections 01-06)
- Labs: Lab 1, Lab 2
- Practice: Repeat lab exercises 2-3 times

**🟡 Intermediate (2-3 weeks):**

- Read: Synchronization & Safety (Sections 07-09)
- Labs: Lab 3, Lab 4, Lab 5
- Practice: Implement mini-project using Executor + CompletableFuture

**🔴 Advanced (1-2 weeks):**

- Read: Concurrent Utilities → Best Practices (Sections 10-15)
- Labs: Lab 6, Lab 7, Lab 8, Lab 9
- Practice: Design a high-concurrency system (e.g., task scheduler)

---

## 📚 Theory Structure

### Foundations (Sections 01-03)
- **01 · Concurrency vs Parallelism**: Understand the core distinction
- **02 · Memory Model**: How threads see and share data
- **03 · I/O Types & Preemption**: Blocking vs Non-blocking, Preemption

### Thread Fundamentals (Sections 04-06)
- **04 · Thread Creation & Lifecycle**: Runnable, Callable, Thread States
- **05 · Thread Control**: sleep(), yield(), join(), interrupt()
- **06 · Priority & Groups**: Thread priority, daemon threads, thread groups

### Synchronization & Safety (Sections 07-09)
- **07 · Race Conditions**: Atomic operations, data races, critical sections
- **08 · Synchronization Basics**: synchronized blocks, volatile, Atomic types
- **09 · Locks & Advanced Sync**: Reentrant, ReadWrite, Semaphore, Condition Variables

### Concurrent Utilities (Sections 10-12)
- **10 · Executor Framework**: Thread pools, submit/invoke patterns
- **11 · CompletableFuture**: Async pipelines, combining, exception handling
- **12 · Concurrent Collections**: ConcurrentHashMap, CopyOnWriteArrayList, BlockingQueues

### Advanced Topics (Sections 13-15)
- **13 · Virtual Threads**: Project Loom, lightweight threads, continuations
- **14 · Structured Concurrency**: StructuredTaskScope, Scoped Values, ThreadLocal
- **15 · Best Practices**: Patterns, anti-patterns, real-world trade-offs

---

## 🧪 Labs Overview

All labs are **executable, incremental**, and build foundational knowledge:

| Lab | Title | Focus | Difficulty |
|:----|:------|:------|:----------|
| **Lab 1** | Thread Creation & Lifecycle | Runnable, Thread states, lifecycle hooks | Beginner |
| **Lab 2** | Synchronization Basics | synchronized blocks, volatile, race conditions | Beginner |
| **Lab 3** | Locks & Deadlock Prevention | ReentrantLock, timeouts, deadlock recovery | Intermediate |
| **Lab 4** | Executor Framework | Thread pools, submit, shutdown patterns | Intermediate |
| **Lab 5** | CompletableFuture | Async chains, combining, exception handling | Intermediate |
| **Lab 6** | Concurrent Collections | ConcurrentHashMap, CopyOnWriteArrayList | Intermediate |
| **Lab 7** | Virtual Threads Basics | Creating, running, benefits over platform threads | Advanced |
| **Lab 8** | Structured Concurrency | StructuredTaskScope, scope management, scoped values | Advanced |
| **Lab 9** | Real-World Scenarios | Web request handler, task scheduler, producer-consumer | Advanced |

---

## 🎓 Interview Preparation

- **Interview Q&A**: 50+ curated questions covering fundamentals to advanced topics
- **Self-Assessment**: Quiz yourself on key concepts, identify weak areas
- **Trade-Off Analysis**: Understand when to pick which pattern
- **Common Mistakes**: Avoid pitfalls that experienced developers still make

[Start Interview Prep →](interview-prep.md)

---

## 🔮 Future Additions

### Go Concurrency Comparison (Roadmap)

We're planning to add a **Go Programming** section that will cover:

- **Goroutines vs Virtual Threads**: Architecture, performance, scalability
- **Channels vs Queues**: Communication patterns
- **Go's select vs Java's patterns**: Flow control
- **When to Pick Go vs Java**: Use case analysis

[View Go Roadmap →](future/go-concurrency-roadmap.md)

---

## 📖 How to Use This Hub

1. **Choose your level**: Beginner? Start with Foundations. Experienced? Jump to Advanced.
2. **Read theory section**: Understand concepts, terminology, trade-offs
3. **Study diagrams**: Mermaid diagrams visualize architecture and flows
4. **Do the lab**: Hands-on practice with real code
5. **Review interview Q&A**: Test your understanding
6. **Revisit**: Come back for quick revision before interviews

---

## 💡 Key Principles

- **Breadth + Depth**: Each section covers breadth first, then deep-dives
- **Query-First Learning**: Start with "what problem does this solve?"
- **Progressive Complexity**: Beginner → Intermediate → Advanced
- **Production-Ready Patterns**: Not just theory, but real-world usage
- **Interview-Focused**: Every concept mapped to common interview questions

---

## 🛠️ Technology Stack

| Component | Version | Purpose |
|:----------|:--------|:--------|
| **Java** | 21+ (for virtual threads) | Core language |
| **JDK** | 21 LTS | Standard library, stdlib |
| **Maven/Gradle** | Latest | Build tools (for labs) |
| **MkDocs** | 2.0+ | Documentation |
| **Mermaid** | 10+ | Diagrams |
| **MathJax** | 3+ | Mathematical notation |

---

## 📝 Content Style

- **Senior-to-Senior**: Skip basics, focus on trade-offs and production patterns
- **Problem-First**: "Why does this exist?" before "How does it work?"
- **Concrete Examples**: Real code, not pseudocode
- **Clear Trade-Offs**: No silver bullets — understand costs

---

## 🤝 Contributing & Feedback

This hub was created to consolidate and organize multithreading knowledge. If you find errors or have suggestions, please reach out.

---

## 📚 References & Credits

- [Java Platform Documentation](https://docs.oracle.com/en/java/javase/21/)
- [Project Loom (Virtual Threads) - JEP 444](https://openjdk.org/jeps/444)
- [Structured Concurrency - JEP 453](https://openjdk.org/jeps/453)
- [The Java Memory Model - Brian Goetz](https://www.infoq.com/articles/java-memory-model-basics/)
- [Effective Java - Joshua Bloch](https://www.oreilly.com/library/view/effective-java-3rd/9780134685991/)

---

**Happy learning! 🚀**
