import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { ExternalLink, Music, Ticket, Play, Instagram, Facebook } from "lucide-react";

interface BioPageProps {
  params: Promise<{ slug: string }>;
}

export default async function BioPage({ params }: BioPageProps) {
  const { slug } = await params;

  const profile = await prisma.managedProfile.findUnique({
    where: { slug },
    include: {
      linkPage: {
        include: {
          linkItems: {
            where: { isActive: true },
            orderBy: { order: "asc" },
          },
        },
      },
    },
  });

  if (!profile || !profile.linkPage || !profile.linkPage.isPublished) {
    notFound();
  }

  const { linkPage } = profile;
  const brandColor = profile.brandColor || "#f43f5e";

  const getIcon = (type: string) => {
    switch (type) {
      case "CATALOG":
        return <Music className="w-5 h-5" />;
      case "TICKETING":
        return <Ticket className="w-5 h-5" />;
      case "CUSTOM":
      default:
        return <ExternalLink className="w-5 h-5" />;
    }
  };

  const socialLinks = profile.socialLinks as Record<string, string> | null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center px-4 py-12 relative overflow-hidden">
      {/* Background glow with brand color */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ backgroundColor: brandColor }}
      />

      <main className="w-full max-w-md flex flex-col items-center z-10">
        {/* Avatar */}
        <div
          className="w-24 h-24 rounded-full p-1 mb-4 shadow-xl ring-2"
          style={{ borderColor: brandColor }}
        >
          {profile.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <div className="w-full h-full bg-slate-800 rounded-full flex items-center justify-center text-xl font-bold">
              {profile.name.substring(0, 2).toUpperCase()}
            </div>
          )}
        </div>

        {/* Name & Bio */}
        <h1 className="text-2xl font-bold tracking-tight text-white mb-1">{profile.name}</h1>
        <p className="text-slate-400 text-sm text-center mb-6 px-4">{profile.bio}</p>

        {/* Social Icons */}
        {socialLinks && (
          <div className="flex items-center gap-4 mb-8">
            {socialLinks.instagram && (
              <a
                href={socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition-colors p-2 bg-slate-900/80 rounded-full border border-slate-800"
              >
                <Instagram className="w-5 h-5" />
              </a>
            )}
            {socialLinks.facebook && (
              <a
                href={socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition-colors p-2 bg-slate-900/80 rounded-full border border-slate-800"
              >
                <Facebook className="w-5 h-5" />
              </a>
            )}
            {socialLinks.spotify && (
              <a
                href={socialLinks.spotify}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition-colors p-2 bg-slate-900/80 rounded-full border border-slate-800"
              >
                <Music className="w-5 h-5" />
              </a>
            )}
          </div>
        )}

        {/* Link Cards (Stan-like) */}
        <div className="w-full space-y-3">
          {linkPage.linkItems.map((item) => (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between p-4 rounded-xl bg-slate-900/90 border border-slate-800/80 hover:border-slate-700 hover:scale-[1.01] transition-all shadow-md"
            >
              <div className="flex items-center gap-3">
                <span className="text-slate-400 group-hover:text-rose-400 transition-colors">
                  {getIcon(item.type)}
                </span>
                <span className="font-medium text-sm text-slate-200 group-hover:text-white">
                  {item.title}
                </span>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-colors" />
            </a>
          ))}
        </div>

        {/* Footer */}
        <footer className="mt-16 text-xs text-slate-600 flex items-center gap-1">
          <span>Propulsé par</span>
          <span className="font-semibold text-slate-500">Thermidor Multiposting</span>
        </footer>
      </main>
    </div>
  );
}
