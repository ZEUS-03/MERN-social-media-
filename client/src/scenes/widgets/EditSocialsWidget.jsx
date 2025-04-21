import {
  Box,
  Modal,
  Typography,
  TextField,
  Button,
  IconButton,
  useTheme,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useFormik } from "formik";
import * as Yup from "yup";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: "0.75rem",
  boxShadow: 24,
  p: 4,
};

const SocialLinksModal = ({ open, handleClose, initialValues, onSubmit }) => {
  const { palette } = useTheme();

  const formik = useFormik({
    initialValues: {
      linkedin: initialValues.linkedin || "",
      twitter: initialValues.twitter || "",
    },
    validationSchema: Yup.object({
      linkedin: Yup.string().url("Enter a valid URL"),
      twitter: Yup.string().url("Enter a valid URL"),
    }),
    onSubmit: (values) => {
      onSubmit(values);
      handleClose();
    },
  });

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography
            variant="h6"
            fontWeight="bold"
            color={palette.primary.main}
          >
            Edit Social Links
          </Typography>
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </Box>

        <Box mt={2} component="form" onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            label="LinkedIn URL"
            name="linkedin"
            value={formik.values.linkedin}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.linkedin && Boolean(formik.errors.linkedin)}
            helperText={formik.touched.linkedin && formik.errors.linkedin}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Twitter URL"
            name="twitter"
            value={formik.values.twitter}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.twitter && Boolean(formik.errors.twitter)}
            helperText={formik.touched.twitter && formik.errors.twitter}
            sx={{ mb: 2 }}
          />
          <Button fullWidth type="submit" variant="contained" sx={{ mt: 1 }}>
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default SocialLinksModal;
