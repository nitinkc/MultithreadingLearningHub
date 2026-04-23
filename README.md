# README: Multithreading & Concurrency Hub

A **comprehensive, structured learning path** for mastering Java multithreading, concurrency, and modern async patterns. From beginner basics to advanced virtual threads, this hub combines theory, hands-on labs, and interview prep.

---

## 🎯 What Is This?

This is **not just another tutorial**. It's a complete learning ecosystem designed for:
- **Systematic progression**: Beginner → Intermediate → Advanced
- **Deep understanding**: Theory + practice + patterns
- **Real interviews**: 50+ common questions with answers
- **Modern Java**: Virtual threads (Java 21+), structured concurrency
- **Production patterns**: Best practices and anti-patterns

---

## 🚀 Quick Start

### Option 1: Read Online

Visit the [full documentation site](index.md) to browse theory, labs, and interview prep.

### Option 2: Local Development

```bash
# Clone repo
cd java-multithreading-hub

# Install dependencies
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# Start local server
python3 -m mkdocs serve
# → http://127.0.0.1:8000
```

### Option 3: Study Locally

Each lab file is executable Java code:

```bash
# Compile and run a lab
javac docs/labs/Lab01_solution.java
java Lab01_solution
```

---

## 📚 Learning Path

### Phase 1: Foundations (Days 1-2)

- **Read**: [01 · Concurrency vs Parallelism](docs/theory/01-foundations-concurrency.md)
- **Read**: [02 · Memory Model](docs/theory/02-memory-model.md)
- **Read**: [03 · I/O Types & Preemption](docs/theory/03-io-and-preemption.md)
- **Complete**: [Lab 01 · Thread Creation](docs/labs/01-thread-creation-lab.md)
- **Self-assess**: First 5 questions in [Interview Questions](docs/interview-questions.md)

### Phase 2: Thread Essentials (Days 3-4)

- **Read**: [04 · Thread Creation & Lifecycle](docs/theory/04-thread-creation.md)
- **Read**: [05 · Thread Control & Coordination](docs/theory/05-thread-control.md)
- **Read**: [06 · Thread Priority, Daemon & Groups](docs/theory/06-thread-priority.md)
- **Complete**: [Lab 02 · Synchronization Basics](docs/labs/02-synchronization-lab.md)
- **Review**: [Interview Q&A](docs/interview-prep.md) sections on thread creation

### Phase 3: Synchronization & Safety (Days 5-7)

- **Read**: [07 · Race Conditions](docs/theory/07-race-conditions.md)
- **Read**: [08 · Synchronization Mechanisms](docs/theory/08-synchronization.md)
- **Read**: [09 · Locks & Advanced Sync](docs/theory/09-locks.md)
- **Complete**: [Lab 03 · Locks & Deadlock Prevention](docs/labs/03-locks-lab.md)
- **Interview**: Try questions 6-10

### Phase 4: Concurrency Utilities (Days 8-10)

- **Read**: [10 · Executor Framework](docs/theory/10-executor-framework.md)
- **Read**: [11 · CompletableFuture](docs/theory/11-completable-future.md)
- **Read**: [12 · Concurrent Collections](docs/theory/12-concurrent-collections.md)
- **Complete**: Lab 04, 05, 06
- **Interview**: Try questions 11-15

### Phase 5: Modern Java (Days 11-14)

- **Read**: [13 · Virtual Threads](docs/theory/13-virtual-threads.md)
- **Read**: [14 · Structured Concurrency](docs/theory/14-structured-concurrency.md)
- **Read**: [15 · Best Practices & Patterns](docs/theory/15-best-practices.md)
- **Complete**: Lab 07, 08, 09
- **Interview**: Full [Self-Assessment Quiz](docs/interview-questions.md)

---

## 📖 Content Structure

