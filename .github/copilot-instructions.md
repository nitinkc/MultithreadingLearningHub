# GitHub Copilot Instructions

Complete guide for using GitHub Copilot effectively in the Java Multithreading & Concurrency Hub project.

**Quick Navigation**:
- [Project Overview](#project-overview)
- [IDE Setup](#ide-setup) 
- [Code Style & Conventions](#code-style--conventions)
- [Best Practices](#best-practices)
- [Common Workflows](#common-workflows)
- [Validation & Quality](#validation--quality)

## Project Overview

Comprehensive learning resource for mastering Java multithreading, concurrency, and virtual threads:

- **Theory Sections (15 files)**: In-depth explanations of concurrency concepts
- **Labs (9 files)**: Hands-on exercises with executable code
- **Interview Prep**: Q&A and self-assessment resources
- **Documentation**: MkDocs-based website for content delivery

## IDE Setup

### IntelliJ IDEA / JetBrains IDEs

1. **Install GitHub Copilot Plugin**:
   - Go to: Settings → Plugins → Marketplace
   - Search: "GitHub Copilot"
   - Click Install (by GitHub)
   - Restart IDE

2. **Authenticate with GitHub**:
   - Sign in with GitHub account
   - Authorize access to Copilot
   - Confirm subscription status

3. **Enable Copilot Features**:
   - Settings → Tools → GitHub Copilot
   - Enable: Inline Code Completions
   - Enable: Chat
   - Set Key Bindings (Alt+\ for inline suggestions)

### Usage Shortcuts

| Action | Shortcut | Notes |
|--------|----------|-------|
| Accept suggestion | Tab or Cmd+Right | Choose suggestion and apply |
| Reject suggestion | Esc | Dismiss current suggestion |
| Next suggestion | Alt+] | Cycle through alternatives |
| Previous suggestion | Alt+[ | Go back to previous option |
| Open Copilot Chat | Cmd+Shift+A | IDE-specific, may vary |

## Code Style & Conventions

### Java Code Standards

1. **Java Version**: Target Java 21+ (support for virtual threads and structured concurrency)
2. **Naming Conventions**:
   - Classes: PascalCase (e.g., `ThreadPoolExample`)
   - Methods: camelCase (e.g., `demonstrateSynchronization()`)
   - Constants: UPPER_SNAKE_CASE (e.g., `MAX_THREADS`)
   - Variables: camelCase (e.g., `threadCount`)

3. **Code Format**:
   - Indentation: 4 spaces
   - Max line length: 120 characters
   - Braces: Java style (opening brace on same line)
   - Comments: Clear, concise, educational tone

### Lab Code Structure

Each lab file should follow this structure:

```java
/**
 * Lab XY: [Title]
 * Focus: [Brief description]
 * Level: [Beginner/Intermediate/Advanced]
 */
public class LabXY[Name] {
    
    // Constants
    private static final int THREAD_COUNT = 5;
    
    // Main execution
    public static void main(String[] args) throws InterruptedException {
        // Exercise demonstrations
    }
    
    // Helper methods for each exercise
    private static void exercise1() {
        // Implementation
    }
    
    // Results/output methods
}
```

## Markdown Standards

### File Organization

1. **Headers**: Use `#` for main title, `##` for sections, `###` for subsections
2. **Lists**: Always include blank line before list starts
3. **Code Blocks**: Use triple backticks with language specified (e.g., ```java)
4. **Links**: Relative paths for internal docs, full URLs for external

### Content Guidelines

1. **Theory Files**: 
   - Start with learning level
   - Include visual representations (Mermaid diagrams preferred)
   - Provide concrete Java examples
   - End with "Read the Original Blog Post" section

2. **Lab Files**:
   - Begin with objectives and checklist
   - Include theory review section
   - Provide starter code and full solution
   - Include exercises and key learnings

3. **Interview Prep Files**:
   - `interview-prep.md`: Q&A with collapsible `??? question` format
   - `interview-questions.md`: Multiple choice self-assessment with `<details>` format

## Copilot Assistance Guidelines

### Do Use Copilot For:

- **Code generation**: Creating boilerplate lab exercises
- **Documentation**: Writing theory explanations and examples
- **Error detection**: Finding and suggesting fixes for common concurrency bugs
- **Code explanations**: Clarifying complex threading concepts
- **Testing**: Generating unit tests for concurrency patterns
- **Refactoring**: Improving code clarity and performance

### Don't Use Copilot For:

- **Content originality**: Ensure explanations reflect your understanding
- **Over-reliance**: Verify all generated code is correct and tested
- **Sensitive patterns**: Don't use Copilot for security-critical code without review
- **Interview content**: Ensure Q&A answers are accurate and well-vetted

## Markdown Formatting Rules

### Blank Lines Before Lists

**REQUIRED**: Always include a blank line before any list (bullet, numbered, or checkbox).

✅ Correct:
```markdown
This is some text.

- First item
- Second item
```

❌ Incorrect:
```markdown
This is some text.
- First item
- Second item
```

### Code Block Formatting

- Use ` ```java ` for Java code blocks
- Indentation: 4 spaces inside code blocks
- Use `// ... existing code ...` for truncated sections
- Always include language identifier

### Header Spacing

Always include blank line after headers:

```markdown
## Section Header

Content starts here.
```

## Concurrency Patterns & Best Practices

When generating code examples, follow these patterns:

### Thread Creation

```java
// ✅ Prefer Runnable/Callable
Thread thread = new Thread(() -> {
    // Task
});

// ❌ Avoid extending Thread
class MyThread extends Thread { }
```

### Synchronization

```java
// ✅ Prefer synchronized blocks for fine-grained control
synchronized(lockObject) {
    // Critical section
}

// ✅ Prefer ReentrantLock for complex scenarios
try {
    if (lock.tryLock(5, TimeUnit.SECONDS)) {
        // Critical section
    }
} finally {
    lock.unlock();
}

// ❌ Avoid synchronized on entire methods when possible
```

### Thread Pools

```java
// ✅ Use ExecutorService
ExecutorService executor = Executors.newFixedThreadPool(10);
Future<Result> future = executor.submit(callable);

// ❌ Avoid creating raw threads for task management
```

### Virtual Threads (Java 21+)

```java
// ✅ Use virtual threads for I/O-bound work
Thread virtualThread = Thread.ofVirtual()
    .start(() -> {
        // I/O operations
    });

// ✅ Use StructuredTaskScope for parent-child relationships
try (var scope = new StructuredTaskScope.ShutdownOnFailure()) {
    Subtask<Result> subtask = scope.fork(() -> compute());
    scope.join();
}
```

## Comment Guidelines

### Code Comments

- Use `//` for single-line comments
- Use `/* */` for multi-line explanations
- Document the "why", not just the "what"
- Be concise: keep comments under 80 characters

### JavaDoc Comments

```java
/**
 * Brief description in one sentence.
 * 
 * Longer explanation if needed.
 * 
 * @param paramName description
 * @return description
 * @throws ExceptionType when...
 */
```

## Testing Conventions

When generating tests:

1. Use JUnit 5 (Jupiter) framework
2. Test names follow pattern: `test[Scenario][ExpectedResult]()`
3. Include assertion messages for clarity
4. Test both normal and edge cases for concurrency
5. Use `CountDownLatch` or `CyclicBarrier` for synchronization in tests

Example:
```java
@Test
void testMultipleThreadsAccessingSharedData_UpdatesCorrectly() {
    // Arrange
    AtomicInteger counter = new AtomicInteger(0);
    
    // Act
    // ... thread execution ...
    
    // Assert
    assertEquals(expected, counter.get(), "Counter should match expected value");
}
```

## MkDocs Configuration

- Theme: mkdocs (built-in)
- Extensions enabled: Mermaid, MathJax, PyDown extras
- Navigation structure: See mkdocs.yml for hierarchy

## Documentation Quality Checks

Before finalizing content:

- [ ] Blank lines before all lists
- [ ] Code blocks use language identifier
- [ ] All relative links work correctly
- [ ] Java 21+ features clearly marked
- [ ] Examples are executable and tested
- [ ] Concepts progress from beginner to advanced
- [ ] Interview Q&As are accurate and concise

## Copilot Prompt Templates

### For Code Generation

```
Generate a Java example that demonstrates [concept] 
for [audience level]. Include [specific requirement].
Follow these conventions:
- Use Java 21+ features
- Include clear comments
- Show both incorrect and correct approaches
```

### For Documentation

```
Write a [section type] explaining [concept] for the Java 
Multithreading Hub. Include:
- Practical example
- Common mistakes
- When to use this pattern
Keep it concise and beginner-friendly.
```

### For Bug Fixes

```
Review this code for concurrency issues:
[code snippet]

Identify:
- Race conditions
- Deadlock risks
- Memory visibility issues
- Suggest fixes with explanations
```

## Common Workflows

### Workflow 1: Lab Code Generation

1. Open `/docs/labs/[XX]-[topic]-lab.md`
2. Ask Copilot: "Generate starter code for Exercise 1"
3. Review suggestion in context of lab goals
4. Refine with: "Add error handling", "Include timeout"
5. Copy to lab file and test execution

### Workflow 2: Theory Explanation

1. Create new theory file (e.g., `docs/theory/XX-topic.md`)
2. Use Copilot Chat: "Write the Fundamentals section explaining [concept]"
3. Refine tone/depth: "Make it more detailed", "Add more examples"
4. Generate code examples: "Show 3 code examples"
5. Create Mermaid diagrams: "Create a diagram showing..."

### Workflow 3: Interview Q&A

1. Use Copilot: "Generate 5 interview questions about [topic]"
2. Format as collapsible questions in `docs/interview-prep.md`
3. Review answers for accuracy
4. Add multiple choice versions to `docs/interview-questions.md`

### Workflow 4: Code Review with Copilot

Use Copilot to review PR comments:
```
@workspace Review this code change for:
- Thread safety issues
- Memory visibility problems
- Performance improvements
[paste diff]
```

## Best Practices

### Do Use Copilot For:

- **Code generation**: Creating boilerplate lab exercises
- **Documentation**: Writing theory explanations and examples
- **Error detection**: Finding and suggesting fixes for common concurrency bugs
- **Code explanations**: Clarifying complex threading concepts
- **Testing**: Generating unit tests for concurrency patterns
- **Refactoring**: Improving code clarity and performance

### Don't Use Copilot For:

- **Content originality**: Ensure explanations reflect your understanding
- **Over-reliance**: Verify all generated code is correct and tested
- **Sensitive patterns**: Don't use Copilot for security-critical code without review
- **Interview content**: Ensure Q&A answers are accurate and well-vetted

### Before Using Copilot

1. **Check existing content**: Don't duplicate
2. **Define scope**: Be specific about requirements
3. **Know the audience**: Beginner vs Advanced matters
4. **Have a template**: Reference existing patterns

### While Using Copilot

1. **Don't accept blindly**: Review all generated code
2. **Test thoroughly**: Run labs before committing
3. **Verify facts**: Check interview Q&A answers
4. **Maintain voice**: Ensure consistency with hub's tone

### After Getting Suggestions

1. **Edit for clarity**: Improve explanations
2. **Add context**: Link to theory/labs
3. **Format properly**: Follow markdown standards
4. **Validate links**: Check all references work

## Validation & Quality

### Pre-Commit Checklist

Before pushing changes generated with Copilot:

```
Code Quality:
- [ ] Code compiles (javac Lab*.java)
- [ ] Labs run without errors
- [ ] Java 21+ features used properly
- [ ] Follows naming conventions
- [ ] Includes meaningful comments

Documentation:
- [ ] Markdown validation: python3 /tmp/final_check.py
- [ ] Blank lines before all lists
- [ ] All relative links work correctly
- [ ] No spelling errors

Concurrency:
- [ ] No race conditions
- [ ] No deadlock risks
- [ ] Memory visibility correct
- [ ] Thread-safe code

Testing:
- [ ] Examples are executable
- [ ] Interview Q&A answers verified
- [ ] All links validate
```

### Validation Commands

```bash
# Check markdown formatting
python3 /tmp/final_check.py

# Compile Java code
cd docs/labs
javac *.java

# Run a lab
java Lab01ThreadCreation
```

## Concurrency Patterns & Best Practices

When generating code examples, follow these patterns:

### Thread Creation

```java
// ✅ Prefer Runnable/Callable
Thread thread = new Thread(() -> {
    // Task
});

// ❌ Avoid extending Thread
class MyThread extends Thread { }
```

### Synchronization

```java
// ✅ Prefer synchronized blocks for fine-grained control
synchronized(lockObject) {
    // Critical section
}

// ✅ Prefer ReentrantLock for complex scenarios
try {
    if (lock.tryLock(5, TimeUnit.SECONDS)) {
        // Critical section
    }
} finally {
    lock.unlock();
}

// ❌ Avoid synchronized on entire methods when possible
```

### Thread Pools

```java
// ✅ Use ExecutorService
ExecutorService executor = Executors.newFixedThreadPool(10);
Future<Result> future = executor.submit(callable);

// ❌ Avoid creating raw threads for task management
```

### Virtual Threads (Java 21+)

```java
// ✅ Use virtual threads for I/O-bound work
Thread virtualThread = Thread.ofVirtual()
    .start(() -> {
        // I/O operations
    });

// ✅ Use StructuredTaskScope for parent-child relationships
try (var scope = new StructuredTaskScope.ShutdownOnFailure()) {
    Subtask<Result> subtask = scope.fork(() -> compute());
    scope.join();
}
```

## Version Control Considerations

- Commit messages: Start with action verb (Add, Fix, Refactor, Update)
- Example: `Add synchronization lab with ReentrantLock examples`
- Keep commits focused on single concepts
- Reference documentation structure in commits

### Git Workflow with Copilot

```bash
# 1. Create feature branch
git checkout -b docs/add-concurrency-lab

# 2. Use Copilot to generate content
# - Create lab file
# - Use Copilot Chat for code/docs

# 3. Validate
python3 /tmp/final_check.py
javac docs/labs/*.java

# 4. Commit with clear message
git add docs/labs/
git commit -m "Add Lab 10: Concurrency Patterns"

# 5. Push and create PR
git push origin docs/add-concurrency-lab
```

## Performance Considerations

When generating code examples:

1. **Avoid busy-waiting**: Use `wait()`, `notify()`, or `Condition`
2. **Lock contention**: Show fine-grained locking strategies
3. **Thread pools**: Always specify bounded queues
4. **Virtual threads**: Use for I/O-bound, not CPU-bound tasks
5. **Memory efficiency**: Be conscious of thread stack sizes

## Educational Focus

All generated content should:

1. **Progress gradually**: Beginner → Intermediate → Advanced
2. **Explain trade-offs**: Show pros/cons of each approach
3. **Include diagrams**: Use Mermaid for visualizing concepts
4. **Provide context**: Explain "why" before "how"
5. **Show real-world usage**: Connect to practical scenarios

## Compliance & Review

- Run final check script: `python3 /tmp/final_check.py`
- All markdown files should validate without formatting issues
- Java code should compile with `javac` (Java 21+)
- Labs should execute without errors

---

**Last Updated**: April 22, 2026  
**Project Version**: 1.0  
**Target Java Version**: 21 LTS+

