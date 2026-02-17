-- Add short_summary column to books table
ALTER TABLE books
ADD COLUMN short_summary VARCHAR(500)
AFTER description;
-- Update all 50 books with engaging short summaries
UPDATE books
SET short_summary = 'Master the art of writing clean, maintainable code that reads like prose and stands the test of time.'
WHERE title = 'Clean Code';
UPDATE books
SET short_summary = 'Discover 23 timeless design patterns that solve recurring problems in object-oriented software design.'
WHERE title = 'Design Patterns';
UPDATE books
SET short_summary = 'Transform from a code monkey to a master craftsman with practical wisdom for building better software.'
WHERE title = 'The Pragmatic Programmer';
UPDATE books
SET short_summary = 'The definitive guide to algorithms and data structures, used by top universities and tech companies worldwide.'
WHERE title = 'Introduction to Algorithms';
UPDATE books
SET short_summary = 'Learn why adding more programmers to a late project makes it later, and other essential software engineering truths.'
WHERE title = 'The Mythical Man-Month';
UPDATE books
SET short_summary = 'Improve your existing code without changing its external behavior using proven refactoring techniques.'
WHERE title = 'Refactoring';
UPDATE books
SET short_summary = 'The essential handbook covering every aspect of software construction from design to debugging.'
WHERE title = 'Code Complete';
UPDATE books
SET short_summary = 'Learn design patterns the fun way with this visually rich, brain-friendly guide that makes concepts stick.'
WHERE title = 'Head First Design Patterns';
UPDATE books
SET short_summary = 'Build software systems that are independent of frameworks, databases, and UI for maximum flexibility and longevity.'
WHERE title = 'Clean Architecture';
UPDATE books
SET short_summary = 'Tackle complex business logic by aligning your software model with the real-world domain it serves.'
WHERE title = 'Domain-Driven Design';
UPDATE books
SET short_summary = 'The comprehensive mathematical foundation for machine learning algorithms and statistical pattern recognition.'
WHERE title = 'Pattern Recognition and Machine Learning';
UPDATE books
SET short_summary = 'The most comprehensive and authoritative textbook on artificial intelligence, covering everything from search to neural networks.'
WHERE title = 'Artificial Intelligence: A Modern Approach';
UPDATE books
SET short_summary = 'Master the fundamentals of computer networking from protocols to network architecture and security.'
WHERE title = 'Computer Networking';
UPDATE books
SET short_summary = 'Learn the theory and practice of database systems, from SQL basics to advanced transaction management.'
WHERE title = 'Database System Concepts';
UPDATE books
SET short_summary = 'Explore how operating systems work under the hood, from process management to file systems and security.'
WHERE title = 'Modern Operating Systems';
UPDATE books
SET short_summary = 'The legendary "Dragon Book" teaching you how to build compilers from lexical analysis to code generation.'
WHERE title = 'Compilers: Principles, Tech, and Tools';
UPDATE books
SET short_summary = 'A complete overview of software engineering covering agile methods, testing, and the entire software lifecycle.'
WHERE title = 'Software Engineering';
UPDATE books
SET short_summary = 'Write unit tests that actually improve your codebase quality and make refactoring fearless.'
WHERE title = 'Unit Testing Principles, Practices, and Patterns';
UPDATE books
SET short_summary = 'Learn how to design software architectures that meet quality requirements and business goals.'
WHERE title = 'Software Architecture in Practice';
UPDATE books
SET short_summary = 'Master Java programming with 90 best practices that make your code more robust, efficient, and maintainable.'
WHERE title = 'Effective Java';
UPDATE books
SET short_summary = 'A modern, hands-on guide to JavaScript that teaches you to write elegant code for browsers and Node.js.'
WHERE title = 'Eloquent JavaScript';
UPDATE books
SET short_summary = 'Ace your coding interviews with 189 programming questions, solutions, and proven strategies from a Google engineer.'
WHERE title = 'Cracking the Coding Interview';
UPDATE books
SET short_summary = 'The mind-expanding classic that teaches fundamental computer science concepts through Scheme programming.'
WHERE title = 'Structure and Interpretation of Computer Programs';
UPDATE books
SET short_summary = 'Beyond coding skills: build your career, market yourself, learn productivity hacks, and achieve financial freedom.'
WHERE title = 'Soft Skills: The Software Developer\'s Life Manual';
UPDATE books
SET short_summary = 'Safely refactor legacy codebases by applying techniques to add tests and improve code you\'re afraid to touch.'
WHERE title = 'Working Effectively with Legacy Code';
UPDATE books
SET short_summary = 'Learn test-driven development hands-on: write tests first, then make them pass, then refactor for excellence.'
WHERE title = 'Test Driven Development: By Example';
UPDATE books
SET short_summary = 'Embrace change in software development with XP practices like pair programming, continuous integration, and refactoring.'
WHERE title = 'Extreme Programming Explained';
UPDATE books
SET short_summary = 'Master agile estimation and planning with practical techniques for story points, velocity, and release planning.'
WHERE title = 'Agile Estimating and Planning';
UPDATE books
SET short_summary = 'Learn the professional behaviors and ethical standards that separate great programmers from mediocre ones.'
WHERE title = 'The Clean Coder';
UPDATE books
SET short_summary = 'Get up to speed quickly with agile methodologies, scrum, kanban, and lean development practices.'
WHERE title = 'Head First Agile';
UPDATE books
SET short_summary = 'Automate your software delivery pipeline for reliable, low-risk releases through continuous integration and deployment.'
WHERE title = 'Continuous Delivery';
UPDATE books
SET short_summary = 'Learn Google\'s approach to building and operating large-scale, reliable systems from their SRE team.'
WHERE title = 'Site Reliability Engineering';
UPDATE books
SET short_summary = 'Discover the key metrics and practices that accelerate software delivery and organizational performance.'
WHERE title = 'Accelerate';
UPDATE books
SET short_summary = 'A business novel that teaches DevOps principles through the story of an IT manager saving his company.'
WHERE title = 'The Phoenix Project';
UPDATE books
SET short_summary = 'Design, build, and deploy microservices architectures that scale and evolve with your business needs.'
WHERE title = 'Building Microservices';
UPDATE books
SET short_summary = 'Design for production stability with patterns for fault tolerance, monitoring, and graceful degradation.'
WHERE title = 'Release It!';
UPDATE books
SET short_summary = 'A comprehensive guide to modern software architecture covering styles, patterns, and the skills architects need.'
WHERE title = 'Fundamentals of Software Architecture';
UPDATE books
SET short_summary = 'Solve common challenges in microservices with proven patterns for decomposition, data management, and transactions.'
WHERE title = 'Microservices Patterns';
UPDATE books
SET short_summary = 'Navigate the complexities of distributed data systems, from replication to eventual consistency to stream processing.'
WHERE title = 'Designing Data-Intensive Applications';
UPDATE books
SET short_summary = 'Deploy and manage containerized applications at scale using Kubernetes, the leading container orchestration platform.'
WHERE title = 'Kubernetes up & Running';
UPDATE books
SET short_summary = 'Master Docker containerization from basics to advanced topics like networking, security, and orchestration.'
WHERE title = 'Docker Deep Dive';
UPDATE books
SET short_summary = 'Everything you need to know about Git version control, from basic commits to advanced workflows and internals.'
WHERE title = 'Pro Git';
UPDATE books
SET short_summary = 'Elegant algorithms and programming techniques that solve real-world problems with clarity and efficiency.'
WHERE title = 'Programming Pearls';
UPDATE books
SET short_summary = 'Learn Python fast with hands-on projects covering basics, data visualization, web apps, and game development.'
WHERE title = 'Python Crash Course';
UPDATE books
SET short_summary = 'Build a solid Python foundation through 52 exercises that teach you to code by doing, not just reading.'
WHERE title = 'Learn Python the Hard Way';
UPDATE books
SET short_summary = 'Improve your C++ programs with 55 specific ways to write better, more efficient, and more maintainable code.'
WHERE title = 'Effective C++';
UPDATE books
SET short_summary = 'The original C programming guide written by the language\'s creators, still the best resource for learning C.'
WHERE title = 'The C Programming Language';
UPDATE books
SET short_summary = 'Learn to think like a computer scientist while mastering Python programming from the ground up.'
WHERE title = 'Think Python';
UPDATE books
SET short_summary = 'Cut through JavaScript\'s quirks to master its elegant core features and avoid common pitfalls.'
WHERE title = 'JavaScript: The Good Parts';
UPDATE books
SET short_summary = 'Deep dive into JavaScript\'s most misunderstood concepts: closures, prototypes, async, and the this keyword.'
WHERE title = 'You Don\'t Know JS';
SELECT 'Short summaries added successfully!' AS Status;