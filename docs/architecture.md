# UtilityHub — Technical Architecture

## 1. Document Information

- Product: UtilityHub
- Document: Technical Architecture
- Version: 1.0
- Status: Draft
- Related Document: `docs/product-requirements.md`

---

## 2. Purpose

This document describes the technical architecture, technology choices,
application structure, development practices and deployment strategy for
UtilityHub.

The architecture is designed to support the initial release with minimal
complexity and hosting costs while allowing the application to evolve into
a full-stack product.

The initial release will focus on browser-based utilities. A backend API,
database and additional cloud services will be introduced only when
required by future features.

---

## 3. Architecture Principles

The following principles will guide architectural decisions.

### 3.1 Simplicity First

The initial implementation should be as simple as possible while meeting
the product requirements.

Infrastructure and abstractions should not be introduced without a
clear requirement.

### 3.2 Browser-First Processing

Utilities should process input directly in the user's browser whenever
practical.

This approach reduces server costs, improves responsiveness and avoids
unnecessary transmission of user data.

### 3.3 Separation of Responsibilities

The application should separate page layout, reusable UI components,
utility-specific logic and shared functionality.

Individual tools should be independently maintainable and testable.

### 3.4 Type Safety

TypeScript should be used to improve code maintainability, catch common
errors during development and make component contracts explicit.

Avoid using `any` unless there is a justified reason.

### 3.5 Testability

Utility logic should be designed so that it can be tested independently
of the UI.

Important user interactions and application behaviour should also have
automated tests.

### 3.6 Cost Efficiency

The initial application should use free or inexpensive hosting where
appropriate.

Paid infrastructure should be introduced only when required by the
product.

### 3.7 Incremental Evolution

The architecture should support the gradual introduction of a .NET
backend, persistent storage, authentication and AWS services without
requiring a complete rewrite of the frontend.

---

## 4. Technology Stack

### 4.1 Frontend

| Technology | Responsibility |
|---|---|
| React | UI components and application rendering |
| TypeScript | Type-safe application development |
| Vite | Development server and production build |
| HTML5 | Semantic page structure |
| CSS | Styling and responsive layouts |
| npm | Dependency and package management |

The frontend will be developed as a single-page application initially.

Routing will be introduced to support navigation between the landing
page, tool directory and individual utility pages.

A routing library will be selected when the application structure is
implemented.

### 4.2 Backend

The initial release will not require a backend.

When backend functionality becomes necessary, the planned technologies
are:

- ASP.NET Core Web API
- .NET 10
- C#
- OpenAPI for API documentation
- NUnit for backend unit tests

The backend will initially be implemented as a modular monolith rather
than as multiple microservices.

### 4.3 Database

The initial release will not require a database.

PostgreSQL is the preferred database for future features that require
persistent application data.

Entity Framework Core may be used for database access when the backend
is introduced.

### 4.4 Version Control and Project Management

| Tool | Responsibility |
|---|---|
| Git | Local version control |
| GitHub | Source code repository |
| GitHub Issues | Work items and defect tracking |
| GitHub Projects | Development board and progress tracking |
| GitHub Pull Requests | Code review and integration |

---

## 5. High-Level Architecture

### 5.1 Initial Release

The initial architecture consists of a frontend application that runs
in the user's browser.

```text
                    User
                      |
                      v
               Web Browser
                      |
                      v
             React Application
                      |
          +-----------+-----------+
          |           |           |
          v           v           v
     JSON Tools   Text Tools   GUID Tools
          |           |           |
          +-----------+-----------+
                      |
                      v
              Browser Processing