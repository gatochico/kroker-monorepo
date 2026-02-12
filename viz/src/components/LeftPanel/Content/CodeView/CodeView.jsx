import { useState, useContext } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CodeBlock from './CodeBlock';

import { selectorContext } from '../../../../contexts/selectorContext';

const CodeView = () => {
  const {
    selectedMethodClass,
  } = useContext(selectorContext);
  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column'}}>
        
        <Typography variant="h5" gutterBottom>
          {selectedMethodClass && `Code File: ${selectedMethodClass}`}
        </Typography>
        <Box sx={{ 
          textAlign: 'left',
          maxHeight: '80vh',
          overflow: 'auto',
          bgcolor: '#f7f7f7',
          scrollbarWidth: 'thin',
          '&::-webkit-scrollbar': {
            width: '0.4em',
          },
          '&::-webkit-scrollbar-track': {
            background: "#f1f1f1",
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#888',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#555'
          }}}>
          <CodeBlock></CodeBlock>
        </Box>
    </Box>
  )
}

export default CodeView
