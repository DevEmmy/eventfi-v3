import axiosInstance from "@/lib/axios";

export interface ImportPreviewResponse {
  headers: string[];
}

export interface ImportError {
  row: number;
  reason: string;
}

export interface ImportResult {
  total: number;
  created: number;
  skipped: number;
  errors: ImportError[];
  headers: string[];
}

export interface ImportOptions {
  ticketId: string;
  nameColumn: string;
  emailColumn: string;
  phoneColumn?: string;
  cityColumn?: string;
  locationColumn?: string;
  skipDuplicates?: boolean;
}

export const ImportService = {
  /**
   * Upload a CSV and get its column headers back for the field-mapping step.
   */
  previewCSV: async (eventId: string, file: File): Promise<ImportPreviewResponse> => {
    const form = new FormData();
    form.append("file", file);
    const res = await axiosInstance.post<{ status: string; data: ImportPreviewResponse }>(
      `/events/${eventId}/import/preview`,
      form,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return res.data.data;
  },

  /**
   * Run the full import with the chosen field mapping.
   */
  importGoogleForms: async (
    eventId: string,
    file: File,
    options: ImportOptions
  ): Promise<ImportResult> => {
    const form = new FormData();
    form.append("file", file);
    form.append("ticketId", options.ticketId);
    form.append("nameColumn", options.nameColumn);
    form.append("emailColumn", options.emailColumn);
    if (options.phoneColumn) form.append("phoneColumn", options.phoneColumn);
    if (options.cityColumn) form.append("cityColumn", options.cityColumn);
    if (options.locationColumn) form.append("locationColumn", options.locationColumn);
    form.append("skipDuplicates", String(options.skipDuplicates ?? true));

    const res = await axiosInstance.post<{ status: string; data: ImportResult; message: string }>(
      `/events/${eventId}/import/google-forms`,
      form,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return res.data.data;
  },
};