```
docs/
├── index.md                           ← Start here
├── theory/
│   ├── 01-foundations-concurrency.md
│   ├── 02-memory-model.md
│   ├── 03-io-and-preemption.md
│   ├── 04-thread-creation.md
│   ├── 05-thread-control.md
│   ├── 06-thread-priority.md
│   ├── 07-race-conditions.md
│   ├── 08-synchronization.md
│   ├── 09-locks.md
│   ├── 10-executor-framework.md
│   ├── 11-completable-future.md
│   ├── 12-concurrent-collections.md
│   ├── 13-virtual-threads.md
│   ├── 14-structured-concurrency.md
│   └── 15-best-practices.md
├── labs/
│   ├── 00-labs-overview.md
│   ├── 01-thread-creation-lab.md      ← Complete + solution
│   ├── 02-synchronization-lab.md      ← Complete + solution
│   ├── 03-locks-lab.md
│   ├── 04-executor-lab.md
│   ├── 05-completable-future-lab.md
│   ├── 06-concurrent-collections-lab.md
│   ├── 07-virtual-threads-lab.md
│   ├── 08-structured-concurrency-lab.md
│   └── 09-real-world-lab.md
├── interview-prep.md                  ← 50+ Q&A
├── interview-questions.md             ← Self-assessment quiz
└── future/
    └── go-concurrency-roadmap.md      ← Future: Go comparison
```

---

## 🧪 Labs

Each lab includes:
- **Starter code** with TODO comments
- **Complete solution** with explanations
- **Extra exercises** to deepen learning
- **Reference** to theory sections

Labs are designed to be:
- ✅ Executable on Java 21+
- ✅ Incremental difficulty
- ✅ Hands-on practice
- ✅ Real-world relevant

---

## 🎓 Interview Preparation

### Quiz Mode

Test yourself with [50+ Q&A Interview Questions](docs/interview-prep.md):
- Fundamentals, synchronization, executors
- CompletableFuture, virtual threads
- Design patterns, anti-patterns
- Trade-off decisions

### Self-Assessment Quiz

Take the [Interactive Quiz](docs/interview-questions.md) (15 questions):
- Beginner, Intermediate, Advanced
- Get instant feedback
- Identify weak areas

### Topics Covered

- Thread creation and lifecycle
- Synchronization mechanisms
- Race conditions and deadlocks
- Executor frameworks
- Concurrent collections
- Virtual threads and structured concurrency
- Real-world patterns

---

## 🔑 Key Features

| Feature | Benefit |
|:--------|:--------|
| **Progressive Learning** | Beginner → Intermediate → Advanced |
| **Theory + Practice** | 15 theory sections + 9 labs |
| **Interview Focused** | 50+ curated questions |
| **Modern Java** | Virtual threads, structured concurrency |
| **Real Code** | Executable lab exercises |
| **Mermaid Diagrams** | Visual explanations of complex concepts |
| **Trade-off Analysis** | When to use which pattern |
| **Common Pitfalls** | What NOT to do |

---

## ✨ Highlights

### Theory Quality

- Clear definitions and explanations
- Mermaid diagrams for architecture
- Real code examples
- Why-not-just-how pedagogy

### Lab Exercises

- Progress from simple to complex
- Runnable, self-contained code
- Both starter and complete solutions
- Extra challenges for advanced learners

### Interview Prep

- Concise, practical Q&A
- Focus on trade-offs (no silver bullets)
- Common mistakes and how to avoid
- Senior-level perspective

---

## 🛠️ Technology Stack

| Component | Version | Purpose |
|:----------|:--------|:--------|
| **Java** | 21 LTS | Core language |
| **MkDocs** | 2.0+ | Static site generation |
| **Mermaid** | 10+ | Diagrams |
| **MathJax** | 3+ | Math notation |
| **Markdown** | GitHub-flavored | Content format |

---

## 📝 Content Principles

- **Breadth first, depth available**: Each section covers concepts, then links to deep dives
- **Query-first design**: "What problem does this solve?" before "How does it work?"
- **Production focus**: Not just theory; real-world patterns
- **Assume competence**: For experienced developers; skip basics
- **No silver bullets**: Each pattern has trade-offs

---

## 🚗 Roadmap

### Current (Phase 1)

- ✅ 15 theory modules
- ✅ 9 labs (2 complete + solutions, 7 structured)
- ✅ 50+ interview Q&A
- ✅ MkDocs site with Mermaid diagrams

### Future (Phase 2)

- 🔲 Go concurrency comparison (goroutines vs virtual threads)
- 🔲 When to pick Go vs Java
- 🔲 Performance benchmarks
- 🔲 Advanced lab solutions with videos
- 🔲 Concurrency in popular frameworks (Spring, Quarkus)

---

## 🤝 Contributing

This hub is designed for learning and growth. Contributions welcome:
- Found an error? Open an issue or PR
- Have a better explanation? Let's improve it
- Want to add a lab? Great! Follow the structure
- Feedback on difficulty/pacing? Appreciate it!

