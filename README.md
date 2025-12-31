# JM SQUARE KITCHEN KANO

A modern e-commerce platform for kitchen products built with React, TypeScript, and Supabase.

## Project Overview

JM SQUARE KITCHEN KANO is a full-featured kitchen products e-commerce website with an admin dashboard for managing products, categories, and analyzing site performance.

## Features

- **Product Management**: Browse and manage kitchen products by category
- **Admin Dashboard**: Comprehensive admin panel with product management, category management, and site analytics
- **User Authentication**: Secure login and signup system with role-based access control
- **Contact System**: Contact form with submission tracking
- **Newsletter**: Newsletter subscription functionality
- **Site Analytics**: Detailed analytics dashboard with charts and insights

## Technologies Used

This project is built with:

- **Vite** - Build tool and development server
- **TypeScript** - Type-safe JavaScript
- **React** - UI library
- **React Router** - Client-side routing
- **shadcn-ui** - UI component library
- **Tailwind CSS** - Utility-first CSS framework
- **Supabase** - Backend as a service (database, authentication)
- **Recharts** - Chart library for analytics

## Getting Started

### Prerequisites

- Node.js (v18 or higher) - [Install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- npm or yarn package manager

### Installation

1. Clone the repository:
```sh
git clone https://github.com/Mustychampion/portpolio.git
cd jm-square-kitchen-style-main
```

2. Install dependencies:
```sh
npm install
```

3. Set up environment variables:
   - Create a `.env` file in the root directory
   - Add your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the development server:
```sh
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── ui/           # shadcn-ui components
│   └── ...           # Custom components
├── pages/            # Page components
├── hooks/            # Custom React hooks
├── integrations/     # External service integrations
│   └── supabase/     # Supabase client and types
└── lib/              # Utility functions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Admin Dashboard

The admin dashboard provides:

- **Product Management**: Add, edit, delete, and manage product stock
- **Category Management**: Create and manage product categories
- **Site Analytics**: 
  - Overview statistics
  - Product analytics by category
  - Contact submission insights
  - Newsletter subscription metrics
  - Growth trends and charts

## Database Schema

The project uses Supabase with the following main tables:

- `products` - Product information
- `categories` - Product categories
- `contact_submissions` - Contact form submissions
- `newsletter_subscriptions` - Newsletter subscribers
- `user_roles` - User role management

## Deployment

Build the project for production:

```sh
npm run build
```

The `dist` folder will contain the production-ready files that can be deployed to any static hosting service.

## License

This project is private and proprietary.
