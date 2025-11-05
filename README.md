# Study Material Analyzer

An AI-powered study tool that transforms lecture notes, slides, and textbooks into concise summaries and high-quality multiple-choice questions.

## Features

- 📄 **PDF Upload**: Drag-and-drop interface for easy document upload
- 🤖 **Smart Text Extraction**: Automatic text extraction with OCR support
- 📝 **Intelligent Summaries**: Generate concise, topic-based summaries
- ✅ **MCQ Generation**: Create high-quality multiple-choice questions with:
  - Difficulty levels (Easy, Medium, Hard)
  - Detailed explanations
  - 4 answer options per question
- 🎯 **Interactive Quizzes**: Engaging quiz interface with instant feedback
- 📊 **Performance Analytics**: Detailed results and performance tracking
- 💾 **Export Options**: Download summaries and quiz results

## Tech Stack

- **Frontend**: React, TypeScript, Vite
- **UI Components**: shadcn/ui, Radix UI
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **State Management**: React Query

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone <your-repo-url>

# Navigate to project directory
cd study-material-analyzer

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:8080`

## Backend Integration

This frontend is designed to connect to your existing backend API. Update the API endpoints in `src/lib/api.ts`:

```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
```

### Required Backend Endpoints

Your backend should implement the following endpoints:

- `POST /api/upload` - Upload PDF file
- `GET /api/status/:documentId` - Get processing status
- `GET /api/content/:documentId` - Get generated summaries and questions
- `GET /api/export/:documentId` - Export results (PDF/JSON)

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://your-backend-url/api
```

## Project Structure

```
src/
├── components/
│   └── ui/           # shadcn/ui components
├── pages/
│   ├── Upload.tsx    # PDF upload interface
│   ├── Processing.tsx # Processing status
│   ├── Summary.tsx   # Document summary view
│   ├── Quiz.tsx      # Interactive quiz
│   └── Results.tsx   # Quiz results & analytics
├── lib/
│   ├── api.ts        # API client functions
│   └── utils.ts      # Utility functions
└── types/
    └── index.ts      # TypeScript type definitions
```

## Design System

The app uses a cohesive design system with:
- **Primary Color**: Educational blue (#0891b2)
- **Accent Color**: Warm yellow (#f59e0b)
- **Success**: Green (#16a34a)
- **Warning**: Orange (#f59e0b)
- **Semantic tokens** defined in `src/index.css`

All colors use HSL format for better theming support.

## Customization

### Updating Mock Data

Currently, the app uses mock data. To connect to your backend:

1. Update API endpoints in `src/lib/api.ts`
2. Replace mock data calls in components with API calls
3. Update types in `src/types/index.ts` to match your API responses

### Styling

All styles are managed through the design system:
- Colors: `src/index.css`
- Tailwind config: `tailwind.config.ts`
- Component variants: Individual component files

## Deployment

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

The built files will be in the `dist/` directory.

## License

MIT
