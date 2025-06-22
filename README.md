# bhaveshg.dev

A modern portfolio website built with React, TypeScript, and Tailwind CSS, showcasing projects, certifications, and GitHub contributions.

## Features

- **Responsive Design**: Fully responsive portfolio website with dark/light theme support
- **Interactive Components**: Dynamic hero section with terminal-style animations
- **Project Management**: Admin interface for managing projects, blogs, and certifications
- **GitHub Integration**: Real-time GitHub contributions heatmap
- **Contact System**: Contact form with email notifications via Supabase
- **Modern UI**: Built with shadcn/ui components and Radix UI primitives

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Supabase (Database, Auth, Edge Functions)
- **Deployment**: Vercel
- **Forms**: React Hook Form with Zod validation
- **State Management**: TanStack Query
- **Icons**: Lucide React

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/bhaveshg.dev.git
   cd bhaveshg.dev
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file with your Supabase and GitHub credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_GITHUB_TOKEN=your_github_personal_access_token
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── Header.tsx      # Navigation header
│   ├── HeroSection.tsx # Hero section with animations
│   ├── AboutSection.tsx
│   ├── SkillsSection.tsx
│   └── ...
├── pages/              # Page components
├── services/           # API service functions
├── hooks/              # Custom React hooks
├── integrations/       # Third-party integrations
├── lib/                # Utility functions
└── data/               # Static data and types
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build in development mode
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Supabase Edge Functions

The project includes Supabase Edge Functions for:
- GitHub contributions data fetching
- Email notifications for contact form submissions

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).