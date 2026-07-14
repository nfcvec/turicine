import { useCallback, useMemo, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import Switch from "@mui/material/Switch";
import Tooltip from "@mui/material/Tooltip";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { listMovies, setMovieVisibility } from "../api/movies.js";
import { formatSeconds } from "../utils/duration.js";
import { useApiResource } from "../hooks/useApiResource.js";
import MovieFormDialog from "../components/MovieFormDialog.jsx";

// A movie is "incomplete" when any of these are missing.
function missingFields(movie) {
  const missing = [];
  if (!movie.Synopsis) missing.push("sinopsis");
  if (!movie.Directors) missing.push("directores");
  if (!movie.Cast) missing.push("elenco");
  if (!movie.Images || movie.Images.length === 0) missing.push("imágenes");
  return missing;
}

export default function MoviesPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [visibilityBusyId, setVisibilityBusyId] = useState(null);
  const [actionError, setActionError] = useState(null);

  const fetcher = useCallback((signal) => listMovies(signal), []);
  const { data, loading, error, refetch } = useApiResource(fetcher);

  const toggleVisibility = async (movie) => {
    setActionError(null);
    setVisibilityBusyId(movie.Id);
    try {
      await setMovieVisibility(movie.Id, !movie.IsVisible);
      await refetch();
    } catch (err) {
      setActionError(err.message);
    } finally {
      setVisibilityBusyId(null);
    }
  };

  // Incomplete first (more missing = higher), then by title.
  const movies = useMemo(() => {
    const list = data?.value ?? [];
    return [...list].sort((a, b) => {
      const diff = missingFields(b).length - missingFields(a).length;
      return diff !== 0 ? diff : a.Title.localeCompare(b.Title);
    });
  }, [data]);

  const handleSaved = () => {
    setDialogOpen(false);
    refetch();
  };

  return (
    <Box>
      <Stack
        direction="row"
        sx={{ mb: 2, justifyContent: "space-between", alignItems: "center" }}
      >
        <Typography variant="h4">Películas</Typography>
        <Stack direction="row" spacing={1}>
          <Button
            startIcon={<RefreshIcon />}
            onClick={() => refetch()}
            disabled={loading}
          >
            Actualizar
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setDialogOpen(true)}
          >
            Nueva película
          </Button>
        </Stack>
      </Stack>

      {(error || actionError) && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || actionError}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Estado</TableCell>
                <TableCell>Título</TableCell>
                <TableCell>Categoría</TableCell>
                <TableCell>Duración</TableCell>
                <TableCell>Directores</TableCell>
                <TableCell align="center">Mostrar</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {movies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    Sin películas registradas.
                  </TableCell>
                </TableRow>
              ) : (
                movies.map((movie) => {
                  const missing = missingFields(movie);
                  return (
                    <TableRow key={movie.Id} hover>
                      <TableCell>
                        {missing.length === 0 ? (
                          <Tooltip title="Completa">
                            <CheckCircleIcon color="success" fontSize="small" />
                          </Tooltip>
                        ) : (
                          <Tooltip title={`Falta: ${missing.join(", ")}`}>
                            <Chip
                              icon={<WarningAmberIcon />}
                              label={`Falta ${missing.length}`}
                              color="warning"
                              size="small"
                              variant="outlined"
                            />
                          </Tooltip>
                        )}
                      </TableCell>
                      <TableCell>
                        <Link component={RouterLink} to={`/movies/${movie.Id}`}>
                          {movie.Title}
                        </Link>
                      </TableCell>
                      <TableCell>{movie.Category?.Name ?? "—"}</TableCell>
                      <TableCell>{formatSeconds(movie.DurationSeconds)}</TableCell>
                      <TableCell>{movie.Directors || "—"}</TableCell>
                      <TableCell align="center">
                        <Tooltip title={movie.IsVisible ? "Visible en el sitio" : "Oculta en el sitio"}>
                          <Switch
                            size="small"
                            checked={Boolean(movie.IsVisible)}
                            onChange={() => toggleVisibility(movie)}
                            disabled={visibilityBusyId === movie.Id}
                          />
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <MovieFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSaved={handleSaved}
      />
    </Box>
  );
}
