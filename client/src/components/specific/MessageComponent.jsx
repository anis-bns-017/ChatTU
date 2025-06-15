import { Box, Typography, Stack, Paper } from "@mui/material";
import moment from "moment";
import React, { memo } from "react";
import { fileFormat } from "../../lib/features";
import RenderAttachments from "../shared/RenderAttachments";

const MessageComponent = ({ message, user }) => {
  const { sender, content, attachments = [], createdAt } = message;
  const sameSender = sender._id === user._id;
  const timeAgo = moment(createdAt).fromNow();

  return (
    <Stack
      direction="row"
      justifyContent={sameSender ? "flex-end" : "flex-start"}
      sx={{ mb: 1, px: 1 }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: sameSender ? "flex-end" : "flex-start",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            bgcolor: "grey.100",
            color: "text.primary",

            px: 1,
            py: 1,
            maxWidth: 350,
            position: "relative",
          }}
        >
          {/* Bubble tail */}
          <Box
            sx={{
              position: "absolute",
              width: 0,
              height: 0,
              borderTop: "10px solid transparent",
              borderBottom: "10px solid transparent",
              ...(sameSender
                ? {
                    right: -10,
                    borderLeft: "10px solid",
                    borderLeftColor: "primary.main",
                  }
                : {
                    left: -10,
                    borderRight: "10px solid",
                    borderRightColor: "grey.100",
                  }),
              top: 10,
            }}
          />
          {!sameSender && (
            <Typography
              color="secondary"
              fontWeight={600}
              variant="subtitle2"
              sx={{ mb: 0.5 }}
            >
              {sender.name}
            </Typography>
          )}
          {content && (
            <Typography sx={{ wordBreak: "break-word" }}>{content}</Typography>
          )}
          {attachments.length > 0 && (
            <Stack spacing={0.5} sx={{ mt: 1 }}>
              {attachments.map((attachment, index) => {
                const url = attachment.url;
                const file = fileFormat(url);
                console.log("Attachment file:", file);
                return (
                  <Box key={index}>
                    <a
                      href={url}
                      target="_blank"
                      download
                      style={{ color: "inherit", textDecoration: "none" }}
                    >
                      {<RenderAttachments type={file} url={url} />}
                    </a>
                  </Box>
                );
              })}
            </Stack>
          )}
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 0.5, display: "block", textAlign: "right" }}
          >
            {timeAgo}
          </Typography>
        </Paper>
      </Box>
    </Stack>
  );
};

export default memo(MessageComponent);
