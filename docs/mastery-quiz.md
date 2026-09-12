# Mastery Quiz by Section

## 01 · Concurrency vs Parallelism & Process vs Thread


<quiz>
On a single-core machine, two threads both make progress during the same second. Which is necessarily true?
- [ ] A) They ran in parallel
- [x] B) They ran concurrently
- [ ] C) They shared a stack
- [ ] D) No context switch occurred
**B** — Both tasks making progress establishes concurrency, not simultaneous execution. A single core can interleave the threads through scheduling but cannot execute both at the same instant.
</quiz>




<quiz>
A local variable refers to a mutable `ArrayList` also stored in a shared field. Which statement is correct?
- [ ] A) The list is thread-safe because the reference is stack-local
- [x] B) Only the reference is local; the heap object can still be shared
- [ ] C) Each thread gets a copy of the list
- [ ] D) The JVM moves the list onto the stack
**B** — A thread has its own local reference, but that reference can point to the same heap object as another thread. Mutating that shared object still requires an appropriate thread-safety strategy.
</quiz>




<quiz>
A program starts 100 CPU-bound platform threads on a four-core machine. What is the most defensible prediction?
- [ ] A) Roughly 25× speedup
- [ ] B) Exactly four threads enter `RUNNABLE`
- [x] C) At most four execute simultaneously and extra threads may add overhead
- [ ] D) The JVM serializes all 100
**C** — Core count limits true CPU parallelism. All 100 may be in Java's `RUNNABLE` state, which includes ready-to-run threads, while scheduling and context switching can reduce throughput.
</quiz>



## 02 · Java Memory Model & Memory Visibility


<quiz>
Thread A writes `data = 42` and then `ready = true`, where only `ready` is `volatile`. Thread B reads `ready == true` and then reads `data`. What must B observe?
- [ ] A) `data` may still be 0
- [x] B) `data` must be 42
- [ ] C) Only if `data` is also volatile
- [ ] D) It is undefined whether B terminates
**B** — A write to a volatile variable happens-before a subsequent read of that same variable that observes it. The earlier ordinary write to `data` is therefore visible to B.
</quiz>




<quiz>
Two threads execute `volatileCount++` on a `volatile int`. Which guarantee applies?
- [ ] A) No updates are lost
- [x] B) Each read and write is visible, but the compound increment can lose updates
- [ ] C) The operation is lock-free and atomic
- [ ] D) The result is always exactly twice the loop count
**B** — `volatile` supplies visibility and ordering, not atomicity for a read-modify-write sequence. Both threads can read the same value and later overwrite one another's increments.
</quiz>




<quiz>
After `worker.start()`, the worker reads fields initialized by the starting thread before the call. Which statement is correct?
- [ ] A) Visibility requires `volatile` on every field
- [x] B) `start()` creates a happens-before edge to actions in the worker
- [ ] C) Visibility starts only after `join()`
- [ ] D) It works only on one core
**B** — Actions before a successful call to `Thread.start()` happen-before actions in the started thread. `join()` provides the opposite publication direction: worker actions become visible after the joining thread returns.
</quiz>



## 03 · I/O Types & Thread Preemption


<quiz>
A non-blocking `SocketChannel.read(buffer)` returns `0`. What does that mean?
- [ ] A) End of stream
- [x] B) No bytes are currently available
- [ ] C) The channel permanently failed
- [ ] D) The thread was preempted
**B** — In non-blocking mode, zero means the operation made no progress now. End of stream is reported as `-1`; callers normally use a selector rather than spin aggressively.
</quiz>




<quiz>
A thread is preempted while holding a Java monitor. What happens to the monitor?
- [ ] A) It is released automatically
- [ ] B) It transfers to the next waiter
- [x] C) The preempted thread retains it
- [ ] D) The critical section rolls back
**C** — Scheduling does not alter monitor ownership. Other threads remain blocked until the owner exits the synchronized region or terminates in a way that unwinds it.
</quiz>




<quiz>
Which workload is least likely to gain throughput merely by replacing a core-sized platform pool with thousands of virtual threads?
- [ ] A) Waiting on sockets
- [ ] B) Sleeping between requests
- [x] C) CPU-bound hashing
- [ ] D) Blocking database calls
**C** — Virtual threads improve scalability when tasks spend substantial time blocked. They do not create CPU cores, so many continuously runnable hashing tasks add scheduling overhead without extra compute capacity.
</quiz>



