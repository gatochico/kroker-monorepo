import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import ClassSelector from './components/ClassSelector';
import TestSelector from './components/TestSelector';

const SelectorView = () => {

  return (
    <Box sx={{ width: '100%', height: "100%", overflow: "scroll", display: "flex", flexDirection: "column"}}>
      <Box sx={{  
        whiteSpace: "nowrap",
        display: "flex",
        justifyContent: "space-between",
        margin: "4px 16px 16px",
        alignItems: "center",
        gap: "16px",
        height: "100%"
        }}>
        <Typography variant="h5">
          Select class
        </Typography>
        <ClassSelector/>
      </Box>

        <Box 
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{ flex: '0 0 auto', height: "100%" }}
        >
          <TestSelector/>
        </Box>
    </Box>
  )
}

export default SelectorView;
