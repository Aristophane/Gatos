"use client";

import { useState } from "react";
import {
  Users,
  Instagram,
  Facebook,
  ExternalLink,
  Play,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  Radio,
  Building2,
  Mic2,
  Layers,
  Send,
  AlertCircle
} from "lucide-react";

interface Target {
  id: string;
  destinationType: string;
  status: string;
  channelConnection: {
    provider: string;
    externalAccountName: string;
  };
  remotePost?: {
    permalinkUrl: string;
    remotePostId: string;
  } | null;
}

interface Occurrence {
  id: string;
  scheduledAt: string;
  status: string;
  variant: {
    network: string;
    format: string;
    caption: string;
    hasBioWatermark: boolean;
    audioCatalogTitle?: string | null;
  };
  targets: Target[];
}

interface Profile {
  id: string;
  name: string;
  slug: string;
  type: string;
  delegationMode: string;
  avatarUrl: string | null;
  bio: string | null;
  brandColor: string | null;
  channelConnections: {
    id: string;
    provider: string;
    externalAccountName: string;
    isConnected: boolean;
  }[];
  campaigns: {
    id: string;
    title: string;
    scenario: string;
    status: string;
    plans: {
      occurrences: Occurrence[];
    }[];
  }[];
}

interface DashboardViewProps {
  agencyName: string;
  profiles: Profile[];
}

