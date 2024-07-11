import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate, useLocation } from "react-router-dom";

const StyledButton = styled(Button)(({ theme, isActive }) => ({
  color: isActive ? "white" : "inherit",
  marginRight: "15px",
  backgroundColor: isActive ? "black" : "transparent",
  "&:hover": {
    background: isActive ? "black" : "transparent",
    color: "white",
  },
}));

const LogoutButton = styled(Button)({
  color: "inherit",
  marginLeft: "15px",
  backgroundColor: "#ff0000",
  "&:hover": {
    backgroundColor: "#cc0000",
  },
});

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const renderButtons = () => {
    if (location.pathname === "/" || location.pathname === "/signup") {
      return null;
    } else {
      return (
        <>
          <StyledButton
            isActive={location.pathname === "/addreport"}
            onClick={() => navigate("/addreport")}
          >
            Add Report
          </StyledButton>
          <StyledButton
            isActive={location.pathname === "/viewreports"}
            onClick={() => navigate("/viewreports")}
          >
            View Reports
          </StyledButton>
          <LogoutButton onClick={() => navigate("/")}>Logout</LogoutButton>
        </>
      );
    }
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          QuickReads
        </Typography>
        {renderButtons()}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
