# 05 · Thread Control & Coordination

> **Level:** Beginner
>
> **Pre-reading:** [04 · Thread Creation & Lifecycle](04-thread-creation.md)

---

## Thread.sleep()

**Definition**: Pauses the **current thread** for a specified duration.

### Key Characteristics

- **Releases CPU** but **NOT locks**
- Thread goes to **TIMED_WAITING** state
- Guaranteed **minimum** sleep time (may sleep longer)
- Throws `InterruptedException`

### Usage

```java
// Basic sleep
try {
    Thread.sleep(1000);  // Sleep 1 second (milliseconds)
} catch (InterruptedException e) {
    Thread.currentThread().interrupt();  // Restore interrupt flag
}

// Using TimeUnit (more readable)
try {
    TimeUnit.SECONDS.sleep(2);
    TimeUnit.MILLISECONDS.sleep(500);
} catch (InterruptedException e) {
    Thread.currentThread().interrupt();
}

// Duration API (Java 9+)
try {
    Thread.sleep(Duration.ofSeconds(2));
} catch (InterruptedException e) {
    Thread.currentThread().interrupt();
}
```

### Important: Does NOT Release Locks

```java
synchronized (lock) {
    System.out.println("Holding lock");
    Thread.sleep(5000);  // ❌ STILL holding lock while sleeping
    // Other threads CANNOT access this synchronized block
} 
```

---

## Thread.yield()

**Definition**: Voluntarily yields CPU time to other threads of the **same priority**.

### Characteristics

- **Hint to scheduler** (not guaranteed)
- Thread remains in **RUNNABLE** state
- Does NOT release locks
- Use case: Fairness between equal-priority threads

### Usage

```java
// Fairness in long computation
for (int i = 0; i < 1000000; i++) {
    if (i % 1000 == 0) {
        Thread.yield();  // Give other threads a chance
    }
    doWork();
}
```

### Yield vs Sleep

| Aspect | yield() | sleep(ms) |
|:-------|:--------|:---------|
| **Duration** | No wait | Exact wait |
| **State** | RUNNABLE | TIMED_WAITING |
| **Effect** | Hint to scheduler | Guaranteed pause |
| **Guaranteed?** | No | Yes |

---

## Thread.join()

**Definition**: Current thread **waits** for another thread to finish.

### Usage

```java
Thread worker = new Thread(() -> {
    System.out.println("Worker starting");
    try { Thread.sleep(2000); } catch (InterruptedException e) {}
    System.out.println("Worker done");
});

worker.start();

System.out.println("Main waiting...");
try {
    worker.join();  // Main thread blocks here until worker finishes
} catch (InterruptedException e) {
    Thread.currentThread().interrupt();
}

System.out.println("Main continuing (worker finished)");
```

**Output:**
```
Worker starting
Main waiting...
(2 second wait)
Worker done
Main continuing (worker finished)
```

### Timed Join

```java
Thread worker = new Thread(() -> {
    try { Thread.sleep(5000); } catch (InterruptedException e) {}
});
worker.start();

try {
    boolean finished = worker.join(2000);  // Wait max 2 seconds
    if (finished) {
        System.out.println("Worker finished");
    } else {
        System.out.println("Worker still running");
    }
} catch (InterruptedException e) {
    Thread.currentThread().interrupt();
}
```

---

## Thread.interrupt()

**Definition**: Request a thread to **stop** what it's doing. Not forced termination.

### How It Works

1. Sets a thread's **interrupt flag**
2. If thread is blocked (sleep/wait), throws `InterruptedException`
3. Thread must check and handle it

### Usage

```java
Thread worker = new Thread(() -> {
    try {
        while (!Thread.currentThread().isInterrupted()) {
            System.out.println("Working...");
            Thread.sleep(1000);
        }
    } catch (InterruptedException e) {
        System.out.println("Interrupted!");
        Thread.currentThread().interrupt();  // Restore flag
    }
});

worker.start();

// Let it work for a bit
try { Thread.sleep(2500); } catch (InterruptedException e) {}

// Request stop
worker.interrupt();

try {
    worker.join();  // Wait for clean shutdown
} catch (InterruptedException e) {
    Thread.currentThread().interrupt();
}
```

### Checking Interrupt Status

```java
// Check without clearing flag
boolean interrupted = Thread.currentThread().isInterrupted();

// Check and clear flag
boolean wasInterrupted = Thread.interrupted();  // Static method
```

