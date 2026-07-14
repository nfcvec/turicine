import { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import { createCategory, updateCategory } from "../api/categories.js";

// `category` (OData read model) present -> edit mode; absent -> create mode.
export default function CategoryFormDialog({ open, category, onClose, onSaved }) {
  const isEdit = Boolean(category);
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!open) return;
    setError(null);
    setName(category?.Name ?? "");
  }, [open, category]);

  const handleSubmit = async () => {
    setError(null);
    const payload = { name: name.trim() };
    setSubmitting(true);
    try {
      if (isEdit) {
        await updateCategory(category.Id, payload);
      } else {
        await createCategory(payload);
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
      <DialogTitle>{isEdit ? "Editar categoría" : "Nueva categoría"}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            label="Nombre"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={submitting}>
          Cancelar
        </Button>
        <Button variant="contained" onClick={handleSubmit} disabled={submitting || !name.trim()}>
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
