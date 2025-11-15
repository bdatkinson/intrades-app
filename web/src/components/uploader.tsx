"use client";

import React from "react";

type Props = {
  accept?: string;
  challengeId: number | string;
  uploadMode?: "presigned" | "proxy"; // currently presigned via backend endpoint
  onUploaded?: (info: { key: string; url: string }) => void;
};

type PresignedPost = { url: string; fields: Record<string, string> };

export default function Uploader({ accept, challengeId, onUploaded }: Props) {
  const [file, setFile] = React.useState<File | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleUpload() {
    if (!file) return;
    setBusy(true);
    setError(null);

    try {
      const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      const presignUrl = `${base}/uploads/challenges/${challengeId}/presigned`;

      const presignRes = await fetch(presignUrl, {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ contentType: file.type, fileName: file.name }),
      });

      if (!presignRes.ok) throw new Error("Failed to get presigned data");
      const presignJson = (await presignRes.json()) as { data?: PresignedPost } | PresignedPost;
      const { url, fields } = ("data" in presignJson && presignJson.data)
        ? presignJson.data
        : (presignJson as PresignedPost);

      // Build S3 form data
      const form = new FormData();
      Object.entries(fields || {}).forEach(([k, v]) => form.append(k, String(v)));
      form.append("file", file);

      const uploadRes = await fetch(url, { method: "POST", body: form });
      if (!uploadRes.ok) throw new Error("Upload failed");

      const key = (fields && (fields as Record<string, string>).key) || `${challengeId}/${file.name}`;

      const cfDomain = process.env.NEXT_PUBLIC_CLOUDFRONT_DOMAIN;
      const bucket = process.env.NEXT_PUBLIC_S3_BUCKET;
      const viewUrl = cfDomain
        ? `https://${cfDomain}/${key}`
        : bucket
        ? `https://${bucket}.s3.amazonaws.com/${key}`
        : "#";

      onUploaded?.({ key, url: viewUrl });
      setFile(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-lg border border-[var(--brand-border)] p-4">
      <div className="flex items-center gap-3">
        <input
          type="file"
          accept={accept}
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          aria-label="Choose file"
        />
        <button
          type="button"
          disabled={!file || busy}
          onClick={handleUpload}
          className="rounded-md px-3 py-2 text-sm font-medium text-black brand-gradient disabled:opacity-50"
        >
          {busy ? "Uploading..." : "Upload"}
        </button>
      </div>
      {error && <div className="mt-2 text-sm text-red-600">{error}</div>}
    </div>
  );
}
