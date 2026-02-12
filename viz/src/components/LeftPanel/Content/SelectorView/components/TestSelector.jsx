import { useEffect, useContext, useState } from "react";
import { selectorContext } from "../../../../../contexts/selectorContext";
import TestSelectionBox from "./TestSelectionBox";
import { Box, Chip, Typography, styled, Button, ButtonGroup } from "@mui/material";
import { backgroundColors } from "../../../../../constants/constants";

const ColorBox = styled('div')(({color}) => ({
  width: "15px",
  height: "15px",
  border: "solid black 1px",
  backgroundColor: color,
}));

const Div = styled(Box)(() => ({
  width: "95%",
  height: "100%",
  minWidth: "90%",
  display: "flex",
  flexDirection: "column",
  textAlign: "start",
  marginLeft: "5%",
}));
const Boxes = styled(Box)(() => ({
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  marginTop: "12px",
  gap: 20,
}));
const Row = styled(Box)(() => ({
  width: "95%",
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  paddingBottom: "8px",
}));
const TitleRow = styled(Box)(() => ({
  width: "95%",
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
}));

const TestSelector = () => {
  const {
    selectedClass,
    selectedTests,
    setSelectedTests,
    selectedAutomaticTests,
    setSelectedAutomaticTests,
    selectedManualTests,
    setSelectedManualTests,
    selectedDataset,
  } = useContext(selectorContext);

  const [selectTestCount, setSelectedTestCount] = useState({
    manual: { total: 0, checked: 0 },
    automatic: { total: 0, checked: 0 },
  });

  useEffect(() => {
    if (selectedClass) {
      if (Object.values(selectedTests).length || !selectedDataset) return;
      const testoptions = {};
      selectedDataset.testoptions[selectedClass].forEach(
        (test) =>
          (testoptions[test.name.toLowerCase()] = {
            name: test,
            selected: false,
            color: null,
          })
      );
      const filteredAutomaticTestOptions = Object.fromEntries(
        Object.entries(testoptions).filter(
          ([, value]) => value.name.type === "Automatic"
        )
      );
      const filteredManualTestOptions = Object.fromEntries(
        Object.entries(testoptions).filter(
          ([, value]) => value.name.type === "Manual"
        )
      );
      setSelectedAutomaticTests(filteredAutomaticTestOptions);
      setSelectedManualTests(filteredManualTestOptions);
    }
  }, [selectedClass, setSelectedTests, selectedTests, setSelectedAutomaticTests, setSelectedManualTests]);

  useEffect(() => {
    const allTests = {...selectedAutomaticTests, ...selectedManualTests}
    setSelectedTests(allTests)
    const totalAutomatic = Object.keys(selectedAutomaticTests).length;
    const totalManual = Object.keys(selectedManualTests).length;
    const checkedAutomatic = Object.values(selectedAutomaticTests).filter((t) => t.selected).length;
    const checkedManual = Object.values(selectedManualTests).filter((t) => t.selected).length;
    setSelectedTestCount({
      manual: { total: totalManual, checked: checkedManual },
      automatic: { total: totalAutomatic, checked: checkedAutomatic },
    })
  }, [selectedAutomaticTests, selectedManualTests, setSelectedTests])

  const groupATests = Object.values(selectedTests).filter(
    (test) => test.color === "groupA"
  );
  const groupBTests = Object.values(selectedTests).filter(
    (test) => test.color === "groupB"
  );

  const handleDeleteChip = (test) => {
    const updatedTests = { ...selectedTests };
    const deletedTest = updatedTests[test.name.name.toLowerCase()];
    deletedTest.color = null;
    setSelectedTests(updatedTests);
  };

  const handleSelectAll = (testType, action) => {
    if (action === "unselect") {
      const newTests = testType === "manual" ? {...selectedManualTests} : {...selectedAutomaticTests};
      const unselectedTests = {};
      Object.entries(newTests).forEach(([key, val]) => {
        unselectedTests[key] = {
          ...val,
          selected: false,
          color: null,
        }
      })
      testType === "manual" ? setSelectedManualTests(unselectedTests) : setSelectedAutomaticTests(unselectedTests);
    } else if (action === "groupA") {
      const newTests = testType === "manual" ? {...selectedManualTests} : {...selectedAutomaticTests};
      const groupATests = {};
      Object.entries(newTests).forEach(([key, val]) => {
        groupATests[key] = {
          ...val,
          selected: true,
          color: "groupA",
        }
      })
      testType === "manual" ? setSelectedManualTests(groupATests) : setSelectedAutomaticTests(groupATests);
    } else if (action === "groupB") {
      const newTests = testType === "manual" ? {...selectedManualTests} : {...selectedAutomaticTests};
      const groupBTests = {};
      Object.entries(newTests).forEach(([key, val]) => {
        groupBTests[key] = {
          ...val,
          selected: true,
          color: "groupB",
        }
      })
      testType === "manual" ? setSelectedManualTests(groupBTests) : setSelectedAutomaticTests(groupBTests);
    } 
  }

  const getAllButtons = (testType) => (
    <div>
      <ButtonGroup size="small" variant="text">
        <Button 
          sx={{borderColor: null, color: "gray", gap: "5px"}}
          onClick={() => handleSelectAll(testType, "groupA")}
        >
          All<ColorBox color={backgroundColors.GroupA}/>
        </Button>
        <Button
          sx={{borderColor: null, color: "gray", gap: "5px"}}
          onClick={() => handleSelectAll(testType, "groupB")}
        >
          All<ColorBox color={backgroundColors.GroupB}/>
        </Button>
        <Button 
          sx={{borderColor: null, color: "gray"}}
          onClick={() => handleSelectAll(testType, "unselect")}
        >
          Unselect All
        </Button>
      </ButtonGroup>
    </div>
  ) 

  return (
    <Div>
      <TitleRow>
        <Typography variant="h8" sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          Manual Tests 
          ({selectTestCount.manual.checked}/{selectTestCount.manual.total}):
        </Typography>
        {getAllButtons("manual")}
      </TitleRow>
      <Row>
        <TestSelectionBox
          selectedTests={selectedManualTests}
          setSelectedTests={setSelectedManualTests}
        />
      </Row>
      <TitleRow>
        <Typography variant="h8">
          Generated Tests
          ({selectTestCount.automatic.checked}/{selectTestCount.automatic.total}):
        </Typography>
        {getAllButtons("automatic")}
      </TitleRow>
      <Row>
        <TestSelectionBox
          selectedTests={selectedAutomaticTests}
          setSelectedTests={setSelectedAutomaticTests}
        />
      </Row>
      <Boxes>
        <Box
          sx={{ height: 120, width: "95%", borderRadius: 2, overflow:'auto' }}
          bgcolor={backgroundColors.GroupA}
        >
          {groupATests
            ? groupATests.map((test) => (
                <Chip
                  variant="blue outlined"
                  label={test.name.name}
                  onDelete={() => handleDeleteChip(test)}
                  key={test.name.name.toLowerCase()}
                  sx={{margin: 0.5}}
                />
              ))
            : null}
        </Box>
        <Box
          sx={{ height: 120, width: "95%", borderRadius: 2, overflow: 'auto' }}
          bgcolor={backgroundColors.GroupB}
        >
          {groupBTests
            ? groupBTests.map((test) => (
                <Chip
                  variant="blue outlined"
                  label={test.name.name}
                  onDelete={() => handleDeleteChip(test)}
                  key={test.name.name.toLowerCase()}
                  sx={{margin: 0.5}}
                />
              ))
            : null}
        </Box>
      </Boxes>
    </Div>
  );
};

export default TestSelector;
