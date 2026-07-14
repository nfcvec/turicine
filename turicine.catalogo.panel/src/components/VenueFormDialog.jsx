import { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import { createVenue, updateVenue } from "../api/venues.js";

const EMPTY = { name: "", address: "", mapsUrl: "", whatsappNumber: "", phoneNumber: "" };

// `venue` (OData read model) present -> edit mode; absent -> create mode.
export default function VenueFormDialog({ open, venue, onClose, onSaved }) {
  const isEdit = Boolean(venue);
  const [form, setForm] = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!open) return;
    setError(null);
    setForm(
      venue
        ? {
            name: venue.Name ?? "",
            address: venue.Address ?? "",
            mapsUrl: venue.MapsUrl ?? "",
            whatsappNumber: venue.WhatsappNumber ?? "",
            phoneNumber: venue.PhoneNumber ?? "",
          }
        : EMPTY,
    );
  }, [open, venue]);

  const setField = (key) => (event) =>
    setForm((prev) => ({ ...prev, [key]: event.target.value }));

  const handleSubmit = async () => {
    setError(null);
    const payload = {
      name: form.name.trim(),
      address: form.address.trim() || null,
      mapsUrl: form.mapsUrl.trim() || null,
      whatsappNumber: form.whatsappNumber.trim() || null,
      phoneNumber: form.phoneNumber.trim() || null,
    };
    setSubmitting(true);
    try {
      if (isEdit) {
        await updateVenue(venue.Id, payload);
      } else {
        await createVenue(payload);
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
      <DialogTitle>{isEdit ? "Editar sede" : "Nueva sede"}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField label="Nombre" value={form.name} onChange={setField("name")} required fullWidth />
          <TextField label="Dirección" value={form.address} onChange={setField("address")} fullWidth />
          <TextField label="Link de Maps" value={form.mapsUrl} onChange={setField("mapsUrl")} fullWidth />
          <TextField label="WhatsApp (número)" value={form.whatsappNumber} onChange={setField("whatsappNumber")} fullWidth />
          <TextField label="Teléfono" value={form.phoneNumber} onChange={setField("phoneNumber")} fullWidth />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={submitting}>
          Cancelar
        </Button>
        <Button variant="contained" onClick={handleSubmit} disabled={submitting || !form.name}>
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
