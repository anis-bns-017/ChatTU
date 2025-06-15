import {
  Dialog,
  DialogTitle,
  InputAdornment,
  List,
  Stack,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import { useInputValidation } from "6pp";
import { Search as SearchIcon } from "@mui/icons-material";
import UserItem from "../shared/UserItem";
import { sampleUsers } from "../constants/sampleData";

const Search = () => {
  const search = useInputValidation("");

  const isLoadingSendFriendRequest = false;
  const [users, setUsers] = useState(sampleUsers);

  const addFriendHandler = (id) => {
    console.log("Friend request to:", id);
  };

  return (
    <Dialog
      open
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          p: 3,
          borderRadius: "16px",
          boxShadow: 6,
          backgroundColor: "#f9f9f9",
        },
      }}
    >
      <Stack spacing={3}>
        <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>
          🔍 Find People
        </DialogTitle>

        <TextField
          label="Search by name or username"
          value={search.value}
          onChange={search.changeHandler}
          variant="outlined"
          size="medium"
          autoFocus
          fullWidth
          sx={{
            backgroundColor: "white",
            borderRadius: "8px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="primary" />
              </InputAdornment>
            ),
          }}
        />

        <List
          sx={{
            maxHeight: "300px",
            overflowY: "auto",
          }}
        >
          {users?.map((user) => (
            <UserItem
              user={user}
              key={user._id}
              handler={addFriendHandler}
              handlerIsLoading={isLoadingSendFriendRequest}
            />
          ))}
        </List>
      </Stack>
    </Dialog>
  );
};
 
export default Search;
