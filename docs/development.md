# Development Guidelines

## Overview

This document outlines the development standards, best practices, and workflows for the BJJ Gym Management Application.

## Development Environment Setup

1. **Prerequisites**
   - Node.js (v18 or higher)
   - npm or yarn
   - Git
   - VSCode (recommended)
   - Supabase CLI (optional)

2. **Environment Variables**
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

## Code Style Guidelines

### TypeScript

1. **Type Safety**
   - Always define proper types and interfaces
   - Avoid using `any` type
   - Use type inference when possible
   ```typescript
   // Good
   interface Member {
     id: string;
     name: string;
     belt: BeltLevel;
   }
   
   // Bad
   const member: any = { /* ... */ };
   ```

2. **Naming Conventions**
   - Use PascalCase for components, interfaces, and types
   - Use camelCase for variables and functions
   - Use UPPER_CASE for constants
   ```typescript
   // Components
   const MemberList = () => { /* ... */ };
   
   // Interfaces
   interface UserProgress { /* ... */ }
   
   // Variables
   const memberCount = 42;
   
   // Constants
   const MAX_STRIPES = 4;
   ```

### React Components

1. **Component Structure**
   ```typescript
   // imports
   import { useState } from 'react';
   import type { Member } from '@/types';
   
   // types
   interface Props {
     member: Member;
     onUpdate: (member: Member) => void;
   }
   
   // component
   export function MemberCard({ member, onUpdate }: Props) {
     // state/hooks
     const [isEditing, setIsEditing] = useState(false);
     
     // handlers
     const handleSubmit = () => { /* ... */ };
     
     // render
     return ( /* ... */ );
   }
   ```

2. **Component Organization**
   - Keep components focused and single-responsibility
   - Extract reusable logic into custom hooks
   - Use composition over inheritance

### File Structure

```
src/
├── components/          # Reusable components
│   ├── common/         # Shared components
│   └── feature/        # Feature-specific components
├── hooks/              # Custom React hooks
├── lib/               # Core functionality
├── pages/             # Page components
├── types/             # TypeScript types
└── utils/             # Utility functions
```

## State Management

1. **React Context**
   - Use for global state that many components need
   - Keep context values focused and specific
   ```typescript
   const AuthContext = createContext<AuthContextType | null>(null);
   
   export function AuthProvider({ children }: PropsWithChildren) {
     // ...
   }
   ```

2. **Local State**
   - Use `useState` for component-specific state
   - Use `useReducer` for complex state logic

## Testing Guidelines

1. **Unit Tests**
   - Test individual components and functions
   - Focus on business logic and user interactions
   - Use meaningful test descriptions

2. **Integration Tests**
   - Test component interactions
   - Verify data flow between components
   - Test API integration points

## Performance Optimization

1. **Code Splitting**
   ```typescript
   const MemberDetails = lazy(() => import('./MemberDetails'));
   ```

2. **Memoization**
   ```typescript
   const MemoizedComponent = memo(Component);
   const memoizedValue = useMemo(() => computeValue(a, b), [a, b]);
   const memoizedCallback = useCallback(() => { /* ... */ }, []);
   ```

3. **Bundle Size**
   - Use dynamic imports for large dependencies
   - Monitor bundle size with build tools
   - Implement proper code splitting

## Git Workflow

1. **Branch Naming**
   ```
   feature/add-member-search
   bugfix/fix-belt-promotion
   refactor/optimize-queries
   ```

2. **Commit Messages**
   ```
   feat: add member search functionality
   fix: correct belt promotion logic
   refactor: optimize database queries
   ```

3. **Pull Request Process**
   - Create descriptive PR titles
   - Include context and screenshots
   - Link related issues
   - Request appropriate reviewers

## Error Handling

1. **API Errors**
   ```typescript
   try {
     const data = await api.call();
     return data;
   } catch (error) {
     if (error instanceof ApiError) {
       // Handle specific API error
     }
     throw error;
   }
   ```

2. **Error Boundaries**
   ```typescript
   class ErrorBoundary extends React.Component {
     static getDerivedStateFromError(error: Error) {
       return { hasError: true, error };
     }
     
     componentDidCatch(error: Error, info: React.ErrorInfo) {
       console.error('Error caught by boundary:', error, info);
     }
   }
   ```

## Security Best Practices

1. **Authentication**
   - Always use HTTPS
   - Implement proper session management
   - Use secure authentication methods

2. **Data Protection**
   - Validate all user inputs
   - Sanitize data before rendering
   - Use proper content security policies

3. **Authorization**
   - Implement role-based access control
   - Validate permissions on both client and server
   - Use principle of least privilege

## Deployment

1. **Build Process**
   ```bash
   # Install dependencies
   npm install
   
   # Build for production
   npm run build
   
   # Preview build
   npm run preview
   ```

2. **Environment Configuration**
   - Use environment-specific variables
   - Keep sensitive data in environment files
   - Document required environment variables

3. **Deployment Checklist**
   - Run all tests
   - Check bundle size
   - Verify environment variables
   - Test in staging environment
   - Monitor deployment

## Code Review Guidelines

1. **What to Look For**
   - Code style consistency
   - Type safety
   - Performance implications
   - Security considerations
   - Test coverage

2. **Review Process**
   - Read the PR description
   - Check out the branch locally
   - Test the changes
   - Provide constructive feedback
   - Approve or request changes

## Documentation

1. **Code Documentation**
   - Document complex logic
   - Add JSDoc comments for functions
   - Keep documentation up to date

2. **Component Documentation**
   - Document props and their types
   - Provide usage examples
   - Document side effects

## Tooling

1. **VSCode Extensions**
   - ESLint
   - Prettier
   - TypeScript and TSLint
   - Git Lens
   - Error Lens

2. **Development Tools**
   - React Developer Tools
   - Redux DevTools (if using Redux)
   - Chrome DevTools
   - Supabase Dashboard

## Resources

1. **Official Documentation**
   - [React Documentation](https://react.dev)
   - [TypeScript Documentation](https://www.typescriptlang.org/docs)
   - [Supabase Documentation](https://supabase.com/docs)

2. **Style Guides**
   - [TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html)
   - [React Style Guide](https://github.com/airbnb/javascript/tree/master/react)
