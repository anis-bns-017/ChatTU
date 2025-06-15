import { Avatar, Stack, Typography } from "@mui/material";
import {
  Face as FaceIcon,
  AlternateEmail as UsernameIcon,
  CalendarMonth as CalendarIcon,
} from "@mui/icons-material";
import React from "react";

import moment from "moment";

const Profile = () => {
  return (
    <Stack spacing={"2rem"} direction={"column"} alignItems={"center"}>
      <Avatar
        sx={{
          width: 200,
          height: 200,
          objectFit: "contain",
          marginBottom: "1rem",
          border: "5px solid white",
        }}
      />
      <ProfileCard heading={"bio"} text={"hey There"} />
      <ProfileCard
        heading={"Username"}
        text={"smanisbns@gmail.com"}
        icon={<UsernameIcon />}
      />
      <ProfileCard
        heading={"Name"}
        text={"Anisur Rahaman"}
        icon={<FaceIcon />}
      />

      <ProfileCard
        heading={"Joined"}
        text={moment("Feb 22 2025 06:26:29 GMT+0600").fromNow()}
        icon={<CalendarIcon />}
      />
    </Stack>
  );
};

const ProfileCard = ({ text, icon, heading }) => {
  return (
    <Stack
      direction={"row"}
      alignItems={"center"}
      spacing={"1rem"}
      color={"white"}
      textAlign={"center"}
    >
      {icon && icon}
      <Stack>
        <Typography variant="body1">{text}</Typography>
        <Typography color="gray" variant="caption">
          {heading}
        </Typography>
      </Stack>
    </Stack>
  );
};

export default Profile;
