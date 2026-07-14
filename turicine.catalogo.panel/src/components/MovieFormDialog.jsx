import { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import Alert from "@mui/material/Alert";
import { createMovie, updateMovie } from "../api/movies.js";
import { listCategories } from "../api/categories.js";
import { parseDurationToSeconds, formatSecondsCompact } from "../utils/duration.js";

const EMPTY = {
  title: "",
  categoryId: "",
  duration: "",
  synopsis: "",
  directors: "",
  cast: "",
  isVisible: true,
};

// `movie` (OData read model) present -> edit mode; absent -> create mode.
export default function MovieFormDialog({ open, movie, onClose, onSaved }) {
  const isEdit = Boolean(movie);
  const [form, setForm] = useState(EMPTY);
  const [categories, setCategories] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!open) return;
    setError(null);
    setForm(
      movie
        ? {
            title: movie.Title ?? "",
            categoryId: movie.CategoryId ?? "",
            duration: formatSecondsCompact(movie.DurationSeconds),
            synopsis: movie.Synopsis ?? "",
            directors: movie.Directors ?? "",
            cast: movie.Cast ?? "",
            isVisible: movie.IsVisible ?? true,
          }
        : EMPTY,
    );
  }, [open, movie]);

  useEffect(() => {
    if (!open) return;
    const controller = new AbortController();
    listCategories(controller.signal)
      .then((data) => setCategories(data?.value ?? []))
      .catch((err) => {
        if (err.name !== "AbortError") setError(err.message);
      });
    return () => controller.abort();
  }, [open]);

  const setField = (key) => (event) =>
    setForm((prev) => ({ ...prev, [key]: event.target.value }));

  const handleSubmit = async () => {
    setError(null);

    const durationSeconds = parseDurationToSeconds(form.duration);
    if (durationSeconds === null) {
      setError("Duración inválida. Usa formato como 1h21m0s o segundos.");
      return;
    }

    const payload = {
      title: form.title.trim(),
      categoryId: form.categoryId,
      durationSeconds,
      synopsis: form.synopsis.trim() || null,
      directors: form.directors.trim() || null,
      cast: form.cast.trim() || null,
      isVisible: form.isVisible,
    };

    setSubmitting(true);
    try {
      if (isEdit) {
        await updateMovie(movie.Id, payload);
      } else {
        await createMovie(payload);
      }
      onSaved();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{isEdit ? "Editar película" : "Nueva película"}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            label="Título"
            value={form.title}
            onChange={setField("title")}
            required
            fullWidth
          />
          <TextField
            select
            label="Categoría"
            value={form.categoryId}
            onChange={setField("categoryId")}
            required
            fullWidth
          >
            {categories.map((category) => (
              <MenuItem key={category.Id} value={category.Id}>
                {category.Name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Duración"
            placeholder="1h21m0s"
            value={form.duration}
            onChange={setField("duration")}
            required
            fullWidth
          />
          <TextField
            label="Sinopsis"
            value={form.synopsis}
            onChange={setField("synopsis")}
            multiline
            minRows={2}
            fullWidth
          />
          <TextField
            label="Directores"
            value={form.directors}
            onChange={setField("directors")}
            fullWidth
          />
          <TextField
            label="Elenco"
            value={form.cast}
            onChange={setField("cast")}
            fullWidth
          />
          <FormControlLabel
            control={
              <Switch
                checked={form.isVisible}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, isVisible: event.target.checked }))
                }
              />
            }
            label="Mostrar esta película en el sitio"
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={submitting}>
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={submitting || !form.title || !form.categoryId || !form.duration}
        >
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
