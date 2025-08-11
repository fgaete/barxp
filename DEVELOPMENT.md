# BarXP - Development Guide

## 🚀 Development Workflow

### Branch Strategy

We follow a GitFlow-inspired branching model:

- **`main`** - Production-ready code
- **`qa`** - Quality assurance and staging
- **`dev`** - Development integration branch
- **Feature branches** - `feature/feature-name`
- **Bug fixes** - `bugfix/bug-description`
- **Hotfixes** - `hotfix/critical-fix`

### Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd BarXP
   ```

2. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Run tests**
   ```bash
   npm run test        # Watch mode
   npm run test:run    # Single run
   npm run test:coverage # With coverage
   ```

### Development Process

1. **Create a feature branch from `dev`**
   ```bash
   git checkout dev
   git pull origin dev
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write code following our coding standards
   - Add unit tests for new functionality
   - Update documentation if needed

3. **Test your changes**
   ```bash
   npm run lint        # Check code style
   npm run test:run    # Run all tests
   npm run build       # Ensure build works
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```
   
   Follow [Conventional Commits](https://www.conventionalcommits.org/) format:
   - `feat:` - New features
   - `fix:` - Bug fixes
   - `docs:` - Documentation changes
   - `style:` - Code style changes
   - `refactor:` - Code refactoring
   - `test:` - Test additions/changes
   - `chore:` - Maintenance tasks

5. **Push and create Pull Request**
   ```bash
   git push origin feature/your-feature-name
   ```
   
   Create a PR to merge into `dev` branch.

## 🔄 CI/CD Pipeline

### Automated Checks

Every push and PR triggers:

- **Linting** - ESLint code quality checks
- **Type Checking** - TypeScript compilation
- **Unit Tests** - Vitest test suite
- **Build Verification** - Production build test
- **Security Audit** - npm audit for vulnerabilities

### Deployment Flow

1. **Development** (`dev` branch)
   - Automatic testing on every push
   - Integration testing environment

2. **QA** (`qa` branch)
   - Staging environment deployment
   - User acceptance testing
   - Performance testing

3. **Production** (`main` branch)
   - Production deployment
   - Full test suite execution
   - Monitoring and alerts

### Branch Protection Rules

- **`main`** branch requires:
  - PR review approval
  - All CI checks passing
  - Up-to-date with base branch

- **`qa`** branch requires:
  - All CI checks passing
  - No direct pushes allowed

## 🧪 Testing Strategy

### Unit Tests

- **Framework**: Vitest + React Testing Library
- **Location**: `src/test/`
- **Coverage Target**: 80%+

### Test Commands

```bash
npm run test          # Watch mode for development
npm run test:run      # Single run for CI
npm run test:ui       # Visual test interface
npm run test:coverage # Generate coverage report
```

### Writing Tests

1. **Component Tests**
   - Test user interactions
   - Verify rendering
   - Mock external dependencies

2. **Hook Tests**
   - Test custom hooks in isolation
   - Mock Firebase/external services

3. **Utility Tests**
   - Test pure functions
   - Edge cases and error handling

## 📋 Code Quality

### Linting

- **ESLint** with TypeScript support
- **Prettier** for code formatting
- **Pre-commit hooks** (recommended)

### Code Style

- Use TypeScript for type safety
- Follow React best practices
- Implement proper error handling
- Write meaningful commit messages

### Performance

- Lazy load components when appropriate
- Optimize bundle size
- Use React.memo for expensive components
- Implement proper loading states

## 🚨 Troubleshooting

### Common Issues

1. **Tests failing locally**
   ```bash
   npm run test:run -- --reporter=verbose
   ```

2. **Build errors**
   ```bash
   npm run build 2>&1 | tee build.log
   ```

3. **Linting errors**
   ```bash
   npm run lint -- --fix
   ```

### Getting Help

- Check existing issues and PRs
- Review CI/CD logs in GitHub Actions
- Ask team members for code review

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [Vitest Documentation](https://vitest.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Conventional Commits](https://www.conventionalcommits.org/)