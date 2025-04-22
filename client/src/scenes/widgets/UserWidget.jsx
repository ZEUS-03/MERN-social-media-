import {
  ManageAccountsOutlined,
  EditOutlined,
  LocationOnOutlined,
  WorkOutlineOutlined,
} from "@mui/icons-material";
import { Box, Typography, Divider, useTheme } from "@mui/material";
import UserImage from "components/UserImage";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SocialLinksModal from "./EditSocialsWidget";
import { BASE_URL } from "helper/constants";

const UserWidget = ({
  userId,
  picturePath,
  onStartLoading,
  onFinishLoading,
}) => {
  const [user, setUser] = useState(null);
  const { palette } = useTheme();
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const dark = palette.neutral.dark;
  const medium = palette.neutral.medium;
  const main = palette.neutral.main;
  const loggedInUserId = useSelector((state) => state.user._id);
  const [socialLinksModalOpen, setSocialLinksModalOpen] = useState(false);

  const getUser = async () => {
    const response = await fetch(`${BASE_URL}/users/${userId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    if (onFinishLoading) onFinishLoading();
    setUser(data);
  };

  useEffect(() => {
    if (onStartLoading) onStartLoading();
    getUser();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) {
    return null;
  }

  const {
    firstName,
    lastName,
    location,
    occupation,
    viewedProfile,
    impressions,
    friends,
    socials,
  } = user;

  const isPersonalProfile = loggedInUserId === userId;

  const updateSocialLinks = async (values) => {
    // Update each social field
    for (const key in values) {
      if (values[key]) {
        await fetch(`${BASE_URL}/users/${userId}/social/${key}`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ [key]: values[key] }),
        });
      }
    }
    await getUser(); // Refresh after update
  };

  return (
    <WidgetWrapper>
      {/* FIRST ROW */}
      <FlexBetween
        gap="0.5rem"
        pb="1.1rem"
        onClick={() => navigate(`/profile/${userId}`)}
      >
        <FlexBetween gap="1rem">
          <UserImage image={picturePath} />
          <Box>
            <Typography
              variant="h4"
              color={dark}
              fontWeight="500"
              sx={{
                "&:hover": {
                  color: palette.primary.main,
                  cursor: "pointer",
                },
              }}
            >
              {firstName} {lastName}
            </Typography>
            <Typography color={medium}>
              {friends.length} {friends.length > 1 ? "friends" : "friend"}
            </Typography>
          </Box>
        </FlexBetween>
        {isPersonalProfile && (
          <ManageAccountsOutlined
            sx={{
              color: main,
              cursor: "pointer",
              "&:hover": {
                color: palette.primary.main,
              },
            }}
          />
        )}
      </FlexBetween>

      <Divider />

      {/* SECOND ROW */}
      <Box p="1rem 0">
        <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
          <LocationOnOutlined fontSize="large" sx={{ color: main }} />
          <Typography color={medium}>{location}</Typography>
        </Box>
        <Box display="flex" alignItems="center" gap="1rem">
          <WorkOutlineOutlined fontSize="large" sx={{ color: main }} />
          <Typography color={medium}>{occupation}</Typography>
        </Box>
      </Box>

      <Divider />

      {/* THIRD ROW */}
      {isPersonalProfile && (
        <Box p="1rem 0">
          <FlexBetween mb="0.5rem">
            <Typography color={medium}>Who's viewed your profile</Typography>
            <Typography color={main} fontWeight="500">
              {viewedProfile}
            </Typography>
          </FlexBetween>
          <FlexBetween>
            <Typography color={medium}>Impressions of your post</Typography>
            <Typography color={main} fontWeight="500">
              {impressions}
            </Typography>
          </FlexBetween>
        </Box>
      )}

      <Divider />

      {/* FOURTH ROW */}
      <Box p="1rem 0">
        <FlexBetween gap="1rem" mb="1rem">
          <Typography fontSize="1rem" color={main} fontWeight="500">
            Social Profiles
          </Typography>
          {isPersonalProfile && (
            <EditOutlined
              sx={{
                color: main,
                cursor: "pointer",
                "&:hover": {
                  color: palette.primary.main,
                },
              }}
              onClick={() => {
                setSocialLinksModalOpen(true);
              }}
            />
          )}
        </FlexBetween>

        <FlexBetween gap="1rem" mb="0.5rem">
          <FlexBetween gap="1rem">
            <img src="../assets/twitter.png" alt="twitter" />
            <Box>
              <Typography color={main} fontWeight="500">
                Twitter
              </Typography>
              {socials.twitter ? (
                <Box
                  component="a"
                  href={socials.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: medium,
                    textDecoration: "none",
                    "&:hover": {
                      textDecoration: "underline",
                      color: palette.primary.main,
                    },
                  }}
                >
                  {socials.twitter}
                </Box>
              ) : (
                <Typography color={medium}>Add your X account.</Typography>
              )}
            </Box>
          </FlexBetween>
        </FlexBetween>

        <FlexBetween gap="1rem">
          <FlexBetween gap="1rem">
            <img src="../assets/linkedin.png" alt="linkedin" />
            <Box>
              <Typography color={main} fontWeight="500">
                Linkedin
              </Typography>
              {socials.linkedin ? (
                <Box
                  component="a"
                  href={socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: medium,
                    textDecoration: "none",
                    "&:hover": {
                      textDecoration: "underline",
                      color: palette.primary.main, // optional highlight on hover
                    },
                  }}
                >
                  {socials.linkedin}
                </Box>
              ) : (
                <Typography color={medium}>
                  Add your linkedin account.
                </Typography>
              )}
            </Box>
          </FlexBetween>
        </FlexBetween>
      </Box>
      {/* MODAL */}
      {isPersonalProfile && (
        <SocialLinksModal
          open={socialLinksModalOpen}
          handleClose={() => setSocialLinksModalOpen(false)}
          initialValues={socials || { linkedin: "", twitter: "" }}
          onSubmit={updateSocialLinks}
        />
      )}
    </WidgetWrapper>
  );
};

export default UserWidget;
