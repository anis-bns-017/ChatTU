import { Stack } from "@mui/material";

import ChatItem from "../shared/ChatItem";
import { bgGradient } from "../constants/color";

const ChatList = ({
  w = "100%",
  chats = [],
  chatId,
  onlineUsers = [],
  newMessagesAlert = [
    {
      chatId: "",
      count: 0,
    },
  ],
  handleDeleteChat,
}) => {
  return (
    <Stack
      width={w}
      direction={"column"}
      overflow={"auto"}
      height={"100%"}
      sx={{
        backgroundImage: bgGradient,
      }}
    >
      {chats?.map((data, index) => {
        const { _id, avatar, name, groupChat, members } = data;

        const newMsgAlert = newMessagesAlert.find(
          ({ chatId }) => chatId === _id
        );

        const isOnline = members?.some((member) => onlineUsers.includes(_id));

        return (
          <ChatItem
            newMessageAlert={newMsgAlert}
            isOnline={isOnline}
            avatar={avatar}
            name={name}
            _id={_id}
            key={_id}
            groupChat={groupChat}
            sameSender={chatId === _id}
            handleDeleteChat={handleDeleteChat}
          />
        );
      })}
    </Stack>
  );
};

export default ChatList;
