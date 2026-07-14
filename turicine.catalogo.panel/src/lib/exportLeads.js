import * as XLSX from "xlsx";

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toLocaleString("es-EC");
}

// Builds and triggers an .xlsx download from lead read models. Generation is
// fully client-side (SheetJS); the backend only returns JSON.
export function exportLeadsToExcel(leads, fileLabel) {
  const rows = leads.map((lead) => ({
    Nombre: lead.FullName,
    Correo: lead.Email,
    Tema: lead.Topic ?? "",
    Mensaje: lead.Message ?? "",
    Recibido: formatDate(lead.CreatedAtUtc),
    Descargado: lead.IsDownloaded ? "Sí" : "No",
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  worksheet["!cols"] = [
    { wch: 24 },
    { wch: 28 },
    { wch: 30 },
    { wch: 50 },
    { wch: 20 },
    { wch: 12 },
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Contactos");

  const stamp = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(workbook, `contactos_${fileLabel}_${stamp}.xlsx`);
}
