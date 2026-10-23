"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Upload, FileText, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";

export default function AdminCatalogToolbar() {
  const router = useRouter();
  const [seeding, setSeeding] = useState(false);
  const [importing, setImporting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [jsonText, setJsonText] = useState("");

  const handleSeedCatalog = async () => {
    if (!confirm("Populate 16 realistic luxury Indian ethnic & western products with high-res photography and real INR pricing?")) {
      return;
    }

    setSeeding(true);
    setStatusMsg(null);
    try {
      const res = await fetch("/api/admin/seed", { method: "POST" });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatusMsg({
          type: "success",
          text: data.message || "Catalog successfully seeded with 16 luxury styles!",
        });
        router.refresh();
      } else {
        setStatusMsg({
          type: "error",
          text: data.error || "Failed to seed catalog",
        });
      }
    } catch (e: any) {
      setStatusMsg({ type: "error", text: "Connection error while seeding catalog" });
    } finally {
      setSeeding(false);
    }
  };

  const handleBulkJsonUpload = async () => {
    if (!jsonText.trim()) return;
    setImporting(true);
    setStatusMsg(null);

    try {
      let payload;
      try {
        payload = JSON.parse(jsonText);
      } catch (e) {
        setStatusMsg({ type: "error", text: "Invalid JSON format. Please ensure valid syntax." });
        setImporting(false);
        return;
      }

      const res = await fetch("/api/admin/bulk-import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setStatusMsg({
          type: "success",
          text: `Successfully imported ${data.importedCount} items!`,
        });
        setModalOpen(false);
        setJsonText("");
        router.refresh();
      } else {
        setStatusMsg({ type: "error", text: data.error || "Failed to import items" });
      }
    } catch (e: any) {
      setStatusMsg({ type: "error", text: "Error sending payload to server" });
    } finally {
      setImporting(false);
    }
  };

  const handleCsvFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setStatusMsg(null);

    try {
      const text = await file.text();
      const res = await fetch("/api/admin/bulk-import", {
        method: "POST",
        headers: { "Content-Type": "text/csv" },
        body: text,
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setStatusMsg({
          type: "success",
          text: `CSV import completed: ${data.importedCount} garments loaded!`,
        });
        setModalOpen(false);
        router.refresh();
      } else {
        setStatusMsg({ type: "error", text: data.error || "Failed to parse CSV" });
      }
    } catch (e: any) {
      setStatusMsg({ type: "error", text: "Error uploading CSV file" });
    } finally {
      setImporting(false);
      e.target.value = "";
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Seed catalog button */}
        <button
          type="button"
          onClick={handleSeedCatalog}
          disabled={seeding}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-mono font-bold tracking-wider uppercase rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30 transition-all shadow-sm disabled:opacity-50"
        >
          <Sparkles className={`w-3.5 h-3.5 ${seeding ? "animate-spin text-amber-600" : "text-amber-500"}`} />
          <span>{seeding ? "Seeding Catalog..." : "Seed 16 Luxury Styles"}</span>
        </button>

        {/* Bulk import button */}
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-mono font-semibold tracking-wider uppercase rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 transition-colors shadow-sm"
        >
          <Upload className="w-3.5 h-3.5 text-slate-600" />
          <span>Bulk JSON / CSV Import</span>
        </button>
      </div>

      {/* Notification Toast */}
      {statusMsg && (
        <div
          className={`p-3 rounded-lg text-xs font-mono flex items-center justify-between gap-2 border animate-in fade-in duration-200 ${
            statusMsg.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-rose-50 border-rose-200 text-rose-800"
          }`}
        >
          <div className="flex items-center gap-2">
            {statusMsg.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{statusMsg.text}</span>
          </div>
          <button
            onClick={() => setStatusMsg(null)}
            className="text-[11px] font-bold opacity-60 hover:opacity-100"
          >
            ✕
          </button>
        </div>
      )}

      {/* Bulk Import Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-xl p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Upload className="w-4 h-4 text-slate-600" />
                Bulk Catalog Importer (JSON / CSV)
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Import multiple garments simultaneously. You can either paste a JSON array of clothing items or upload a simple CSV file with columns: <code>title, baseprice, sku, size, colorname, imageurl</code>.
            </p>

            {/* CSV File Upload Option */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 border-dashed text-center">
              <label className="cursor-pointer flex flex-col items-center justify-center gap-1.5">
                <FileText className="w-6 h-6 text-slate-500" />
                <span className="text-xs font-semibold text-slate-800">
                  Click to select CSV File
                </span>
                <span className="text-[11px] text-slate-500">.csv format supported</span>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleCsvFileChange}
                  className="hidden"
                />
              </label>
            </div>

            <div className="relative text-center text-xs font-mono text-slate-400">
              <span className="bg-white px-2 relative z-10 uppercase">or paste JSON data</span>
              <div className="absolute inset-0 top-1/2 border-t border-slate-200" />
            </div>

            {/* JSON Textarea Option */}
            <div>
              <textarea
                value={jsonText}
                onChange={(e) => setJsonText(e.target.value)}
                rows={6}
                placeholder={`[\n  {\n    "title": "Chanderi Silk Kurti",\n    "basePrice": 2499,\n    "size": "M",\n    "colorName": "Sky Blue",\n    "stockCount": 10\n  }\n]`}
                className="w-full p-3 font-mono text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-slate-800 text-slate-900"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBulkJsonUpload}
                disabled={importing || !jsonText.trim()}
                className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg flex items-center gap-1.5 disabled:opacity-50"
              >
                {importing && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                <span>Import JSON Items</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
