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
  type CertificateVariant,
  certificatePdfToBase64,
  certificatePdfToBlob,
  generateCertificatePdf,
  parseCertificateCsv,
} from "@/lib/certificateGenerator";

const PREVIEW_NAME = "John Doe";
const PREVIEW_CATEGORY = "Web Development";
const PREVIEW_POSITION = "1st";

const defaultSubjectFor = (v: CertificateVariant) =>
  v === "top_team"
    ? "Your Certificate of Appreciation — CodeRush 2026"
    : "Your Certificate of Participation — CodeRush 2026";

const CertificatesPage = () => {
  const { token } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [variant, setVariant] = useState<CertificateVariant>("participation");

  const [previewName, setPreviewName] = useState(PREVIEW_NAME);
  const [previewCategory, setPreviewCategory] = useState(PREVIEW_CATEGORY);
  const [previewPosition, setPreviewPosition] = useState(PREVIEW_POSITION);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  const [recipients, setRecipients] = useState<CertificateRecipient[]>([]);
  const [emailSubject, setEmailSubject] = useState(defaultSubjectFor("participation"));
  const [emailMessage, setEmailMessage] = useState("");

  const [sending, setSending] = useState(false);
  const [sendProgress, setSendProgress] = useState({ current: 0, total: 0 });
  const [downloading, setDownloading] = useState(false);

  const refreshPreview = useCallback(async () => {
    setPreviewLoading(true);
    try {
      const bytes = await generateCertificatePdf(
        previewName,
        previewCategory,
        {
          variant,
          position: variant === "top_team" ? previewPosition : undefined,
        }
      );
      const blob = certificatePdfToBlob(bytes);
      setPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return URL.createObjectURL(blob);
      });
    } catch (e) {
      console.error(e);
      toast.error(
        e instanceof Error ? e.message : "Failed to generate preview"
      );
    } finally {
      setPreviewLoading(false);
    }
  }, [previewName, previewCategory, previewPosition, variant]);

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

  const handleVariantChange = (next: CertificateVariant) => {
    setVariant(next);
    setRecipients([]);
    setEmailSubject(defaultSubjectFor(next));
    if (next === "top_team") {
      setPreviewName(PREVIEW_NAME);
      setPreviewCategory(PREVIEW_CATEGORY);
      setPreviewPosition(PREVIEW_POSITION);
    }
  };

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = parseCertificateCsv(reader.result as string, variant);
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
      const bytes = await generateCertificatePdf(
        previewName,
        previewCategory,
        {
          variant,
          position: variant === "top_team" ? previewPosition : undefined,
        }
      );
      const blob = certificatePdfToBlob(bytes);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download =
        variant === "top_team"
          ? "certificate-appreciation-preview.pdf"
          : "certificate-participation-preview.pdf";
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
        const bytes = await generateCertificatePdf(r.name, r.category, {
          variant,
          position: r.position,
        });
        const blob = certificatePdfToBlob(bytes);
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        const tag = variant === "top_team" ? "appreciation" : "participation";
        a.download = `${r.name.replace(/\s+/g, "-")}-${tag}-certificate.pdf`;
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
      `Send ${variant === "top_team" ? "appreciation" : "participation"} certificates to ${recipients.length} recipient(s)?`
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
            const bytes = await generateCertificatePdf(r.name, r.category, {
              variant,
              position: r.position,
            });
            return {
              name: r.name,
              email: r.email,
              category: r.category,
              ...(variant === "top_team" && r.position
                ? { position: r.position }
                : {}),
              pdfBase64: certificatePdfToBase64(bytes),
            };
          })
        );

        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/certificates/send`,
          {
            recipients: payload,
            certificateVariant: variant,
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

  const csvHint =
    variant === "top_team"
      ? "Required columns: name, email, category, position"
      : "Required columns: name, email, category";

  return (
    <div>
      <PageBreadcrumb pageTitle="Certificate Generator" />

      <div className="mb-6 flex flex-wrap gap-3 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03]">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Certificate type
        </span>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => handleVariantChange("participation")}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              variant === "participation"
                ? "bg-brand-500 text-white"
                : "border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-white/5"
            }`}
          >
            Participation
          </button>
          <button
            type="button"
            onClick={() => handleVariantChange("top_team")}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              variant === "top_team"
                ? "bg-brand-500 text-white"
                : "border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-white/5"
            }`}
          >
            Top teams (appreciation)
          </button>
        </div>
        <p className="w-full text-xs text-gray-500 dark:text-gray-400">
          {variant === "top_team"
            ? "Uses Template-2.pdf — includes rank/placing (position) and competition (category)."
            : "Uses Template.pdf — participation certificates."}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ComponentCard
          title="Live preview"
          desc={
            variant === "top_team"
              ? "Sample team name, position, and category."
              : "Sample name and category."
          }
        >
          <div
            className={`grid grid-cols-1 gap-4 ${
              variant === "top_team" ? "sm:grid-cols-3" : "sm:grid-cols-2"
            }`}
          >
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                {variant === "top_team" ? "Sample team / name" : "Sample name"}
              </label>
              <input
                type="text"
                value={previewName}
                onChange={(e) => setPreviewName(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                placeholder="John Doe"
              />
            </div>
            {variant === "top_team" && (
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Position
                </label>
                <input
                  type="text"
                  value={previewPosition}
                  onChange={(e) => setPreviewPosition(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  placeholder="1st Place"
                />
              </div>
            )}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Category
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

        <ComponentCard title="Upload CSV" desc={csvHint}>
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
            <span className="text-center text-xs text-gray-500">{csvHint}</span>
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
                    {variant === "top_team" && (
                      <TableCell isHeader>Position</TableCell>
                    )}
                    <TableCell isHeader>Category</TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recipients.map((r, i) => (
                    <TableRow key={`${r.email}-${i}`}>
                      <TableCell>{r.name}</TableCell>
                      <TableCell>{r.email}</TableCell>
                      {variant === "top_team" && (
                        <TableCell>{r.position ?? "—"}</TableCell>
                      )}
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
