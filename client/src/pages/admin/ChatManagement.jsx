import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import Table from "../../components/shared/Table";
import { Avatar, Stack } from "@mui/material";
import { dashboardData } from "../../components/constants/sampleData";
import { transformImage } from "../../lib/features";
import AvatarCard from "../../components/shared/AvatarCard";

const columns = [
  { field: "id", headerName: "ID", headerClassName: "table-header", width: 90 },
  {
    field: "avatar",
    headerName: "Avatar",
    headerClassName: "table-header",
    width: 150,
    renderCell: (params) => {
      return <AvatarCard avatar={params.row.avatar} />;
    },
  },
  {
    field: "name",
    headerName: "Name",
    headerClassName: "table-header",
    width: 300,
  },

  {
    field: "totalMembers",
    headerName: "Total Members",
    headerClassName: "table-header",
    width: 150,
  },

  {
    field: "members",
    headerName: "Members",
    headerClassName: "table-header",
    width: 400,
    renderCell: (params) => (
      <AvatarCard max={100} avatar={params.row.members} />
    ),
  },
  {
    field: "totalMessages",
    headerName: "Total Messages",
    headerClassName: "table-header",
    width: 120,
  },
  {
    field: "creator",
    headerName: "Creator By",
    headerClassName: "table-header",
    width: 250,
    renderCell: (params) => (
      <Stack direction="row" alignItems="center" spacing={1}>
        <Avatar src={params.row.creator.avatar} alt={params.row.creator.name} />
        <span>{params.row.creator.name}</span>
      </Stack>
    ),
  },
];

const ChatManagement = () => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    setRows(
      dashboardData.chats.map((chat, index) => ({
        ...chat,
        id: chat._id || index,
        avatar: chat.avatar.map((img) => transformImage(img, 50)),
        members: chat.members.map((member) =>
          transformImage(member.avatar, 50)
        ),
        updatedAt: new Date().toLocaleDateString(),
      }))
    );
  }, []);
  return (
    <AdminLayout>
      <Table heading={"All Chats"} columns={columns} rows={rows} />
    </AdminLayout>
  );
};

export default ChatManagement;
