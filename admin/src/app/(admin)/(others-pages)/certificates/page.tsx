"use client";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Download,
  Eye,
  FileSpreadsheet,
  Loader2,
  Mail,
  RefreshCw,
  Upload,
} from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import useAuthStore from "@/store/authStore";
import {
  type CertificateRecipient,
  certificatePdfToBase64,
  certificatePdfToBlob,
  generateCertificatePdf,
  parseCertificateCsv,
} from "@/lib/certificateGenerator";

const PREVIEW_NAME = "John Doe";
const PREVIEW_CATEGORY = "Web Development";

const CertificatesPage = () => {
  const { token } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [previewName, setPreviewName] = useState(PREVIEW_NAME);
  const [previewCategory, setPreviewCategory] = useState(PREVIEW_CATEGORY);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  const [recipients, setRecipients] = useState<CertificateRecipient[]>([]);
  const [emailSubject, setEmailSubject] = useState(
    "Your Certificate of Participation — CodeRush 2026"
  );
  const [emailMessage, setEmailMessage] = useState("");

  const [sending, setSending] = useState(false);
  const [sendProgress, setSendProgress] = useState({ current: 0, total: 0 });
  const [downloading, setDownloading] = useState(false);

  const refreshPreview = useCallback(async () => {
    setPreviewLoading(true);
    try {
      const bytes = await generateCertificatePdf(previewName, previewCategory);
      const blob = certificatePdfToBlob(bytes);
      setPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return URL.createObjectURL(blob);
      });
    } catch (e) {
      console.error(e);
      toast.error("Failed to generate preview");
    } finally {
      setPreviewLoading(false);
    }
  }, [previewName, previewCategory]);

  useEffect(() => {
    const t = setTimeout(() => {
      refreshPreview();
    }, 400);
    return () => clearTimeout(t);
  }, [refreshPreview]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = parseCertificateCsv(reader.result as string);
        setRecipients(parsed);
        toast.success(`Loaded ${parsed.length} recipient(s) from CSV`);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Invalid CSV file";
        toast.error(msg);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleDownloadPreview = async () => {
    try {
      const bytes = await generateCertificatePdf(previewName, previewCategory);
      const blob = certificatePdfToBlob(bytes);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "certificate-preview.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error("Download failed");
    }
  };

  const handleDownloadAll = async () => {
    if (recipients.length === 0) {
      toast.error("Upload a CSV first");
      return;
    }
    setDownloading(true);
    try {
      for (const r of recipients) {
        const bytes = await generateCertificatePdf(r.name, r.category);
        const blob = certificatePdfToBlob(bytes);
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${r.name.replace(/\s+/g, "-")}-certificate.pdf`;
        a.click();
        URL.revokeObjectURL(url);
        await new Promise((resolve) => setTimeout(resolve, 200));
      }
      toast.success(`Downloaded ${recipients.length} certificate(s)`);
    } catch {
      toast.error("Failed to download certificates");
    } finally {
      setDownloading(false);
    }
  };

  const handleSendEmails = async () => {
    if (recipients.length === 0) {
      toast.error("Upload a CSV with recipients first");
      return;
    }
    if (!token) {
      toast.error("You must be signed in");
      return;
    }

    const confirmed = window.confirm(
      `Send certificates to ${recipients.length} recipient(s)? This cannot be undone.`
    );
    if (!confirmed) return;

    setSending(true);
    setSendProgress({ current: 0, total: recipients.length });

    const BATCH_SIZE = 10;
    let totalSent = 0;
    let totalFailed = 0;

    try {
      for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
        const batch = recipients.slice(i, i + BATCH_SIZE);
        const payload = await Promise.all(
          batch.map(async (r) => {
            const bytes = await generateCertificatePdf(r.name, r.category);
            return {
              name: r.name,
              email: r.email,
              category: r.category,
              pdfBase64: certificatePdfToBase64(bytes),
            };
          })
        );

        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/certificates/send`,
          {
            recipients: payload,
            subject: emailSubject,
            message: emailMessage || undefined,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        totalSent += data.sent ?? 0;
        totalFailed += data.failed ?? 0;
        setSendProgress({
          current: Math.min(i + batch.length, recipients.length),
          total: recipients.length,
        });
      }

      if (totalFailed === 0) {
        toast.success(`Successfully sent ${totalSent} certificate email(s)`);
      } else {
        toast.error(`Sent ${totalSent}, failed ${totalFailed}`);
      }
    } catch (err: unknown) {
      const msg =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "Failed to send certificates";
      toast.error(msg);
    } finally {
      setSending(false);
      setSendProgress({ current: 0, total: 0 });
    }
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Certificate Generator" />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ComponentCard
          title="Live preview"
          desc="Adjust sample name and category to see how certificates will look."
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Sample name
              </label>
              <input
                type="text"
                value={previewName}
                onChange={(e) => setPreviewName(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Sample category
              </label>
              <input
                type="text"
                value={previewCategory}
                onChange={(e) => setPreviewCategory(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                placeholder="Web Development"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={refreshPreview}
              disabled={previewLoading}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/5"
            >
              {previewLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              Refresh preview
            </button>
            <button
              type="button"
              onClick={handleDownloadPreview}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/5"
            >
              <Download className="h-4 w-4" />
              Download sample
            </button>
          </div>

          <div className="relative mt-2 overflow-hidden rounded-xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-gray-900">
            {previewLoading && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 dark:bg-gray-900/60">
                <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
              </div>
            )}
            {previewUrl ? (
              <iframe
                title="Certificate preview"
                src={`${previewUrl}#toolbar=0&navpanes=0`}
                className="h-[420px] w-full"
              />
            ) : (
              <div className="flex h-[420px] items-center justify-center text-sm text-gray-500">
                <Eye className="mr-2 h-4 w-4" />
                Preview will appear here
              </div>
            )}
          </div>
        </ComponentCard>

        <ComponentCard
          title="Upload CSV"
          desc='Required columns: name, email, category (header row).'
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={handleCsvUpload}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-gray-300 px-6 py-10 transition hover:border-brand-500 hover:bg-brand-500/5 dark:border-gray-700 dark:hover:border-brand-500"
          >
            <Upload className="h-10 w-10 text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Click to upload CSV
            </span>
            <span className="text-xs text-gray-500">name, email, category</span>
          </button>

          {recipients.length > 0 && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <FileSpreadsheet className="mr-1 inline h-4 w-4" />
              {recipients.length} recipient(s) loaded
            </p>
          )}
        </ComponentCard>
      </div>

      <div className="mt-6">
        <ComponentCard
          title="Email settings"
          desc="Optional custom message (HTML allowed). Leave blank for the default template."
        >
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email subject
              </label>
              <input
                type="text"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Custom message (optional)
              </label>
              <textarea
                rows={4}
                value={emailMessage}
                onChange={(e) => setEmailMessage(e.target.value)}
                placeholder="Leave empty to use the default congratulations message..."
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleSendEmails}
                disabled={sending || recipients.length === 0}
                className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50"
              >
                {sending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Mail className="h-4 w-4" />
                )}
                {sending
                  ? `Sending ${sendProgress.current}/${sendProgress.total}…`
                  : "Email certificates to all"}
              </button>
              <button
                type="button"
                onClick={handleDownloadAll}
                disabled={downloading || recipients.length === 0}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:text-gray-300"
              >
                {downloading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                Download all PDFs
              </button>
            </div>
          </div>
        </ComponentCard>
      </div>

      {recipients.length > 0 && (
        <div className="mt-6">
          <ComponentCard title={`Recipients (${recipients.length})`}>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableCell isHeader>Name</TableCell>
                    <TableCell isHeader>Email</TableCell>
                    <TableCell isHeader>Category</TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recipients.map((r, i) => (
                    <TableRow key={`${r.email}-${i}`}>
                      <TableCell>{r.name}</TableCell>
                      <TableCell>{r.email}</TableCell>
                      <TableCell>{r.category}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </ComponentCard>
        </div>
      )}
    </div>
  );
};

export default CertificatesPage;
