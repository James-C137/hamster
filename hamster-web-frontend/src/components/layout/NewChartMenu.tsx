import React, { useState, useEffect } from 'react';
import { Button, Modal, Text, Paper } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

const NewChartMenu: React.FC = () => {
  const [opened, { open, close }] = useDisclosure();
  const [selectedButton, setSelectedButton] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [prevPage, setPrevPage] = useState<number | null>(null);
  const [animationStyle, setAnimationStyle] = useState({});

  const handleButtonClick = (value: string) => {
    setPrevPage(page);
    setSelectedButton(value);
    setPage(2);
  };

  useEffect(() => {
    let newAnimationStyle = {};
    if (page === 1) {
      newAnimationStyle = prevPage === 2 ? fadeInFromLeft : {};
    } else if (page === 2) {
      newAnimationStyle = prevPage === 1 ? fadeInFromRight : {};
    }
    setAnimationStyle(newAnimationStyle);
  }, [page, prevPage]);

  const titleStyle = { fontWeight: 700, fontSize: '1.5rem', textAlign: 'center' } as React.CSSProperties;
const buttonStyle = {
  width: '100%',
  marginBottom: '10px',
  backgroundColor: 'white',
  borderColor: 'lightgray',
  color: 'black',
  textAlign: 'left',
  padding: '10px',
  height: '70px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center', // This will center the items vertically
  alignItems: 'center', // This will center the items horizontally
  borderRadius: '15px'    
} as React.CSSProperties;
const paperStyle = { padding: '1rem', height: '400px' } as React.CSSProperties;
const subtextStyle = { color: 'lightgray', marginTop: '5px', fontSize: '13px' } as React.CSSProperties;  

const buttonTextStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center', // ensures vertical centering
  height: '100%', // takes the full height of the parent button
  fontSize: '18px'
} as React.CSSProperties;

const buttonSpacing = {
  marginBottom: '10px', // Adjust as needed
} as React.CSSProperties;

const pageIconStyle = {
  width: '10px',
  height: '10px',
  borderRadius: '50%',
  margin: '5px 5px',
  outline: '1px solid'
}

  return (
    <div>
      <Button onClick={open}>Open Modal</Button>
      <Modal opened={opened} onClose={close} size="xl" centered>
        <div style={{ overflowX: 'hidden' }}>
          <Text style={titleStyle}>Make New Chart</Text>

          {page === 1 ? (
            <Paper style={{ ...paperStyle, ...animationStyle }}>
              {['Time Between', 'Log User-Inputted Value', 'Log Time', 'Custom SQL'].map((text, idx) => (
                <Button key={idx} style={{ ...buttonStyle, ...buttonSpacing }} onClick={() => handleButtonClick(text)}>
                  <div style={buttonTextStyle}>
                    <div style={{ fontWeight: 'bold' }}>{text}</div>
                    <Text style={subtextStyle}>subtext {idx + 1}</Text>
                  </div>
                </Button>
              ))}
            </Paper>
          ) : (
            <Paper style={{ ...paperStyle, ...animationStyle }}>
              <Text style={{ ...titleStyle, textAlign: 'center', marginTop: '100px' }}>{selectedButton}</Text>
            </Paper>
          )}

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
            <span
              style={{ ...pageIconStyle, backgroundColor: page === 1 ? 'black' : 'lightgray', outlineColor: page === 1 ? 'black' : 'lightgray' }}
              onClick={() => {
                setPrevPage(page);
                setPage(1);
              }}
            ></span>
            <span style={{ ...pageIconStyle, backgroundColor: page === 2 ? 'black' : 'white', outlineColor: 'black' }}></span>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default NewChartMenu;
