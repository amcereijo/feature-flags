import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  TextInput,
  PasswordInput,
  Button,
  Paper,
  Title,
  Container,
  Alert,
  Text,
  Box,
  Center,
  Stack,
  rem,
} from '@mantine/core';
import { useAuth } from '../contexts/auth.context';

export const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const location = useLocation();
  const from = location.state?.from?.pathname || '/features';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(username, password);
      // Navigate to the page they tried to visit or default to /features
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Center h="100vh" style={{ background: 'var(--mantine-color-gray-0)' }}>
      <Container size={420} py={40}>
        <Stack gap={30}>
          <Box ta="center">
            <Title order={1} size="h2" c="blue.7">
              Feature Flags Manager
            </Title>
            <Text c="dimmed" size="sm" mt={5}>
              Sign in to manage your feature flags
            </Text>
          </Box>

          <Paper withBorder shadow="md" p={30} radius="md" bg="white">
            <form onSubmit={handleSubmit}>
              <Stack gap="md">
                <TextInput
                  label="Username"
                  placeholder="admin"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  styles={{ label: { marginBottom: rem(4) } }}
                />
                <PasswordInput
                  label="Password"
                  placeholder="Your password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  styles={{ label: { marginBottom: rem(4) } }}
                />
                {error && (
                  <Alert color="red" radius="md" title="Error" variant="light">
                    {error}
                  </Alert>
                )}
                <Button
                  type="submit"
                  fullWidth
                  loading={loading}
                  variant="gradient"
                  gradient={{ from: 'blue', to: 'cyan', deg: 90 }}
                >
                  Sign in
                </Button>
              </Stack>
            </form>
          </Paper>
        </Stack>
      </Container>
    </Center>
  );
};
