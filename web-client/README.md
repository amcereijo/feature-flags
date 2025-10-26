# Feature Flags Management Client

A modern React application for managing feature flags with support for multiple value types (boolean, string, number). This client works in conjunction with a Go-based SQLite API server for feature flag management.

## Tech Stack

### Frontend Framework
- React 19 with TypeScript
- Vite 7 for build tooling and development server

### UI Components and Styling
- Mantine UI v8 (@mantine/core, @mantine/hooks)
- Tabler Icons (@tabler/icons-react)
- Emotion for CSS-in-JS (@emotion/react)

### State Management and Data Fetching
- React Query v5 (@tanstack/react-query)
- Axios for HTTP requests

### Authentication
- Clerk (@clerk/clerk-react) for user management
- Secure authentication flows
- Protected routes
- Social login support

### Routing
- React Router v7 (react-router-dom)

### Development Tools
- TypeScript 5.8
- ESLint 9 with React plugins
- Vite for fast development and optimized builds
- Clerk Dashboard for user management

## Project Structure

```
client/
├── src/
│   ├── components/     # React components
│   │   ├── Features.tsx      # Feature flags management UI
│   │   ├── TokensPage.tsx    # API tokens management UI
│   │   ├── SignInPage.tsx    # Custom Clerk sign-in page
│   │   ├── SignUpPage.tsx    # Custom Clerk sign-up page
│   │   └── Layout.tsx        # Common layout with auth header
│   ├── services/      # API services and business logic
│   │   ├── api.client.ts     # Base API client configuration
│   │   ├── auth.service.ts   # Authentication service
│   │   ├── feature.service.ts # Feature management service
│   │   └── token.service.ts   # API tokens service
│   ├── types/         # TypeScript type definitions
│   │   ├── feature.types.ts  # Feature-related types
│   │   └── token.types.ts    # Token-related types
│   ├── contexts/      # React contexts
│   │   └── auth.context.tsx  # Authentication context
│   ├── config/        # Configuration files
│   ├── assets/        # Static assets
│   ├── App.tsx        # Main application component
│   └── main.tsx       # Application entry point
├── public/           # Public static files
├── index.html        # HTML entry point
└── vite.config.ts    # Vite configuration
```

## Core Functionality

### Authentication and Security
- **User Authentication**: Secure sign-in and sign-up flows using Clerk
- **Protected Routes**: Access control for authenticated users
- **Social Authentication**: Support for multiple authentication providers
- **Custom UI**: Themed authentication pages matching application design
- **Security Best Practices**: Token-based authentication and secure session management

### Feature Flag Management
- **View Features**: List all feature flags with filtering and search capabilities
- **Create Features**: Add new feature flags with the following properties:
  - Name
  - Resource ID
  - Value (supports multiple types)
  - Active status

### Value Type Support
The system supports multiple value types for feature flags:
- **Boolean**: True/false values
- **String**: Text values
- **Number**: Numeric values

### User Interface
- Modern, responsive design using Mantine UI components
- Intuitive form controls for each value type
- Real-time updates using React Query
- Search and filter capabilities
- Loading states and error handling

### API Token Management
- **Token Generation**: Create API tokens for external service authentication
- **Token Listing**: View all generated API tokens with creation dates
- **Token Revocation**: Ability to revoke tokens for security
- **Token Security**: Secure token display and copy functionality

### Data Management
- REST API integration via Axios
- Optimistic updates for better user experience
- Automatic data revalidation
- Error handling and retry mechanisms

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the environment file:
   ```bash
   cp .env.example .env
   ```

4. Set up your Clerk application:
   - Create an account at [clerk.dev](https://clerk.dev)
   - Create a new application
   - Copy your API keys from the Clerk dashboard

5. Update the environment variables in `.env`:
   ```
   VITE_API_URL=your_api_endpoint
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   ```

6. Configure Clerk Authentication:
   - Set up your authentication providers in the Clerk dashboard
   - Customize the appearance settings if needed
   - Configure your redirect URLs

7. Start the development server:
   ```bash
   npm run dev
   ```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Environment Variables

- `VITE_API_URL` - Base URL for the API server
```
