import { useEffect, useContext, useMemo } from "react";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { selectorContext } from "../../../../../contexts/selectorContext";

const ClassSelector = () => {
  const {
    selectedClass,
    setSelectedClass,
    setSelectedTests,
    setSelectedAutomaticTests,
    setSelectedManualTests,
    setSelectedMethodClass,
    setSelectedMethod,
    selectedDataset,
    setMethodType,
  } = useContext(selectorContext);

  const handleChange = (event) => {
    setSelectedClass(event.target.value);
    setSelectedTests({});
    setSelectedManualTests({});
    setSelectedAutomaticTests({});
  };


  useEffect(() => {
    if (selectedClass || !selectedDataset) return;
    const first = Object.keys(selectedDataset.testoptions);
    setSelectedClass(first[0]);
    setSelectedTests({});
    setSelectedManualTests({});
    setSelectedAutomaticTests({});
    setSelectedMethodClass("");
    setSelectedMethod("");
    setMethodType("");
  }, [
    selectedClass,
    setSelectedClass,
    setSelectedTests,
    setSelectedMethod,
    setSelectedMethodClass,
    setSelectedAutomaticTests,
    setSelectedManualTests,
    selectedDataset,
    setMethodType,
  ]);

  if (!selectedDataset) return <></>

  return (
    <Select
      labelId="class-select"
      id="class-selector"
      value={selectedClass}
      label="Class"
      onChange={handleChange}
      sx={{ width: "100%" }}
    >
      {Object.keys(selectedDataset.testoptions).map((c) => (
        <MenuItem key={c} value={c}>
          {c}
        </MenuItem>
      ))}
    </Select>
  );
};

export default ClassSelector;
