import { AppShell, Burger, Group, Skeleton, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ReactNode } from 'react';
import NewChartMenu from './NewChartMenu';

interface ShellProps {
  children?: ReactNode;
}

export function Shell({ children }: ShellProps) {
  const [isBurgerOpen, { toggle: toggleBurger }] = useDisclosure();

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
        </Group>
      </AppShell.Header>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
