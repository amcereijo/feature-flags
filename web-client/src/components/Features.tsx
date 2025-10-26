import { useState } from 'react';
import {
  Table,
  Group,
  Button,
  Switch,
  TextInput,
  Modal,
  Stack,
  Title,
  Container,
  LoadingOverlay,
  Paper,
  Text,
  Badge,
  ActionIcon,
  Select,
  NumberInput,
} from '@mantine/core';
import { IconPlus, IconSearch, IconTrash, IconEdit } from '@tabler/icons-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FeatureService } from '../services/feature.service';
import { useAuth } from '@clerk/clerk-react';
import type { Feature } from '../types/feature.types';
import { getDefaultValueForType } from '../types/feature.types';

export const Features = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resourceFilter, setResourceFilter] = useState('');
  const [editingFeature, setEditingFeature] = useState<Partial<Feature> | null>(null);

  const { getToken } = useAuth();
  const featureService = new FeatureService(getToken);
  const queryClient = useQueryClient();

  const { data: features = [], isLoading } = useQuery({
    queryKey: ['features'],
    queryFn: () => featureService.getAllFeatures(),
  });

  const createMutation = useMutation({
    mutationFn: (feature: Omit<Feature, 'id'>) => featureService.createFeature(feature),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['features'] });
      setIsModalOpen(false);
      setEditingFeature(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, feature }: { id: string; feature: Feature }) =>
      featureService.updateFeature(id, feature),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['features'] });
      setIsModalOpen(false);
      setEditingFeature(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => featureService.deleteFeature(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['features'] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFeature?.name || !editingFeature?.resourceId || !editingFeature.valueType) return;

    const feature = {
      name: editingFeature.name,
      value: editingFeature.value ?? getDefaultValueForType(editingFeature.valueType),
      valueType: editingFeature.valueType,
      resourceId: editingFeature.resourceId,
      active: editingFeature.active ?? true,
    };

    if (editingFeature.id) {
      updateMutation.mutate({
        id: editingFeature.id,
        feature: { ...feature, id: editingFeature.id }
      });
    } else {
      createMutation.mutate(feature);
    }
  };

  const handleToggleActive = (feature: Feature) => {
    if (!feature.id) return;
    updateMutation.mutate({
      id: feature.id,
      feature: { ...feature, active: !feature.active },
    });
  };

  const filteredFeatures = features.filter(
    (feature) =>
      !resourceFilter || feature.resourceId.toLowerCase().includes(resourceFilter.toLowerCase())
  );

  return (
    <Container size="xl">
      <LoadingOverlay visible={isLoading} />

      <Paper shadow="xs" p="md" withBorder>
        <Group justify="space-between" mb={20}>
          <Stack gap={5}>
            <Title order={2}>Feature Flags</Title>
            <Text size="sm" c="dimmed">Manage your application feature flags</Text>
          </Stack>
          <Button
            onClick={() => {
              setEditingFeature({
                name: '',
                resourceId: '',
                value: false,
                active: true
              });
              setIsModalOpen(true);
            }}
            variant="gradient"
            gradient={{ from: 'blue', to: 'cyan', deg: 90 }}
            leftSection={<IconPlus size={14} />}
          >
            Add Feature
          </Button>
        </Group>

        <Paper p="xs" withBorder mb={20} bg="gray.0">
          <TextInput
            placeholder="Filter by resource ID"
            value={resourceFilter}
            onChange={(e) => setResourceFilter(e.target.value)}
            leftSection={<IconSearch size={14} />}
          />
        </Paper>

        <Table striped highlightOnHover withTableBorder>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Name</Table.Th>
              <Table.Th>Resource ID</Table.Th>
              <Table.Th>Value</Table.Th>
              <Table.Th>Active</Table.Th>
              <Table.Th style={{ width: '100px' }}>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {filteredFeatures.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={5} style={{ textAlign: 'center' }}>
                  <Text c="dimmed">No feature flags found</Text>
                </Table.Td>
              </Table.Tr>
            ) : (
              filteredFeatures.map((feature) => (
                <Table.Tr key={feature.id}>
                  <Table.Td>{feature.name}</Table.Td>
                  <Table.Td>
                    <Badge variant="light" color="blue">
                      {feature.resourceId}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Group>
                      {feature.valueType === 'boolean' ? (
                        <Switch
                          checked={Boolean(feature.value)}
                          onChange={() =>
                            updateMutation.mutate({
                              id: feature.id!,
                              feature: { ...feature, value: feature.value }
                            })
                          }
                          color="green"
                          size="md"
                          readOnly={true}
                        />
                      ) : (
                        <Text>{String(feature.value)}</Text>
                      )}
                      <Badge size="sm">{feature.valueType}</Badge>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Switch
                      checked={feature.active}
                      onChange={() => handleToggleActive(feature)}
                      color="blue"
                      size="md"
                    />
                  </Table.Td>
                  <Table.Td>
                    <Group gap="xs">
                      <ActionIcon
                        color="blue"
                        variant="light"
                        onClick={() => {
                          setEditingFeature(feature);
                          setIsModalOpen(true);
                        }}
                      >
                        <IconEdit size={16} />
                      </ActionIcon>
                      <ActionIcon
                        color="red"
                        variant="light"
                        onClick={() => feature.id && deleteMutation.mutate(feature.id)}
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
        opened={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingFeature(null);
        }}
        title={<Title order={3}>{editingFeature?.id ? 'Edit Feature Flag' : 'Add Feature Flag'}</Title>}
        size="md"
        padding="lg"
      >
        <form onSubmit={handleSubmit}>
          <Stack gap="md">
            <TextInput
              label="Name"
              description="The unique identifier for this feature flag"
              required
              value={editingFeature?.name || ''}
              onChange={(e) =>
                setEditingFeature((prev) => ({ ...prev, name: e.target.value }))
              }
            />
            <TextInput
              label="Resource ID"
              description="The resource this feature flag belongs to"
              required
              value={editingFeature?.resourceId || ''}
              readOnly={!!editingFeature?.id}
              onChange={(e) =>
                setEditingFeature((prev) => ({ ...prev, resourceId: e.target.value }))
              }
            />
            <Paper withBorder p="sm" bg="gray.0">
              <Stack gap="sm">
                <div>
                  <Text size="sm" fw={500}>Value Type</Text>
                  <Text size="xs" c="dimmed">Select the type of value for this feature</Text>
                  <Select
                    value={editingFeature?.valueType }
                    onChange={(value) => {
                      if (value && (value === 'boolean' || value === 'string' || value === 'number')) {
                        setEditingFeature((prev) => ({
                          ...prev,
                          valueType: value,
                          value: getDefaultValueForType(value)
                        }));
                      }
                    }}
                    data={[
                      { value: 'boolean', label: 'Boolean' },
                      { value: 'string', label: 'String' },
                      { value: 'number', label: 'Number' }
                    ]}
                    mt="xs"
                  />
                </div>
                <div>
                  <Text size="sm" fw={500}>Value</Text>
                  <Text size="xs" c="dimmed">Set the feature value</Text>
                  {editingFeature?.valueType === 'boolean' && (
                    <Switch
                      checked={typeof editingFeature?.value === 'boolean' ? editingFeature.value : false}
                      onChange={(e) => setEditingFeature((prev) => ({ ...prev, value: e.target?.checked || false }))}
                      color="green"
                      size="md"
                      mt="xs"
                    />
                  )}
                  {editingFeature?.valueType === 'string' && (
                    <TextInput
                      value={String(editingFeature?.value || '')}
                      onChange={(e) => setEditingFeature((prev) => ({ ...prev, value: e.target.value }))}
                      mt="xs"
                    />
                  )}
                  {editingFeature?.valueType === 'number' && (
                    <NumberInput
                      value={Number(editingFeature?.value || 0)}
                      onChange={(value) => setEditingFeature((prev) => ({ ...prev, value: value || 0 }))}
                      mt="xs"
                    />
                  )}
                </div>
              </Stack>
            </Paper>
            <Paper withBorder p="sm" bg="gray.0">
              <Group justify="space-between">
                <div>
                  <Text size="sm" fw={500}>Active</Text>
                  <Text size="xs" c="dimmed">Control if this flag is active in the system</Text>
                </div>
                <Switch
                  checked={editingFeature?.active ?? true}
                  onChange={(e) =>
                    setEditingFeature((prev) => ({ ...prev, active: e.target.checked }))
                  }
                  color="blue"
                  size="md"
                />
              </Group>
            </Paper>
            <Group justify="flex-end" mt="md">
              <Button
                variant="light"
                color="gray"
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingFeature(null);
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={createMutation.isPending || updateMutation.isPending}
                variant="gradient"
                gradient={{ from: 'blue', to: 'cyan', deg: 90 }}
              >
                {editingFeature?.id ? 'Save Changes' : 'Add Feature'}
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Container>
  );
};
