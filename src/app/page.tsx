import { prisma } from "@/lib/db";
import { DashboardView } from "@/components/dashboard-view";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const workspace = await prisma.agencyWorkspace.findFirst({
    where: { slug: "thermidor-studios" },
    include: {
      managedProfiles: {
        include: {
          channelConnections: true,
          campaigns: {
            include: {
              plans: {
                include: {
                  occurrences: {
                    include: {
                      variant: true,
                      targets: {
                        include: {
                          channelConnection: true,
                          remotePost: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!workspace) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-2xl font-bold mb-2">Base de données non initialisée</h1>
        <p className="text-slate-400 mb-6">
          Veuillez exécuter la commande de seed pour initialiser l'agence et les profils artistes :
        </p>
        <code className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-lg text-rose-400 font-mono text-sm">
          pnpm db:push &amp;&amp; pnpm db:seed
        </code>
      </div>
    );
  }

  // Adapter les données pour le composant client
  const serializedProfiles = workspace.managedProfiles.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    type: p.type,
    delegationMode: p.delegationMode,
    mandateStatus: p.mandateStatus,
    mandateGrantedAt: p.mandateGrantedAt ? p.mandateGrantedAt.toISOString() : null,
    mandateGrantedByEmail: p.mandateGrantedByEmail,
    mandateToken: p.mandateToken,
    avatarUrl: p.avatarUrl,
    bio: p.bio,
    brandColor: p.brandColor,
    channelConnections: p.channelConnections.map((c) => ({
      id: c.id,
      provider: c.provider,
      externalAccountId: c.externalAccountId,
      externalAccountName: c.externalAccountName,
      isConnected: c.isConnected,
    })),
    campaigns: p.campaigns.map((camp) => ({
      id: camp.id,
      title: camp.title,
      scenario: camp.scenario,
      status: camp.status,
      plans: camp.plans.map((pl) => ({
        occurrences: pl.occurrences.map((occ) => ({
          id: occ.id,
          scheduledAt: occ.scheduledAt.toISOString(),
          status: occ.status,
          variant: {
            network: occ.variant.network,
            format: occ.variant.format,
            caption: occ.variant.caption,
            hasBioWatermark: occ.variant.hasBioWatermark,
            audioCatalogTitle: occ.variant.audioCatalogTitle,
          },
          targets: occ.targets.map((t) => ({
            id: t.id,
            destinationType: t.destinationType,
            status: t.status,
            channelConnection: {
              provider: t.channelConnection.provider,
              externalAccountName: t.channelConnection.externalAccountName,
            },
            remotePost: t.remotePost
              ? {
                  permalinkUrl: t.remotePost.permalinkUrl,
                  remotePostId: t.remotePost.remotePostId,
                }
              : null,
          })),
        })),
      })),
    })),
  }));

  return (
    <DashboardView
      agencyName={workspace.name}
      profiles={serializedProfiles}
    />
  );
}
