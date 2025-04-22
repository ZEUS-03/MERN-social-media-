import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";
import PostWidget from "./PostWidget";
import { BASE_URL } from "helper/constants";
import { Box, Typography } from "@mui/material";

const PostsWidget = ({
  userId,
  profile = false,
  onStartLoading,
  onFinishLoading,
}) => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);

  const getPosts = async () => {
    const response = await fetch(`${BASE_URL}/posts`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    dispatch(setPosts({ posts: data }));
    if (onFinishLoading) onFinishLoading();
  };

  const getUserPosts = async () => {
    const response = await fetch(`${BASE_URL}/posts/${userId}/posts`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    dispatch(setPosts({ posts: data }));
    if (onFinishLoading) onFinishLoading();
  };

  useEffect(() => {
    if (onStartLoading) onStartLoading();
    if (profile) {
      getUserPosts();
    } else {
      getPosts();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {posts.length > 0 ? (
        posts.map(
          ({
            _id,
            userId,
            firstName,
            lastName,
            description,
            location,
            picturePath,
            userPicturePath,
            likes,
            commentCount,
          }) => (
            <PostWidget
              key={_id}
              postId={_id}
              postUserId={userId}
              name={`${firstName} ${lastName}`}
              description={description}
              location={location}
              picturePath={picturePath}
              userPicturePath={userPicturePath}
              likes={likes}
              commentCount={commentCount}
            />
          )
        )
      ) : (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          height="100%"
          mt={4}
        >
          Z{" "}
          <Typography variant="h6" color="text.secondary">
            No Posts Yet
          </Typography>
        </Box>
      )}
    </>
  );
};

export default PostsWidget;
