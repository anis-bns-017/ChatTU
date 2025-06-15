import {
  Button,
  Dialog,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useInputValidation } from "6pp";

import { sampleUsers } from "../constants/sampleData";
import UserItem from "../shared/UserItem";
import { useState } from "react";
const NewGroup = () => {
  const [members, setMembers] = useState(sampleUsers);
  const [selectedMembers, setSelectedMembers] = useState([]);

  const selectMemberHandler = (id) => {
    setMembers((prev) =>
      prev.map((user) =>
        user._id === id ? { ...user, isAdded: !user.isAdded } : user
      )
    );

    setSelectedMembers((prev) =>
      prev.includes(id) ? prev.filter((curr) => curr != id) : [...prev, id]
    );
  };

 

  const submitHandler = () => {};

  const groupName = useInputValidation("");
  const closeHandler = () => {};
  return (
    <Dialog open onClose={closeHandler}>
      <Stack
        p={{
          xs: "1rem",
          sm: "3rem",
        }}
        maxWidth={"25rem"}
        spacing={"2rem"}
      >
        <DialogTitle textAlign={"center"} variant="h4">
          New Group
        </DialogTitle>
        <TextField
          label="Group Name"
          value={groupName.value}
          onChange={groupName.changeHandler}
        ></TextField>
        <Typography variant="body1">Members</Typography>
        <Stack>
          {members?.map((user) => (
            <UserItem
              user={user}
              key={user._id}
              handler={selectMemberHandler}
              isAdded={selectedMembers.includes(user._id)}
            />
          ))}
        </Stack>

        <Stack direction={"row"} justifyContent={"space-evenly"}>
          <Button variant="contained" color="error" size="large">
            Cancel
          </Button>
          <Button variant="contained" size="large" onClick={submitHandler}>
            Create
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
};

export default NewGroup;
