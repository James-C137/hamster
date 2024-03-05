import React, { useState } from 'react';
import { Button, Modal, Text, Paper, TextInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import axios from 'axios';
import { buttonSpacing, buttonStyle, buttonTextStyle, pageIconStyle, paperStyle, subtextStyle, titleStyle } from './NewChartMenu.styles';
import { Shortcut, shortcutTypes } from './ShortcutTypes';

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
      chartType: selectedButton.chartType,
      queryType: selectedButton.type,
      eventName: name
    }))
  }

  return (
    <div>
      <Button onClick={open}>Make New Chart</Button>
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
