import React, { useState } from 'react';
import { Button, Modal, Text, Paper, TextInput, ActionIcon } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import axios from 'axios';
import { buttonSpacing, buttonStyle, buttonTextStyle, pageIconStyle, paperStyle, subtextStyle, titleStyle } from './NewChartMenu.styles';
import { Shortcut, shortcutTypes } from './ShortcutTypes';
import { Plus } from 'tabler-icons-react';

const CHARTS_API_URL = 'https://qiqp6ejx2c.execute-api.us-east-1.amazonaws.com/prod/charts';

interface NewChartMenuProps {
  username: string | undefined
}

export function NewChartMenu({ username }: NewChartMenuProps){
  const [opened, { open, close }] = useDisclosure();
  const [selectedButton, setSelectedButton] = useState<Shortcut | null>(null);
  const [page, setPage] = useState(1);
  const [newTemplateName, setTemplateName] = useState<string>('');
  const canOpenNewChartMenu = username != undefined && username.length > 1;

  const onModalClose = () => {
    setPage(1);
    setSelectedButton(null);
    setTemplateName('');
    close();
  }

  const handleButtonClick = (value: Shortcut) => {
    setSelectedButton(value);
    setPage(2);
  };

  const createShortcut = async (selectedButton: Shortcut, name: string, username: string) => {
    // add API here
    // https://qiqp6ejx2c.execute-api.us-east-1.amazonaws.com/prod/charts?ownerId=premelon

    await axios.post(`${CHARTS_API_URL}?ownerId=${username}`, JSON.stringify({
      chartType: selectedButton.chartType,
      queryType: selectedButton.type,
      eventName: name
    }))
  }

  return (
    <>
      <ActionIcon variant="default" onClick={() => {
        if (canOpenNewChartMenu) {
          open();
        }
      }}
      style={{height: '28px'}}>
        <Plus size={16} color={canOpenNewChartMenu ? '#000000' : '#B0B0B0'}/>
      </ActionIcon>
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
                label='Name your new shortcut'
                placeholder='Enter name here, no spaces'
                value={newTemplateName}
                onChange={(event) => setTemplateName(event.currentTarget.value.replace(' ', ''))}
              />
              <Text>
                <ol>
                  <li>Download the <a href={selectedButton?.exampleLink} target="_blank">example shortcut</a>.</li>
                  <li>Change the username to <b>{username}</b>.</li>
                  <li>Change the eventName to {newTemplateName.length > 0 ? <b>{newTemplateName}.</b> : 'the name you choose above.'}</li>
                  <li>Change the data field to be anything you want.</li>
                </ol>
                </Text>
                <Button
                  variant="filled"
                  disabled={newTemplateName.length === 0 || selectedButton == null}
                  onClick={() => {
                    if (selectedButton != null && newTemplateName.length > 0 && username != undefined) {
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
    </>
  );
};

export default NewChartMenu;