---

## 📖 Recommended Reading

**Before/alongside this hub:**
- "Effective Java" (Joshua Bloch) — Chapter on Concurrency
- "Java Concurrency in Practice" (Brian Goetz) — Deep reference
- Official [Java Concurrency Documentation](https://docs.oracle.com/en/java/javase/21/)

**After mastering this hub:**
- Study real frameworks (Spring's TaskExecutor, Vert.x)
- Implement a production service using virtual threads
- Review open-source concurrency code (Java Collections Framework, etc.)

---

## 📝 Blog Series Reference

These theory modules are based on the comprehensive blog series at **[nitinkc.github.io/java/multithreading/concurrency/](https://nitinkc.github.io/java/multithreading/concurrency/)**

### Complete Blog Post Series

- **[Series Overview](https://nitinkc.github.io/java/multithreading/concurrency/series-overview/)** — Complete roadmap of all topics
- **[Theory & Fundamentals](https://nitinkc.github.io/java/multithreading/concurrency/theory-and-fundamentals/)** — Foundations (Sections 01-02)
- **[Thread Creation Methods](https://nitinkc.github.io/java/multithreading/concurrency/thread-creation-methods/)** — Section 04
- **[Thread Control & Coordination](https://nitinkc.github.io/java/multithreading/concurrency/thread-control-coordination/)** — Section 05
- **[Race Conditions & Critical Sections](https://nitinkc.github.io/java/multithreading/concurrency/race-conditions-critical-sections/)** — Section 07
- **[Synchronization Mechanisms](https://nitinkc.github.io/java/multithreading/concurrency/synchronization-mechanisms/)** — Section 08
- **[Locks & Advanced Sync](https://nitinkc.github.io/java/multithreading/concurrency/locks-and-advanced-sync/)** — Section 09
- **[Executor Framework](https://nitinkc.github.io/java/multithreading/concurrency/executor-framework/)** — Section 10
- **[CompletableFuture Mastery](https://nitinkc.github.io/java/multithreading/concurrency/completable-future-mastery/)** — Section 11
- **[Concurrent Collections](https://nitinkc.github.io/java/multithreading/concurrency/concurrent-collections/)** — Section 12
- **[Virtual Threads](https://nitinkc.github.io/java/multithreading/concurrency/virtual-threads/)** — Section 13
- **[Structured Concurrency & Scoped Values](https://nitinkc.github.io/java/multithreading/concurrency/structured-concurrency-scoped-values/)** — Section 14
- **[Best Practices & Patterns](https://nitinkc.github.io/java/multithreading/concurrency/best-practices-patterns/)** — Section 15

Each hub theory section links back to the corresponding blog post for additional context and detailed examples.

---

## ❓ FAQ

**Q: Do I need Java 21 to learn?**
A: Most labs work on Java 8+. Virtual threads (Lab 7-8) require Java 21+. Recommend Java 21 for full experience.

**Q: How long does it take?**
A: 2-4 weeks for beginner → advanced, depending on pace. 1 week for intermediate developers.

**Q: Can I learn this without a CS degree?**
A: Yes. This hub explains concepts from first principles. No advanced CS background assumed.

**Q: Is this enough for interviews?**
A: Yes. Covers 95% of concurrency questions in typical tech interviews. Combine with company-specific tech stack review.

**Q: How do I practice between labs?**
A: Implement small projects (task scheduler, web server, producer-consumer pipeline) using patterns learned.

---

## 📞 Support

- 🔍 Search the documentation
- 📖 Review theory section for concept clarification
- 💻 Try the lab exercises
- 🎯 Check the interview Q&A for similar questions
- 📚 Reference "Java Concurrency in Practice" for deeper dives

---

## 📄 License

This learning hub is provided as-is for educational purposes. Use freely, share, adapt. Attribution appreciated.

---

## 🎉 Getting Started

1. **[Read the Overview](index.md)**
2. **[Start with Theory 01](docs/theory/01-foundations-concurrency.md)**
3. **[Complete Lab 01](docs/labs/01-thread-creation-lab.md)**
4. **[Progress systematically](index.md#-learning-path-recommendations)**
5. **[Prep for interviews](docs/interview-prep.md)**

---

**Ready to master Java concurrency? Let's go! 🚀**
