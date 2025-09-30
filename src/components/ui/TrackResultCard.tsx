import { motion, Variants } from 'framer-motion';
import { Music, Mic, BookOpen, GitBranch } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Track, OutputMode } from '@/types/music';
interface TrackResultCardProps {
  track: Track;
  mode: OutputMode;
}
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut' // Use a safer string value for easing
    }
  },
};
const Section = ({ title, children, icon: Icon }: { title: string, children: React.ReactNode, icon: React.ElementType }) => (
  <div className="mt-4">
    <h3 className={cn(
      "flex items-center text-lg font-bold mb-2 tracking-wider text-foreground",
    )}>
      <Icon className="w-5 h-5 mr-3" />
      {title}
    </h3>
    <div className="pl-8 space-y-2 text-muted-foreground leading-relaxed">{children}</div>
  </div>
);
const BroadcastContent = ({ track }: { track: Track }) => (
  <>
    <p><strong className="text-foreground font-semibold">Artist:</strong> {track.broadcast.artist}</p>
    <p><strong className="text-foreground font-semibold">Release:</strong> {track.broadcast.release}</p>
    <p><strong className="text-foreground font-semibold">Fusion:</strong> {track.broadcast.fusion}</p>
  </>
);
const PrepContent = ({ track }: { track: Track }) => (
  <>
    <p><strong className="text-foreground font-semibold">Artist Background:</strong> {track.prep.artistBackground}</p>
    <p><strong className="text-foreground font-semibold">Release Context:</strong> {track.prep.releaseContext}</p>
    <p><strong className="text-foreground font-semibold">Global Significance:</strong> {track.prep.globalSignificance}</p>
  </>
);
export function TrackResultCard({ track, mode }: TrackResultCardProps) {
  return (
    <motion.div
      variants={cardVariants}
      className="glass p-6 rounded-lg shadow-md"
    >
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-shrink-0">
          <img
            src={track.artworkUrl}
            alt={`${track.albumTitle} — ${track.artistName}`}
            className="w-40 h-40 object-cover rounded-md border-2 border-border" // Use theme-aware border
          />
        </div>
        <div className="flex-grow">
          <h2 className="text-3xl font-bold text-foreground tracking-widest glitch-text" data-text={`${track.songTitle} — ${track.artistName}`}>
            {track.songTitle} — {track.artistName}
          </h2>
          {(mode === 'Broadcast' || mode === 'Double') && (
            <Section title="Broadcast Bullets" icon={Mic}>
              <BroadcastContent track={track} />
            </Section>
          )}
          {(mode === 'Prep' || mode === 'Double') && (
            <Section title="Prep Notes" icon={BookOpen}>
              <PrepContent track={track} />
            </Section>
          )}
        </div>
      </div>
      <div className="mt-6 pt-4 border-t flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm">
        <div className="flex items-center gap-4">
          <a
            href={track.spotifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-primary hover:underline transition-colors duration-200"
          >
            <Music className="w-4 h-4" />
            Listen on Spotify
          </a>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <GitBranch className="w-4 h-4" />
          <span className="font-semibold">Sources:</span>
          <span className="truncate" title={track.sources.join('; ')}>{track.sources.join('; ')}</span>
        </div>
      </div>
    </motion.div>
  );
}