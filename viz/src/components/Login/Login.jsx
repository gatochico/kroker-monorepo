import React, { useState } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import { Typography, TextField } from "@mui/material";
export default function Login({ clicked, setToken }) {
  const [password, setPassword] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setToken(password);
  };

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
        <div className="login-wrapper">
          <Typography variant="h4" gutterBottom sx={{ textAlign: "center" }}>
            Enter
          </Typography>
          <form onSubmit={handleSubmit}>
            <Box
              sx={{
                display: "flex",
                gap: "10px",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                label="Password"
                variant="outlined"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                error={clicked}
                helperText={clicked && "Incorrect password."}
              />
              <div>
                <Button type="submit" variant="contained" disabled={!password}>
                  Enter
                </Button>
              </div>
            </Box>
          </form>
        </div>
      </Card>
    </Container>
  );
}

Login.propTypes = {
  setToken: PropTypes.func.isRequired,
  clicked: PropTypes.bool.isRequired,
};
