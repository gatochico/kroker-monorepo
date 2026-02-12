import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Box from "@mui/material/Box";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import MuiToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Checkbox from "@mui/material/Checkbox";
import { styled } from "@mui/material";
import { backgroundColors } from "../../../../../constants/constants";

const ColorBox = styled("div")(({ color }) => ({
  width: "15px",
  height: "15px",
  border: "solid black 1px",
  backgroundColor: color,
}));

const ToggleButton = styled(MuiToggleButton)({
  "&.Mui-selected, &.Mui-selected:hover": {
    backgroundColor: "darkgray",
  },
});

// eslint-disable-next-line react/prop-types
const TestSelectionBox = ({ selectedTests, setSelectedTests }) => {
  const handleChange = (value) => {
    const tests = { ...selectedTests };
    tests[value.name.name.toLowerCase()].selected =
      !tests[value.name.name.toLowerCase()].selected;
    if (!tests[value.name.name.toLowerCase()].selected)
      tests[value.name.name.toLowerCase()].color = null;
    setSelectedTests(tests);
  };

  const changeColor = (newValue, name) => {
    const tests = { ...selectedTests };
    tests[name.toLowerCase()].color = newValue;
    setSelectedTests(tests);
  };

  return (
    <Box
      sx={{
        maxHeight: "250px",
        width: "100%",
        overflow: "auto",
        bgcolor: "background.paper",
        scrollbarWidth: "thin",
        "&::-webkit-scrollbar": {
          width: "0.4em",
        },
        "&::-webkit-scrollbar-track": {
          background: "#f1f1f1",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#888",
        },
        "&::-webkit-scrollbar-thumb:hover": {
          background: "#555",
        },
      }}
    >
      <List sx={{ width: "100%", bgcolor: "background.paper", py: 0 }}>
        {Object.values(selectedTests).map((test) => {
          const labelId = `checkbox-list-label-${test.name.name}`;
          return (
            <ListItem key={test.name.name} sx={{ py: 0 }}>
              <ListItemButton disableRipple dense>
                <ListItemIcon>
                  <Checkbox
                    onClick={() => handleChange(test)}
                    edge="start"
                    checked={test.selected}
                    disableRipple
                  />
                </ListItemIcon>
                <ListItemText
                  id={labelId}
                  primary={
                    <Typography
                      sx={{
                        width: "85%",
                        textAlign: "left",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {test.name.name}
                    </Typography>
                  }
                />
                {test.selected && (
                  <>
                    <ListItemText
                      id={labelId}
                      primary={
                        <Typography
                          sx={{
                            display: "flex",
                            textAlign: "right",
                            marginRight: 2,
                            justifyContent: "right",
                          }}
                        >
                          Group:
                        </Typography>
                      }
                    />
                    <ToggleButtonGroup
                      size="small"
                      exclusive
                      value={test.color}
                      onChange={(event, newValue) =>
                        changeColor(newValue, test.name.name)
                      }
                    >
                      <ToggleButton
                        value={"groupA"}
                        key={test.name.name + "groupA"}
                      >
                        <ColorBox color={backgroundColors.GroupA} />
                      </ToggleButton>
                      <ToggleButton
                        value={"groupB"}
                        key={test.name.name + "groupB"}
                      >
                        <ColorBox color={backgroundColors.GroupB} />
                      </ToggleButton>
                    </ToggleButtonGroup>
                  </>
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};

export default TestSelectionBox;
