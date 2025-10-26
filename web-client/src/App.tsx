import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MantineProvider, createTheme } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ClerkLoaded, SignedIn, SignedOut } from '@clerk/clerk-react';
import { Features } from './components/Features';
import { Layout } from './components/Layout';
import { SignInPage } from './components/SignInPage';
import { TokensPage } from './components/TokensPage';
import '@mantine/core/styles.css';

const queryClient = new QueryClient();

const theme = createTheme({
  primaryColor: 'blue',
  defaultRadius: 'md',
  colors: {
    blue: [
      '#E7F5FF',
      '#D0EBFF',
      '#A5D8FF',
      '#74C0FC',
      '#4DABF7',
      '#339AF0',
      '#228BE6',
      '#1C7ED6',
      '#1971C2',
      '#1864AB',
    ],
  },
  shadows: {
    md: '0 2px 4px rgba(0, 0, 0, 0.1)',
    lg: '0 4px 8px rgba(0, 0, 0, 0.12)',
    xl: '0 8px 16px rgba(0, 0, 0, 0.14)',
  },
  components: {
    Button: {
      defaultProps: {
        size: 'md',
      },
    },
    TextInput: {
      defaultProps: {
        size: 'md',
      },
    },
  },
});

function App() {
  return (
    <BrowserRouter>
      <MantineProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <ClerkLoaded>
            <SignedIn>
              <Routes>
                <Route path="/" element={<Navigate to="/features" replace />} />
                <Route
                  path="/features"
                  element={
                    <Layout>
                      <Features />
                    </Layout>
                  }
                />
                <Route
                  path="/tokens"
                  element={
                    <Layout>
                      <TokensPage />
                    </Layout>
                  }
                />
                <Route path="*" element={<Navigate to="/features" replace />} />
              </Routes>
            </SignedIn>
            <SignedOut>
              <Routes>
                <Route path="/*" element={<SignInPage />} />
              </Routes>
            </SignedOut>
          </ClerkLoaded>
        </QueryClientProvider>
      </MantineProvider>
    </BrowserRouter>
  );
}

export default App;
