import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import { Avatar, Box, Stack, Tab } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { fileFormat, transformImage } from "../../lib/features";
import moment from "moment";
import { dashboardData } from "../../components/constants/sampleData";
import Table from "../../components/shared/Table";
import RenderAttachments from "../../components/shared/RenderAttachments";

const columns = [
  { field: "id", headerName: "ID", headerClassName: "table-header", width: 90 },
  {
    field: "attachments",
    headerName: "Attachments",
    headerClassName: "table-header",
    width: 200,
     
    renderCell: (params) => {
      const { attachments } = params.row;
      // console.log("hey: ", attachments);
      return attachments?.length > 0 ? (
        attachments.map((attachment, index) => {
          const url = attachment.url;
          const file = fileFormat(url);
          return (
            <Box key={index} display="flex" alignItems="center" gap={"1rem"}>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                download
                style={{
                  color: "black",
                  textDecoration: "none",
                }}
              >
                {RenderAttachments(file, url)}
              </a>
              <Avatar width={"50px"} src={attachment.url} alt={`Attachment ${index + 1}`} />
            </Box>
          );
        })
      ) : (
        <span>No Attachments</span>
      );
    },
  },
  {
    field: "content",
    headerName: "Content",
    headerClassName: "table-header",
    width: 400,
  },
  {
    field: "sender",
    headerName: "Sent By",
    headerClassName: "table-header",
    width: 200,
    renderCell: (params) => (
      <Stack direction="row" alignItems="center" spacing={"1rem"}>
        <Avatar src={params.row.sender.avatar} alt={params.row.sender.name} />
        <span>{params.row.sender.name}</span>
      </Stack>
    ),
  },
  {
    field: "chat",
    headerName: "Chat",
    headerClassName: "table-header",
    width: 220,
  },
  {
    field: "groupChat",
    headerName: "Group Chat",
    headerClassName: "table-header",
    width: 180,
  },
  {
    field: "createdAt",
    headerName: "Created At",
    headerClassName: "table-header",
    width: 250,
  },
  {
    field: "updatedAt",
    headerName: "Updated At",
    headerClassName: "table-header",
    width: 180,
  },
];

const MessageManagement = () => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    setRows(
      dashboardData.messages.map((message, index) => ({
        ...message,
        id: message._id || index,
        attachments: message.attachments,
        sender: {
          name: message.sender.name,
          avatar: transformImage(message.sender.avatar, 50),
        },
        createdAt: message.createdAt
          ? moment(message.createdAt).format("YYYY-MM-DD HH:mm:ss")
          : "Invalid date",
        updatedAt: message.updatedAt
          ? moment(message.updatedAt).format("YYYY-MM-DD HH:mm:ss")
          : "Invalid date",
      }))
    );
  }, []);
  return (
    <AdminLayout>
      <Table heading={"All Messages"} columns={columns} rows={rows}
      rowHeight={'auto'} />
    </AdminLayout>
  );
};

export default MessageManagement;
