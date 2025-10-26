import { SignUp } from '@clerk/clerk-react';
import { Container, rem } from '@mantine/core';
import { dark } from '@clerk/themes';

export function SignUpPage() {
  const appearance = {
    baseTheme: dark,
    variables: {
      borderRadius: '8px',
      colorPrimary: '#228BE6',
    },
    elements: {
      rootBox: {
        backgroundColor: 'var(--mantine-color-body)',
      },
      card: {
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.12)',
        margin: '2rem auto',
        maxWidth: '400px',
        backgroundColor: 'var(--mantine-color-dark-7)',
      },
      headerTitle: {
        fontSize: '28px',
        fontWeight: 700,
        color: 'var(--mantine-color-white)',
        marginBottom: '0.5rem',
      },
      headerSubtitle: {
        fontSize: '16px',
        color: 'var(--mantine-color-gray-3)',
        marginBottom: '1.5rem',
      },
      formButtonPrimary: {
        backgroundColor: '#228BE6',
        fontSize: '16px',
        fontWeight: 600,
        '&:hover': {
          backgroundColor: '#1C7ED6',
        },
      },
      formFieldInput: {
        borderRadius: '4px',
        backgroundColor: 'var(--mantine-color-dark-6)',
        borderColor: 'var(--mantine-color-dark-4)',
        color: 'var(--mantine-color-white)',
        fontSize: '16px',
        '&:focus': {
          borderColor: '#228BE6',
          boxShadow: '0 0 0 1px #228BE6',
        },
      },
      formFieldLabel: {
        color: 'var(--mantine-color-gray-3)',
        fontSize: '14px',
        fontWeight: 500,
      },
      footerAction: {
        color: 'var(--mantine-color-blue-4)',
        '&:hover': {
          color: 'var(--mantine-color-blue-3)',
        },
      },
    },
    layout: {
      socialButtonsPlacement: 'bottom' as const,
      socialButtonsVariant: 'blockButton' as const,
      showOptionalFields: false,
    },
  } as const;

  return (
    <Container size="xs" my={rem(40)}>
      <SignUp
        appearance={appearance}
        routing="hash"
        redirectUrl="/features"
      />
    </Container>
  );
}