### Best Practice: Cancellation Pattern

```java
class CancellableTask extends Thread {
    @Override
    public void run() {
        try {
            while (!Thread.currentThread().isInterrupted()) {
                // Do work
                Thread.sleep(100);
            }
        } catch (InterruptedException e) {
            // Cleanup on interruption
            System.out.println("Task cancelled");
            Thread.currentThread().interrupt();
        }
    }
}

// Usage
CancellableTask task = new CancellableTask();
task.start();

// Cancel later
task.interrupt();
task.join();  // Wait for graceful shutdown
```

---

## Thread Priority

### Priority Constants

```java
Thread.MIN_PRIORITY   = 1
Thread.NORM_PRIORITY  = 5  // Default
Thread.MAX_PRIORITY   = 10
```

### Setting Priority

```java
Thread thread = new Thread(() -> System.out.println("Working"));

thread.setPriority(Thread.MAX_PRIORITY);   // 10 (most urgent)
thread.setPriority(Thread.NORM_PRIORITY);  // 5 (default)
thread.setPriority(Thread.MIN_PRIORITY);   // 1 (least urgent)

int priority = thread.getPriority();
```

### Priority Inheritance

- **Default priority**: 5 (NORM_PRIORITY)
- **Child threads inherit** parent's priority
- With same priority: execution order is **undeterministic**

### Important Caveats

⚠️ **Priority is just a HINT:**

- Different OSes handle priorities differently
- No guarantee that high-priority thread runs first
- Don't rely on priority for correctness

```java
// ❌ WRONG: Relying on priority for correctness
Thread t1 = new Thread(() -> System.out.println("1"));
Thread t2 = new Thread(() -> System.out.println("2"));

t1.setPriority(Thread.MAX_PRIORITY);
t2.setPriority(Thread.MIN_PRIORITY);

t1.start();
t2.start();

// Output might be: 2, 1 (not guaranteed order)
```

---

## Coordinating Multiple Threads

### Pattern 1: Wait-Notify

```java
class BoundedBuffer {
    private final int[] buffer = new int[5];
    private int count = 0;
    
    synchronized void put(int value) throws InterruptedException {
        while (count == buffer.length) {            // Wait if full
            wait();  // Release lock, wait
        }
        buffer[count++] = value;
        notifyAll();  // Wake blocked threads
    }
    
    synchronized int take() throws InterruptedException {
        while (count == 0) {                        // Wait if empty
            wait();
        }
        int value = buffer[--count];
        notifyAll();
        return value;
    }
}
```

### Pattern 2: Countdown Latch

```java
import java.util.concurrent.CountDownLatch;

CountDownLatch latch = new CountDownLatch(3);

// Start 3 threads
for (int i = 0; i < 3; i++) {
    new Thread(() -> {
        System.out.println("Task starting");
        doWork();
        latch.countDown();  // Signal completion
    }).start();
}

// Main thread waits
latch.await();  // Blocks until count reaches 0
System.out.println("All tasks done");
```

### Pattern 3: CyclicBarrier

```java
import java.util.concurrent.CyclicBarrier;

CyclicBarrier barrier = new CyclicBarrier(3);  // 3 threads

for (int i = 0; i < 3; i++) {
    new Thread(() -> {
        System.out.println("Thread ready");
        barrier.await();  // Wait for all 3 threads
        System.out.println("All ready, go!");
    }).start();
}
```

---

## Key Takeaways

| Method | Purpose | Releases Locks? |
|:-------|:--------|:----------------|
| **sleep()** | Pause for duration | ❌ No |
| **yield()** | Hint scheduler | ❌ No (already released) |
| **join()** | Wait for thread finish | ✅ Yes (implicit) |
| **interrupt()** | Request cancellation | ✅ Throws exception |
| **wait()** | Coordinate with monitor | ✅ Yes |

---

## 📚 Read the Original Blog Post

For more details and examples, read:

- **[Thread Control & Coordination](https://nitinkc.github.io/java/multithreading/concurrency/03-thread-control-coordination/)** — Thread lifecycle methods explained

---

??? question "Why does sleep() not release locks?"
    By design. If it released locks, other threads could modify data you're protecting, causing race conditions.

??? question "What's the difference between join() and wait()?"
    join() waits for a specific thread to finish. wait() releases the lock and waits for notify() from any thread.

??? question "Should I use Thread.stop()?"
    No. It's deprecated. Use interrupt() and check isInterrupted() instead.

---
