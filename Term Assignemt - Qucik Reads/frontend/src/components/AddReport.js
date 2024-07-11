import React, { useState } from "react";
import { Typography, TextField, Button, Box, Paper, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddReport = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState(null);

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!image) {
      console.error("No image selected");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(image);

    reader.onloadend = () => {
      const base64Image = reader.result;
      const reportData = {
        title: title,
        email: email,
        description: description,
        image: base64Image,
      };

      submitReport(reportData);
    };
  };

  const submitReport = async (reportData) => {
    try {
      await axios.post(
        "https://5vtv0ubdph.execute-api.us-east-1.amazonaws.com/dev/addreport",
        JSON.stringify(reportData),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      navigate("/viewreports");
    } catch (error) {
      console.error("Error submitting report:", error);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="90vh"
    >
      <Paper elevation={2} style={{ padding: 20, width: "50%" }}>
        <Typography
          variant="h4"
          gutterBottom
          textAlign={"center"}
          style={{
            fontFamily: "Arial, sans-serif",
            letterSpacing: "1px",
          }}
        >
          Report Incident
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Title"
                value={title}
                onChange={handleTitleChange}
                variant="outlined"
                size="small"
                sx={{ mb: 2, boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)" }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                variant="outlined"
                size="small"
                sx={{ mb: 2, boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)" }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={description}
                onChange={handleDescriptionChange}
                variant="outlined"
                size="small"
                sx={{ mb: 2, boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)" }}
              />
            </Grid>

            <Grid item xs={12}>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                textAlign: "center",
                mt: 2,
              }}
            >
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  mb: 2,
                  backgroundColor: "#ff0000",
                  "&:hover": {
                    backgroundColor: "#cc0000",
                  },
                  width: "50%",
                  fontSize: "1.1rem",
                }}
              >
                Report
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
      <Box ml={2}>
        <img
          src="/report.jpg"
          alt="Report"
          style={{ maxHeight: 400, maxWidth: "100%", objectFit: "contain" }}
        />
      </Box>
    </Box>
  );
};

export default AddReport;
