import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { MandateAcceptClient } from "./mandate-client";
import { ShieldCheck } from "lucide-react";

interface MandatePageProps {
  params: Promise<{ token: string }>;
}

export default async function MandatePage({ params }: MandatePageProps) {
  const { token } = await params;

  const profile = await prisma.managedProfile.findUnique({
    where: { mandateToken: token },
    include: {
      agencyWorkspace: true,
    },
  });

  if (!profile) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider">
              Délégation d'Identité Sociale
            </span>
            <h1 className="text-xl font-bold text-white">Mandat de Gestion Numérique</h1>
          </div>
        </div>

        <p className="text-sm text-slate-300 mb-6">
          L'agence <strong className="text-white font-semibold">{profile.agencyWorkspace.name}</strong> sollicite
          un mandat de publication pour le compte de l'artiste <strong className="text-white font-semibold">{profile.name}</strong>.
        </p>

        <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-5 mb-8 space-y-3 text-xs text-slate-300">
          <h2 className="font-semibold text-white text-sm mb-2 flex items-center gap-2">
            Termes de la délégation :
          </h2>
          <div className="flex items-start gap-2">
            <span className="text-rose-400 font-bold">•</span>
            <span>
              <strong>Portée :</strong> Autorisation accordée à l'agence de planifier, adapter et publier des visuels,
              textes, Reels, Stories et vidéos sur les canaux officiels autorisés.
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-rose-400 font-bold">•</span>
            <span>
              <strong>Sécurité :</strong> Vos mots de passe personnels ne sont jamais communiqués ni stockés.
              L'autorisation s'exécute via les protocoles OAuth officiels.
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-rose-400 font-bold">•</span>
            <span>
              <strong>Révocabilité :</strong> Ce mandat peut être suspendu ou résilié à tout moment depuis votre espace.
            </span>
          </div>
        </div>

        <MandateAcceptClient
          token={token}
          artistName={profile.name}
          initialStatus={profile.mandateStatus}
        />
      </div>
    </div>
  );
}
