import { useEffect, useRef, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import { createSponsor, updateSponsorName, replaceSponsorLogo } from "../api/sponsors.js";

// `sponsor` present -> edit mode (name + optional new logo); absent -> create (name + logo required).
export default function SponsorFormDialog({ open, sponsor, onClose, onSaved }) {
  const isEdit = Boolean(sponsor);
  const [name, setName] = useState("");
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const fileRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    setError(null);
    setFile(null);
    if (fileRef.current) fileRef.current.value = "";
    setName(sponsor?.Name ?? "");
  }, [open, sponsor]);

  const canSave = name.trim() && (isEdit || file);

  const handleSubmit = async () => {
    setError(null);
    setSubmitting(true);
    try {
      if (isEdit) {
        await updateSponsorName(sponsor.Id, name.trim());
        if (file) await replaceSponsorLogo(sponsor.Id, file);
      } else {
        await createSponsor(name.trim(), file);
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
      <DialogTitle>{isEdit ? "Editar auspiciante" : "Nuevo auspiciante"}</DialogTitle>
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
          <Button variant="outlined" component="label">
            {file ? file.name : isEdit ? "Reemplazar logo (opcional)" : "Seleccionar logo"}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            />
          </Button>
          {!isEdit && (
            <Typography variant="caption" color="text.secondary">
              Nombre y logo son obligatorios.
            </Typography>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={submitting}>
          Cancelar
        </Button>
        <Button variant="contained" onClick={handleSubmit} disabled={submitting || !canSave}>
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
