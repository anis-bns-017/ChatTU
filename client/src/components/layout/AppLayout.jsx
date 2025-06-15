import React from "react";
import Header from "./Header";
import Title from "../shared/Title";
import { Grid, Box } from "@mui/material";
import ChatList from "../specific/ChatList";
import { sampleChats } from "../constants/sampleData";
import { useParams } from "react-router-dom";
import Profile from "../specific/Profile";

const AppLayout = () => (WrappedComponent) => {
  return (props) => {
    const params = useParams();
    const chatId = params.chatId;

    const handleDeleteChat = (e, _id, groupChat) => {
      e.preventDefault();
      console.log("Delete Chat: ", _id, groupChat);
    };

    return (
      <>
        <Title />
        <Header />

        <Grid container sx={{ height: "calc(100vh - 4rem)" }}>
          <Grid
            flex={3}
            sm={4}
            md={3}
            height={"100%"}
            sx={{
              display: {
                xs: "none",
                sm: "block",
              },
            }}
          >
            <ChatList
              chats={sampleChats}
              chatId={chatId}
              newMessagesAlert={[
                {
                  chatId,
                  count: 4,
                },
              ]}
              onlineUsers={["1", "2"]}
              handleDeleteChat={handleDeleteChat}
            />
          </Grid>

          {/* Profile Section */}
          <Grid flex={6} xs={12} sm={8} lg={6} height={"100%"}>
            <WrappedComponent {...props} />
          </Grid>
          <Grid
            flex={2}
            md={4}
            lg={3}
            height={"100%"}
            sx={{
              display: {
                xs: "none",
                md: "block",
              },
              padding: "2rem",
              bgcolor: "rgba(0, 0, 0, 0.85)",
            }}
          >
            <Profile />
          </Grid>
        </Grid>
      </>
    );
  };
};

export default AppLayout;
