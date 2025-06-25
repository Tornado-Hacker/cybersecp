# Cybersecurity Portfolio Website

## Overview

This is a full-stack web application for a cybersecurity professional's portfolio website. It features a modern, responsive frontend built with React and TypeScript, and a robust backend powered by Express.js. The application includes both public portfolio sections and a secure admin dashboard for content management.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack React Query for server state management
- **Routing**: Wouter for client-side routing
- **Build Tool**: Vite for development and build processes
- **UI Components**: Radix UI primitives with custom styling

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Session-based authentication with bcrypt for password hashing
- **File Structure**: Monorepo structure with shared schema definitions

### Key Design Decisions
1. **Monorepo Structure**: All code is organized in a single repository with `client/`, `server/`, and `shared/` directories for better code sharing and maintainability.
2. **TypeScript Throughout**: Full TypeScript implementation across frontend, backend, and shared schemas for type safety.
3. **Component Library**: Uses shadcn/ui for consistent, accessible UI components.
4. **Session-Based Auth**: Chose session-based authentication over JWT for simplicity and security in admin operations.

## Key Components

### Database Schema
- **Users**: Admin user management with username/password authentication
- **Profile**: Personal information, contact details, and professional summary
- **Skills**: Categorized technical skills with icons and descriptions
- **Certifications**: Professional certifications with visual branding
- **Projects**: Portfolio projects with images, descriptions, and technology stacks
- **Blog Posts**: Content management for blog articles
- **Contact Messages**: Visitor inquiries and contact form submissions

### Frontend Components
- **Portfolio Pages**: Public-facing portfolio sections (Hero, About, Skills, etc.)
- **Admin Dashboard**: Secure content management interface
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Form Management**: React Hook Form with Zod validation

### Backend Features
- **RESTful API**: Clean API endpoints for all data operations
- **Authentication Middleware**: Session-based auth with middleware protection
- **Data Validation**: Server-side validation using Drizzle-Zod schemas
- **Error Handling**: Comprehensive error handling and logging

## Data Flow

1. **Public Portfolio**: 
   - Visitors access public pages
   - Data fetched from API endpoints
   - Cached using React Query for performance

2. **Admin Authentication**:
   - Admin login through secure form
   - Session creation and management
   - Protected routes require authentication

3. **Content Management**:
   - CRUD operations for all content types
   - Real-time updates using React Query mutations
   - Form validation on both client and server

4. **Contact Form**:
   - Visitor submissions stored in database
   - Admin can view and manage messages

## External Dependencies

### Frontend Dependencies
- React ecosystem (React, React DOM, React Router)
- TanStack React Query for data fetching
- Radix UI for accessible components
- Tailwind CSS for styling
- React Hook Form with Zod for form handling

### Backend Dependencies
- Express.js for server framework
- Drizzle ORM for database operations
- bcrypt for password hashing
- express-session for session management
- PostgreSQL driver (@neondatabase/serverless)

### Development Tools
- Vite for build tooling
- TypeScript for type checking
- ESLint and Prettier for code quality
- Drizzle Kit for database migrations

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with hot module replacement
- **Database**: PostgreSQL with Drizzle migrations
- **Environment**: Replit-optimized with proper module configuration

### Production Deployment
- **Build Process**: Vite builds client assets, esbuild bundles server code
- **Server**: Node.js Express server serving both API and static assets
- **Database**: PostgreSQL with environment-based connection strings
- **Deployment Target**: Replit Autoscale for automatic scaling

### Configuration
- **Environment Variables**: DATABASE_URL, SESSION_SECRET
- **Build Commands**: Separate build steps for client and server
- **Asset Serving**: Static file serving with proper caching headers

## Changelog

```
Changelog:
- June 25, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```