import { Grid, Skeleton, Stack } from "@mui/material";
import React from "react";

export const LayoutLoader = () => {
  return (
    <Grid container sx={{ height: "calc(100vh - 4rem)" }} spacing="1rem">
      <Grid
        flex={4}
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
        <Skeleton variant="rectangular" height={100} />
      </Grid>
      <Grid flex={4} xs={12} sm={8} lg={6} height={"100%"}>
        <Stack spacing={"1rem"}>
          {Array.from({ length: 10 }).map((_, idx) => (
            <Skeleton
              key={idx}
              variant="rectangular"
              height={"5rem"}
              sx={{ mb: 2 }}
            />
          ))}
        </Stack>
      </Grid>
      <Grid
        flex={4}
        md={4}
        lg={3}
        height={"100%"}
        sx={{
          display: {
            xs: "none",
            md: "block",
          },
        }}
      >
        <Skeleton variant="rectangular" height="100vh" />
      </Grid>
    </Grid>
  );
};
