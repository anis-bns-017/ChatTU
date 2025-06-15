import { Container, Paper, Typography } from "@mui/material";
import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { bgGradient, blue, cyan, forestGradient, matBlack, oceanGradient, purple } from "../constants/color";

const Table = ({ rows, columns, heading, rowHeight = 52 }) => {
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Paper
        elevation={4}
        sx={{
          borderRadius: 4,
          px: { xs: 2, md: 6 },
          py: { xs: 3, md: 4 },
          backgroundColor: "#f5f5f5",
        }}
      >
        <Typography
          textAlign="center"
          variant="h4"
          sx={{
            mb: 4,
            textTransform: "uppercase",
            fontWeight: 600,
            color: matBlack,
          }}
        >
          {heading}
        </Typography>

        <div style={{ width: "100%", height: 550 }}>
          <DataGrid
            rows={rows}
            columns={columns}
            rowHeight={rowHeight}
            disableRowSelectionOnClick
            sx={{
              border: "none",
              ".table-header": {
                backgroundColor: blue,
                color: "yellow",
                fontWeight: "bold",
              },
            }}
          />
        </div>
      </Paper>
    </Container>
  );
};


export default Table;
