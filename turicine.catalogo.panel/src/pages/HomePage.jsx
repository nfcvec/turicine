import { useCallback } from "react";
import { Link as RouterLink } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActionArea from "@mui/material/CardActionArea";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import MovieIcon from "@mui/icons-material/Movie";
import RefreshIcon from "@mui/icons-material/Refresh";
import { listMovies } from "../api/movies.js";
import { useApiResource } from "../hooks/useApiResource.js";

export default function HomePage() {
  const fetcher = useCallback((signal) => listMovies(signal), []);
  const { data, loading, error, refetch } = useApiResource(fetcher);

  const total = data?.value?.length ?? null;

  const subtitle = error
    ? "No se pudo cargar"
    : loading
      ? "Cargando…"
      : `${total} registradas`;

  return (
    <Box>
      <Stack
        direction="row"
        sx={{ mb: 1, justifyContent: "space-between", alignItems: "center" }}
      >
        <Typography variant="h4">Panel del catálogo</Typography>
        <Tooltip title="Actualizar">
          <span>
            <IconButton onClick={() => refetch()} disabled={loading}>
              <RefreshIcon />
            </IconButton>
          </span>
        </Tooltip>
      </Stack>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Administración de películas del festival Turicine.
      </Typography>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card>
            <CardActionArea component={RouterLink} to="/movies">
              <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <MovieIcon color="secondary" fontSize="large" />
                <Box>
                  <Typography variant="h6">Películas</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {subtitle}
                  </Typography>
                </Box>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
