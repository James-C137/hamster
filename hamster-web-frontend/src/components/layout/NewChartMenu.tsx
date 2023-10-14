import React, { useState } from 'react';
import { Button, Modal, Text, Paper } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

const NewChartMenu: React.FC = () => {
  const [opened, { open, close }] = useDisclosure();
  const [selectedButton, setSelectedButton] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const handleButtonClick = (value: string) => {
      console.log('test');
    setSelectedButton(value);
    setPage(2);
  };

  const buttonTextStyle = { fontWeight: 700 } as React.CSSProperties;
  const centerTextStyle = { textAlign: 'center', fontSize: '1.5rem' } as React.CSSProperties;
  const paperPadding = { padding: '1rem' } as React.CSSProperties;
  const backButtonStyle = { position: 'absolute', top: '1rem', left: '1rem' } as React.CSSProperties;
  const buttonStyle = {
    display: 'block',
    width: '100%',
    marginBottom: '10px',
    backgroundColor: 'white',
    borderColor: 'lightgray',
    color: 'black'
  } as React.CSSProperties;

  return (
    <div>
      <Button onClick={open}>Open Modal</Button>

      <Modal opened={opened} onClose={close} title="Make New Chart" size="xl">
        {page === 1 ? (
          <Paper style={paperPadding}>
            {['Time Between', 'Log User-Inputted Value', 'Log Time', 'Custom SQL'].map((text, idx) => (
              <Button key={idx} style={buttonStyle} onClick={() => handleButtonClick(text)}>
                <Text size="xl" style={buttonTextStyle}>{text}</Text> <br />
                <Text>subtext {idx + 1}</Text>
              </Button>
            ))}
          </Paper>
        ) : (
          <Paper style={paperPadding}>
            <Button style={backButtonStyle} onClick={() => setPage(1)}>
              Back
            </Button>
            <Text style={centerTextStyle}>{selectedButton}</Text>
          </Paper>
        )}

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: page === 1 ? 'black' : 'gray', margin: '0 5px' }} onClick={() => setPage(1)}></span>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: page === 2 ? 'black' : 'gray', margin: '0 5px' }}></span>
        </div>
      </Modal>
    </div>
  );
}

export default NewChartMenu;
