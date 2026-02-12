import { useNavigate } from "react-router-dom";
import {
  Typography,
  List,
  ListSubheader,
  ListItemButton,
  ListItemText,
  Card,
  Box,
  Container,
  ListItemIcon,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export default function Landing() {
  const navigate = useNavigate();

  const navigateToViz = (path) => navigate(`/viz?dataset=${path}`);

  return (
    <Container
      maxWidth={false}
      sx={{
        backgroundColor: "#ebebeb",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Card
        sx={{
          flexDirection: "column",
          margin: "0 auto",
          width: "60%",
          backgroundColor: "#f7f7f7",
          padding: "20px",
          minHeight: "150px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            color: "#666666",
            textDecoration: "underline",
            textAlign: "center",
            marginBottom: "8px",
          }}
        >
          Datasets (Spark)
        </Typography>
        <Box display="flex" sx={{ width: "100%", justifyContent: "center" }}>
          <List
            sx={{
              width: "30%",
              bgcolor: "background.paper",
              border: "1px solid darkgray",
              borderTopLeftRadius: "8px",
              borderBottomLeftRadius: "8px",
            }}
            component="nav"
            aria-labelledby="nested-list-subheader"
            subheader={
              <ListSubheader
                component="div"
                id="nested-list-subheader"
                sx={{ fontSize: "24px", color: "gray" }}
              >
                Tutorial
              </ListSubheader>
            }
          >
            <ListItemButton onClick={() => navigateToViz("sparkTutorial")}>
              <ListItemText primary="Tutorial" />
              <ListItemIcon>
                <ArrowForwardIcon />
              </ListItemIcon>
            </ListItemButton>
          </List>

          <List
            sx={{
              width: "30%",
              bgcolor: "background.paper",
              border: "1px solid darkgray",
            }}
            component="nav"
            aria-labelledby="nested-list-subheader"
            subheader={
              <ListSubheader
                component="div"
                id="nested-list-subheader"
                sx={{ fontSize: "24px", color: "gray" }}
              >
                Small
              </ListSubheader>
            }
          >
            <ListItemButton onClick={() => navigateToViz("sparkEasy1")}>
              <ListItemText primary="Small #1" />
              <ListItemIcon>
                <ArrowForwardIcon />
              </ListItemIcon>
            </ListItemButton>

            <ListItemButton onClick={() => navigateToViz("sparkEasy2")}>
              <ListItemText primary="Small #2" />
              <ListItemIcon>
                <ArrowForwardIcon />
              </ListItemIcon>
            </ListItemButton>
          </List>

          <List
            sx={{
              width: "30%",
              bgcolor: "background.paper",
              border: "1px solid darkgray",
            }}
            component="nav"
            aria-labelledby="nested-list-subheader"
            subheader={
              <ListSubheader
                component="div"
                id="nested-list-subheader"
                sx={{ fontSize: "24px", color: "gray" }}
              >
                Medium
              </ListSubheader>
            }
          >
            <ListItemButton onClick={() => navigateToViz("sparkMedium1")}>
              <ListItemText primary="Medium #1" />
              <ListItemIcon>
                <ArrowForwardIcon />
              </ListItemIcon>
            </ListItemButton>

            <ListItemButton onClick={() => navigateToViz("sparkMedium2")}>
              <ListItemText primary="Medium #2" />
              <ListItemIcon>
                <ArrowForwardIcon />
              </ListItemIcon>
            </ListItemButton>
          </List>

          <List
            sx={{
              width: "30%",
              bgcolor: "background.paper",
              border: "1px solid darkgray",
              borderTopRightRadius: "8px",
              borderBottomRightRadius: "8px",
            }}
            component="nav"
            aria-labelledby="nested-list-subheader"
            subheader={
              <ListSubheader
                component="div"
                id="nested-list-subheader"
                sx={{ fontSize: "24px", color: "gray" }}
              >
                Large
              </ListSubheader>
            }
          >
            <ListItemButton onClick={() => navigateToViz("sparkHard")}>
              <ListItemText primary="Large #1" />
              <ListItemIcon>
                <ArrowForwardIcon />
              </ListItemIcon>
            </ListItemButton>
          </List>
        </Box>
      </Card>
    </Container>
  );
}
