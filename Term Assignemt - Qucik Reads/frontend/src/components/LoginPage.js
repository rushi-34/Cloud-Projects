import React from "react";
import {
  TextField,
  Button,
  Typography,
  Container,
  Box,
  Link,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import loginGif from "../assets/news.gif";
import { useForm, Controller } from "react-hook-form";
import { z, object } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

const validationSchema = object({
  email: z.string().email(),
  password: z.string().min(1, { message: "Password is required." }),
});

const resolver = zodResolver(validationSchema);

function LoginPage() {
  const {
    control,
    handleSubmit,
    formState: { errors },
    trigger,
    reset,
  } = useForm({
    resolver,
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const navigate = useNavigate();

  const onLoginRequest = async (data) => {
    try {
      const response = await axios.post(
        "https://5vtv0ubdph.execute-api.us-east-1.amazonaws.com/dev/login",
        JSON.stringify(data),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      navigate("/addreport");
      if (response.data.statusCode === 401) {
        window.alert("Invalid email or password");
        navigate("/");
        reset();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <Box
          sx={{
            width: "50%",
            display: "flex",
            justifyContent: "center",
            marginRight: "20px",
            "@media (max-width: 600px)": {
              display: "none",
            },
          }}
        >
          <img
            src={loginGif}
            alt="Login Gif"
            style={{ width: "100%", maxWidth: "100%", height: "auto" }}
          />
        </Box>
        <Box
          sx={{
            width: "50%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5">
            Login
          </Typography>
          <form
            style={{ width: "100%" }}
            onSubmit={handleSubmit(onLoginRequest)}
            sx={{ mt: 3 }}
          >
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  size="small"
                  onBlur={() => trigger("email")}
                />
              )}
            />
            <Typography variant="body2" color="error">
              {errors.email?.message}
            </Typography>

            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  size="small"
                  onBlur={() => trigger("password")}
                />
              )}
            />
            <Typography variant="body2" color="error">
              {errors.password?.message}
            </Typography>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
          </form>
          <Typography variant="body1" mt={2}>
            New User? <Link href="/signup">Signup</Link>
          </Typography>
          <Typography variant="body1" mt={2}>
            <Link href="/forgetpassword">Forgot Password?</Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}

export default LoginPage;
