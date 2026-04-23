# Lab 1 · Thread Creation & Lifecycle

> **Difficulty:** Beginner
> **Time:** 30 minutes
> **Topics:** Runnable, Callable, Thread states, Thread names

---

## Objectives

- ✅ Create threads using Runnable and Callable
- ✅ Observe thread lifecycle states
- ✅ Work with Futures and results
- ✅ Handle InterruptedException properly

---

## Starter Code

```java
public class Lab01ThreadCreation {
    
    // Exercise 1: Create thread using Runnable
    static void exercise1_RunableThread() {
        // TODO: Create a Runnable that prints "Hello from Runnable"
        // TODO: Create a Thread with that Runnable
        // TODO: Call start() and observe the output
    }
    
    // Exercise 2: Create thread using Callable
    static void exercise2_CallableThread() {
        // TODO: Create a Callable<String> that returns "Hello from Callable"
        // TODO: Wrap it in an ExecutorService
        // TODO: Submit it and get the result using Future.get()
    }
    
    // Exercise 3: Observe thread lifecycle states
    static void exercise3_ThreadStates() {
        final Thread[] threadRef = new Thread[1];
        
        Thread stateObserver = new Thread(() -> {
            for (int i = 0; i < 10; i++) {
                // TODO: Print thread name and state
                // TODO: Sleep between checks
            }
        });
        
        threadRef[0] = new Thread(() -> {
            try {
                Thread.sleep(2000);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        });
        
        threadRef[0].setName("sleeper");
        // TODO: Start both threads and observe state transitions
    }
    
    // Exercise 4: Named threads and IDs
    static void exercise4_ThreadInfo() {
        // TODO: Create 3 named threads
        // TODO: Print each thread's name, ID, priority, and state
        // TODO: Show that IDs are unique
    }
    
    public static void main(String[] args) throws InterruptedException {
        System.out.println("=== Lab 01: Thread Creation & Lifecycle ===\n");
        
        exercise1_RunableThread();
        System.out.println();
        
        exercise2_CallableThread();
        System.out.println();
        
        exercise3_ThreadStates();
        System.out.println();
        
        exercise4_ThreadInfo();
    }
}
```

---

## Solution Guide

### Exercise 1: Runnable Thread

```java
static void exercise1_RunableThread() {
    Runnable task = () -> {
        System.out.println("Hello from Runnable");
        System.out.println("Running in: " + Thread.currentThread().getName());
    };
    
    Thread thread = new Thread(task);
    thread.setName("runnable-thread");
    thread.start();
    
    try {
        thread.join();  // Wait for thread to finish
    } catch (InterruptedException e) {
        Thread.currentThread().interrupt();
    }
}
```

### Exercise 2: Callable Thread

```java
static void exercise2_CallableThread() throws InterruptedException, ExecutionException {
    ExecutorService executor = Executors.newSingleThreadExecutor();
    
    Callable<String> task = () -> {
        Thread.sleep(500);
        return "Hello from Callable";
    };
    
    Future<String> future = executor.submit(task);
    String result = future.get();  // Blocks until result available
    System.out.println(result);
    
    executor.shutdown();
}
```

### Exercise 3: Thread States

```java
static void exercise3_ThreadStates() throws InterruptedException {
    final Thread[] threadRef = new Thread[1];
    
    Thread stateObserver = new Thread(() -> {
        for (int i = 0; i < 10; i++) {
            Thread observed = threadRef[0];
            if (observed != null) {
                System.out.println("Thread: " + observed.getName() + 
                                   " | State: " + observed.getState() + 
                                   " | Alive: " + observed.isAlive());
            }
            try {
                Thread.sleep(300);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
    });
    
    threadRef[0] = new Thread(() -> {
        try {
            System.out.println("Sleeper thread started");
            Thread.sleep(2000);
            System.out.println("Sleeper thread ending");
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    });
    
    threadRef[0].setName("sleeper");
    
    stateObserver.start();
    threadRef[0].start();
    
    stateObserver.join();
    threadRef[0].join();
}
```

### Exercise 4: Thread Info

```java
static void exercise4_ThreadInfo() {
    Thread[] threads = new Thread[3];
    for (int i = 0; i < 3; i++) {
        final int index = i;
        threads[i] = new Thread(() -> {
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {}
        });
        threads[i].setName("worker-" + i);
        threads[i].setPriority(Thread.NORM_PRIORITY + (i - 1));
    }
    
    for (Thread t : threads) {
        t.start();
        System.out.println("Thread: " + t.getName() + 
                           " | ID: " + t.threadId() + 
                           " | Priority: " + t.getPriority() + 
                           " | State: " + t.getState());
    }
    
    for (Thread t : threads) {
        t.join();
    }
}
```

---

## Key Learnings

1. **Runnable vs Callable**: Callable returns a value, Runnable doesn't
2. **Thread states**: NEW → RUNNABLE → (BLOCKED/WAITING/TIMED_WAITING) → TERMINATED
3. **join()**: Wait for a thread to finish (blocks caller)
4. **Thread naming**: Helps debugging multi-threaded applications
5. **InterruptedException**: Must handle or propagate properly

---

## Exercises to Try

1. **Modify Exercise 1** to create 5 threads and see their interleaved output
2. **Modify Exercise 2** to submit 10 Callables and collect all results
3. **Modify Exercise 3** to track state transitions over longer period
4. **Add Exception Handling** to exercise 2 for timeout scenarios

---

## References

- [Thread Creation & Lifecycle](../theory/04-thread-creation.md)
- [Thread Control & Coordination](../theory/05-thread-control.md)

---