## 04 · Thread Creation & Lifecycle


<quiz>
Calling `run()` directly on a newly constructed `Thread` has which effect?
- [ ] A) It transitions to `RUNNABLE`
- [x] B) It executes on the caller and leaves the Thread unstarted
- [ ] C) It starts a virtual thread
- [ ] D) It throws `IllegalThreadStateException`
**B** — `run()` is an ordinary method call. Only `start()` arranges execution on a new thread and establishes the start happens-before relationship.
</quiz>




<quiz>
Immediately after `t.start()`, `t.getState()` returns `RUNNABLE`. What can be concluded?
- [ ] A) `t` is executing at that instant
- [x] B) `t` is ready or executing
- [ ] C) `t` has acquired every needed lock
- [ ] D) `t` cannot already terminate
**B** — Java combines OS-ready and actively-running conditions into `RUNNABLE`. State observations are snapshots and can change immediately.
</quiz>




<quiz>
A `Callable<Integer>` throws an `IOException` after being submitted. Where does the checked exception appear?
- [ ] A) Directly from `submit()`
- [ ] B) It is discarded
- [x] C) As the cause of `ExecutionException` from `Future.get()`
- [ ] D) Only in the worker's uncaught-exception handler
**C** — Submission normally returns before execution. The task's failure is captured by the `Future`, and `get()` reports it through `ExecutionException.getCause()`.
</quiz>



## 05 · Thread Control & Coordination


<quiz>
A thread catches `InterruptedException` from `sleep()` and then checks `isInterrupted()` without restoring the flag. What will it usually see?
- [ ] A) `true`
- [x] B) `false`
- [ ] C) A second exception
- [ ] D) An unspecified value
**B** — Throwing `InterruptedException` clears the interrupt status. Code that cannot propagate the exception should commonly restore the status with `Thread.currentThread().interrupt()`.
</quiz>




<quiz>
Why must `wait()` normally be guarded by a `while` loop rather than an `if`?
- [ ] A) `wait()` never releases its monitor
- [x] B) Wakeups may be spurious or another thread may consume the condition first
- [ ] C) `notifyAll()` always interrupts waiters
- [ ] D) The loop makes the monitor reentrant
**B** — Waking is permission to recheck, not proof that the predicate remains true. The waiting thread releases and later reacquires the monitor, then must test the condition again.
</quiz>




<quiz>
Thread A calls `worker.join(100)` and the call returns normally. What is guaranteed?
- [ ] A) The worker terminated
- [ ] B) The worker's writes happen-before A
- [ ] C) At least 100 ms elapsed
- [x] D) Nothing about termination unless A checks `worker.isAlive()`
**D** — A timed join may return because of timeout. The full termination-to-join happens-before guarantee applies when the join establishes that the worker terminated; checking liveness distinguishes the outcomes.
</quiz>



## 06 · Thread Priority, Daemon & Thread Groups


<quiz>
Only daemon threads remain, and one is midway through a `finally` block writing a file. What may the JVM do?
- [ ] A) Wait for the block
- [ ] B) Convert it to non-daemon
- [x] C) Exit without completing the block
- [ ] D) Interrupt and join it
**C** — Daemon status does not grant a cleanup grace period. The JVM may terminate once no live non-daemon threads remain, so correctness-critical persistence should not rely on daemon completion.
</quiz>




<quiz>
A thread is started and then `setDaemon(true)` is called. What occurs?
- [ ] A) Status changes at its next safepoint
- [x] B) `IllegalThreadStateException`
- [ ] C) The call is ignored
- [ ] D) The thread is interrupted
**B** — Daemon status must be configured before the thread starts. It cannot be changed once the thread is alive.
</quiz>




<quiz>
A maximum-priority thread and a minimum-priority thread race to publish a result. Which design is correct?
- [ ] A) Assume maximum priority wins
- [ ] B) Use priority plus `yield()`
- [x] C) Coordinate explicitly with synchronization
- [ ] D) Put both in a `ThreadGroup`
**C** — Priority is an OS-dependent scheduling hint and cannot establish ordering, visibility, or correctness. Thread groups do not change that and are legacy management machinery.
</quiz>



