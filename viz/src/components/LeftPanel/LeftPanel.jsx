import { useContext } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import SelectorView from "./Content/SelectorView/SelectorView";
import CodeView from "./Content/CodeView/CodeView";

import { selectorContext } from "../../contexts/selectorContext";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
      sx={{
        height: "100%",
        maxHeight: "90%",
        paddingTop: 2,
      }}
    >
      {value === index && children}
    </Box>
  );
}

const LeftPanel = () => {
  const { selectedTab, setSelectedTab } = useContext(selectorContext);
  const handleChange = (event, newValue) => {
    setSelectedTab(newValue);
  };
  return (
    <Box sx={{ width: "100%", height: "100%", overflow: "scroll" }}>
      <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
        <Tabs value={selectedTab} onChange={handleChange} centered>
          <Tab label="Test Selection" />
          <Tab label="Code Coverage" />
        </Tabs>
      </Box>
      <TabPanel value={selectedTab} index={0}>
        <SelectorView />
      </TabPanel>
      <TabPanel value={selectedTab} index={1}>
        <CodeView />
      </TabPanel>
    </Box>
  );
};

export default LeftPanel;
