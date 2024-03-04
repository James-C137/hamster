import { AppShell, Burger, Group, Skeleton, Text, TextInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ReactNode, useState } from 'react';
import NewChartMenu from './NewChartMenu';
import Cookies from 'js-cookie';

interface ShellProps {
  onUsernameChange: (newUsername: string) => void;
  children?: ReactNode;
}

export function Shell({ onUsernameChange, children }: ShellProps) {
  const [isBurgerOpen, { toggle: toggleBurger }] = useDisclosure();
  const [showDescription, setShowDescription] = useState(false);

  return (
    <AppShell
      header={{ height: { base: 60, md: 70, lg: 80 } }}
      navbar={{
        width: { sm: 240, md: 280},
        breakpoint: 'sm',
        collapsed: { mobile: !isBurgerOpen },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={isBurgerOpen} onClick={toggleBurger} hiddenFrom="sm" size="sm" />
          <Text size="xl" fw={700}>🐹 Hamster</Text>
          <NewChartMenu />
          <TextInput 
            placeholder='username'
            defaultValue={Cookies.get('username')}
            onKeyDown={(event) => {
              // Check if the key pressed is 'Enter'
              if (event.key === 'Enter') {
                // Call your onUsernameChange function or any other function
                onUsernameChange(event.currentTarget.value);
                setShowDescription(false);
              }
            }}
            onChange={() => setShowDescription(true)}
          />
          <Text c='#b0b0b0'>{showDescription ? 'press enter to update username' : null}</Text>
        </Group>
      </AppShell.Header>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
