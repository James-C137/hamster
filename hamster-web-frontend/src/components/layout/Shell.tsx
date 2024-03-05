import { AppShell, Burger, Group, Modal, ActionIcon, Text, TextInput, Radio } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ReactNode, useState } from 'react';
import { Calendar } from 'tabler-icons-react';
import NewChartMenu from './NewChartMenu';
import Cookies from 'js-cookie';

interface ShellProps {
  onUsernameChange: (newUsername: string) => void;
  onTimeRangeChange: (newRange: number) => void;
  children?: ReactNode;
}

const RADIO_SPACING_DIV = <div style={{height: '5px'}} />;

export function Shell({ onUsernameChange, onTimeRangeChange, children }: ShellProps) {
  const [isBurgerOpen, { toggle: toggleBurger }] = useDisclosure();
  const [showDescription, setShowDescription] = useState(false);
  const [isTimeRangeModalOpen, setIsTimeRangeModalOpen] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState('7'); // Default selected time range

  return (
    <AppShell
      header={{ height: { base: 60, md: 70, lg: 80 } }}
      navbar={{
        width: { sm: 240, md: 280 },
        breakpoint: 'sm',
        collapsed: { mobile: !isBurgerOpen },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={isBurgerOpen} onClick={toggleBurger} hiddenFrom="sm" size="sm" />
          <Text size="xl" fw={700}>🐹 Hamster</Text>
          <ActionIcon variant="default" onClick={() => setIsTimeRangeModalOpen(true)}>
            <Calendar size={16} />
          </ActionIcon>
          <Modal
            opened={isTimeRangeModalOpen}
            onClose={() => setIsTimeRangeModalOpen(false)}
            title="Select time range"
            size="lg"
          >
            <Radio.Group
              value={selectedTimeRange}
              onChange={(value) => {
                setSelectedTimeRange(value);
                onTimeRangeChange(parseInt(value));
              }}
            >
              <Radio value="1" label="1 day" />
              {RADIO_SPACING_DIV}
              <Radio value="7" label="7 days" />
              {RADIO_SPACING_DIV}
              <Radio value="14" label="14 days" />
              {RADIO_SPACING_DIV}
              <Radio value="28" label="28 days" />
            </Radio.Group>
          </Modal>
          <NewChartMenu />
          <TextInput 
            placeholder='username'
            defaultValue={Cookies.get('username')}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                onUsernameChange(event.currentTarget.value);
                setShowDescription(false);
              }
            }}
            onChange={() => setShowDescription(true)}
          />
          {showDescription && <Text color='#b0b0b0'>press enter to update username</Text>}
        </Group>
      </AppShell.Header>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
