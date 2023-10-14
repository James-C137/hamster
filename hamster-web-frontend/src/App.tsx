import { MantineProvider, SimpleGrid } from '@mantine/core';
import '@mantine/core/styles.css';
import './App.css';
import { Graph } from './components/Graph/Graph';
import { Shell } from './components/Shell/Shell';

function App() {

  return (
    <MantineProvider>
      <Shell>
        <SimpleGrid cols={{ base: 1, sm: 1, md: 2, lg: 2, xl: 3 }}>
          <Graph />
          <Graph />
          <Graph />
          <Graph />
          <Graph />
          <Graph />
          <Graph />
          <Graph />
        </SimpleGrid>
      </Shell>
    </MantineProvider>
  )
}

export default App
