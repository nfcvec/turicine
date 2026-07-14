import { useState } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { buildImageUrl } from "../utils/images.js";

export default function HeroCarousel({ images }) {
  const [index, setIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <Box
        sx={{
          height: 360,
          borderRadius: 2,
          bgcolor: "background.paper",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "text.secondary",
        }}
      >
        Sin imágenes
      </Box>
    );
  }

  const current = images[index];
  const go = (delta) =>
    setIndex((prev) => (prev + delta + images.length) % images.length);

  return (
    <Box sx={{ position: "relative", borderRadius: 2, overflow: "hidden" }}>
      <Box
        component="img"
        src={buildImageUrl(current.CloudflareImageId)}
        alt=""
        sx={{ width: "100%", height: 360, objectFit: "cover", display: "block" }}
      />

      {images.length > 1 && (
        <>
          <IconButton
            onClick={() => go(-1)}
            sx={{
              position: "absolute",
              top: "50%",
              left: 8,
              transform: "translateY(-50%)",
              bgcolor: "rgba(0,0,0,0.5)",
              "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
            }}
          >
            <ChevronLeftIcon />
          </IconButton>
          <IconButton
            onClick={() => go(1)}
            sx={{
              position: "absolute",
              top: "50%",
              right: 8,
              transform: "translateY(-50%)",
              bgcolor: "rgba(0,0,0,0.5)",
              "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
            }}
          >
            <ChevronRightIcon />
          </IconButton>
        </>
      )}

      <Chip
        label={`${index + 1} / ${images.length}`}
        size="small"
        sx={{ position: "absolute", bottom: 8, right: 8, bgcolor: "rgba(0,0,0,0.6)" }}
      />
    </Box>
  );
}