## 07 · Race Conditions & Critical Sections


<quiz>
Two threads only read the same mutable object after it has been safely published and no thread ever mutates it again. Is a lock required for those reads?
- [ ] A) Always
- [x] B) No, immutable-after-publication state can be read concurrently
- [ ] C) Only for local variables
- [ ] D) Only on 64-bit JVMs
**B** — Concurrent reads do not race when initialization was safely published and no mutation follows. Safe publication is crucial; merely intending not to mutate does not itself make initial values visible.
</quiz>




<quiz>
Each thread increments a separate `int` field, but both fields occupy the same cache line. The result is correct yet slow. What is the likely issue?
- [ ] A) Deadlock
- [x] B) False sharing
- [ ] C) Torn reads
- [ ] D) Spurious wakeup
**B** — There is no logical data race because the locations differ, but cache-coherence traffic can make the independent writes interfere at the hardware cache-line level.
</quiz>




<quiz>
A bank transfer performs an atomic debit and an atomic credit as two separate operations. Is the transfer itself atomic?
- [ ] A) Yes, because both steps are atomic
- [ ] B) Only with volatile balances
- [x] C) No, observers can see the intermediate state
- [ ] D) Yes, if both amounts are `int`
**C** — Atomic components do not automatically form an atomic transaction. A shared critical section or a higher-level invariant-preserving design must cover the compound operation.
</quiz>



## 08 · Synchronization Mechanisms (synchronized, volatile, AtomicVariables)


<quiz>
One method is `static synchronized` and another is instance `synchronized` on a `Counter`. Can they execute concurrently?
- [ ] A) Never
- [x] B) Yes, because they lock `Counter.class` and the instance respectively
- [ ] C) Only if both are volatile
- [ ] D) Only on different classes
**B** — Static synchronized methods use the class object monitor; instance synchronized methods use `this`. Different monitor identities do not exclude one another.
</quiz>




<quiz>
An `AtomicReference<State>` safely swaps references, but `State` itself is mutable. What is guaranteed?
- [ ] A) Every mutation inside `State` is atomic
- [x] B) Only reference operations have the atomic guarantees
- [ ] C) `State` becomes immutable
- [ ] D) Readers cannot observe concurrent field changes
**B** — Atomicity does not recursively extend into the referenced object. Prefer immutable state snapshots or independently synchronize mutations to the object's fields.
</quiz>




<quiz>
A CAS loop computes a new value, but another thread changes A→B→A before the CAS. What subtle hazard can let CAS succeed despite intervening change?
- [ ] A) Priority inversion
- [x] B) ABA problem
- [ ] C) Lock convoy
- [ ] D) Torn stack
**B** — CAS compares the current value with the expected value, not its history. A stamped/versioned reference can detect that the apparently identical A is from a later state.
</quiz>



## 09 · Locks & Advanced Synchronization


<quiz>
A thread acquires a `ReentrantLock` twice and unlocks it once. Can another thread acquire it?
- [ ] A) Yes, one unlock fully releases it
- [x] B) No, the hold count remains one
- [ ] C) Only with a fair lock
- [ ] D) Only via `tryLock()`
**B** — Reentrancy maintains a hold count. Every successful acquisition must be matched by an unlock, ideally in nested `finally` blocks.
</quiz>




<quiz>
A thread holding a `ReentrantReadWriteLock` read lock tries to acquire its write lock while another reader exists. What is the danger?
- [ ] A) Automatic promotion
- [x] B) It can wait indefinitely because lock upgrading is unsupported
- [ ] C) Both readers become writers
- [ ] D) The read lock is silently dropped
**B** — General read-to-write upgrading is unsafe and can deadlock. Release the read lock and acquire the write lock while rechecking the predicate, or use a suitable conversion-capable design.
</quiz>




<quiz>
A `StampedLock` optimistic read copies two related fields and `validate(stamp)` returns false. What should the reader do?
- [ ] A) Return the copied values
- [x] B) Retry under a read lock
- [ ] C) Call `unlockRead(stamp)` immediately
- [ ] D) Upgrade the invalid stamp directly
**B** — Failed validation means a writer may have made the snapshot inconsistent. Acquire a real read lock, reread both fields, and unlock using that read-lock stamp.
</quiz>



## 10 · Executor Framework & Thread Pools


