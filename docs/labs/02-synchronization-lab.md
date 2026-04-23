# Lab 2 · Synchronization Basics

> **Difficulty:** Beginner
> **Time:** 45 minutes
> **Topics:** Synchronized, volatile, race conditions, Atomic types

---

## Objectives

- ✅ Reproduce a race condition
- ✅ Fix with synchronized keyword
- ✅ Fix with volatile
- ✅ Fix with AtomicInteger

---

## Starter Code

```java
public class Lab02Synchronization {
    
    // Exercise 1: Demonstrate race condition
    static class Counter {
        public int count = 0;  // Shared, not synchronized
        
        public void increment() {
            count++;  // NOT atomic!
        }
    }
    
    static void exercise1_RaceCondition() {
        Counter counter = new Counter();
        Thread[] threads = new Thread[10];
        
        for (int i = 0; i < 10; i++) {
            threads[i] = new Thread(() -> {
               for (int j = 0; j < 10000; j++) {
                   counter.increment();
               }
            });
        }
        
        // TODO: Start all threads
        // TODO: Join all threads
        // TODO: Print final count (should be 100000, but won't be!)
    }
    
    // Exercise 2: Fix with synchronized
    static class CounterSynchronized {
        private int count = 0;
        
        public synchronized void increment() {
            count++;
        }
        
        public synchronized int getCount() {
            return count;
        }
    }
    
    static void exercise2_WithSynchronized() {
        // TODO: Repeat exercise 1 with CounterSynchronized
        // Result should be exactly 100000
    }
    
    // Exercise 3: Fix with volatile (won't work for increment!)
    static class CounterVolatile {
        public volatile int count = 0;
        
        public void increment() {
            count++;  // Still NOT atomic, but visibility is guaranteed
        }
    }
    
    static void exercise3_WithVolatile() {
        // TODO: Repeat with CounterVolatile
        // Result will still be wrong - volatile doesn't help with ++
    }
    
    // Exercise 4: Fix with AtomicInteger (The right way)
    static void exercise4_WithAtomicInteger() {
        java.util.concurrent.atomic.AtomicInteger counter = new java.util.concurrent.atomic.AtomicInteger(0);
        Thread[] threads = new Thread[10];
        
        for (int i = 0; i < 10; i++) {
            threads[i] = new Thread(() -> {
                for (int j = 0; j < 10000; j++) {
                    counter.incrementAndGet();  // Atomic
                }
            });
        }
        
        // TODO: Start, join, print (should be 100000)
    }
    
    public static void main(String[] args) throws InterruptedException {
        System.out.println("=== Lab 02: Synchronization Basics ===\n");
        
        exercise1_RaceCondition();
        exercise2_WithSynchronized();
        exercise3_WithVolatile();
        exercise4_WithAtomicInteger();
    }
}
```

---

## Key Concepts

- **Race Condition**: `count++` is three operations: read, add, write
- **Synchronized**: Only one thread in critical section at a time
- **Volatile**: Visibility, but not atomicity
- **Atomic**: Lock-free atomicity using CAS

---

## References

- [Race Conditions & Critical Sections](../theory/07-race-conditions.md)
- [Synchronization Mechanisms](../theory/08-synchronization.md)

---
