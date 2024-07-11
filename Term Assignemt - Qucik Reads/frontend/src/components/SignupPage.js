import React from "react";
import {
  TextField,
  Button,
  Typography,
  Container,
  Box,
  Link,
  Modal,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import loginGif from "../assets/news.gif";
import { useForm, Controller } from "react-hook-form";
import { z, object } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import Alert from "@mui/material/Alert";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const validationSchema = object({
  firstname: z.string().min(1, { message: "Firstname is required." }),
  lastname: z.string().min(1, { message: "Lastname is required." }),
  email: z.string().email(),
  password: z.string().min(1, { message: "Password is required." }),
  confirmPassword: z
    .string()
    .min(1, { message: "Confirm Password is required." }),
}).refine((value) => value.confirmPassword === value.password, {
  message: "Password and confirm password must be same.",
  path: ["confirmPassword"],
});

const resolver = zodResolver(validationSchema);

function SignupPage() {
  const [open, setOpen] = React.useState(false);
  const formDataRef = React.useRef(null);
  const handleOpen = (data) => {
    formDataRef.current = data;
    setOpen(true);
  };
  const handleClose = () => {
    formDataRef.current = null;
    setOpen(false);
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    trigger,
    reset,
  } = useForm({
    resolver,
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const navigate = useNavigate();

  const handleSubscription = async () => {
    console.log("Subscription handled");
    const formData = formDataRef.current;
    formData.subscribe = "Yes";
    await onRegisterRequest(formData);
  };

  const onRegisterRequest = async (data) => {
    try {
      const response = await axios.post(
        "https://5vtv0ubdph.execute-api.us-east-1.amazonaws.com/dev/adduser",
        JSON.stringify(data),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      navigate("/addreport");
      if (response.data.statusCode === 400) {
        window.alert("Email already exists");
        reset();
        navigate("/signup");
      }
    } catch (error) {
      console.error("Error signing up:", error);
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
            SignUp
          </Typography>
          <form
            style={{ width: "100%" }}
            onSubmit={handleSubmit(handleOpen)}
            sx={{ mt: 3 }}
          >
            <Controller
              name="firstname"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="firstname"
                  label="Firstname"
                  name="firstname"
                  autoComplete="firstname"
                  size="small"
                  onBlur={() => trigger("firstname")}
                />
              )}
            />
            <Typography variant="body2" color="error">
              {errors.firstname?.message}
            </Typography>

            <Controller
              name="lastname"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="lastname"
                  label="Lastname"
                  name="lastname"
                  autoComplete="lastname"
                  size="small"
                  onBlur={() => trigger("lastname")}
                />
              )}
            />
            <Typography variant="body2" color="error">
              {errors.lastname?.message}
            </Typography>

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

            <Controller
              name="confirmPassword"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  id="confirmPassword"
                  autoComplete="current-password"
                  size="small"
                  onBlur={() => trigger("confirmPassword")}
                />
              )}
            />
            <Typography variant="body2" color="error">
              {errors.confirmPassword?.message}
            </Typography>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
          </form>
          <Typography variant="body1">
            Already have an account? <Link href="/">Login here</Link>
          </Typography>
        </Box>
      </Box>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Would you like to get notified about the new reports?
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              marginTop: "10px",
              width: "100%",
            }}
          >
            <Button
              variant="contained"
              style={{ marginRight: "10px" }}
              onClick={async () => {
                await handleSubscription();
                handleClose();
              }}
            >
              Yes
            </Button>
            <Button
              variant="contained"
              style={{ marginLeft: "10px" }}
              onClick={async () => {
                onRegisterRequest(formDataRef.current);
                handleClose();
              }}
            >
              No
            </Button>
          </Box>
        </Box>
      </Modal>
    </Container>
  );
}

export default SignupPage;
