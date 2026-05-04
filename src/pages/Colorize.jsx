import { useCallback, useEffect, useRef, useState } from "react";
import api from "../lib/api";

export default function Colorize() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploadPct, setUploadPct] = useState(0);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [resultUrl, setResultUrl] = useState(null);

  // track original image dimensions
  const [origWH, setOrigWH] = useState({ w: 0, h: 0 });

  // object URLs to revoke later
  const objectUrlsRef = useRef([]);
  const pushObjUrl = (url) => {
    objectUrlsRef.current.push(url);
    return url;
  };

  // abort controller for inflight requests
  const abortRef = useRef(null);

  // ensure no leaks on unmount
  useEffect(() => {
    return () => {
      if (abortRef.current) abortRef.current.abort();
      objectUrlsRef.current.forEach((u) => URL.revokeObjectURL(u));
      objectUrlsRef.current = [];
    };
  }, []);

  const onSelect = useCallback((f) => {
    if (!f) return;
    setErr("");
    setResultUrl(null);
    setFile(f);

    // make preview
    const url = pushObjUrl(URL.createObjectURL(f));
    setPreview(url);

    // read original dimensions
    const img = new Image();
    img.onload = () => setOrigWH({ w: img.naturalWidth, h: img.naturalHeight });
    img.src = url;
  }, []);

  const onFileChange = (e) => onSelect(e.target.files?.[0]);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    onSelect(e.dataTransfer?.files?.[0]);
  }, [onSelect]);

  const onDragOver = (e) => e.preventDefault();

  const reset = () => {
    if (abortRef.current) abortRef.current.abort();
    setFile(null);
    setPreview(null);
    setResultUrl(null);
    setUploadPct(0);
    setErr("");
    objectUrlsRef.current.forEach((u) => URL.revokeObjectURL(u));
    objectUrlsRef.current = [];
    setOrigWH({ w: 0, h: 0 });
  };

  const submit = async () => {
    if (!file) return setErr("Please choose an image first.");
    setErr("");
    setLoading(true);
    setUploadPct(0);

    // cancel any prior request
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    try {
      const form = new FormData();
      form.append("file", file);

      // Primary attempt: JSON response
      const res = await api.post("/images/colorize", form, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (evt) => {
          if (!evt.total) return;
          const pct = Math.round((evt.loaded / evt.total) * 100);
          setUploadPct(pct);
        },
        signal: abortRef.current.signal,
      });

      const url = res?.data?.output_url || res?.data?.url || res?.data?.result_url;
      if (url) {
        setResultUrl(url);
      } else {
        // Fallback: ask as blob if server returned bytes
        const blobRes = await api.post("/images/colorize", form, {
          headers: { "Content-Type": "multipart/form-data" },
          responseType: "blob",
          signal: abortRef.current.signal,
        });
        const blobUrl = pushObjUrl(URL.createObjectURL(new Blob([blobRes.data])));
        setResultUrl(blobUrl);
      }
    } catch (e) {
      if (e.name === "CanceledError" || e.name === "AbortError") {
        // user navigated away or re-submitted; ignore
      } else {
        const msg =
          e?.response?.data?.detail ||
          e?.message ||
          "Upload failed. Please try again.";
        setErr(msg);
      }
    } finally {
      setLoading(false);
      setUploadPct(0);
    }
  };

  // helper for safe file download
  const safeDownloadBlob = (blob, filename) => {
    const dlUrl = pushObjUrl(URL.createObjectURL(blob));
    const a = document.createElement("a");
    a.href = dlUrl;
    a.download = filename;
    a.style.display = "none";
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      a.remove();
      URL.revokeObjectURL(dlUrl);
    }, 0);
  };

  // download colorized image resized to original dimensions
  const downloadSameSize = async () => {
    if (!resultUrl || !origWH.w || !origWH.h) return;

    // Prefer blob fetch -> draw to canvas (avoids CORS taint)
    let blob;
    try {
      const resp = await fetch(resultUrl, { mode: "cors", referrerPolicy: "no-referrer" });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      blob = await resp.blob();
    } catch {
      // If we can't read as blob (signed URLs or strict CORS), fallback to direct download without resizing
      const a = document.createElement("a");
      a.href = resultUrl;
      a.download = "colorized.png";
      a.style.display = "none";
      a.rel = "noopener";
      document.body.appendChild(a);
      a.click();
      a.remove();
      return;
    }

    const imgUrl = pushObjUrl(URL.createObjectURL(blob));
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = origWH.w;
      canvas.height = origWH.h;

      const ctx = canvas.getContext("2d");
      // Optional white background to avoid transparent edges
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Stretch to exactly original WxH
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((outBlob) => {
        if (!outBlob) return;
        const base = file?.name?.replace(/\.(jpg|jpeg|png|webp)$/i, "") || "colorized";
        safeDownloadBlob(outBlob, `${base}_colorized_${origWH.w}x${origWH.h}.png`);
      }, "image/png");
    };
    img.onerror = () => {
      // last resort: raw download
      const a = document.createElement("a");
      a.href = resultUrl;
      a.download = "colorized.png";
      a.style.display = "none";
      a.rel = "noopener";
      document.body.appendChild(a);
      a.click();
      a.remove();
    };
    img.src = imgUrl;
  };

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <section>
        <h1 className="text-3xl font-semibold">Colorize an image</h1>
        <p className="text-gray-600 mt-2">
          Upload a black-and-white JPG/PNG. We’ll bring it to life.
        </p>

        {/* Uploader */}
        {!preview && (
          <div
            onDrop={onDrop}
            onDragOver={onDragOver}
            className="mt-6 rounded-2xl border-2 border-dashed p-8 bg-white text-center"
          >
            <p className="text-gray-700 font-medium">Drag & drop your image here</p>
            <p className="text-gray-500 text-sm">or</p>
            <label className="inline-block mt-3 px-4 py-2 rounded-md bg-black text-white cursor-pointer">
              Choose file
              <input type="file" accept="image/*" className="hidden" onChange={onFileChange} />
            </label>
            <p className="text-xs text-gray-500 mt-2">Max ~10MB • JPG/PNG</p>
            {err && (
              <div className="mt-4 rounded-md bg-red-50 border border-red-200 p-2 text-sm text-red-700">
                {err}
              </div>
            )}
          </div>
        )}

        {/* Selected preview & actions */}
        {preview && (
          <div className="mt-6 grid lg:grid-cols-2 gap-6 items-start">
            {/* LEFT: Input */}
            <div className="rounded-xl border bg-white p-3">
              <div className="text-sm font-medium mb-2">
                Input {origWH.w && origWH.h ? `(${origWH.w}×${origWH.h})` : ""}
              </div>
              <div className="aspect-[4/3] rounded-lg overflow-hidden bg-gray-100">
                <img src={preview} alt="preview" className="h-full w-full object-contain" />
              </div>
              <div className="mt-3 flex items-center gap-2">
                <button
                  onClick={submit}
                  disabled={loading}
                  className="px-4 py-2 rounded-md bg-black text-white disabled:opacity-60"
                >
                  {loading ? (uploadPct ? `Uploading ${uploadPct}%…` : "Colorizing…") : "Colorize"}
                </button>
                <button onClick={reset} className="px-4 py-2 rounded-md border">
                  Remove
                </button>
              </div>
              {loading && (
                <div className="mt-3">
                  <div className="h-2 w-full bg-gray-200 rounded">
                    <div
                      className="h-2 bg-black rounded"
                      style={{ width: `${uploadPct}%`, transition: "width 120ms linear" }}
                    />
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    {uploadPct ? `${uploadPct}%` : "Processing…"}
                  </div>
                </div>
              )}
              {err && (
                <div className="mt-3 rounded-md bg-red-50 border border-red-200 p-2 text-sm text-red-700">
                  {err}
                </div>
              )}
            </div>

            {/* RIGHT: Result only */}
            <div className="rounded-xl border bg-white p-3">
              <div className="text-sm font-medium mb-2">Result</div>
              <div className="aspect-[4/3] rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                {resultUrl ? (
                  <img src={resultUrl} alt="result" className="h-full w-full object-contain" />
                ) : (
                  <span className="text-gray-400 text-sm">No result yet</span>
                )}
              </div>

              {resultUrl && (
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={downloadSameSize}
                    className="px-4 py-2 rounded-md bg-black text-white"
                  >
                    Download ({origWH.w}×{origWH.h})
                  </button>
                  <button onClick={() => setResultUrl(null)} className="px-4 py-2 rounded-md border">
                    Clear
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
