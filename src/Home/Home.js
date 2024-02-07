import React, { useState, useEffect } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { Button } from '@mui/material';

export default function Home() {
  const api = process.env.REACT_APP_BACKEND_URL;
  const [value, setValue] = useState('');
  const { userId } = useParams();
  const [socket, setSocket] = useState(null);
  let xp = 0;

  useEffect(() => {
    if (xp === 0) {
      xp++;
      const s = io(`${api}`);
      setSocket(s);
      s.emit('join-room', userId);
      s.emit('first', { id: userId });
      s.on('second', async (newData) => {
        setValue(newData.textabout);
      });
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (socket !== null && userId !== null && value !== '') {
      const newData = {
        id: userId,
        textabout: String(value)
      };

      socket.emit('change_backend', newData);
      socket.on('second', async (newData) => {
        setValue(newData.textabout);
      });
    }
  }, [socket, value, userId]);

  function downloadText() {
    const text = value;
    const newText = new Blob([text], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(newText);
    link.download = `file${userId}.txt`;
    link.click();
    setTimeout(() => {
      URL.revokeObjectURL(link.href);
    }, 100);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-1/2 bg-white shadow-md rounded-md p-4">
        <textarea
          className="border border-gray-300 p-2 w-full rounded-md resize-none"
          placeholder="Enter Data"
          onChange={(e) => setValue(e.target.value)}
          value={value}
          rows={3}
        />
        <div className="mt-4 space-x-2">
          <CopyToClipboard text={value}>
            <Button variant="contained" color="primary">
              Copy This
            </Button>
          </CopyToClipboard>
          <Button variant="contained" color="secondary" onClick={downloadText}>
            Download
          </Button>
        </div>
      </div>
    </div>
  );
}
