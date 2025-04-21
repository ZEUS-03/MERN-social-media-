import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  SendOutlined,
} from "@mui/icons-material";
import {
  Box,
  Divider,
  IconButton,
  InputBase,
  Typography,
  useTheme,
} from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "state";

const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  location,
  picturePath,
  userPicturePath,
  likes,
  commentCount,
}) => {
  const [isComments, setIsComments] = useState(false);
  const [comment, setComment] = useState("");
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;
  const [fetchedComments, setFetchedComments] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMoreComments, setHasMoreComments] = useState(true);

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;
  const medium = palette.neutral.medium;

  const patchLike = async () => {
    const response = await fetch(`http://localhost:3001/posts/${postId}/like`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId }),
    });
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
  };

  const fetchComments = async (pageToLoad = 1) => {
    const response = await fetch(
      `http://localhost:3001/posts/${postId}/comments?page=${pageToLoad}&limit=5`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const newComments = await response.json();

    if (newComments.length < 5) setHasMoreComments(false);

    return newComments;
  };

  const handleCommentSubmit = async () => {
    if (comment.trim() === "") return;
    const response = await fetch(
      `http://localhost:3001/posts/${postId}/comment`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: comment }),
      }
    );
    const allComments = await fetchComments(page);
    setFetchedComments((prev) => [...allComments]);
    setComment("");
  };

  const handleLoadMore = async () => {
    const nextPage = page + 1;
    setPage(nextPage);
    const newComments = await fetchComments(nextPage);
    setFetchedComments((prev) => [...prev, ...newComments]);
  };

  useEffect(() => {
    const loadComments = async () => {
      // Define an async function inside useEffect
      if (isComments && fetchedComments.length === 0) {
        const newComments = await fetchComments(page); // Await fetchComments
        setFetchedComments((prev) => [...prev, ...newComments]);
      }
    };
    loadComments(); // Call the async function
  }, [isComments, page, fetchedComments.length]);

  return (
    <WidgetWrapper m="2rem 0">
      <Friend
        friendId={postUserId}
        name={name}
        subtitle={location}
        userPicturePath={userPicturePath}
      />
      <Typography color={main} sx={{ mt: "1rem" }}>
        {description}
      </Typography>
      {picturePath && (
        <img
          width="100%"
          height="auto"
          alt="post"
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
          src={`http://localhost:3001/assets/${picturePath}`}
        />
      )}
      <FlexBetween mt="0.25rem">
        <FlexBetween gap="1rem">
          <FlexBetween gap="0.3rem">
            <IconButton onClick={patchLike}>
              {isLiked ? (
                <FavoriteOutlined sx={{ color: primary }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
            <Typography>{likeCount}</Typography>
          </FlexBetween>

          <FlexBetween gap="0.3rem">
            <IconButton onClick={() => setIsComments(!isComments)}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
            <Typography>{commentCount}</Typography>
          </FlexBetween>
        </FlexBetween>
      </FlexBetween>

      {isComments && (
        <Box mt="1rem">
          {/* Input Area */}
          <FlexBetween gap="0.5rem">
            <InputBase
              placeholder="Write a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              fullWidth
              sx={{
                backgroundColor: palette.neutral.light,
                borderRadius: "2rem",
                padding: "0.5rem 1rem",
                flex: 1,
              }}
            />
            <IconButton onClick={handleCommentSubmit}>
              <SendOutlined sx={{ color: primary }} />
            </IconButton>
          </FlexBetween>
          {/* Comments */}
          <Box mt="0.5rem">
            {fetchedComments.map((cmt, i) => (
              <Box
                key={cmt._id}
                display="flex"
                alignItems="flex-start"
                gap="1rem"
                mb="1rem"
                pl="1rem"
              >
                {/* Profile Image */}
                <img
                  src={`http://localhost:3001/assets/${cmt.user.picturePath}`}
                  alt="profile"
                  style={{
                    width: "35px",
                    height: "35px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    marginTop: "4px", // Ensure it aligns with the text
                  }}
                />

                {/* Comment Content */}
                <Box>
                  <Typography
                    variant="h6"
                    sx={{
                      color: main,
                      fontWeight: "550",
                      lineHeight: "1.3",
                    }}
                  >
                    {cmt.user.firstName}
                  </Typography>
                  <Typography sx={{ color: main, lineHeight: "1.5" }}>
                    {cmt.text}
                  </Typography>
                </Box>
              </Box>
            ))}

            {hasMoreComments && (
              <Typography
                onClick={handleLoadMore}
                sx={{
                  cursor: "pointer",
                  color: medium,
                  fontSize: "0.9rem",
                  pl: "1rem",
                  mt: "0.25rem",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                View more comments
              </Typography>
            )}
            <Divider />
          </Box>
        </Box>
      )}
    </WidgetWrapper>
  );
};

export default PostWidget;
