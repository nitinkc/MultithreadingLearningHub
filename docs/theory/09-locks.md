# 09 · Locks & Advanced Synchronization

> **Level:** Intermediate
>
> **Pre-reading:** [08 · Synchronization Mechanisms](08-synchronization.md)

---

## ReentrantLock

### What Is Reentrancy?

**Reentrancy**: Same thread can acquire the same lock multiple times without deadlock.

```java
import java.util.concurrent.locks.ReentrantLock;

class Counter {
    private int count = 0;
    private final ReentrantLock lock = new ReentrantLock();
    
    void increment() {
        lock.lock();
        try {
            count++;
            incrementInternal();  // Same thread can acquire again
        } finally {
            lock.unlock();
        }
    }
    
    void incrementInternal() {
        lock.lock();  // Reentrant: same thread can acquire again
        try {
            count++;
        } finally {
            lock.unlock();  // Must unlock twice
        }
    }
}
```

### Lock with Timeout

```java
ReentrantLock lock = new ReentrantLock();

try {
    // Try to acquire, wait up to 2 seconds
    if (lock.tryLock(2, TimeUnit.SECONDS)) {
        try {
            // Critical section
        } finally {
            lock.unlock();
        }
    } else {
        System.out.println("Couldn't acquire lock");
    }
} catch (InterruptedException e) {
    Thread.currentThread().interrupt();
}
```

### Fair Lock

```java
// Guarantees FIFO ordering of waiting threads
ReentrantLock fairLock = new ReentrantLock(true);

// vs (default)
ReentrantLock unfairLock = new ReentrantLock(false);
```

### ReentrantLock vs synchronized

| Feature | ReentrantLock | synchronized |
|:--------|:-------------|:-------------|
| **Reentrancy** | ✅ | ✅ (implicit) |
| **Fairness** | Configurable | No |
| **Try-lock** | ✅ | ❌ |
| **Timeout** | ✅ | ❌ |
| **Interrupt** | ✅ | ❌ |
| **Readability** | Complex | Simple |

---

## ReadWriteLock

### Use Case

When you have **many readers** and **few writers**.

```java
import java.util.concurrent.locks.ReadWriteLock;
import java.util.concurrent.locks.ReentrantReadWriteLock;

class CachedData {
    private String data;
    private final ReadWriteLock lock = new ReentrantReadWriteLock();
    
    // Many threads can read concurrently
    String getData() {
        lock.readLock().lock();
        try {
            return data;
        } finally {
            lock.readLock().unlock();
        }
    }
    
    // Only one thread can write (exclusive)
    void setData(String newData) {
        lock.writeLock().lock();
        try {
            data = newData;
        } finally {
            lock.writeLock().unlock();
        }
    }
}
```

### Behavior

```
Multiple readers: | R1 read |---| R2 read |---| R3 read |--- (concurrent)
Exclusive writer: |---- W1 write ----|  (blocks all readers)
```

### StampedLock (Java 8+)

More efficient version, but complex:

```java
import java.util.concurrent.locks.StampedLock;

class OptimizedCache {
    private String data;
    private final StampedLock lock = new StampedLock();
    
    String getData() {
        // Optimistic read (no lock)
        long stamp = lock.tryOptimisticRead();
        String result = data;
        
        // Validate
        if (!lock.validate(stamp)) {
            // If validation failed, acquire read lock
            stamp = lock.readLock();
            try {
                result = data;
            } finally {
                lock.unlockRead(stamp);
            }
        }
        return result;
    }
}
```

---

## Semaphore

### Use Case

Control access to a **limited number of resources**.

```java
import java.util.concurrent.Semaphore;

class ConnectionPool {
    private final Semaphore semaphore;
    
    ConnectionPool(int maxConnections) {
        this.semaphore = new Semaphore(maxConnections);
    }
    
    Connection getConnection() throws InterruptedException {
        semaphore.acquire();  // Decrement, block if 0
        return new Connection();
    }
    
    void releaseConnection(Connection conn) {
        conn.close();
        semaphore.release();   // Increment, wake waiting threads
    }
}

// Usage
ConnectionPool pool = new ConnectionPool(5);

// At most 5 threads can acquire simultaneously
for (int i = 0; i < 100; i++) {
    new Thread(() -> {
        try {
            Connection conn = pool.getConnection();
            useConnection(conn);
            pool.releaseConnection(conn);
        } catch (InterruptedException e) {}
    }).start();
}
```

