import { Box, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import Navbar from "scenes/navbar";
import UserWidget from "scenes/widgets/UserWidget";
import MyPostWidget from "scenes/widgets/MyPostWidget";
import PostsWidget from "scenes/widgets/PostsWidget";
import AdvertWidget from "scenes/widgets/AdvertWidget";
import FriendListWidget from "scenes/widgets/FriendListWidget";
import { useState } from "react";
import FullPageShimmer from "scenes/widgets/Shimmer"; // make sure this file exists!

const HomePage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const { _id, picturePath } = useSelector((state) => state.user);
  const [loadingCount, setLoadingCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const onComponentStart = () => {
    setLoadingCount((prev) => prev + 1);
  };

  const onComponentDone = () => {
    setLoadingCount((prev) => {
      const next = prev - 1;
      if (next === 0) setLoading(false);
      return next;
    });
  };

  // if (loading) {
  //   return <FullPageShimmer />;
  // }

  return (
    <Box>
      <Navbar />
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="0.5rem"
        justifyContent="space-between"
      >
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
          <UserWidget
            userId={_id}
            picturePath={picturePath}
            onStartLoading={onComponentStart}
            onFinishLoading={onComponentDone}
          />
        </Box>
        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          <MyPostWidget picturePath={picturePath} />
          <PostsWidget
            userId={_id}
            onStartLoading={onComponentStart}
            onFinishLoading={onComponentDone}
          />
        </Box>
        {isNonMobileScreens && (
          <Box flexBasis="26%">
            <AdvertWidget
              onStartLoading={onComponentStart}
              onFinishLoading={onComponentDone}
            />
            <Box m="2rem 0" />
            <FriendListWidget
              userId={_id}
              onStartLoading={onComponentStart}
              onFinishLoading={onComponentDone}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default HomePage;
