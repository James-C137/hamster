import { AppShell, Burger, Button, Group, Modal, Skeleton, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ReactNode } from 'react';

interface ShellProps {
  children?: ReactNode;
}

export function Shell({ children }: ShellProps) {
  const [isBurgerOpen, { toggle: toggleBurger }] = useDisclosure();
  const [isModalOpen, { open: openModal, close: closeModal }] = useDisclosure();

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
          <Button variant="filled" onClick={openModal}>Make New Chart</Button>
          <Modal opened={isModalOpen} onClose={closeModal} title="Make new Chart" centered>Test</Modal>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        Navbar
        {Array(15)
          .fill(0)
          .map((_, index) => (
            <Skeleton key={index} h={28} mt="sm" animate={false} />
          ))}
      </AppShell.Navbar>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
