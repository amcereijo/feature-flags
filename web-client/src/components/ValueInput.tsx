import { Switch, TextInput, NumberInput, Group, Text, Select } from '@mantine/core';
import type { FeatureValueType } from '../types/feature.types';

interface ValueInputProps {
  value: boolean | string | number;
  valueType: FeatureValueType;
  onChange: (value: boolean | string | number) => void;
  onTypeChange: (type: FeatureValueType) => void;
  label?: string;
  description?: string;
}

export const ValueInput = ({
  value,
  valueType,
  onChange,
  onTypeChange,
  label = 'Value',
  description,
}: ValueInputProps) => {
  const renderInput = () => {
    switch (valueType) {
      case 'boolean':
        return (
          <Switch
            checked={Boolean(value)}
            onChange={(e) => onChange(e.currentTarget.checked)}
            size="md"
          />
        );
      case 'number':
        return (
          <NumberInput
            value={Number(value)}
            onChange={(val) => onChange(val || 0)}
            placeholder="Enter a number"
          />
        );
      case 'string':
        return (
          <TextInput
            value={String(value)}
            onChange={(e) => onChange(e.currentTarget.value)}
            placeholder="Enter a text value"
          />
        );
    }
  };

  return (
    <div>
      <Group justify="space-between" mb="xs">
        <div>
          {label && <Text fw={500}>{label}</Text>}
          {description && (
            <Text size="xs" c="dimmed">
              {description}
            </Text>
          )}
        </div>
        <Select
          value={valueType}
          onChange={(val) => val && onTypeChange(val as FeatureValueType)}
          data={[
            { value: 'boolean', label: 'Boolean' },
            { value: 'string', label: 'Text' },
            { value: 'number', label: 'Number' },
          ]}
          style={{ width: '100px' }}
        />
      </Group>
      {renderInput()}
    </div>
  );
};
