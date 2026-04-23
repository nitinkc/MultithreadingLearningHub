# 07 · Race Conditions & Critical Sections

> **Level:** Intermediate
>
> **Pre-reading:** [02 · Memory Model](02-memory-model.md)

---

## Shared Resources & Access

### What Can Be Shared?

- **Class-level variables**
- **Instance variables in shared objects**
- **Static variables**
- **Heap-allocated objects**
- **File handles, sockets**

**Stack-local variables are NOT shared:**
```java
void threadSafeLocalVar() {
    int x = 0;  // Local to this method
    // Each thread has its own copy on its stack
    // NOT a race condition
}
```

---

## Race Conditions

### Definition

A **race condition** occurs when:

1. Multiple threads access **shared mutable data**
2. **Without synchronization**
3. At least one thread **modifies** the data

Result: Non-deterministic behavior; outcome depends on timing.

### Example: Counter Race Condition

```java
class Counter {
    private int count = 0;  // Shared
    
    void increment() {
        count++;  // Three steps: read, add, write
    }
    
    int getCount() {
        return count;
    }
}

// Usage with race condition
Counter counter = new Counter();

Thread t1 = new Thread(() -> {
    for (int i = 0; i < 1000; i++) {
        counter.increment();  // Expected: 1000
    }
});

Thread t2 = new Thread(() -> {
    for (int i = 0; i < 1000; i++) {
        counter.increment();  // Expected: 1000
    }
});

t1.start();
t2.start();
t1.join();
t2.join();

System.out.println(counter.getCount());
// Output: NOT 2000 (e.g., 1856)  ← Race condition!
```

### Interleaving: How Race Conditions Happen

```
Time  | Thread 1         | count | Thread 2
------|------------------|-------|------------------
t1    | read count = 5   | 5     |
t2    |                  | 5     | read count = 5
t3    | add 1 (= 6)      | 5     |
t4    |                  | 5     | add 1 (= 6)
t5    | write count = 6  | 6     |
t6    |                  | 6     | write count = 6
------|------------------|-------|------------------
      | LOST UPDATE!     | 6     | count should be 7!
```

---

## Atomic Operations

### Definition

An **atomic operation** completes in a single indivisible step **relative to other threads**.

### Atomic by Default in Java

- ✅ Read/write **primitive types** (except long, double)
- ✅ Read/write **references**
- ✅ Read/write **volatile long and double**

### NOT Atomic

- ❌ `count++` (three steps: read, add, write)
- ❌ `list.add(item)` then `counter++` (multiple operations)
- ❌ Non-volatile `long` and `double`

### Non-Atomic `long` and `double`

```java
class Holder {
    private long value = 0;  // NOT atomic by default
    
    void setValue(long v) {
        // Write might be split into 2 x 32-bit writes
        // Thread might see partially written value
        value = v;
    }
    
    long getValue() {
        return value;  // Might see partially written value
    }
}

// Fix: Make it volatile
class HolderFixed {
    private volatile long value = 0;  // Atomic now
}
```

---

## Data Races

### Definition

A **data race** occurs when:

- Two accesses to the same memory location
- On different threads
- At least one is a write
- **Without synchronization**

```java
class DataRaceExample {
    private int x = 0;  // Shared, not volatile
    
    void write() {
        x = 42;  // Write without synchronization
    }
    
    int read() {
        return x;  // Read without synchronization
    }
}

// Usage
DataRaceExample example = new DataRaceExample();

// Thread 1 writes
new Thread(() -> example.write()).start();

// Thread 2 reads
new Thread(() -> {
    int value = example.read();
    System.out.println("Value: " + value);
    // Might see 0 or 42 (race condition!)
}).start();
```

### Data Race vs Race Condition

| Aspect | Data Race | Race Condition |
|:-------|:----------|:---------------|
| **Definition** | Unsynchronized access to shared memory | Non-deterministic outcome from timing |
| **Visibility** | Stale values due to caching | Wrong result due to interleaving |
| **Example** | `int x` without volatile | `count++` without sync |
| **Scope** | Memory access level | Application logic level |

Every data race is a race condition, but not every race condition is a data race.

---

## Critical Section

### Definition

A **critical section** is a code segment that:

- Accesses **shared mutable data**
- Must execute **atomically** (without interference)

### Using `synchronized` to Protect Critical Section

```java
class Counter {
    private int count = 0;
    
    synchronized void increment() {  // Critical section
        // Only one thread can execute here at a time
        count++;
    }
    
    synchronized int getCount() {
        return count;  // Also critical section
    }
}

// Usage - now safe
Counter counter = new Counter();

Thread t1 = new Thread(() -> {
    for (int i = 0; i < 1000; i++) {
        counter.increment();
    }
});

Thread t2 = new Thread(() -> {
    for (int i = 0; i < 1000; i++) {
        counter.increment();
    }
});

t1.start();
t2.start();
t1.join();
t2.join();

System.out.println(counter.getCount());
// Output: 2000 ✅ Correct!
```

### Fine-Grained vs Coarse-Grained Locking

**Coarse-Grained (Simple but Slow):**
```java
class BankAccount {
    private int balance = 1000;
    
    synchronized void withdraw(int amount) {  // Locks whole object
        balance -= amount;
    }
    
    synchronized void deposit(int amount) {
        balance += amount;
    }
    
    synchronized int getBalance() {
        return balance;
    }
}
```

**Fine-Grained (Complex but Faster):**
```java
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

class BankAccount {
    private int balance = 1000;
    private final Lock lock = new ReentrantLock();
    
    void withdraw(int amount) {
        lock.lock();  // Lock only for critical section
        try {
            balance -= amount;
        } finally {
            lock.unlock();
        }
    }
    
    void deposit(int amount) {
        lock.lock();
        try {
            balance += amount;
        } finally {
            lock.unlock();
        }
    }
}
```

---

## Key Takeaways

| Concept | Definition |
|:--------|:-----------|
| **Race Condition** | Non-deterministic outcome due to unsynchronized access |
| **Data Race** | Unsynchronized access to same memory location |
| **Atomic Operation** | Indivisible operation (no interleaving possible) |
| **Critical Section** | Code that must execute atomically |
| **Synchronization** | Mechanism to prevent simultaneous access |

---

## 📚 Read the Original Blog Post

For more details and examples, read:

- **[Race Conditions & Critical Sections](https://nitinkc.github.io/java/multithreading/concurrency/race-conditions-critical-sections/)** — Understanding shared state hazards

---

??? question "What's the difference between a race condition and data race?"
    Data race: unsynchronized memory access. Race condition: non-deterministic outcome. A data race can cause, but isn't equivalent to, a race condition.

??? question "Is `count++` really not atomic?"
    Correct. It's actually three operations: read count, add 1, write back. Threads can interleave between these steps.

??? question "Can I have a race condition if I use volatile?"
    Yes. volatile ensures visibility but not atomicity. `volatile count++` is still a race condition.

---
