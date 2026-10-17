# UtilityHub Development Workflow

## 1. Purpose

This document defines the development practices, Git workflow, testing expectations, and completion criteria for UtilityHub.

The objective is to maintain a consistent, maintainable, and professional development process while building the project as a solo developer.

## 2. Development Principles

- Keep changes small, focused, and easy to review.
- Understand the requirements before implementing a feature.
- Prefer simple solutions over unnecessary abstractions.
- Follow the architecture documented in `docs/architecture.md`.
- Keep documentation updated when requirements or architectural decisions change.
- Write tests for important functionality.
- Never commit secrets, credentials, or sensitive user data.
- Keep the `main` branch stable.

## 3. Git Branching Strategy

### 3.1 Main Branch

The `main` branch represents the stable version of UtilityHub.

- Do not commit feature development directly to `main`.
- Changes should normally be merged through pull requests.
- Keep `main` in a working state.

### 3.2 Documentation Branch

The initial documentation tasks will share one branch:

`M1-Docs`

This branch contains the work for:

- DOCS-001: Define UtilityHub product requirements.
- DOCS-002: Document the initial technical architecture.
- DOCS-003: Establish development and Git standards.

Once all three documents are ready, create one pull request from `M1-Docs` into `main`.

### 3.3 Feature Branches

After the documentation milestone, create a separate branch for each application feature or focused task.

Use these naming conventions:

- `feature/<short-description>` for new features.
- `fix/<short-description>` for bug fixes.
- `docs/<short-description>` for later documentation-only changes.
- `refactor/<short-description>` for refactoring.

Examples:

- `feature/json-formatter`
- `feature/json-diff`
- `feature/guid-generator`
- `fix/json-validation`
- `docs/deployment-guide`

Use lowercase words separated by hyphens.

## 4. Commit Conventions

Use clear commit messages that describe the purpose of each change.

Follow this format:

`<type>: <short description>`

Supported types:

- `feat`: Add functionality.
- `fix`: Fix a bug.
- `docs`: Add or update documentation.
- `test`: Add or update tests.
- `refactor`: Refactor code without changing intended behavior.
- `chore`: Perform maintenance or configuration changes.

Examples:

- `docs: define UtilityHub product requirements`
- `docs: document technical architecture`
- `feat: add JSON formatter`
- `fix: handle invalid JSON input`
- `test: cover GUID generation`
- `chore: configure frontend linting`

Keep commit messages concise and specific.

## 5. Issue and Pull Request Workflow

Use GitHub Issues to track work and GitHub Projects to track progress.

For each development task:

1. Review the issue and its acceptance criteria.
2. Clarify any missing requirements before implementation.
3. Move the issue to the appropriate project status.
4. Create or switch to the relevant branch.
5. Implement the change.
6. Run the applicable tests and quality checks.
7. Review the changes locally.
8. Commit and push the changes.
9. Open a pull request when the work is ready.
10. Address review feedback.
11. Merge the pull request after the required checks pass.
12. Confirm that the associated issue is closed.

Pull requests should include:

- A concise summary of the changes.
- The reason for the changes.
- Tests or checks performed.
- Screenshots for meaningful UI changes, where appropriate.
- References to the related GitHub issue.

Use GitHub's `Closes #<issue-number>` syntax in a pull request description when merging that pull request should close the issue.

For the initial documentation milestone, use one pull request to merge all three documentation issues.

## 6. Testing Strategy

Testing expectations will evolve as the application grows.

### 6.1 Documentation Changes

For documentation-only changes:

- Check spelling and grammar.
- Verify that file paths and commands are correct.
- Check that documentation agrees with the product requirements and architecture.
- Review Markdown formatting and code blocks.

### 6.2 Frontend Changes

For frontend functionality:

- Test normal, expected inputs.
- Test invalid and edge-case inputs.
- Verify loading, success, and error states where applicable.
- Verify that the interface works on desktop and mobile-sized screens.
- Add automated tests for important business logic and utility behavior.
- Run the configured linting, type-checking, and test commands before opening a pull request.

The specific frontend testing libraries and commands will be selected when the frontend application is initialized.

### 6.3 Backend Changes

When an ASP.NET Core backend is introduced:

- Write unit tests for important business logic.
- Add integration tests where appropriate.
- Test validation and error-handling behavior.
- Verify API contracts and response status codes.
- Run the relevant test suite before opening a pull request.

NUnit is the planned backend unit-testing framework.

## 7. Definition of Ready

A task is ready for implementation when:

- Its purpose is clear.
- Its scope is understood.
- Acceptance criteria are documented.
- Dependencies and important constraints are identified.
- The task is small enough to implement and verify independently.

If a task is not ready, clarify it before starting implementation.

## 8. Definition of Done

A task is considered complete when all applicable criteria are satisfied:

- The acceptance criteria are met.
- The implementation follows the documented architecture.
- Relevant tests have been added or updated.
- Required tests and quality checks pass.
- Errors and important edge cases are handled.
- No secrets or sensitive data have been committed.
- Documentation is updated where necessary.
- The changes have been reviewed.
- The pull request is merged.
- The associated GitHub issue and project status are updated.

For documentation-only tasks, apply the relevant criteria rather than requiring application tests.

## 9. Code Quality Guidelines

- Use descriptive names for variables, methods, components, and files.
- Keep functions and components focused on a single responsibility.
- Avoid unnecessary duplication.
- Prefer explicit, understandable code over clever shortcuts.
- Keep dependencies to a minimum.
- Avoid introducing infrastructure before there is a clear need.
- Separate UI rendering from reusable utility logic where practical.
- Handle invalid input safely.
- Avoid logging or exposing sensitive user-provided content.
- Update tests when changing existing behavior.

Language-specific conventions will be documented or configured when the corresponding application code is introduced.

## 10. Security and Configuration

- Never commit API keys, passwords, access tokens, or private credentials.
- Use environment variables or an appropriate secret-management mechanism when configuration requires secrets.
- Keep local environment files out of Git when they contain sensitive information.
- Validate untrusted input where appropriate.
- Use HTTPS for deployed applications.
- Avoid sending user input to a server unless the feature requires it and the behavior is clearly communicated.

The initial browser-only utilities should process data locally whenever practical.

## 11. Development Workflow with ChatGPT

ChatGPT may assist with requirements, architecture, implementation, debugging, testing, and code review.

For each task:

1. Review the issue and existing project context.
2. Agree on the implementation approach before making significant changes.
3. Identify the files that need to change.
4. Implement the smallest complete solution.
5. Review the code and relevant edge cases.
6. Add or update tests.
7. Run the available validation commands.
8. Review the final Git diff.
9. Summarize the changes and any remaining limitations.
10. Prepare the work for a pull request.

Generated code must be reviewed and tested rather than accepted without verification.

Do not introduce unrelated changes while working on a focused issue.

## 12. Current Development Constraints

During the initial MVP:

- Prefer free development tools and hosting options.
- Keep the application browser-first.
- Avoid a backend and database until requirements justify them.
- Avoid authentication and external integrations unless explicitly approved as future scope.
- Keep the architecture simple enough for a solo developer to maintain.
- Reassess these constraints when new requirements emerge.

## 13. Updating This Document

Update this document when the team's development process or project conventions change.

Keep it aligned with the actual workflow rather than documenting practices that are not being followed.