"use client";

import React, { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  CaretLeft,
  UploadSimple,
  FileCsv,
  ArrowRight,
  CheckCircle,
  XCircle,
  Warning,
  Ticket,
  Spinner,
} from "@phosphor-icons/react";
import Button from "@/components/Button";
import { ImportService, ImportResult, ImportOptions } from "@/services/import";
import { BookingService } from "@/services/booking";
import { TicketType } from "@/types/booking";
import customToast from "@/lib/toast";

interface Props {
  eventId: string;
}

type Step = "upload" | "map" | "result";

const REQUIRED_FIELDS = ["name", "email"] as const;
const OPTIONAL_FIELDS = ["phone", "city", "location"] as const;
type FieldKey = (typeof REQUIRED_FIELDS)[number] | (typeof OPTIONAL_FIELDS)[number];

const FIELD_LABELS: Record<FieldKey, string> = {
  name: "Full Name",
  email: "Email Address",
  phone: "Phone Number",
  city: "City",
  location: "Location / Address",
};

const ImportAttendeesPage: React.FC<Props> = ({ eventId }) => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<Step>("upload");
  const [isDragging, setIsDragging] = useState(false);

  // Step 1 state
  const [file, setFile] = useState<File | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [previewing, setPreviewing] = useState(false);

  // Step 2 state
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [ticketsLoading, setTicketsLoading] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState("");
  const [fieldMapping, setFieldMapping] = useState<Record<FieldKey, string>>({
    name: "",
    email: "",
    phone: "",
    city: "",
    location: "",
  });
  const [skipDuplicates, setSkipDuplicates] = useState(true);
  const [importing, setImporting] = useState(false);

  // Step 3 state
  const [result, setResult] = useState<ImportResult | null>(null);

  // ─── File handling ───────────────────────────────────────────────────────────

  const handleFile = useCallback(
    async (f: File) => {
      if (!f.name.toLowerCase().endsWith(".csv")) {
        customToast.error("Please upload a CSV file");
        return;
      }
      setFile(f);
      setPreviewing(true);
      try {
        const preview = await ImportService.previewCSV(eventId, f);
        setHeaders(preview.headers);

        // Auto-map columns by fuzzy matching
        const autoMap: Record<FieldKey, string> = {
          name: "",
          email: "",
          phone: "",
          city: "",
          location: "",
        };
        for (const h of preview.headers) {
          const lower = h.toLowerCase();
          if (!autoMap.name && (lower.includes("name") || lower.includes("full")))
            autoMap.name = h;
          else if (!autoMap.email && lower.includes("email")) autoMap.email = h;
          else if (!autoMap.phone && (lower.includes("phone") || lower.includes("mobile")))
            autoMap.phone = h;
          else if (!autoMap.city && lower.includes("city")) autoMap.city = h;
          else if (!autoMap.location && (lower.includes("address") || lower.includes("location")))
            autoMap.location = h;
        }
        setFieldMapping(autoMap);

        // Fetch ticket types
        setTicketsLoading(true);
        const tix = await BookingService.getTicketTypes(eventId);
        setTickets(tix);
        if (tix.length === 1) setSelectedTicketId(tix[0].id);
        setTicketsLoading(false);

        setStep("map");
      } catch (err: any) {
        customToast.error(err.message || "Failed to read CSV");
      } finally {
        setPreviewing(false);
      }
    },
    [eventId]
  );

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  };

  // ─── Import ──────────────────────────────────────────────────────────────────

  const runImport = async () => {
    if (!file || !selectedTicketId || !fieldMapping.name || !fieldMapping.email) {
      customToast.error("Please fill in all required fields");
      return;
    }

    setImporting(true);
    try {
      const options: ImportOptions = {
        ticketId: selectedTicketId,
        nameColumn: fieldMapping.name,
        emailColumn: fieldMapping.email,
        phoneColumn: fieldMapping.phone || undefined,
        cityColumn: fieldMapping.city || undefined,
        locationColumn: fieldMapping.location || undefined,
        skipDuplicates,
      };

      const res = await ImportService.importGoogleForms(eventId, file, options);
      setResult(res);
      setStep("result");
      customToast.success(`${res.created} attendee(s) imported successfully`);
    } catch (err: any) {
      customToast.error(err.response?.data?.message || err.message || "Import failed");
    } finally {
      setImporting(false);
    }
  };

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white">
      {/* Header */}
      <div className="border-b border-white/10 px-6 py-4 flex items-center gap-4">
        <button
          onClick={() => router.push(`/events/${eventId}/manage`)}
          className="text-white/60 hover:text-white transition-colors"
        >
          <CaretLeft size={20} />
        </button>
        <div>
          <h1 className="text-lg font-semibold">Import Attendees</h1>
          <p className="text-sm text-white/50">Google Forms / CSV import</p>
        </div>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-0 px-6 py-5 border-b border-white/10">
        {(["upload", "map", "result"] as Step[]).map((s, i) => {
          const labels = { upload: "Upload CSV", map: "Map Fields", result: "Results" };
          const active = s === step;
          const done =
            (s === "upload" && (step === "map" || step === "result")) ||
            (s === "map" && step === "result");
          return (
            <React.Fragment key={s}>
              <div className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium ${
                    done
                      ? "bg-green-500 text-white"
                      : active
                      ? "bg-white text-black"
                      : "bg-white/10 text-white/40"
                  }`}
                >
                  {done ? <CheckCircle size={16} weight="fill" /> : i + 1}
                </div>
                <span
                  className={`text-sm font-medium ${
                    active ? "text-white" : done ? "text-green-400" : "text-white/40"
                  }`}
                >
                  {labels[s]}
                </span>
              </div>
              {i < 2 && <div className="mx-3 flex-1 h-px bg-white/10 max-w-[80px]" />}
            </React.Fragment>
          );
        })}
      </div>

      <div className="max-w-2xl mx-auto px-6 py-10">
        {/* ── Step 1: Upload ── */}
        {step === "upload" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-1">Upload your CSV file</h2>
              <p className="text-white/50 text-sm">
                Export responses from Google Forms → Google Sheets →{" "}
                <span className="text-white/70">File › Download › CSV</span>
              </p>
            </div>

            {/* Drop zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${
                isDragging ? "border-white/50 bg-white/5" : "border-white/20 hover:border-white/40"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,text/csv"
                className="hidden"
                onChange={onFileChange}
              />
              {previewing ? (
                <div className="flex flex-col items-center gap-3">
                  <Spinner size={32} className="animate-spin text-white/60" />
                  <p className="text-white/60">Reading CSV…</p>
                </div>
              ) : file ? (
                <div className="flex flex-col items-center gap-3">
                  <FileCsv size={40} className="text-green-400" />
                  <p className="font-medium">{file.name}</p>
                  <p className="text-white/40 text-sm">
                    {(file.size / 1024).toFixed(1)} KB — click to replace
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <UploadSimple size={40} className="text-white/30" />
                  <p className="font-medium text-white/70">Drag & drop your CSV here</p>
                  <p className="text-white/40 text-sm">or click to browse — max 5 MB</p>
                </div>
              )}
            </div>

            <div className="rounded-xl bg-white/5 border border-white/10 p-4 text-sm text-white/60 space-y-1">
              <p className="font-medium text-white/80 mb-2">How to export from Google Forms</p>
              <p>1. Open your form → click <strong className="text-white/70">Responses</strong></p>
              <p>2. Click the Google Sheets icon to open in Sheets</p>
              <p>3. Go to <strong className="text-white/70">File › Download › Comma Separated Values (.csv)</strong></p>
              <p>4. Upload the downloaded file here</p>
            </div>
          </div>
        )}

        {/* ── Step 2: Map fields ── */}
        {step === "map" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-1">Map your columns</h2>
              <p className="text-white/50 text-sm">
                Tell us which column from <span className="text-white/70">{file?.name}</span>{" "}
                matches each EventFi field.
              </p>
            </div>

            {/* Field mapping */}
            <div className="rounded-xl border border-white/10 overflow-hidden divide-y divide-white/10">
              {([...REQUIRED_FIELDS, ...OPTIONAL_FIELDS] as FieldKey[]).map((field) => (
                <div key={field} className="flex items-center gap-4 px-4 py-3">
                  <div className="w-36 shrink-0">
                    <span className="text-sm font-medium text-white/80">
                      {FIELD_LABELS[field]}
                    </span>
                    {REQUIRED_FIELDS.includes(field as any) && (
                      <span className="ml-1 text-xs text-red-400">*</span>
                    )}
                  </div>
                  <select
                    value={fieldMapping[field]}
                    onChange={(e) =>
                      setFieldMapping((prev) => ({ ...prev, [field]: e.target.value }))
                    }
                    className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-white/50"
                  >
                    <option value="">— not mapped —</option>
                    {headers.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            {/* Ticket selection */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Assign to ticket type <span className="text-red-400">*</span>
              </label>
              {ticketsLoading ? (
                <div className="flex items-center gap-2 text-white/40 text-sm">
                  <Spinner className="animate-spin" /> Loading tickets…
                </div>
              ) : tickets.length === 0 ? (
                <p className="text-sm text-yellow-400">
                  No tickets found for this event. Create a ticket first.
                </p>
              ) : (
                <div className="space-y-2">
                  {tickets.map((t) => (
                    <label
                      key={t.id}
                      className={`flex items-center gap-3 rounded-xl border px-4 py-3 cursor-pointer transition-colors ${
                        selectedTicketId === t.id
                          ? "border-white/60 bg-white/10"
                          : "border-white/15 hover:border-white/30"
                      }`}
                    >
                      <input
                        type="radio"
                        name="ticket"
                        value={t.id}
                        checked={selectedTicketId === t.id}
                        onChange={() => setSelectedTicketId(t.id)}
                        className="accent-white"
                      />
                      <Ticket size={16} className="text-white/50 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{t.name}</p>
                        <p className="text-xs text-white/40">
                          {t.type === "FREE" ? "Free" : `${t.currency} ${t.price.toLocaleString()}`}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Options */}
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={skipDuplicates}
                onChange={(e) => setSkipDuplicates(e.target.checked)}
                className="w-4 h-4 rounded accent-white"
              />
              <span className="text-sm text-white/70">
                Skip rows where the email already exists as an attendee for this event
              </span>
            </label>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setStep("upload")}
                className="px-5 py-2.5 rounded-xl border border-white/20 text-sm text-white/70 hover:text-white hover:border-white/40 transition-colors"
              >
                Back
              </button>
              <Button
                onClick={runImport}
                disabled={importing || !selectedTicketId || !fieldMapping.name || !fieldMapping.email}
                className="flex items-center gap-2"
              >
                {importing ? (
                  <>
                    <Spinner className="animate-spin" size={16} /> Importing…
                  </>
                ) : (
                  <>
                    Import Attendees <ArrowRight size={16} />
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* ── Step 3: Results ── */}
        {step === "result" && result && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Import complete</h2>

            {/* Summary cards */}
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-xl bg-green-500/10 border border-green-500/20 p-4 text-center">
                <p className="text-3xl font-bold text-green-400">{result.created}</p>
                <p className="text-sm text-white/50 mt-1">Imported</p>
              </div>
              <div className="rounded-xl bg-white/5 border border-white/10 p-4 text-center">
                <p className="text-3xl font-bold text-white/70">{result.skipped}</p>
                <p className="text-sm text-white/50 mt-1">Skipped</p>
              </div>
              <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-center">
                <p className="text-3xl font-bold text-red-400">{result.errors.length}</p>
                <p className="text-sm text-white/50 mt-1">Errors</p>
              </div>
            </div>

            <p className="text-sm text-white/50">
              {result.total} rows in file · {result.created} added · {result.skipped} skipped
              (duplicate) · {result.errors.length} invalid
            </p>

            {/* Error list */}
            {result.errors.length > 0 && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/5 overflow-hidden">
                <div className="px-4 py-3 border-b border-red-500/20 flex items-center gap-2">
                  <Warning size={16} className="text-red-400" />
                  <span className="text-sm font-medium text-red-400">Rows with errors</span>
                </div>
                <div className="divide-y divide-red-500/10 max-h-64 overflow-y-auto">
                  {result.errors.slice(0, 50).map((e, i) => (
                    <div key={i} className="px-4 py-2 flex items-center gap-3 text-sm">
                      <span className="text-white/30 w-16 shrink-0">Row {e.row}</span>
                      <span className="text-red-300">{e.reason}</span>
                    </div>
                  ))}
                  {result.errors.length > 50 && (
                    <div className="px-4 py-2 text-sm text-white/40">
                      …and {result.errors.length - 50} more
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setStep("upload");
                  setFile(null);
                  setHeaders([]);
                  setResult(null);
                  setFieldMapping({ name: "", email: "", phone: "", city: "", location: "" });
                  setSelectedTicketId("");
                }}
                className="px-5 py-2.5 rounded-xl border border-white/20 text-sm text-white/70 hover:text-white hover:border-white/40 transition-colors"
              >
                Import another file
              </button>
              <Button onClick={() => router.push(`/events/${eventId}/manage`)}>
                View attendees
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImportAttendeesPage;
