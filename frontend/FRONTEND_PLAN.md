# Summary Generation App - Frontend Implementation Plan

## Tech Stack

- React 19 with TypeScript
- Vite for bundling
- Tailwind CSS v4 for styling
- shadcn/ui component library
- React Hook Form with Zod validation
- Tanstack Query for API state management
- Axios for HTTP requests

## Application Overview

A single-page application for text summarization with clean UI featuring dual-pane layout for input and output.

---

## Page Implementation Plan

### 1. Login Page (`/login`)

#### Components to Create:

- `LoginPage` - Main login page component
    - Uses React Hook Form for form management
    - Zod schema validation for email and password
    - Loading states during authentication
    - Error handling and user feedback
    - Remember me functionality
    - Redirect after successful login

#### Features:

- Email/password authentication
- Form validation with real-time feedback
- Loading spinner during login process
- Error message display for failed login attempts
- Responsive design for all screen sizes
- Redirect to dashboard after successful login
- Integration with existing auth service

#### API Integration:

- Uses existing `authService.login()` method
- Handles authentication tokens and user data storage
- Integrates with existing token refresh mechanism

### 2. Main Dashboard Page (`/`)

#### Components to Create:

- `SummaryGeneratorForm` - Main form component with text input
    - Uses React Hook Form for form management
    - Zod schema validation for text input
    - Character/word count display
    - Clear/reset functionality

- `SummaryDisplay` - Output display component
    - Loading states with skeleton
    - Copy to clipboard functionality
    - Export options (plain text, markdown)
    - Error state handling

- `SummaryLayout` - Container component
    - Responsive grid layout (side-by-side on desktop, stacked on mobile)
    - Card-based design with shadows
    - Consistent spacing and typography

#### API Integration:

- `POST /api/summarize` - Generate summary endpoint
- Request: `{ text: string, options?: { length: 'short' | 'medium' | 'long' } }`
- Response: `{ summary: string, wordCount: number, processingTime: number }`

#### Utils/Hooks:

- `useSummaryGeneration` - Custom hook for API calls
- `useClipboard` - Copy functionality
- `textUtils.ts` - Text processing utilities (word count, character limits)

#### Types:

- `SummaryRequest` - API request interface
- `SummaryResponse` - API response interface
- `FormData` - Form validation schema

---

## Common Components & Layout

### Layout Components:

- `AppLayout` - Root layout with consistent styling
- `Header` - Simple header with app title and theme toggle
- `Footer` - Optional footer with credits/links

### Shared Components:

- `LoadingSpinner` - Reusable loading component
- `ErrorMessage` - Error display component
- `CopyButton` - Copy to clipboard button
- `CharacterCounter` - Text input counter component

### Common Utils:

- `api.ts` - Axios configuration and API client
- `constants.ts` - App constants (API URLs, limits)
- `validationSchemas.ts` - Zod schemas for forms

### State Management:

- React Query for server state
- Local state with useState for UI interactions
- Form state managed by React Hook Form

---

## Implementation Priority

### Phase 1 (Core Functionality):

1. Basic layout and routing setup
2. Main summary form with validation
3. API integration for text summarization
4. Basic summary display with loading states

### Phase 2 (Enhanced Features):

1. Copy to clipboard functionality
2. Character/word counting
3. Error handling and user feedback
4. Responsive design refinements

### Phase 3 (Polish):

1. Loading animations and transitions
2. Export functionality
3. Summary length options
4. Performance optimizations

---

## File Structure Changes Needed:

```
src/
├── pages/
│   ├── LoginPage.tsx
│   └── SummaryPage.tsx
├── components/
│   ├── summary/
│   │   ├── SummaryGeneratorForm.tsx
│   │   ├── SummaryDisplay.tsx
│   │   └── SummaryLayout.tsx
│   ├── common/
│   │   ├── Header.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── ErrorMessage.tsx
│   │   └── CopyButton.tsx
│   └── layout/
│       └── AppLayout.tsx
├── hooks/
│   ├── useSummaryGeneration.ts
│   └── useClipboard.ts
├── types/
│   └── summary.ts
├── utils/
│   ├── textUtils.ts
│   └── validationSchemas.ts
└── services/
    └── summaryApi.ts
```

---

## API Endpoints Required:

1. **POST /api/summarize**
    - Generate text summary
    - Input validation
    - Rate limiting consideration

2. **GET /api/health** (optional)
    - Service health check
    - For connection status

---

## Key Features:

- **Real-time validation** - Form validation with instant feedback
- **Responsive design** - Mobile-first approach with Tailwind
- **Loading states** - Skeleton UI during processing
- **Error handling** - Graceful error messages and retry options
- **Accessibility** - ARIA labels and keyboard navigation
- **Performance** - Optimized re-renders and API calls
