import { useEffect, useRef, useState } from "react";
import api from "../lib/api"; // axios instance with Authorization header

export default function Profile() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const objUrlsRef = useRef([]);

  const makeObjUrl = (blob) => {
    const u = URL.createObjectURL(blob);
    objUrlsRef.current.push(u);
    return u;
    };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setErr("");
        const { data } = await api.get("/images?limit=60");

        // OPTIONAL: prefetch as blobs for safer download naming
        const withThumbs = await Promise.all(
          data.map(async (rec) => {
            const r = { ...rec, thumbs: {} };
            try {
              const o = await fetch(rec.original_url);
              const ob = await o.blob();
              r.thumbs.original = makeObjUrl(ob);
            } catch {
              // pass
            }
            try {
              if (rec.colorized_url) {
                const c = await fetch(rec.colorized_url);
                const cb = await c.blob();
                r.thumbs.colorized = makeObjUrl(cb);
              }
            } catch {
              // pass
            }
            return r;
          })
        );

        if (mounted) setItems(withThumbs);
      } catch (e) {
        if (mounted) setErr(e?.response?.data?.detail || e.message || "Failed to load collection.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
      objUrlsRef.current.forEach((u) => URL.revokeObjectURL(u));
      objUrlsRef.current = [];
    };
  }, []);

  const download = async (rec, which = "colorized") => {
    try {
      const url = which === "original" ? rec.original_url : (rec.colorized_url || rec.original_url);
      const resp = await fetch(url);
      const blob = await resp.blob();
      const link = document.createElement("a");
      const obj = makeObjUrl(blob);
      link.href = obj;
      link.download = `${rec.id}_${which}.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      alert("Download failed.");
    }
  };

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold text-center">Profile (protected)</h1>

      <section className="mt-10">
        <div className="flex items-baseline justify-between">
          <h2 className="text-xl font-semibold">Collection</h2>
          {loading && <span className="text-sm text-gray-500">Loading…</span>}
        </div>

        {err && (
          <div className="mt-4 rounded-md bg-red-50 border border-red-200 p-3 text-red-700 text-sm">
            {err}
          </div>
        )}

        {!loading && items.length === 0 && (
          <p className="mt-6 text-gray-600">No images yet. Colorize something to see it here.</p>
        )}

        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((rec) => (
            <article key={rec.id} className="border rounded-xl bg-white p-3">
              <div className="text-xs text-gray-500 mb-2">
                {new Date(rec.created_at).toLocaleString()}
              </div>

              <div className="grid grid-cols-2 gap-2 aspect-square">
                <div className="rounded-lg overflow-hidden bg-gray-100">
                  {rec.thumbs?.original ? (
                    <img src={rec.thumbs.original} alt="original" className="w-full h-full object-cover" />
                  ) : (
                    <img src={rec.original_url} alt="original" className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="rounded-lg overflow-hidden bg-gray-100">
                  {rec.thumbs?.colorized ? (
                    <img src={rec.thumbs.colorized} alt="colorized" className="w-full h-full object-cover" />
                  ) : rec.colorized_url ? (
                    <img src={rec.colorized_url} alt="colorized" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full grid place-items-center text-gray-400 text-xs">No result</div>
                  )}
                </div>
              </div>

              <div className="mt-3 flex gap-2">
                <button
                  className="px-3 py-2 rounded-md bg-black text-white text-sm disabled:opacity-50"
                  onClick={() => download(rec, "colorized")}
                  disabled={!rec.colorized_url}
                >
                  Download Colorized
                </button>
                <button
                  className="px-3 py-2 rounded-md border text-sm"
                  onClick={() => download(rec, "original")}
                >
                  Original
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
