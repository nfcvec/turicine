import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import DeleteIcon from "@mui/icons-material/Delete";
import { buildImageUrl } from "../utils/images.js";
import { deleteMovieImage, reorderMovieImages } from "../api/movies.js";
import ConfirmDialog from "./ConfirmDialog.jsx";

export default function ImageManager({ movieId, images, onChanged }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [toDelete, setToDelete] = useState(null);

  // images come already ordered by CarouselOrder from the backend.
  const ordered = images ?? [];

  const run = async (action) => {
    setError(null);
    setBusy(true);
    try {
      await action();
      await onChanged();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const move = (index, delta) => {
    const target = index + delta;
    if (target < 0 || target >= ordered.length) return;
    const ids = ordered.map((image) => image.Id);
    [ids[index], ids[target]] = [ids[target], ids[index]];
    run(() => reorderMovieImages(movieId, ids));
  };

  const confirmDelete = () => {
    const imageId = toDelete;
    setToDelete(null);
    run(() => deleteMovieImage(movieId, imageId));
  };

  if (ordered.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        Aún no hay imágenes. Usa “Subir imágenes”.
      </Typography>
    );
  }

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
          gap: 2,
        }}
      >
        {ordered.map((image, index) => (
          <Box
            key={image.Id}
            sx={{ borderRadius: 2, overflow: "hidden", bgcolor: "background.paper" }}
          >
            <Box
              component="img"
              src={buildImageUrl(image.CloudflareImageId)}
              alt=""
              sx={{ width: "100%", height: 120, objectFit: "cover", display: "block" }}
            />
            <Stack
              direction="row"
              sx={{ justifyContent: "space-between", alignItems: "center", px: 0.5 }}
            >
              <IconButton
                size="small"
                disabled={busy || index === 0}
                onClick={() => move(index, -1)}
              >
                <ChevronLeftIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                color="error"
                disabled={busy}
                onClick={() => setToDelete(image.Id)}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                disabled={busy || index === ordered.length - 1}
                onClick={() => move(index, 1)}
              >
                <ChevronRightIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Box>
        ))}
      </Box>

      <ConfirmDialog
        open={toDelete !== null}
        title="Eliminar imagen"
        message="Se eliminará esta imagen del carrusel y de Cloudflare. Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        busy={busy}
        onConfirm={confirmDelete}
        onClose={() => setToDelete(null)}
      />
    </Box>
  );
}
