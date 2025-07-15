import React, { useState } from "react";

import {
  Avatar,
  Button,
  Container,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { useFileHandler, useInputValidation } from "6pp";

import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { VisuallyHiddenInput } from "../components/styles/StyleComponents";
import { usernameValidator } from "../utils/validators";
import axios from "axios";
import { server } from "../components/constants/config";
import { useDispatch } from "react-redux";
import { userExists } from "../redux/reducers/auth";
import toast from "react-hot-toast";

const Login = () => {
  const dispatch = useDispatch();
  const [isLogin, setIsLogin] = useState(true);
  const name = useInputValidation("");
  const bio = useInputValidation("");
  const username = useInputValidation("", usernameValidator);
  const password = useInputValidation("");

  const avatar = useFileHandler("single");

  const toggleLogin = () => {
    setIsLogin((prev) => !prev);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("avatar", avatar.file);
    formData.append("name", name.value);
    formData.append("bio", bio.value);
    formData.append("username", username.value);
    formData.append("password", password.value);

    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

 
    try {
      const data = await axios.post(
        `${server}/api/v1/user/new-user`,
        formData,
        config
      );

      dispatch(userExists(true));
      toast.success(data.message);
    } catch (error) {
      // Fixed error handling
      const errorMessage =
        error?.response?.data?.message || "Something went wrong";
      toast.error(errorMessage);

      // For debugging:
      console.error("SignUp error:", {
        status: error?.response?.status,
        data: error?.response?.data,
        fullError: error,
      });
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const { data } = await axios.post(
        `${server}/api/v1/user/login`,
        {
          username: username.value,
          password: password.value,
        },
        config
      );
      dispatch(userExists(true));
      toast.success(data.message);
    } catch (error) {
      // Fixed error handling
      const errorMessage =
        error?.response?.data?.message || "Something went wrong";
      toast.error(errorMessage);

      // For debugging:
      console.error("Login error:", {
        status: error?.response?.status,
        data: error?.response?.data,
        fullError: error,
      });
    }
  };

  return (
    <div
      style={{
        backgroundImage:
          "linear-gradient(rgba(200, 200, 200, 0.5), rgba(120, 110, 220, 0.5))",
      }}
    >
      <Container
        component={"main"}
        maxWidth="xs"
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {isLogin ? (
            <>
              <Typography variant="h5">Login</Typography>
              <form
                style={{ width: "100%", marginTop: "1rem" }}
                onSubmit={handleLogin}
              >
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Username"
                  variant="outlined"
                  value={username.value}
                  onChange={username.changeHandler}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  type="password"
                  label="Password"
                  variant="outlined"
                  value={password.value}
                  onChange={password.changeHandler}
                />

                <Button
                  sx={{ marginTop: "1rem" }}
                  variant="contained"
                  color="primary"
                  type="submit"
                  fullWidth
                >
                  Login
                </Button>

                <Typography textAlign={"center"} m={"1rem"}>
                  Or
                </Typography>

                <Button
                  sx={{ marginTop: "1rem" }}
                  variant="text"
                  fullWidth
                  color="secondary"
                  onClick={() => toggleLogin()}
                >
                  Sign up Instead
                </Button>
              </form>
            </>
          ) : (
            <>
              <Typography variant="h5">Sign Up</Typography>
              <form
                style={{ width: "100%", marginTop: "1rem" }}
                onSubmit={handleSignUp}
              >
                <Stack position={"relative"} width={"10rem"} margin={"auto"}>
                  <Avatar
                    sx={{
                      width: "10rem",
                      height: "10rem",
                      objectFit: "contain",
                      alignItems: "center",
                    }}
                    src={avatar.preview}
                  />

                  {avatar.error && (
                    <Typography
                      color="error"
                      variant="caption"
                      m={"1rem auto"}
                      width={"fit-content"}
                      display={"block"}
                    >
                      {avatar.error}
                    </Typography>
                  )}

                  <IconButton
                    sx={{
                      position: "absolute",
                      bottom: "0",
                      right: "0",
                      color: "white",
                      bgcolor: "rgba(0, 0, 0, 0.5)",
                      ":hover": {
                        bgcolor: "rgba(0, 0, 0, 0.7)",
                      },
                    }}
                    component="label"
                  >
                    <>
                      <CameraAltIcon />
                      <VisuallyHiddenInput
                        type="file"
                        onChange={avatar.changeHandler}
                      />
                    </>
                  </IconButton>
                </Stack>

                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Name"
                  variant="outlined"
                  value={name.value}
                  onChange={name.changeHandler}
                />

                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Bio"
                  variant="outlined"
                  value={bio.value}
                  onChange={bio.changeHandler}
                />

                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Username"
                  variant="outlined"
                  value={username.value}
                  onChange={username.changeHandler}
                />

                {username.error && (
                  <Typography color="error" variant="caption">
                    {username.error}
                  </Typography>
                )}

                <TextField
                  margin="normal"
                  required
                  fullWidth
                  type="password"
                  label="Password"
                  variant="outlined"
                  value={password.value}
                  onChange={password.changeHandler}
                />

                {/* {password.error && (
                <Typography color="error" variant="caption">
                  {password.error}
                </Typography>
              )} */}

                <Button
                  sx={{ marginTop: "1rem" }}
                  variant="contained"
                  color="primary"
                  type="submit"
                  fullWidth
                >
                  Sign Up
                </Button>

                <Typography textAlign={"center"} m={"1rem"}>
                  Or
                </Typography>

                <Button
                  variant="text"
                  fullWidth
                  color="secondary"
                  onClick={() => toggleLogin()}
                >
                  Login Instead
                </Button>
              </form>
            </>
          )}
        </Paper>
      </Container>
    </div>
  );
};

export default Login;
