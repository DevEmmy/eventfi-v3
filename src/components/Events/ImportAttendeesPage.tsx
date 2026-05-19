"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
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
  Database,
  ChartBar,
} from "@phosphor-icons/react";
import Button from "@/components/Button";
import { ImportService, ImportResult, ImportOptions } from "@/services/import";
import { BookingService } from "@/services/booking";
import { TicketType } from "@/types/booking";
import customToast from "@/lib/toast";
import confetti from "canvas-confetti";

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
  const [csvPreviewRows, setCsvPreviewRows] = useState<string[][]>([]);

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

  // Trigger confetti on Step 3 successful results load
  useEffect(() => {
    if (step === "result" && result && result.created > 0) {
      try {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
        });
      } catch (e) {
        console.error("Confetti failed", e);
      }
    }
  }, [step, result]);

  // Parse CSV preview locally to extract 5 preview rows
  const parseCsvLocal = (f: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (!text) return;

      const parseCSVLine = (line: string): string[] => {
        const resultRow: string[] = [];
        let current = "";
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          if (char === '"') {
            inQuotes = !inQuotes;
          } else if (char === "," && !inQuotes) {
            resultRow.push(current.trim());
            current = "";
          } else {
            current += char;
          }
        }
        resultRow.push(current.trim());
        return resultRow;
      };

      const lines = text.split(/\r?\n/);
      const parsed: string[][] = [];
      // Parse first 6 lines (1 header + 5 content)
      for (let i = 0; i < Math.min(lines.length, 6); i++) {
        if (lines[i].trim()) {
          parsed.push(parseCSVLine(lines[i]));
        }
      }
      if (parsed.length > 1) {
        setCsvPreviewRows(parsed.slice(1));
      } else {
        setCsvPreviewRows([]);
      }
    };
    reader.readAsText(f);
  };

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

        // Parse local preview
        parseCsvLocal(f);

        // Fetch ticket types
        setTicketsLoading(true);
        const tix = await BookingService.getTicketTypes(eventId);
        setTickets(tix);
        if (tix.length === 1) setSelectedTicketId(tix[0].id);
        setTicketsLoading(false);
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
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-foreground/10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push(`/events/${eventId}/manage`)}
              className="p-2 rounded-full border border-foreground/10 text-foreground/60 hover:text-foreground hover:bg-foreground/5 hover:border-foreground/20 transition-all cursor-pointer"
            >
              <CaretLeft size={20} />
            </button>
            <div>
              <h1 className="text-xl font-bold font-[family-name:var(--font-clash-display)] tracking-wide">
                Import Attendees
              </h1>
              <p className="text-xs text-foreground/50">Google Forms / CSV data integration</p>
            </div>
          </div>
        </div>
      </div>

      {/* Step indicator */}
      <div className="border-b border-foreground/10 bg-foreground/[0.01] py-5 px-6">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          {(["upload", "map", "result"] as Step[]).map((s, i) => {
            const labels = { upload: "Upload CSV", map: "Map Fields", result: "Results" };
            const active = s === step;
            const done =
              (s === "upload" && (step === "map" || step === "result")) ||
              (s === "map" && step === "result");
            return (
              <React.Fragment key={s}>
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 border ${
                      done
                        ? "bg-green-500 border-green-500 text-white shadow-lg shadow-green-500/20"
                        : active
                        ? "bg-primary border-primary text-white shadow-lg shadow-primary/20"
                        : "bg-foreground/[0.02] border-foreground/10 text-foreground/40"
                    }`}
                  >
                    {done ? <CheckCircle size={16} weight="bold" /> : i + 1}
                  </div>
                  <span
                    className={`text-xs font-semibold tracking-wide uppercase transition-all duration-300 ${
                      active
                        ? "text-foreground font-bold"
                        : done
                        ? "text-green-500"
                        : "text-foreground/40"
                    }`}
                  >
                    {labels[s]}
                  </span>
                </div>
                {i < 2 && (
                  <div
                    className={`flex-1 h-[2px] mx-4 transition-all duration-500 min-w-[20px] max-w-[60px] ${
                      done ? "bg-green-500" : "bg-foreground/10"
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* ── Step 1: Upload ── */}
        {step === "upload" && (
          <div className="space-y-8">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold font-[family-name:var(--font-clash-display)] mb-2">
                Upload your CSV file
              </h2>
              <p className="text-foreground/50 text-sm">
                Provide responses exported from Google Forms or any spreadsheet. For best results,
                make sure column headers like <strong className="text-foreground/80 font-medium">Name</strong> and{" "}
                <strong className="text-foreground/80 font-medium">Email</strong> are defined.
              </p>
            </div>

            {/* Drop zone / File Card */}
            {!file ? (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={onDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-14 text-center cursor-pointer transition-all duration-300 relative overflow-hidden group ${
                  isDragging
                    ? "border-primary bg-primary/[0.03] shadow-lg shadow-primary/5"
                    : "border-foreground/15 hover:border-foreground/30 hover:bg-foreground/[0.01]"
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
                  <div className="flex flex-col items-center gap-4">
                    <Spinner size={36} className="animate-spin text-primary" />
                    <p className="text-foreground/60 text-sm font-medium">Reading and validating CSV data…</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-foreground/[0.02] border border-foreground/10 flex items-center justify-center text-foreground/40 group-hover:scale-110 group-hover:text-primary group-hover:border-primary/20 transition-all duration-300">
                      <UploadSimple size={32} />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground/80 text-lg">Drag & drop your CSV file here</p>
                      <p className="text-foreground/40 text-sm mt-1">or click to browse from files — max 5 MB</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {/* Custom File Metadata Card */}
                <div className="rounded-2xl border border-foreground/10 p-6 bg-foreground/[0.01] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-transparent pointer-events-none opacity-50" />
                  
                  <div className="flex items-center gap-4 relative z-10 min-w-0">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-sm shadow-primary/10 shrink-0">
                      <FileCsv size={28} weight="fill" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground truncate max-w-sm sm:max-w-md">
                        {file.name}
                      </p>
                      <div className="flex items-center gap-2.5 mt-1 text-xs text-foreground/50">
                        <span>{(file.size / 1024).toFixed(1)} KB</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-foreground/20" />
                        <span className="flex items-center gap-1 text-green-500 font-medium">
                          <CheckCircle size={14} weight="fill" /> CSV Structure Valid
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 relative z-10 shrink-0 self-end sm:self-center">
                    <button
                      onClick={() => {
                        setFile(null);
                        setHeaders([]);
                        setCsvPreviewRows([]);
                      }}
                      className="px-4 py-2 rounded-full border border-foreground/15 text-xs font-semibold text-foreground/70 hover:text-foreground hover:bg-foreground/5 hover:border-foreground/30 transition-all cursor-pointer"
                    >
                      Change File
                    </button>
                    <Button
                      onClick={() => setStep("map")}
                      variant="primary"
                      size="sm"
                      rightIcon={ArrowRight}
                    >
                      Map Columns
                    </Button>
                  </div>
                </div>

                {/* CSV Table Preview */}
                {headers.length > 0 && csvPreviewRows.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-foreground/80">File Preview</h3>
                      <span className="text-xs text-foreground/40">Showing first {csvPreviewRows.length} rows</span>
                    </div>
                    <div className="rounded-2xl border border-foreground/10 overflow-hidden bg-foreground/[0.01]">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="border-b border-foreground/10 bg-foreground/[0.02]">
                              {headers.map((h, idx) => (
                                <th
                                  key={idx}
                                  className="px-4 py-3 font-semibold whitespace-nowrap text-foreground/70 border-r border-foreground/5 last:border-r-0"
                                >
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-foreground/5">
                            {csvPreviewRows.map((row, rowIdx) => (
                              <tr key={rowIdx} className="hover:bg-foreground/[0.01] transition-colors">
                                {headers.map((h, colIdx) => (
                                  <td
                                    key={colIdx}
                                    className="px-4 py-2.5 truncate max-w-[150px] text-foreground/60 border-r border-foreground/5 last:border-r-0"
                                  >
                                    {row[colIdx] || ""}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Premium Instructions Grid */}
            <div className="rounded-2xl border border-foreground/10 bg-foreground/[0.01] p-6">
              <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                <Database size={16} className="text-primary" />
                How to export from Google Forms
              </h3>
              <div className="grid sm:grid-cols-2 gap-5 text-xs text-foreground/60 leading-relaxed">
                <div className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-foreground/5 text-foreground/80 flex items-center justify-center font-bold shrink-0">
                    1
                  </div>
                  <p>
                    Open your Google Form, select the{" "}
                    <strong className="text-foreground font-semibold">Responses</strong> tab, and click
                    the green sheets icon to view responses.
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-foreground/5 text-foreground/80 flex items-center justify-center font-bold shrink-0">
                    2
                  </div>
                  <p>
                    In the Google Sheet, go to{" "}
                    <strong className="text-foreground font-semibold">File › Download › Comma Separated Values (.csv)</strong>{" "}
                    to download.
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-foreground/5 text-foreground/80 flex items-center justify-center font-bold shrink-0">
                    3
                  </div>
                  <p>
                    Upload the downloaded CSV file in the zone above. We'll automatically match
                    columns like name and email.
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-foreground/5 text-foreground/80 flex items-center justify-center font-bold shrink-0">
                    4
                  </div>
                  <p>
                    Map the columns to database fields, choose which ticket category the attendees belong
                    to, and run the import.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Step 2: Map fields ── */}
        {step === "map" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold font-[family-name:var(--font-clash-display)] mb-2">
                Map columns & options
              </h2>
              <p className="text-foreground/50 text-sm">
                Align the headers from <span className="text-foreground/80 font-medium">{file?.name}</span>{" "}
                with the EventFi fields and configure ticket preferences.
              </p>
            </div>

            {/* Main Mapping Workspace: Grid layout */}
            <div className="grid lg:grid-cols-12 gap-8 items-start">
              {/* Left Form: 7 cols */}
              <div className="lg:col-span-7 space-y-6">
                {/* Field mappings card */}
                <div className="rounded-2xl border border-foreground/10 bg-foreground/[0.01] p-5 space-y-4">
                  <h3 className="text-sm font-semibold text-foreground/80 mb-1">Database Column Alignment</h3>
                  <div className="divide-y divide-foreground/5">
                    {([...REQUIRED_FIELDS, ...OPTIONAL_FIELDS] as FieldKey[]).map((field) => {
                      const isRequired = REQUIRED_FIELDS.includes(field as any);
                      return (
                        <div key={field} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3.5 first:pt-0 last:pb-0">
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-sm font-semibold text-foreground/80">
                                {FIELD_LABELS[field]}
                              </span>
                              {isRequired ? (
                                <span className="text-[10px] font-bold text-red-500 bg-red-500/10 px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                                  Required
                                </span>
                              ) : (
                                <span className="text-[10px] font-semibold text-foreground/40 bg-foreground/5 px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                                  Optional
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <select
                            value={fieldMapping[field]}
                            onChange={(e) =>
                              setFieldMapping((prev) => ({ ...prev, [field]: e.target.value }))
                            }
                            className={`w-full sm:w-56 bg-background border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer ${
                              fieldMapping[field]
                                ? "border-primary/50 text-foreground font-medium"
                                : "border-foreground/10 text-foreground/50"
                            }`}
                          >
                            <option value="">— Mapped: none —</option>
                            {headers.map((h) => (
                              <option key={h} value={h}>
                                {h}
                              </option>
                            ))}
                          </select>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Ticket Types selection */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-foreground/80">
                    Assign ticket type <span className="text-red-500">*</span>
                  </label>
                  {ticketsLoading ? (
                    <div className="flex items-center gap-2 text-foreground/40 text-xs">
                      <Spinner className="animate-spin text-primary" size={16} /> Loading tickets…
                    </div>
                  ) : tickets.length === 0 ? (
                    <p className="text-xs text-yellow-500 bg-yellow-500/10 border border-yellow-500/20 px-4 py-3 rounded-xl font-medium">
                      No tickets found for this event. Create a ticket first.
                    </p>
                  ) : (
                    <div className="grid sm:grid-cols-2 gap-3">
                      {tickets.map((t) => (
                        <label
                          key={t.id}
                          className={`flex items-start gap-3 rounded-2xl border p-4 cursor-pointer transition-all duration-300 ${
                            selectedTicketId === t.id
                              ? "border-primary bg-primary/[0.04] ring-2 ring-primary/20"
                              : "border-foreground/10 bg-foreground/[0.01] hover:border-foreground/20 hover:bg-foreground/[0.02]"
                          }`}
                        >
                          <input
                            type="radio"
                            name="ticket"
                            value={t.id}
                            checked={selectedTicketId === t.id}
                            onChange={() => setSelectedTicketId(t.id)}
                            className="hidden"
                          />
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                            selectedTicketId === t.id
                              ? "border-primary bg-primary"
                              : "border-foreground/30"
                          }`}>
                            {selectedTicketId === t.id && (
                              <div className="w-1.5 h-1.5 rounded-full bg-white" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 justify-between">
                              <p className="text-xs font-bold text-foreground truncate">{t.name}</p>
                              {t.type === "FREE" ? (
                                <span className="text-[10px] font-bold text-green-500 bg-green-500/10 px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                                  Free
                                </span>
                              ) : (
                                <span className="text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                                  Paid
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-foreground/50 mt-1.5 font-semibold">
                              {t.type === "FREE"
                                ? "Free Ticket"
                                : `${t.currency} ${t.price.toLocaleString()}`}
                            </p>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Settings Duplicates Switch */}
                <div className="rounded-2xl border border-foreground/10 p-5 bg-foreground/[0.01] flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <h3 className="text-xs font-semibold text-foreground/80">Skip Duplicate Records</h3>
                    <p className="text-[11px] text-foreground/40 leading-normal max-w-sm sm:max-w-md">
                      Automatically ignore CSV rows with email addresses that are already registered for this event.
                    </p>
                  </div>
                  <div
                    onClick={() => setSkipDuplicates(!skipDuplicates)}
                    className={`w-10 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 shrink-0 ${
                      skipDuplicates ? "bg-primary" : "bg-foreground/20"
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ${
                        skipDuplicates ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => setStep("upload")}
                    className="px-5 py-2.5 rounded-full border border-foreground/15 text-sm font-semibold text-foreground/70 hover:text-foreground hover:bg-foreground/5 hover:border-foreground/30 transition-all cursor-pointer"
                  >
                    Back
                  </button>
                  <Button
                    onClick={runImport}
                    disabled={
                      importing || !selectedTicketId || !fieldMapping.name || !fieldMapping.email
                    }
                    variant="primary"
                    size="md"
                    rightIcon={importing ? undefined : ArrowRight}
                    className="w-full sm:w-auto"
                  >
                    {importing ? (
                      <>
                        <Spinner className="animate-spin" size={16} /> Importing…
                      </>
                    ) : (
                      "Import Attendees"
                    )}
                  </Button>
                </div>
              </div>

              {/* Right CSV Preview: 5 cols */}
              <div className="lg:col-span-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-foreground/80">Preview & Highlights</h3>
                  <span className="text-[10px] text-foreground/40 bg-foreground/5 px-2 py-0.5 rounded-md font-semibold">
                    Dynamic Mapping view
                  </span>
                </div>
                
                {headers.length > 0 && csvPreviewRows.length > 0 ? (
                  <div className="rounded-2xl border border-foreground/10 overflow-hidden bg-foreground/[0.01] shadow-sm">
                    <div className="overflow-x-auto max-h-[460px] overflow-y-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-foreground/10 bg-foreground/[0.02] sticky top-0 z-10 bg-background">
                            {headers.map((h, idx) => {
                              const matchedField = (Object.keys(fieldMapping) as FieldKey[]).find(
                                (k) => fieldMapping[k] === h
                              );
                              const highlightClass = matchedField
                                ? matchedField === "name"
                                  ? "bg-primary/5 text-primary border-b border-primary/30"
                                  : matchedField === "email"
                                  ? "bg-secondary/5 text-secondary border-b border-secondary/30"
                                  : "bg-foreground/5 text-foreground border-b border-foreground/30"
                                : "text-foreground/50";
                              return (
                                <th
                                  key={idx}
                                  className={`px-4 py-3 font-semibold whitespace-nowrap border-r border-foreground/5 last:border-r-0 ${highlightClass}`}
                                >
                                  <div className="flex flex-col gap-1">
                                    <span className="truncate max-w-[120px]">{h}</span>
                                    {matchedField && (
                                      <span
                                        className={`text-[9px] uppercase tracking-wider font-bold inline-block px-1.5 py-0.5 rounded-md w-fit ${
                                          matchedField === "name"
                                            ? "bg-primary/20 text-primary"
                                            : matchedField === "email"
                                            ? "bg-secondary/20 text-secondary"
                                            : "bg-foreground/10 text-foreground"
                                        }`}
                                      >
                                        {FIELD_LABELS[matchedField]}
                                      </span>
                                    )}
                                  </div>
                                </th>
                              );
                            })}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-foreground/5">
                          {csvPreviewRows.map((row, rowIdx) => (
                            <tr key={rowIdx} className="hover:bg-foreground/[0.01] transition-colors">
                              {headers.map((h, colIdx) => {
                                const matchedField = (Object.keys(fieldMapping) as FieldKey[]).find(
                                  (k) => fieldMapping[k] === h
                                );
                                const cellHighlight = matchedField
                                  ? matchedField === "name"
                                    ? "bg-primary/[0.02] text-primary/80 font-medium"
                                    : matchedField === "email"
                                    ? "bg-secondary/[0.02] text-secondary/80 font-medium"
                                    : "bg-foreground/[0.02] text-foreground/80"
                                  : "text-foreground/50";
                                return (
                                  <td
                                    key={colIdx}
                                    className={`px-4 py-2.5 truncate max-w-[120px] border-r border-foreground/5 last:border-r-0 ${cellHighlight}`}
                                  >
                                    {row[colIdx] || ""}
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-foreground/10 p-8 text-center text-foreground/40 text-xs">
                    No preview data loaded
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── Step 3: Results ── */}
        {step === "result" && result && (
          <div className="space-y-8 max-w-3xl mx-auto">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 text-green-500 mb-2 border border-green-500/20">
                <CheckCircle size={36} weight="fill" />
              </div>
              <h2 className="text-3xl font-bold font-[family-name:var(--font-clash-display)]">
                Import Complete
              </h2>
              <p className="text-foreground/50 text-sm max-w-md mx-auto">
                CSV data has been processed and attendee records have been merged into the event database.
              </p>
            </div>

            {/* Results cards */}
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="rounded-2xl bg-green-500/[0.02] border border-green-500/20 p-5 text-center relative overflow-hidden group hover:border-green-500/30 transition-all">
                <div className="absolute top-2 right-2 opacity-10 text-green-500 group-hover:scale-110 transition-transform">
                  <CheckCircle size={28} />
                </div>
                <p className="text-4xl font-extrabold text-green-500 font-[family-name:var(--font-clash-display)]">
                  {result.created}
                </p>
                <p className="text-xs font-semibold text-foreground/50 mt-1 uppercase tracking-wider">
                  Imported
                </p>
              </div>

              <div className="rounded-2xl bg-foreground/[0.01] border border-foreground/10 p-5 text-center relative overflow-hidden group hover:border-foreground/20 transition-all">
                <div className="absolute top-2 right-2 opacity-10 text-foreground/50 group-hover:scale-110 transition-transform">
                  <XCircle size={28} />
                </div>
                <p className="text-4xl font-extrabold text-foreground/70 font-[family-name:var(--font-clash-display)]">
                  {result.skipped}
                </p>
                <p className="text-xs font-semibold text-foreground/50 mt-1 uppercase tracking-wider">
                  Skipped (Dup)
                </p>
              </div>

              <div className="rounded-2xl bg-red-500/[0.02] border border-red-500/20 p-5 text-center relative overflow-hidden group hover:border-red-500/30 transition-all">
                <div className="absolute top-2 right-2 opacity-10 text-red-500 group-hover:scale-110 transition-transform">
                  <Warning size={28} />
                </div>
                <p className="text-4xl font-extrabold text-red-500 font-[family-name:var(--font-clash-display)]">
                  {result.errors.length}
                </p>
                <p className="text-xs font-semibold text-foreground/50 mt-1 uppercase tracking-wider">
                  Errors
                </p>
              </div>
            </div>

            {/* Proportion Bar Chart */}
            <div className="space-y-3 rounded-2xl border border-foreground/10 p-5 bg-foreground/[0.01]">
              <div className="flex items-center justify-between text-xs text-foreground/50">
                <span className="font-semibold">Import Breakdown</span>
                <span>{result.total} total rows processed</span>
              </div>
              <div className="w-full h-3 rounded-full bg-foreground/10 overflow-hidden flex">
                {result.created > 0 && (
                  <div
                    className="h-full bg-green-500 transition-all duration-500"
                    style={{ width: `${result.total > 0 ? (result.created / result.total) * 100 : 0}%` }}
                    title={`${result.created} Imported`}
                  />
                )}
                {result.skipped > 0 && (
                  <div
                    className="h-full bg-foreground/30 transition-all duration-500"
                    style={{ width: `${result.total > 0 ? (result.skipped / result.total) * 100 : 0}%` }}
                    title={`${result.skipped} Skipped`}
                  />
                )}
                {result.errors.length > 0 && (
                  <div
                    className="h-full bg-red-500 transition-all duration-500"
                    style={{ width: `${result.total > 0 ? (result.errors.length / result.total) * 100 : 0}%` }}
                    title={`${result.errors.length} Failed`}
                  />
                )}
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs justify-end">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                  <span className="text-foreground/70">
                    {result.created} Success (
                    {result.total > 0 ? ((result.created / result.total) * 100).toFixed(0) : 0}%)
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-foreground/30" />
                  <span className="text-foreground/70">
                    {result.skipped} Skipped (
                    {result.total > 0 ? ((result.skipped / result.total) * 100).toFixed(0) : 0}%)
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <span className="text-foreground/70">
                    {result.errors.length} Failed (
                    {result.total > 0 ? ((result.errors.length / result.total) * 100).toFixed(0) : 0}%)
                  </span>
                </div>
              </div>
            </div>

            {/* Error log list */}
            {result.errors.length > 0 && (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.01] overflow-hidden shadow-sm">
                <div className="px-5 py-4 border-b border-red-500/10 flex items-center justify-between bg-red-500/[0.03]">
                  <div className="flex items-center gap-2">
                    <Warning size={18} className="text-red-500" />
                    <span className="text-sm font-bold text-foreground">Failed Rows Report</span>
                  </div>
                  <span className="text-xs text-red-500 font-semibold bg-red-500/10 px-2 py-0.5 rounded-md">
                    Action required
                  </span>
                </div>
                <div className="divide-y divide-foreground/5 max-h-72 overflow-y-auto">
                  {result.errors.slice(0, 50).map((e, i) => (
                    <div key={i} className="px-5 py-3 flex items-start gap-4 text-xs transition-colors hover:bg-red-500/[0.01]">
                      <span className="text-foreground/40 font-bold bg-foreground/5 px-2 py-1 rounded-md shrink-0">
                        Row {e.row}
                      </span>
                      <div className="space-y-1">
                        <p className="text-foreground/80 font-medium">{e.reason}</p>
                        <p className="text-foreground/40 text-[10px]">
                          Verify this row has correct format and valid required fields in your CSV spreadsheet before re-importing.
                        </p>
                      </div>
                    </div>
                  ))}
                  {result.errors.length > 50 && (
                    <div className="px-5 py-3 text-xs text-foreground/40 text-center font-medium bg-foreground/[0.01]">
                      …and {result.errors.length - 50} more records
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-center gap-4 pt-4">
              <button
                onClick={() => {
                  setStep("upload");
                  setFile(null);
                  setHeaders([]);
                  setCsvPreviewRows([]);
                  setResult(null);
                  setFieldMapping({ name: "", email: "", phone: "", city: "", location: "" });
                  setSelectedTicketId("");
                }}
                className="px-6 py-3 rounded-full border border-foreground/15 text-sm font-semibold text-foreground/80 hover:text-foreground hover:bg-foreground/5 hover:border-foreground/30 transition-all cursor-pointer"
              >
                Import another file
              </button>
              <Button
                onClick={() => router.push(`/events/${eventId}/manage`)}
                variant="primary"
                size="md"
              >
                Go to Dashboard
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImportAttendeesPage;
