import { useCallback, useRef, useState } from "react";
import { useParams, useNavigate, Link as RouterLink } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import LinearProgress from "@mui/material/LinearProgress";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import UploadIcon from "@mui/icons-material/Upload";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PlaceIcon from "@mui/icons-material/Place";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { getMovie, uploadMovieImage, deleteMovie } from "../api/movies.js";
import { useApiResource } from "../hooks/useApiResource.js";
import { formatSeconds } from "../utils/duration.js";
import HeroCarousel from "../components/HeroCarousel.jsx";
import ImageManager from "../components/ImageManager.jsx";
import MovieFormDialog from "../components/MovieFormDialog.jsx";
import MovieVenuesDialog from "../components/MovieVenuesDialog.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";

export default function MovieDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [venuesOpen, setVenuesOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetcher = useCallback((signal) => getMovie(id, signal), [id]);
  const { data: movie, loading, error, refetch } = useApiResource(fetcher);

  const handleFiles = async (event) => {
    const files = Array.from(event.target.files || []);
    event.target.value = "";
    if (files.length === 0) return;

    setUploadError(null);
    setUploading(true);
    try {
      const startOrder = movie?.Images?.length ?? 0;
      for (let i = 0; i < files.length; i += 1) {
        await uploadMovieImage(id, files[i], startOrder + i);
      }
      await refetch();
    } catch (err) {
      setUploadError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteMovie(id);
      navigate("/movies");
    } catch {
      setDeleting(false);
      setDeleteOpen(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !movie) {
    return (
      <Box>
        <Button startIcon={<ArrowBackIcon />} component={RouterLink} to="/movies">
          Volver
        </Button>
        <Alert severity="error" sx={{ mt: 2 }}>
          {error || "Película no encontrada."}
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Button
        startIcon={<ArrowBackIcon />}
        component={RouterLink}
        to="/movies"
        sx={{ mb: 2 }}
      >
        Volver
      </Button>

      <HeroCarousel images={movie.Images} />

      <Stack
        direction="row"
        sx={{ mt: 3, mb: 1, justifyContent: "space-between", alignItems: "flex-start" }}
      >
        <Typography variant="h4">{movie.Title}</Typography>
        <Stack direction="row" spacing={1}>
          <Button startIcon={<EditIcon />} onClick={() => setEditOpen(true)}>
            Editar
          </Button>
          <Button
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => setDeleteOpen(true)}
          >
            Eliminar
          </Button>
        </Stack>
      </Stack>

      <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: "wrap" }}>
        <Chip label={movie.Category?.Name ?? "Sin categoría"} color="secondary" variant="outlined" />
        <Chip label={formatSeconds(movie.DurationSeconds)} variant="outlined" />
        <Chip label={`${movie.Images?.length ?? 0} imágenes`} variant="outlined" />
      </Stack>

      {movie.Directors && (
        <Typography variant="body2" color="text.secondary">
          <strong>Directores:</strong> {movie.Directors}
        </Typography>
      )}
      {movie.Cast && (
        <Typography variant="body2" color="text.secondary">
          <strong>Elenco:</strong> {movie.Cast}
        </Typography>
      )}
      {movie.Synopsis && (
        <Typography variant="body1" sx={{ mt: 2, maxWidth: 800 }}>
          {movie.Synopsis}
        </Typography>
      )}

      <Stack
        direction="row"
        sx={{ mt: 4, mb: 1, justifyContent: "space-between", alignItems: "center" }}
      >
        <Typography variant="h6">Sedes donde se emite</Typography>
        <Button startIcon={<PlaceIcon />} onClick={() => setVenuesOpen(true)}>
          Editar sedes
        </Button>
      </Stack>
      {movie.Venues && movie.Venues.length > 0 ? (
        <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: "wrap", gap: 1 }}>
          {movie.Venues.map((venue) => (
            <Chip
              key={venue.Id}
              icon={<PlaceIcon />}
              label={venue.Name}
              variant="outlined"
              onClick={
                venue.MapsUrl
                  ? () => window.open(venue.MapsUrl, "_blank", "noopener")
                  : undefined
              }
              onDelete={
                venue.WhatsappNumber
                  ? () =>
                      window.open(
                        `https://wa.me/${venue.WhatsappNumber.replace(/\D/g, "")}`,
                        "_blank",
                        "noopener",
                      )
                  : undefined
              }
              deleteIcon={venue.WhatsappNumber ? <WhatsAppIcon /> : undefined}
            />
          ))}
        </Stack>
      ) : (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          No asignada a ninguna sede.
        </Typography>
      )}

      <Stack
        direction="row"
        sx={{ mt: 4, mb: 1, justifyContent: "space-between", alignItems: "center" }}
      >
        <Typography variant="h6">Imágenes del carrusel</Typography>
        <Button
          variant="contained"
          startIcon={<UploadIcon />}
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          Subir imágenes
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={handleFiles}
        />
      </Stack>

      {uploading && <LinearProgress sx={{ mb: 2 }} />}
      {uploadError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {uploadError}
        </Alert>
      )}

      <ImageManager movieId={id} images={movie.Images} onChanged={refetch} />

      <MovieFormDialog
        open={editOpen}
        movie={movie}
        onClose={() => setEditOpen(false)}
        onSaved={() => {
          setEditOpen(false);
          refetch();
        }}
      />

      <MovieVenuesDialog
        open={venuesOpen}
        movieId={id}
        currentVenues={movie.Venues}
        onClose={() => setVenuesOpen(false)}
        onSaved={() => {
          setVenuesOpen(false);
          refetch();
        }}
      />

      <ConfirmDialog
        open={deleteOpen}
        title="Eliminar película"
        message="Se eliminará la película y todas sus imágenes (Cloudflare y base de datos). Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        busy={deleting}
        onConfirm={handleDelete}
        onClose={() => setDeleteOpen(false)}
      />
    </Box>
  );
}