<quiz>
A task in a single-thread executor submits another task to the same executor and blocks on its `Future.get()`. What can happen?
- [ ] A) Work stealing resolves it
- [x] B) Thread-starvation deadlock
- [ ] C) The nested task runs inline
- [ ] D) The pool adds a thread
**B** — The only worker is waiting for a task that cannot start until that worker becomes free. Fixed pools can suffer the same pattern when every worker waits on queued dependent work.
</quiz>




<quiz>
A task submitted with `submit()` throws a runtime exception and nobody calls `Future.get()`. Which statement is most accurate?
- [ ] A) It must reach the uncaught-exception handler
- [x] B) The exception is captured and may go unnoticed
- [ ] C) The executor shuts down
- [ ] D) The JVM exits
**B** — `submit()` wraps task completion in a `Future`, capturing the failure. In contrast, failures from `execute()` can reach the worker thread's uncaught-exception handling path.
</quiz>




<quiz>
After `shutdownNow()` returns, what is guaranteed?
- [ ] A) Every running task stopped
- [ ] B) Queued tasks ran
- [x] C) Interrupts were requested and never-started tasks were returned
- [ ] D) The executor terminated
**C** — Java cancellation is cooperative. Running tasks may ignore interrupts or remain stuck in non-interruptible operations, so termination still requires observation and possibly `awaitTermination()`.
</quiz>



## 11 · CompletableFuture & Async Pipelines


<quiz>
A future is already complete when `thenApply(fn)` is attached. Where may `fn` run?
- [ ] A) Always common pool
- [ ] B) Always producer thread
- [x] C) In the attaching thread
- [ ] D) Always a new thread
**C** — A non-async continuation may execute inline in the thread that completes the stage or, if already complete, in the caller attaching it. Do not assume thread affinity.
</quiz>




<quiz>
What is the result-type difference between `thenApply(x -> async(x))` and `thenCompose(x -> async(x))` when `async` returns `CompletableFuture<R>`?
- [ ] A) None
- [x] B) The first yields a nested future; the second flattens it
- [ ] C) The second blocks
- [ ] D) The first cancels the inner future
**B** — `thenApply` maps T to `CompletableFuture<R>`, producing `CompletableFuture<CompletableFuture<R>>`; `thenCompose` sequences and flattens it to `CompletableFuture<R>`.
</quiz>




<quiz>
One component of `CompletableFuture.allOf(a, b)` fails quickly while the other never completes. When does `allOf` complete?
- [ ] A) Immediately on first failure
- [x] B) Only after all components complete
- [ ] C) After a default timeout
- [ ] D) When the common pool is idle
**B** — `allOf` is not inherently fail-fast and does not cancel siblings. Its aggregate completes after every component completes, exceptionally if one or more failed.
</quiz>



## 12 · Concurrent Collections & BlockingQueues


<quiz>
During `ConcurrentHashMap` iteration, another thread inserts a key. Must the iterator include it?
- [ ] A) Yes
- [x] B) No; iteration is weakly consistent
- [ ] C) It throws `ConcurrentModificationException`
- [ ] D) It blocks the writer
**B** — The iterator tolerates concurrent updates and may reflect some but not necessarily all of them. It does not provide a frozen snapshot or fail-fast behavior.
</quiz>




<quiz>
An iterator is obtained from a `CopyOnWriteArrayList`, then an element is added. What does that iterator see?
- [ ] A) The new element
- [x] B) Its original snapshot
- [ ] C) `ConcurrentModificationException`
- [ ] D) An unspecified corrupt array
**B** — The iterator retains the array snapshot that existed at creation. Writes publish a new copied array and are costly, which is why the collection suits read-heavy workloads.
</quiz>




<quiz>
A producer calls `put()` on a full bounded `BlockingQueue` and is interrupted while waiting. What happens?
- [ ] A) The element is guaranteed inserted
- [x] B) `InterruptedException` is thrown
- [ ] C) The oldest element is dropped
- [ ] D) The queue becomes unbounded
**B** — `put()` is an interruptible blocking operation. The caller must choose whether to propagate cancellation or restore the interrupt status after handling it.
</quiz>



## 13 · Virtual Threads (Project Loom)