export function DashboardView({ agencyName, profiles }: DashboardViewProps) {
  const [selectedProfileSlug, setSelectedProfileSlug] = useState<string>(profiles[0]?.slug || "");
  const [occurrencesState, setOccurrencesState] = useState<Record<string, { status: string; loading: boolean; url?: string }>>({});

  const activeProfile = profiles.find((p) => p.slug === selectedProfileSlug) || profiles[0];

  const handlePublish = async (occurrenceId: string) => {
    setOccurrencesState((prev) => ({
      ...prev,
      [occurrenceId]: { ...prev[occurrenceId], loading: true, status: "PUBLISHING" },
    }));

    try {
      const res = await fetch("/api/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "EXECUTE", occurrenceId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur de publication");

      const successUrl = data.results?.[0]?.url;
      setOccurrencesState((prev) => ({
        ...prev,
        [occurrenceId]: {
          loading: false,
          status: data.status || "PUBLISHED",
          url: successUrl,
        },
      }));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      alert(`Erreur : ${msg}`);
      setOccurrencesState((prev) => ({
        ...prev,
        [occurrenceId]: { ...prev[occurrenceId], loading: false, status: "FAILED" },
      }));
    }
  };

  const handleCancel = async (occurrenceId: string) => {
    if (!confirm("Voulez-vous vraiment annuler cette publication ?")) return;

    setOccurrencesState((prev) => ({
      ...prev,
      [occurrenceId]: { ...prev[occurrenceId], loading: true },
    }));

    try {
      const res = await fetch("/api/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "CANCEL", occurrenceId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur d'annulation");

      setOccurrencesState((prev) => ({
        ...prev,
        [occurrenceId]: { loading: false, status: "CANCELLED" },
      }));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      alert(`Erreur : ${msg}`);
      setOccurrencesState((prev) => ({
        ...prev,
        [occurrenceId]: { ...prev[occurrenceId], loading: false },
      }));
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Top Navigation */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 to-rose-400 flex items-center justify-center font-bold text-white shadow-lg shadow-rose-900/30">
            T
          </div>
          <div>
            <div className="text-xs font-semibold text-rose-400 tracking-wider uppercase">Thermidor Studio</div>
            <div className="text-base font-bold text-white">{agencyName}</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded-full flex items-center gap-2 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Connecteur Meta : Actif (Simulé)
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Sidebar : 5 Profiles List */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold tracking-wider uppercase text-slate-400 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Profils Gérés ({profiles.length})
            </h2>
          </div>

          <div className="space-y-2">
            {profiles.map((profile) => {
              const isSelected = profile.slug === selectedProfileSlug;
              return (
                <button
                  key={profile.id}
                  onClick={() => setSelectedProfileSlug(profile.slug)}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3.5 ${
                    isSelected
                      ? "bg-slate-900 border-rose-500/50 ring-1 ring-rose-500/30 shadow-lg shadow-rose-950/20"
                      : "bg-slate-900/40 border-slate-800/80 hover:bg-slate-900/80 hover:border-slate-700"
                  }`}
                >
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-800 flex-shrink-0 border border-slate-700/50">
                    {profile.avatarUrl ? (
                      <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-slate-400">
                        {profile.name.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-white truncate text-base">{profile.name}</div>
                      <span className="text-[11px] px-2 py-0.5 rounded-full border bg-slate-800 text-slate-300 font-medium border-slate-700">
                        {profile.type === "ARTIST" ? (
                          <span className="flex items-center gap-1"><Mic2 className="w-3 h-3 text-rose-400" /> Artiste</span>
                        ) : (
                          <span className="flex items-center gap-1"><Building2 className="w-3 h-3 text-purple-400" /> Salle/Bar</span>
                        )}
                      </span>
                    </div>

                    {/* Delegation mode badge */}
                    <div className="mt-1.5 flex items-center gap-2">
                      <span
                        className={`text-[11px] px-2 py-0.5 rounded-md font-medium border ${
                          profile.delegationMode === "DELEGATED"
                            ? "bg-rose-500/10 text-rose-300 border-rose-500/20"
                            : "bg-sky-500/10 text-sky-300 border-sky-500/20"
                        }`}
                      >
                        {profile.delegationMode === "DELEGATED" ? "Délégation Agence" : "Artiste Autonome"}
                      </span>

                      {profile.channelConnections.length > 0 && (
                        <div className="flex items-center gap-1 text-slate-400">
                          {profile.channelConnections.some((c) => c.provider === "INSTAGRAM_BUSINESS") && (
                            <Instagram className="w-3.5 h-3.5 text-pink-400" />
                          )}
                          {profile.channelConnections.some((c) => c.provider === "FACEBOOK_PAGE") && (
                            <Facebook className="w-3.5 h-3.5 text-blue-400" />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Area : Selected Profile Details & Active Campaigns */}
        <div className="lg:col-span-8 space-y-6">
          {activeProfile && (
            <>
              {/* Profile Card Header */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
                <div
                  className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-15 pointer-events-none"
                  style={{ backgroundColor: activeProfile.brandColor || "#e11d48" }}
                />

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-800 border-2 border-slate-700 shadow-md">
                      {activeProfile.avatarUrl ? (
                        <img src={activeProfile.avatarUrl} alt={activeProfile.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-lg text-slate-400">
                          {activeProfile.name.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-white">{activeProfile.name}</h1>
                      <p className="text-sm text-slate-400 line-clamp-1 max-w-md">{activeProfile.bio || "Aucune biographie."}</p>
                    </div>
                  </div>

                  {/* Lien en Bio Button */}
                  <a
                    href={`/bio/${activeProfile.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm font-medium text-slate-200 border border-slate-700 transition-colors shadow-sm"
                  >
                    <ExternalLink className="w-4 h-4 text-rose-400" />
                    Voir le Lien en Bio
                  </a>
                </div>

                {/* Connections summary */}
                <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-4">
                  <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Comptes Connectés :</span>
                  {activeProfile.channelConnections.length === 0 ? (
                    <span className="text-xs text-slate-500 italic">Aucun compte social connecté pour le moment.</span>
                  ) : (
                    activeProfile.channelConnections.map((conn) => (
                      <div
                        key={conn.id}
                        className="flex items-center gap-1.5 text-xs bg-slate-800/80 border border-slate-700/80 px-3 py-1.5 rounded-lg text-slate-200"
                      >
                        {conn.provider === "INSTAGRAM_BUSINESS" ? (
                          <Instagram className="w-3.5 h-3.5 text-pink-400" />
                        ) : (
                          <Facebook className="w-3.5 h-3.5 text-blue-400" />
                        )}
                        <span className="font-medium">{conn.externalAccountName}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 ml-1" />
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Campaigns & Publications */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Layers className="w-5 h-5 text-rose-500" />
                    Campagnes & Publications Actives
                  </h3>
                </div>

                {activeProfile.campaigns.length === 0 ? (
                  <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-8 text-center text-slate-400">
                    <AlertCircle className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                    Aucune campagne active sur ce profil.
                  </div>
                ) : (
                  activeProfile.campaigns.map((camp) => (
                    <div key={camp.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
                        <div>
                          <div className="text-xs font-semibold text-rose-400 uppercase tracking-wider">
                            Scénario : {camp.scenario}
                          </div>
                          <h4 className="text-lg font-bold text-white">{camp.title}</h4>
                        </div>
                        <span className="text-xs bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2.5 py-1 rounded-full font-medium">
                          {camp.status}
                        </span>
                      </div>

                      {/* Occurrences list */}
                      <div className="space-y-3">
                        {camp.plans.flatMap((p) => p.occurrences).map((occ) => {
                          const state = occurrencesState[occ.id] || { status: occ.status, loading: false };
                          const isSuccess = state.status === "PUBLISHED";
                          const isCancelled = state.status === "CANCELLED";

                          return (
                            <div
                              key={occ.id}
                              className="bg-slate-950/80 border border-slate-800/90 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                            >
                              <div className="space-y-1.5 flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  {occ.variant.network === "INSTAGRAM" ? (
                                    <span className="flex items-center gap-1 text-xs font-semibold text-pink-400 bg-pink-500/10 border border-pink-500/20 px-2 py-0.5 rounded">
                                      <Instagram className="w-3 h-3" /> {occ.variant.format}
                                    </span>
                                  ) : (
                                    <span className="flex items-center gap-1 text-xs font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded">
                                      <Facebook className="w-3 h-3" /> {occ.variant.format}
                                    </span>
                                  )}

                                  {occ.variant.hasBioWatermark && (
                                    <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
                                      Filigrane Lien en bio
                                    </span>
                                  )}

                                  {occ.variant.audioCatalogTitle && (
                                    <span className="text-[10px] bg-slate-800 text-emerald-300 border border-emerald-500/20 px-1.5 py-0.5 rounded">
                                      Audio: {occ.variant.audioCatalogTitle}
                                    </span>
                                  )}
                                </div>

                                <p className="text-sm text-slate-300 italic line-clamp-2">
                                  "{occ.variant.caption}"
                                </p>

                                {state.url && (
                                  <a
                                    href={state.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 underline pt-1"
                                  >
                                    <ExternalLink className="w-3.5 h-3.5" /> Voir la publication en ligne
                                  </a>
                                )}
                              </div>

                              {/* Action buttons & Status */}
                              <div className="flex items-center gap-2 self-end sm:self-center">
                                {isSuccess ? (
                                  <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg font-medium">
                                    <CheckCircle2 className="w-4 h-4" /> Publié avec succès
                                  </div>
                                ) : isCancelled ? (
                                  <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-800 px-3 py-1.5 rounded-lg font-medium">
                                    <XCircle className="w-4 h-4 text-slate-500" /> Annulé
                                  </div>
                                ) : (
                                  <>
                                    <button
                                      disabled={state.loading}
                                      onClick={() => handleCancel(occ.id)}
                                      className="text-xs px-3 py-2 rounded-lg bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-700 transition-colors disabled:opacity-50"
                                    >
                                      Annuler
                                    </button>

                                    <button
                                      disabled={state.loading}
                                      onClick={() => handlePublish(occ.id)}
                                      className="flex items-center gap-1.5 text-xs px-4 py-2 rounded-lg bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-semibold transition-all shadow-md shadow-rose-950/40 disabled:opacity-50"
                                    >
                                      {state.loading ? (
                                        <>
                                          <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                          Publication...
                                        </>
                                      ) : (
                                        <>
                                          <Send className="w-3.5 h-3.5" /> Publier maintenant
                                        </>
                                      )}
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
