import React from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import {
  Box,
  Container,
  Paper,
  Stack,
  Typography,
  Avatar,
  useTheme,
} from "@mui/material";
import {
  AdminPanelSettings as AdminPanelSettingsIcon,
  Group as GroupIcon,
  Message as MessageIcon,
  Notifications as NotificationsIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import moment from "moment";
import {
  CurveButton,
  SearchField,
} from "../../components/styles/StyleComponents";
import { DoughnutChart, LineChart } from "../../components/specific/Charts";

const Dashboard = () => {
  const theme = useTheme();

  const Appbar = (
    <Paper
      elevation={4}
      sx={{
        padding: { xs: "1.2rem", md: "2rem" },
        margin: "2rem 0",
        borderRadius: "1.5rem",
        background: `linear-gradient(90deg, ${theme.palette.primary.light} 0%, ${theme.palette.secondary.light} 100%)`,
        boxShadow: "0 4px 24px rgba(33,150,243,0.08)",
      }}
    >
      <Stack direction={"row"} alignItems={"center"} spacing={2}>
        <Avatar
          sx={{
            bgcolor: theme.palette.primary.main,
            width: 56,
            height: 56,
            mr: 2,
          }}
        >
          <AdminPanelSettingsIcon sx={{ fontSize: "2rem" }} />
        </Avatar>
        <SearchField placeholder="Search..." sx={{ flex: 1, maxWidth: 320 }} />
        <CurveButton sx={{ ml: 1, px: 4, py: 1.2, fontWeight: 600 }}>
          Search
        </CurveButton>
        <Box flexGrow={1} />
        <Typography
          display={{
            xs: "none",
            lg: "block",
          }}
          color="rgba(0, 0, 0, 0.7)"
          textAlign={"center"}
          fontWeight={500}
          fontSize={18}
        >
          {moment().format("MMM Do YYYY")}
        </Typography>
        <NotificationsIcon
          sx={{ fontSize: 32, color: theme.palette.primary.main, ml: 2 }}
        />
      </Stack>
    </Paper>
  );

  const Widgets = (
    <Stack
      direction={{
        xs: "column",
        sm: "row",
      }}
      spacing={"2rem"}
      justifyContent={"space-between"}
      alignItems={"center"}
      margin="2rem 0"
    >
      <Widget
        title={"Users"}
        value={34}
        icon={<PersonIcon />}
        color="#42a5f5"
      />
      <Widget title={"Chats"} value={3} icon={<GroupIcon />} color="#66bb6a" />
      <Widget
        title={"Messages"}
        value={234}
        icon={<MessageIcon />}
        color="#ffa726"
      />
    </Stack>
  );

  return (
    <AdminLayout>
      <Container component={"main"} sx={{ py: 4, maxWidth: "xl" }}>
        {Appbar}
        <Stack
          direction={{
            xs: "column",
            lg: "row",
          }}
          flexWrap={"wrap"}
          justifyContent={"center"}
          alignItems={{
            xs: "center",
            lg: "stretch",
          }}
          sx={{
            gap: "2rem",
          }}
        >
          <Paper
            elevation={4}
            sx={{
              padding: { xs: "1.5rem", md: "2rem 3.5rem" },
              borderRadius: "1.5rem",
              width: "100%",
              maxWidth: "45rem",
              height: { xs: "22rem", md: "30rem" },
              background: "linear-gradient(135deg, #e3f2fd 0%, #fce4ec 100%)",
              boxShadow: "0 8px 32px rgba(33,150,243,0.10)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography
              margin={"1rem 0 2rem"}
              variant="h4"
              fontWeight={700}
              color="primary"
            >
              Last Messages
            </Typography>
            <LineChart value={[12, 19, 3, 5, 2, 3, 7, 8, 6, 4, 10, 9]} />
          </Paper>

          <Paper
            elevation={4}
            sx={{
              padding: "1.5rem",
              borderRadius: "1.5rem",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: {
                xs: "100%",
                sm: "50%",
              },
              position: "relative",
              maxWidth: "25rem",
              minHeight: "22rem",
              background: "linear-gradient(135deg, #f3e5f5 0%, #e1f5fe 100%)",
              boxShadow: "0 8px 32px rgba(33,150,243,0.10)",
            }}
          >
            <DoughnutChart
              value={[12, 19, 3, 5, 2, 3, 7, 8, 6]}
              labels={["Single Chats", "Group Chats"]}
            />

            <Stack
              position={"absolute"}
              direction={"row"}
              justifyContent={"center"}
              alignItems={"center"}
              spacing={"0.5rem"}
              width={"100%"}
              height={"100%"}
              sx={{
                top: 0,
                left: 0,
                pointerEvents: "none",
              }}
            >
              <GroupIcon color="primary" />
              <Typography fontWeight={600} color="text.secondary">
                Vs
              </Typography>
              <PersonIcon color="secondary" />
            </Stack>
          </Paper>
        </Stack>
        {Widgets}
      </Container>
    </AdminLayout>
  );
};

const Widget = ({ title, value, icon, color }) => (
  <Paper
    elevation={6}
    sx={{
      p: 3,
      borderRadius: "2rem",
      width: "18rem",
      minHeight: "12rem",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      boxShadow: "0 8px 32px rgba(33,150,243,0.10)",
      transition: "transform 0.2s, box-shadow 0.2s",
      "&:hover": {
        transform: "translateY(-6px) scale(1.04)",
        boxShadow: "0 16px 40px rgba(33,150,243,0.18)",
      },
    }}
  >
    <Avatar
      sx={{
        mb: 2,
        width: 64,
        height: 64,
        bgcolor: color,
        boxShadow: `0 4px 16px ${color}33`,
        fontSize: 36,
      }}
    >
      {icon}
    </Avatar>
    <Typography
      variant="h3"
      sx={{
        fontWeight: 800,
        color: "#222",
        mb: 1,
        fontSize: "2.5rem",
      }}
    >
      {value}
    </Typography>
    <Typography
      variant="subtitle1"
      sx={{
        color: "rgba(0,0,0,0.6)",
        letterSpacing: 1,
        textTransform: "uppercase",
        fontWeight: 600,
        fontSize: 16,
      }}
    >
      {title}
    </Typography>
  </Paper>
);

export default Dashboard;
