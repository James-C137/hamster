import { AppShell, Burger, Group, Modal, ActionIcon, Text, TextInput, Radio } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ReactNode, useState } from 'react';
import { Calendar, Tex, User } from 'tabler-icons-react';
import NewChartMenu from './NewChartMenu';
import Cookies from 'js-cookie';

interface ShellProps {
  onUsernameChange: (newUsername: string) => void;
  onTimeRangeChange: (newRange: number) => void;
  children?: ReactNode;
}

const RADIO_SPACING_DIV = <div style={{height: '5px'}} />;

export function Shell({ onUsernameChange, onTimeRangeChange, children }: ShellProps) {
  const [showDescription, setShowDescription] = useState(false);
  const [isTimeRangeModalOpen, setIsTimeRangeModalOpen] = useState(false);
  const [isUsernameModalOpen, setIsUsernameModalOpen] = useState(false);
  const [username, setUsername] = useState(Cookies.get('username') || '');
  const [selectedTimeRange, setSelectedTimeRange] = useState('7'); // Default selected time range

  const canOpenNewChartMenu = username != undefined && username.length > 1;

  return (
    <AppShell
      header={{ height: { base: 60, md: 70, lg: 80 } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
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
          <NewChartMenu username={username} />
          <ActionIcon variant="default" onClick={() => setIsUsernameModalOpen(true)}>
            <User size={16}/>
          </ActionIcon>
          <Modal
            opened={isUsernameModalOpen}
            onClose={() => {
              setIsUsernameModalOpen(false);
              onUsernameChange(username);
            }}
            title="Enter your username here"
            size="lg"
          >
            <TextInput 
              placeholder='Enter your username'
              value={username}
              onChange={(event) => setUsername(event.currentTarget.value)}
            />
            <Text style={{color: '#B0B0B0', fontSize: '12px', padding: '2px 0px 0px 5px'}}>Exiting this menu will autosave your username</Text>
          </Modal>
        </Group>
      </AppShell.Header>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
