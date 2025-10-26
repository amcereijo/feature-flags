import { useState } from 'react';
import {
  ActionIcon,
  Button,
  Container,
  Title,
  Paper,
  Table,
  Modal,
  TextInput,
  Text,
  Group,
  Box,
  LoadingOverlay,
  Stack,
} from '@mantine/core';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TokenService } from '../services/token.service';
import { useAuth } from '@clerk/clerk-react';

export function TokensPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTokenName, setNewTokenName] = useState('');
  const [createdToken, setCreatedToken] = useState<string | null>(null);

  const { getToken } = useAuth();
  const tokenService = new TokenService(getToken);
  const queryClient = useQueryClient();

  const { data: tokens = [], isLoading } = useQuery({
    queryKey: ['tokens'],
    queryFn: () => tokenService.list(),
  });

  const createMutation = useMutation({
    mutationFn: (name: string) => tokenService.create({ name }),
    onSuccess: (result) => {
      if (result.token) {
        setCreatedToken(result.token);
      }
      queryClient.invalidateQueries({ queryKey: ['tokens'] });
      setNewTokenName('');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => tokenService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tokens'] });
    },
  });

  const handleCreateToken = () => {
    createMutation.mutate(newTokenName);
  };

  const handleDeleteToken = (id: string) => {
    if (window.confirm('Are you sure you want to delete this token?')) {
      deleteMutation.mutate(id);
    }
  };
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    setCreatedToken(null);
    setNewTokenName('');
  };

  return (
    <Container size="lg" py="md">
      <LoadingOverlay visible={isLoading} />

      <Paper withBorder p="md" pos="relative">
        <Group justify="space-between" mb="md">
          <Title order={2}>API Tokens</Title>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Group gap="xs">
              <IconPlus size={16} />
              <span>Create New Token</span>
            </Group>
          </Button>
        </Group>

        <Table striped highlightOnHover withTableBorder>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Name</Table.Th>
              <Table.Th>Created at</Table.Th>
              <Table.Th>Last used</Table.Th>
              <Table.Th style={{ width: '100px' }}>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {tokens.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={4} style={{ textAlign: 'center' }}>
                  <Text c="dimmed">No tokens found</Text>
                </Table.Td>
              </Table.Tr>
            ) : (
              tokens.map((token) => (
                <Table.Tr key={token.id}>
                  <Table.Td>{token.name}</Table.Td>
                <Table.Td>
                      {formatDate(token.createdAt)}
                  </Table.Td>
                  <Table.Td>
                    <Text>{formatDate(token.lastUsedAt) || 'Never'}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <ActionIcon
                    color="red"
                    onClick={() => handleDeleteToken(token.id)}
                  >
                    <IconTrash size={16} />
                  </ActionIcon>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))
            )}
          </Table.Tbody>
        </Table>
      </Paper>

      <Modal
        opened={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        title={createdToken ? 'Token Created' : 'Create New API Token'}
      >
        {createdToken ? (
          <Stack>
            <Text>Your token has been created. Make sure to copy it now as you won't be able to see it again:</Text>
            <Box p="xs" style={{ backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
              <Text>{createdToken}</Text>
            </Box>
            <Button onClick={handleCloseCreateModal}>Close</Button>
          </Stack>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); handleCreateToken(); }}>
            <TextInput
              label="Token Name"
              placeholder="Enter a name for your token"
              value={newTokenName}
              onChange={(e) => setNewTokenName(e.target.value)}
              required
              mb="md"
            />
            <Button type="submit" disabled={!newTokenName}>
              Create Token
            </Button>
          </form>
        )}
      </Modal>
    </Container>
  );
}
