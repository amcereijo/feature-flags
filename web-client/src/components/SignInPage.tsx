import { SignIn } from '@clerk/clerk-react';
import { Container, rem } from '@mantine/core';

export function SignInPage() {
  const appearance = {
    baseTheme: undefined, // Use default light theme
    variables: {
      colorPrimary: '#228BE6',
      colorText: '#1A1B1E',
      colorTextSecondary: '#495057',
      colorBackground: '#FFFFFF',
      colorInputBackground: '#F8F9FA',
      colorInputText: '#1A1B1E',
      colorSuccess: '#40C057',
      borderRadius: '12px',
    },
    elements: {
      rootBox: {
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
      },
      card: {
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
      },
      headerTitle: {
        fontSize: '28px',
        fontWeight: 700,
        color: '#1A1B1E',
      },
      headerSubtitle: {
        fontSize: '16px',
        color: '#495057',
      },
      formButtonPrimary: {
        backgroundColor: '#228BE6',
        fontSize: '16px',
        fontWeight: 600,
        borderRadius: '8px',
        '&:hover': {
          backgroundColor: '#1C7ED6',
        },
      },
      formFieldInput: {
        backgroundColor: '#F8F9FA',
        borderColor: '#DEE2E6',
        color: '#1A1B1E',
        fontSize: '16px',
        borderRadius: '8px',
        '&:focus': {
          borderColor: '#228BE6',
          boxShadow: '0 0 0 2px rgba(34, 139, 230, 0.1)',
        },
      },
      formFieldLabel: {
        color: '#495057',
        fontSize: '14px',
        fontWeight: 500,
      },
      footerActionText: {
        color: '#495057',
      },
      footerActionLink: {
        color: '#228BE6',
        '&:hover': {
          color: '#1C7ED6',
        },
      },
      dividerLine: {
        backgroundColor: '#DEE2E6',
      },
      dividerText: {
        color: '#495057',
      },
      identityPreviewText: {
        color: '#1A1B1E',
      },
      identityPreviewEditButton: {
        color: '#228BE6',
      },
      alternativeMethods: {
        backgroundColor: 'transparent',
        borderRadius: '8px',
      },
      formFieldSuccessText: {
        color: '#40C057',
      },
      formFieldErrorText: {
        color: '#FA5252',
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
      <SignIn
        appearance={appearance}
        routing="hash"
        fallbackRedirectUrl="/features"
      />
    </Container>
  );
}