### Binary Semaphore (Mutex)

```java
Semaphore mutex = new Semaphore(1);  // Acts like a mutex

mutex.acquire();   // Lock
try {
    // Critical section
} finally {
    mutex.release();  // Unlock
}
```

---

## Condition Variables

### Use Case

**Coordinate threads** based on conditions.

```java
import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.ReentrantLock;

class BoundedBuffer<T> {
    private final T[] buffer;
    private int count = 0;
    
    private final ReentrantLock lock = new ReentrantLock();
    private final Condition notEmpty = lock.newCondition();
    private final Condition notFull = lock.newCondition();
    
    public BoundedBuffer(int size) {
        buffer = new Object[size];
    }
    
    void put(T item) throws InterruptedException {
        lock.lock();
        try {
            while (count == buffer.length) {  // Wait if full
                notFull.await();
            }
            buffer[count++] = item;
            notEmpty.signal();  // Signal waiting take()
        } finally {
            lock.unlock();
        }
    }
    
    T take() throws InterruptedException {
        lock.lock();
        try {
            while (count == 0) {  // Wait if empty
                notEmpty.await();
            }
            T item = buffer[--count];
            notFull.signal();  // Signal waiting put()
            return item;
        } finally {
            lock.unlock();
        }
    }
}
```

### Condition vs Object.wait()

| Feature | Condition | wait() |
|:--------|:----------|:-------|
| **Lock** | Explicit | implicit (monitor) |
| **Multiple conditions** | ✅ | ❌ (one per object) |
| **Timeout** | ✅ | ✅ |
| **Complex coordination** | ✅ | ❌ |

---

## Deadlock Prevention

### Deadlock Example

```java
class Account {
    private int balance = 100;
    
    synchronized void transfer(Account other, int amount) {
        this.balance -= amount;
        other.balance += amount;
    }
}

// Deadlock scenario
Account acc1 = new Account();
Account acc2 = new Account();

Thread t1 = new Thread(() -> acc1.transfer(acc2, 50));  // Locks acc1, waits for acc2
Thread t2 = new Thread(() -> acc2.transfer(acc1, 50));  // Locks acc2, waits for acc1
// DEADLOCK!
```

### Prevention Strategy 1: Lock Ordering

```java
class Account {
    private static final Object globalOrder = new Object();
    private int balance = 100;
    private int id;
    
    void transfer(Account other, int amount) {
        // Acquire locks in consistent order
        Account first = this.id < other.id ? this : other;
        Account second = this.id < other.id ? other : this;
        
        synchronized (first) {
            synchronized (second) {
                first.balance -= amount;
                second.balance += amount;
            }
        }
    }
}
```

### Prevention Strategy 2: Timeout

```java
class Account {
    private int balance = 100;
    private ReentrantLock lock = new ReentrantLock();
    
    void transfer(Account other, int amount) throws InterruptedException {
        if (!this.lock.tryLock(1, TimeUnit.SECONDS)) {
            throw new RuntimeException("Couldn't acquire lock");
        }
        try {
            if (!other.lock.tryLock(1, TimeUnit.SECONDS)) {
                throw new RuntimeException("Couldn't acquire lock on other");
            }
            try {
                this.balance -= amount;
                other.balance += amount;
            } finally {
                other.lock.unlock();
            }
        } finally {
            this.lock.unlock();
        }
    }
}
```

---

## Key Takeaways

| Lock Type | Use Case |
|:----------|:---------|
| **ReentrantLock** | General purpose, need timeout/fairness |
| **ReadWriteLock** | Many readers, few writers |
| **Semaphore** | Limit access to N resources |
| **Condition** | Coordinate multiple threads |
| **StampedLock** | High-performance reads |

---

## 📚 Read the Original Blog Post

For more details and examples, read:

- **[Locks & Advanced Sync](https://nitinkc.github.io/java/multithreading/concurrency/locks-and-advanced-sync/)** — ReentrantLock, ReadWriteLock, deadlock prevention

---

??? question "When should I use ReentrantLock instead of synchronized?"
    When you need timeout, fairness, or multiple condition variables. Otherwise, synchronized is simpler.

??? question "Can multiple threads hold a readLock simultaneously?"
    Yes, that's the point. ReadWriteLock allows concurrent reads, exclusive writes.

??? question "What causes deadlock?"
    Circular lock dependencies. Thread A waits for lock held by Thread B, which waits for lock held by Thread A.

---
