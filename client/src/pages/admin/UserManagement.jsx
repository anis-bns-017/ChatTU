import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import Table from "../../components/shared/Table";
import { Avatar } from "@mui/material";
import { dashboardData } from "../../components/constants/sampleData";
import { transformImage } from "../../lib/features";

const columns = [
  { field: "id", headerName: "ID", headerClassName: "table-header", width: 90 },
  {
    field: "username",
    headerName: "Username",
    headerClassName: "table-header",
    width: 150,
  },
  {
    field: "avatar",
    headerName: "Avatar",
    headerClassName: "table-header",
    width: 150,
    renderCell: (params) => (
      <Avatar src={params.row.avatar} alt={params.row.name} />
    ),
  },
  {
    field: "name",
    headerName: "Name",
    headerClassName: "table-header",
    width: 200,
  },
  {
    field: "friends",
    headerName: "Friends",
    headerClassName: "table-header",
    width: 150,
  },
  {
    field: "groups",
    headerName: "Groups",
    headerClassName: "table-header",
    width: 180,
  },
  {
    field: "updatedAt",
    headerName: "Updated At",
    headerClassName: "table-header",
    width: 180,
  },
];
const UserManagement = () => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    setRows(
      dashboardData.users.map((user, index) => ({
        ...user,
        id: user._id || index,
        avatar: transformImage(user.avatar, 50),
        updatedAt: new Date().toLocaleDateString(),
      }))
    );
  }, []);

  console.log("User rows:", rows);
  console.log("User columns:", columns);

  return (
    <AdminLayout>
      <Table heading={"All Users"} columns={columns} rows={rows} />
    </AdminLayout>
  );
};

export default UserManagement;
