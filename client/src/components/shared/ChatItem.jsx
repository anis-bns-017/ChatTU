import React, { memo } from "react";
import { Link } from "../styles/StyleComponents";
import { Box, Stack, Typography, Paper, Badge } from "@mui/material";
import AvatarCard from "./AvatarCard";

const ChatItem = ({
  avatar = [],
  name,
  _id,
  lastMessage,
  groupChat = false,
  sameSender,
  isOnline,
  newMessageAlert,
  handleDeleteChat,
}) => {
  return (
    <Link
      to={`/chat/${_id}`}
      sx={{ textDecoration: "none" }}
      onContextMenu={(e) => handleDeleteChat(e, _id, groupChat)}
    >
      <Paper
        elevation={sameSender ? 6 : 1}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          px: 2,
          py: 1.5,
          mb: 1,
          borderRadius: 3,
          backgroundColor: sameSender ? "#1a1a1a" : "#fff",
          color: sameSender ? "#fff" : "inherit",
          position: "relative",
          transition: "background-color 0.3s, transform 0.2s",
          "&:hover": {
            backgroundColor: sameSender ? "#111" : "#f5f5f5",
            transform: "scale(1.01)",
          },
        }}
      >
        {/* Avatar with optional online dot */}
        <Box position="relative">
          <AvatarCard avatar={avatar} />
          {isOnline && (
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: "#4caf50",
                border: "2px solid white",
                position: "absolute",
                bottom: 0,
                right: 0,
              }}
            />
          )}
        </Box>

        {/* Name and message */}
        <Stack flexGrow={1} spacing={0.5}>
          <Typography variant="subtitle1" fontWeight="600" noWrap>
            {name}
          </Typography>
          {lastMessage && (
            <Typography variant="body2" color="text.secondary" noWrap>
              {lastMessage}
            </Typography>
          )}
        </Stack>

        {/* New message alert */}
        {newMessageAlert && newMessageAlert.count > 0 && (
          <Badge
            badgeContent={newMessageAlert.count}
            color="primary"
            sx={{ ".MuiBadge-badge": { fontSize: "0.75rem" } }}
          />
        )}
      </Paper>
    </Link>
  );
};

export default memo(ChatItem);
