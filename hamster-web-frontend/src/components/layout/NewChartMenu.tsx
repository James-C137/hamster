import React, { useState } from 'react';
import { Button, Modal, Text, Paper, TextInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import axios from 'axios';

type Shortcut = {
  title: string;
  type: string;
  subtext: string;
  exampleLink: string
}

const CHARTS_API_URL = 'https://qiqp6ejx2c.execute-api.us-east-1.amazonaws.com/prod/charts';

const NewChartMenu: React.FC = () => {
  const [opened, { open, close }] = useDisclosure();
  const [selectedButton, setSelectedButton] = useState<Shortcut | null>(null);
  const [page, setPage] = useState(1);
  const [newTemplateName, setTemplateName] = useState<string>('');
  const [username, setUsername] = useState<string>('premelon');

  const onModalClose = () => {
    setPage(1);
    setSelectedButton(null);
    setUsername('');
    setTemplateName('');
    close();
  }

  const handleButtonClick = (value: Shortcut) => {
    setSelectedButton(value);
    setPage(2);
  };

  const createShortcut = async (selectedButton: Shortcut, name: string, username: string) => {
    console.log(name + ' ' + username);
    // add API here
    // https://qiqp6ejx2c.execute-api.us-east-1.amazonaws.com/prod/charts?ownerId=premelon

    await axios.post(`${CHARTS_API_URL}?ownerId=${username}`, JSON.stringify({
      type: "LINE",
      queryType: selectedButton.type,
      eventName: name
    }))
  }

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

  // ['Time Between', 'Log User-Inputted Value', 'Log Time', 'Custom SQL']
  const shortcutTypes: Array<Shortcut> = [
    {
      title: 'Log Time',
      type: 'LOG_TIME',
      subtext: 'What time did you do something?',
      exampleLink: 'https://www.icloud.com/shortcuts/3c6586a381d24b4e9579ed64c494c033',
    }
  ];

  return (
    <div>
      <Button onClick={open}>Open Modal</Button>
      <Modal opened={opened} onClose={onModalClose} size="xl" centered>
        <div style={{ overflowX: 'hidden' }}>
          {page === 1 && selectedButton != null ? <Text style={titleStyle}>Make New Chart</Text> : <Text style={{ ...titleStyle, textAlign: 'center'}}>{selectedButton?.title}</Text>}

          {page === 1 || selectedButton == null ? (
            <Paper style={{ ...paperStyle }}>
              {shortcutTypes.map((shortcut, idx) => (
                <Button key={idx} style={{ ...buttonStyle, ...buttonSpacing }} onClick={() => handleButtonClick(shortcut)}>
                  <div style={buttonTextStyle}>
                    <div style={{ fontWeight: 'bold' }}>{shortcut.title}</div>
                    <Text style={subtextStyle}>{shortcut.subtext}</Text>
                  </div>
                </Button>
              ))}
            </Paper>
          ) : (
            <Paper style={{ ...paperStyle }}>
              <TextInput
                label='Enter your username here'
                placeholder='premelon'
                value={username}
                onChange={(event) => setUsername(event.currentTarget.value.replace(' ', ''))}
              />
              <TextInput
                label='Name your new shortcut'
                placeholder='Enter name here, no spaces'
                value={newTemplateName}
                onChange={(event) => setTemplateName(event.currentTarget.value.replace(' ', ''))}
              />
              <Text>
                <ol>
                  <li>Download the <a href={selectedButton?.exampleLink} target="_blank">example shortcut</a>.</li>
                  <li>Change the username to {username.length > 0 ? <b>{username}</b> : 'your username'}.</li>
                  <li>Change the eventName to {newTemplateName.length > 0 ? <b>{newTemplateName}.</b> : 'the name you choose above.'}</li>
                  <li>Change the data field to be anything you want.</li>
                </ol>
                </Text>
                <Button
                  variant="filled"
                  disabled={newTemplateName.length === 0 || selectedButton == null}
                  onClick={() => {
                    if (selectedButton != null && newTemplateName.length > 0) {
                        createShortcut(selectedButton, newTemplateName, username);
                      }
                    }
                  }
                >Create Shortcut</Button>
            </Paper>
          )}

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
            <span
              style={{ ...pageIconStyle, backgroundColor: page === 1 ? 'black' : 'lightgray', outlineColor: page === 1 ? 'black' : 'lightgray' }}
              onClick={() => {
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
