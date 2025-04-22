import React from "react";
import { Box, Skeleton, useMediaQuery, useTheme } from "@mui/material";

const FullPageShimmer = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const theme = useTheme();

  // Use theme to match light/dark mode
  const skeletonBaseColor =
    theme.palette.mode === "dark"
      ? theme.palette.grey[800]
      : theme.palette.grey[200];
  const skeletonHighlightColor =
    theme.palette.mode === "dark"
      ? theme.palette.grey[700]
      : theme.palette.grey[100];
  const pageBgColor =
    theme.palette.mode === "dark"
      ? theme.palette.background.default
      : "#fafafa";

  const shimmerStyle = {
    borderRadius: 3,
    backgroundColor: skeletonBaseColor,
  };

  return (
    <Box sx={{ bgcolor: pageBgColor, minHeight: "100vh" }}>
      {/* Navbar Skeleton */}
      <Box
        sx={{
          width: "100%",
          px: 6,
          py: 2,
          bgcolor: theme.palette.background.paper,
          boxShadow: theme.shadows[1],
        }}
      >
        <Skeleton variant="rounded" width="30%" height={40} sx={shimmerStyle} />
      </Box>

      {/* Main Layout */}
      <Box
        width="100%"
        padding="3rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="2.5rem"
        justifyContent="space-between"
        bgcolor={pageBgColor}
      >
        {/* Left Sidebar Skeleton */}
        <Box flexBasis={isNonMobileScreens ? "25%" : undefined}>
          <Skeleton
            variant="rounded"
            width="100%"
            height={360}
            sx={{ mb: 3, ...shimmerStyle }}
          />
        </Box>

        {/* Center Column Skeleton */}
        <Box
          flexBasis={isNonMobileScreens ? "45%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          {/* Post input shimmer */}
          <Skeleton
            variant="rounded"
            width="100%"
            height={120}
            sx={{ mb: 3, ...shimmerStyle }}
          />

          {/* Feed posts shimmer */}
          {[1, 2, 3].map((item) => (
            <Skeleton
              key={item}
              variant="rounded"
              width="100%"
              height={280}
              sx={{ mb: 3, ...shimmerStyle }}
            />
          ))}
        </Box>

        {/* Right Sidebar Skeleton */}
        {isNonMobileScreens && (
          <Box flexBasis="25%">
            <Skeleton
              variant="rounded"
              width="100%"
              height={220}
              sx={{ mb: 3, ...shimmerStyle }}
            />
            <Skeleton
              variant="rounded"
              width="100%"
              height={380}
              sx={shimmerStyle}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default FullPageShimmer;
