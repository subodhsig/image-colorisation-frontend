import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import beforeImg from "../assets/test_3.jpg";
import afterImg from "../assets/test_3_colorized_612x291.png";
import { useAuth } from "../context/AuthContext.jsx";

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [hoverUpload, setHoverUpload] = useState(false);

  const gallery = [afterImg, afterImg, afterImg, afterImg, afterImg, afterImg];

  const handleTryNow = () => {
    if (user) {
      navigate("/colorize");
    } else {
      // remember where they intended to go
      navigate("/login", { state: { from: "/colorize" } });
    }
  };

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      {/* Hero */}
      <section className="grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-4xl sm:text-5xl font-semibold leading-tight">
            Colorize black-and-white photos with AI
          </h1>
          <p className="mt-4 text-gray-600 text-lg">
            Restore natural tones using our UNet-CGAN model. Fast, accurate, and easy to use.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={handleTryNow}
              className="px-4 py-2 rounded-md bg-black text-white"
            >
              Try it now
            </button>
            <Link to="/signup" className="px-4 py-2 rounded-md border">
              Create free account
            </Link>
          </div>
          <p className="mt-3 text-xs text-gray-500">
            No credit card required • Free tier available
          </p>
        </div>

        {/* Before / After preview card */}
        <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
          <div className="grid grid-cols-2">
            <div className="p-3 border-r">
              <div className="text-sm font-medium mb-2">Before</div>
              <div className="aspect-[4/3] rounded-lg bg-gray-200 overflow-hidden">
                <img
                  alt="Before"
                  src={beforeImg}
                  className="h-full w-full object-cover grayscale"
                />
              </div>
            </div>
            <div className="p-3">
              <div className="text-sm font-medium mb-2">After</div>
              <div className="aspect-[4/3] rounded-lg bg-gray-200 overflow-hidden">
                <img
                  alt="After"
                  src={afterImg}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between px-4 py-3 border-t bg-gray-50">
            <span className="text-sm text-gray-600">UNet-CGAN • 256×256 • ~2s</span>
            <button
              onMouseEnter={() => setHoverUpload(true)}
              onMouseLeave={() => setHoverUpload(false)}
              onClick={handleTryNow}
              className={`px-3 py-1.5 rounded-md text-sm ${
                hoverUpload ? "bg-black text-white" : "border"
              }`}
            >
              Upload your photo
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12">
        <h2 className="text-2xl font-semibold">Why choose our colorizer?</h2>
        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: "Photorealistic colors", desc: "Trained on diverse datasets to keep skin tones and skies natural." },
            { title: "Fast & private", desc: "Your images never leave your server unless you export them." },
            { title: "Free tier", desc: "Start colorizing right away – upgrade only if you need more." },
          ].map((f) => (
            <div key={f.title} className="rounded-xl border bg-white p-4 shadow-sm">
              <div className="text-base font-medium">{f.title}</div>
              <p className="mt-1 text-sm text-gray-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-12">
        <h2 className="text-2xl font-semibold">How it works</h2>
        <ol className="mt-6 grid gap-5 sm:grid-cols-3">
          {[
            { step: 1, title: "Upload", desc: "Choose a black-and-white photo (JPG/PNG)." },
            { step: 2, title: "Colorize", desc: "Our model predicts realistic colors." },
            { step: 3, title: "Download", desc: "Preview, compare, and save the result." },
          ].map((s) => (
            <li key={s.step} className="rounded-xl border bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-black text-white text-sm">
                  {s.step}
                </span>
                <span className="font-medium">{s.title}</span>
              </div>
              <p className="mt-2 text-sm text-gray-600">{s.desc}</p>
            </li>
          ))}
        </ol>
        <div className="mt-6">
          <button onClick={handleTryNow} className="px-4 py-2 rounded-md bg-black text-white">
            Start colorizing
          </button>
        </div>
      </section>

      {/* Minimal gallery */}
      <section className="py-12">
        <h2 className="text-2xl font-semibold">Sample results</h2>
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {gallery.map((src, i) => (
            <div key={i} className="aspect-square rounded-lg overflow-hidden bg-gray-200">
              <img src={src} alt={`sample ${i + 1}`} className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
