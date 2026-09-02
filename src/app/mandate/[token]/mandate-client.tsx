"use client";

import { useState } from "react";
import { CheckCircle2, ShieldCheck } from "lucide-react";

interface MandateAcceptClientProps {
  token: string;
  artistName: string;
  initialStatus: string;
}

export function MandateAcceptClient({ token, artistName, initialStatus }: MandateAcceptClientProps) {
  const [status, setStatus] = useState(initialStatus);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAccept = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      alert("Veuillez renseigner votre email pour signer le mandat.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/mandate/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mandateToken: token, artistEmail: email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur lors de la signature du mandat");

      setStatus("ACTIVE");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      alert(`Erreur : ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  if (status === "ACTIVE") {
    return (
      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 text-center space-y-3">
        <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
        <h3 className="text-lg font-bold text-white">Mandat de Gestion Actif</h3>
        <p className="text-xs text-emerald-300 max-w-sm mx-auto">
          Merci ! Le mandat de publication au nom de <strong>{artistName}</strong> a été validé et enregistré dans le registre d'audit.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleAccept} className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
          Email du signataire (Artiste ou Représentant) :
        </label>
        <input
          type="email"
          required
          placeholder="ex: contact@monprojet.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-semibold text-sm transition-all shadow-lg shadow-rose-950/50 disabled:opacity-50"
      >
        {loading ? (
          <>
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Validation du mandat...
          </>
        ) : (
          <>
            <ShieldCheck className="w-4 h-4" />
            Signer & Accorder le Mandat à l'Agence
          </>
        )}
      </button>
    </form>
  );
}
