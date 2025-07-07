# YouTube to MP3 Converter - EcoTube

## Overview

EcoTube is a full-stack YouTube to MP3 conversion web application with an eco-friendly comic-style UI. The application allows users to convert YouTube videos to MP3 format with multiple quality options, featuring a sustainable design philosophy and user-friendly interface.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **Styling**: Tailwind CSS with custom eco-friendly color scheme
- **Component Library**: Radix UI primitives with shadcn/ui components
- **State Management**: TanStack Query for server state management
- **Animations**: Framer Motion for smooth transitions and interactions
- **UI Theme**: Comic-style with eco-friendly color palette (forest greens, ocean blues, cream backgrounds)

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Build System**: Vite for development, esbuild for production builds
- **Development Server**: Custom Vite middleware integration for hot reloading

### Database & ORM
- **ORM**: Drizzle ORM configured for PostgreSQL
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Schema Location**: `shared/schema.ts` for type-safe database operations
- **Storage Implementation**: In-memory storage for development with interface for easy PostgreSQL migration

## Key Components

### Core Conversion Logic
- **YouTube Processing**: Server-side conversion using yt-dlp for reliable video-to-audio extraction
- **Quality Options**: 5 quality levels (64k, 128k, 192k, 256k, 320k bitrate)
- **File Management**: Temporary file handling with automatic cleanup
- **Error Handling**: Comprehensive validation and error reporting

### User Interface Components
- **Navigation**: Responsive navigation with mobile menu support
- **Conversion Form**: Input validation with URL verification and quality selection
- **Loading States**: Custom animated loading spinner with eco-themed icons
- **Result Display**: Download interface with file cleanup
- **Contact System**: Form submission with backend message storage

### Pages Structure
- **Home**: Main conversion interface with feature highlights
- **FAQs**: Expandable FAQ sections with animated interactions
- **Changelog**: Version history with categorized updates
- **Contact**: Contact form with server-side message handling
- **404**: Custom not-found page

## Data Flow

### Conversion Process
1. User submits YouTube URL with quality preference
2. Frontend validates URL format and sends request to `/api/convert`
3. Backend uses yt-dlp to extract and convert audio
4. Temporary file created and download URL generated
5. Frontend receives response and displays download interface
6. File automatically cleaned up after download

### Contact Form Flow
1. User fills contact form with name, email, and message
2. Frontend validates data using Zod schemas
3. POST request to `/api/contact` with form data
4. Backend stores message in database/memory storage
5. Success/error feedback displayed to user

### State Management
- Server state managed by TanStack Query with custom query functions
- Form state handled by React Hook Form with Zod validation
- UI state managed through React hooks and context where needed

## External Dependencies

### Core Dependencies
- **React Ecosystem**: React 18, React DOM, React Hook Form
- **Styling**: Tailwind CSS, Radix UI components, class-variance-authority
- **Build Tools**: Vite, esbuild, TypeScript
- **Backend**: Express.js, Drizzle ORM, Neon Database
- **Validation**: Zod for schema validation
- **Animations**: Framer Motion
- **Icons**: Lucide React

### Development Tools
- **TypeScript**: Full type safety across frontend, backend, and shared schemas
- **ESLint/Prettier**: Code formatting and linting (implied by project structure)
- **PostCSS**: CSS processing for Tailwind

### External Services
- **Database**: Neon Database (PostgreSQL-compatible)
- **Deployment**: Configured for Replit with development banner integration

## Deployment Strategy

### Development Environment
- **Hot Reloading**: Vite development server with Express middleware integration
- **File Watching**: TypeScript compilation with incremental builds
- **Database**: Development uses in-memory storage, production ready for PostgreSQL

### Production Build
- **Frontend**: Vite production build with optimized assets
- **Backend**: esbuild bundling for Node.js deployment
- **Static Assets**: Served through Express with proper caching headers
- **Environment**: Configurable through environment variables

### Hosting Considerations
- **Frontend**: Can be deployed to static hosting (Vercel, Netlify)
- **Backend**: Node.js hosting required for conversion functionality
- **Database**: PostgreSQL instance required for production message storage
- **File Storage**: Temporary file management for conversion process

## User Preferences

Preferred communication style: Simple, everyday language.

## Changelog

Changelog:
- July 07, 2025. Initial setup