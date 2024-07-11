import React, { useState, useEffect } from "react";
import axios from "axios"; // Import Axios library
import {
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box, // Import Box component for styling
} from "@mui/material";

const ViewReports = () => {
  const [reportsData, setReportsData] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    fetchReportsData();
  }, []);

  const fetchReportsData = async () => {
    try {
      const response = await axios.get(
        "https://5vtv0ubdph.execute-api.us-east-1.amazonaws.com/dev/getreports"
      );
      const responseData = JSON.parse(response.data.body); // Parse the JSON string in the "body" property
      setReportsData(responseData.reports);
    } catch (error) {
      console.error("Error fetching reports data:", error);
    }
  };

  const handleReportClick = (report) => {
    setSelectedReport(report);
  };

  const handleClose = () => {
    setSelectedReport(null);
  };

  return (
    <Container
      maxWidth=""
      style={{ marginTop: "35px", marginLeft: "10px", marginBottom: "35px" }}
    >
      <Grid container spacing={8}>
        {reportsData.map((report, index) => (
          <Grid item xs={12} sm={4} md={3} key={index}>
            <Card
              sx={{ maxWidth: 400, height: 300 }} // Set fixed dimensions for the card
              style={{ cursor: "pointer" }}
              onClick={() => handleReportClick(report)}
            >
              <CardMedia
                component="img"
                height="240"
                image={report.imageUrl?.S || "../assets/default-image.png"}
                alt="Report Image"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {report.title?.S || "Title"}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={Boolean(selectedReport)} onClose={handleClose}>
        <DialogTitle>{selectedReport?.title?.S || "Title"}</DialogTitle>
        <DialogContent>
          <Box maxHeight="500px" overflow="auto" maxWidth="500px">
            <CardMedia
              component="img"
              height="340"
              image={
                selectedReport?.imageUrl?.S || "../assets/default-image.png"
              }
              alt="Report Image"
              style={{
                objectFit: "contain",
                width: "100%",
                whiteSpace: "nowrap",
              }}
            />
            <DialogContentText
              style={{
                maxHeight: "200px",
                wordWrap: "break-word",
              }}
            >
              {selectedReport?.description?.S || "Description"}
            </DialogContentText>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ViewReports;
