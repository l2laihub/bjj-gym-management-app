# BJJ Gym Management Application

A comprehensive web application for managing Brazilian Jiu-Jitsu (BJJ) gyms, built with React, TypeScript, and Supabase.

## Features

- 📊 **Dashboard**: Overview of key gym metrics and statistics
- 👥 **Member Management**: Track and manage gym members
- 📅 **Attendance Tracking**: Monitor class attendance and schedules
- 🥋 **Curriculum Management**: Organize and track BJJ techniques and belt promotions
- 💰 **Financial Management**: Handle gym finances and transactions
- 📦 **Inventory Management**: Track gym equipment and merchandise
- 🏆 **Tournament Records**: Manage competition records and results
- 🎯 **Prospect Management**: Track and follow up with potential new members

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: TailwindCSS
- **Backend**: Supabase
- **Charts**: Recharts
- **Routing**: React Router
- **Build Tool**: Vite

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account and project

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/huyqduong/bjj-gym-management-app.git
   cd bjj-gym-management-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Fill in your Supabase credentials

4. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
├── components/     # React components
├── contexts/       # React contexts
├── hooks/         # Custom React hooks
├── lib/           # Core functionality and API
├── pages/         # Page components
├── schemas/       # Data validation schemas
├── store/         # State management
├── types/         # TypeScript types
└── utils/         # Utility functions
```

## Documentation

Detailed documentation is available in the [docs](./docs) directory:

- [Technical Architecture](./docs/architecture.md)
- [Database Schema](./docs/database-schema.md)
- [API Documentation](./docs/api.md)
- [Development Guidelines](./docs/development.md)
- [Deployment Guide](./docs/deployment.md)

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