<quiz>
Why can holding a monitor during a blocking operation reduce virtual-thread scalability on affected JDK operations?
- [ ] A) Monitors become non-reentrant
- [x] B) The virtual thread may pin its carrier
- [ ] C) The monitor moves to every carrier
- [ ] D) Virtual threads cannot synchronize
**B** — Pinning prevents the carrier platform thread from running other virtual threads while the virtual thread blocks. Virtual threads support synchronization, but long blocking regions under monitors should be diagnosed and minimized.
</quiz>




<quiz>
Should `Executors.newVirtualThreadPerTaskExecutor()` usually be pooled down to a small number of virtual threads?
- [ ] A) Yes, creation is expensive
- [x] B) No; limit scarce downstream resources instead
- [ ] C) Yes, to one per core for I/O
- [ ] D) No, because resources are infinite
**B** — Virtual threads are intended to represent tasks rather than be reused as a small pool. Concurrency limits still belong around scarce resources such as database connections or rate-limited services.
</quiz>




<quiz>
A million virtual threads each store a large object in a `ThreadLocal`. Which claim is correct?
- [ ] A) Carrier threads share one value
- [ ] B) Virtual threads make the storage free
- [x] C) Each virtual thread can retain its own value, causing large memory use
- [ ] D) `ThreadLocal` is unsupported
**C** — Thread-local state belongs to each virtual thread, not its temporary carrier. Cheap threads multiplied by large per-thread state can still exhaust memory; scoped, bounded context is preferable.
</quiz>



## 14 · Structured Concurrency & Scoped Values


<quiz>
In a fail-fast structured scope, one child fails. What should sibling cancellation be understood as?
- [ ] A) Forced termination
- [x] B) A cooperative cancellation request, commonly interruption
- [ ] C) Successful completion
- [ ] D) JVM shutdown
**B** — Structured concurrency bounds and coordinates lifetimes, but Java still cannot safely force arbitrary code to stop. Siblings must respond to interruption and cancellation-aware operations.
</quiz>




<quiz>
A `ScopedValue` is rebound in a nested dynamic scope. What does code observe after the nested scope returns?
- [ ] A) The nested value forever
- [x] B) The enclosing binding again
- [ ] C) No value in either scope
- [ ] D) A data race
**B** — Scoped bindings have lexical/dynamic extent and are automatically restored on exit. The value object may itself be mutable, but the binding cannot be reassigned within a scope.
</quiz>




<quiz>
What primary guarantee distinguishes structured concurrency from merely submitting two tasks to a shared executor?
- [ ] A) Tasks run in parallel
- [x] B) Child lifetimes and failure handling are bounded by the parent scope
- [ ] C) Every task uses a platform thread
- [ ] D) Exceptions are ignored
**B** — A structured scope makes ownership, joining, cancellation, and failure propagation explicit. Parallel execution alone is available from ordinary executors and is not the defining property.
</quiz>



## 15 · Best Practices & Patterns


<quiz>
A producer-consumer service uses an unbounded queue so producers never block. Under sustained overload, what failure mode remains?
- [ ] A) Deadlock is impossible, so none
- [x] B) Unbounded memory growth and latency
- [ ] C) Automatic backpressure
- [ ] D) Lost monitor ownership
**B** — An unbounded queue moves overload from admission to memory and delay. A bounded queue plus an explicit rejection or backpressure policy makes resource limits visible.
</quiz>




<quiz>
Why is swallowing `InterruptedException` especially harmful in executor shutdown?
- [ ] A) It increases priority
- [x] B) The task may ignore cancellation and prevent timely termination
- [ ] C) It releases every lock
- [ ] D) It corrupts the queue
**B** — The exception clears the interrupt flag. If code neither exits nor restores the flag, higher-level cancellation protocols can no longer observe the request.
</quiz>




<quiz>
A concurrency test passes 100,000 times using `Thread.sleep()` to arrange an interleaving. What does that prove?
- [ ] A) The code is race-free
- [ ] B) The JMM guarantees the observed order
- [x] C) Only that this schedule did not expose the bug; use synchronization-aware stress testing
- [ ] D) Production CPUs will behave identically
**C** — Timing-based tests cannot enumerate legal compiler, CPU, and scheduler behaviors and may accidentally mask races. Establish correctness through happens-before reasoning and tools such as jcstress, then test invariants under stress.
</quiz>


