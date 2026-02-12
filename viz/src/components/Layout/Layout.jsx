import { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Unstable_Grid2";
import { styled } from "@mui/material/styles";
import PropTypes from "prop-types";
import { selectorContext } from "../../contexts/selectorContext";
import { useSearchParams } from 'react-router-dom';
import { Navigate } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { getDatasets } from "../../api/fetchers";

const Item = styled(Paper)(({ theme, heightproportion }) => ({
  ...theme.typography.body2,
  textAlign: "center",
  color: theme.palette.text.secondary,
  height: `${heightproportion}vh`,
  display: "flex",
}));

const Background = styled("div")(({ theme }) => ({
  backgroundColor: "#F5F5F5",
  height: "100vh",
  width: "100%",
  boxSizing: "border-box",
  padding: theme.spacing(2),
  overflow: 'auto'
}));

const Layout = ({ leftContent, rightContent }) => {
  const [searchParams] = useSearchParams();
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedTests, setSelectedTests] = useState({});
  const [selectedAutomaticTests, setSelectedAutomaticTests] = useState({});
  const [selectedManualTests, setSelectedManualTests] = useState({});
  const [selectedMethodClass, setSelectedMethodClass] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("");
  const [methodLine, setMethodLine] = useState(0);
  const [selectedTab, setSelectedTab] = useState(0);
  const [methodType, setMethodType] = useState();

  const [selectedDataset, setSelectedDataset] = useState();

  const selectedDatasetName = searchParams.get("dataset");

  useEffect(() => {
    if (!selectedDatasetName) return;
    getDatasets(selectedDatasetName, setSelectedDataset)
  }, [selectedDatasetName]);

  // const selectedDataset = datasets[selectedDatasetName];


  if (!selectedDatasetName) return <Navigate to={`/`} />

  if (!selectedDataset) return (
    <Background sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <CircularProgress size={100}/>
      </Box>
    </Background>
  )

  return (
    <selectorContext.Provider
      value={{
        selectedClass,
        setSelectedClass,
        selectedTests,
        setSelectedTests,
        selectedAutomaticTests,
        setSelectedAutomaticTests,
        selectedManualTests,
        setSelectedManualTests,
        selectedMethodClass,
        setSelectedMethodClass,
        selectedMethod,
        setSelectedMethod,
        methodLine,
        setMethodLine,
        selectedTab,
        setSelectedTab,
        selectedDataset,
        methodType,
        setMethodType,
      }}
    >
      <Background>
        <Grid container spacing={2}>
          <Grid xs={12} md={selectedTab === 0 ? 4 : 6}>
            <Item heightproportion={95}>{leftContent}</Item>
          </Grid>
          <Grid xs={12} md={selectedTab === 0 ? 8 : 6}>
            <Item heightproportion={95}>{rightContent}</Item>
          </Grid>
        </Grid>
      </Background>
    </selectorContext.Provider>
  );
};

Layout.propTypes = {
  leftContent: PropTypes.object,
  rightContent: PropTypes.object,
  bottomContent: PropTypes.object,
};

export default Layout;
