import { create } from 'zustand';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TrackResultCard } from '@/components/ui/TrackResultCard';
import { chatService } from '@/lib/chat';
import { mockData } from '@/lib/mock-data'; // Import mock data
import type { Track, OutputMode } from '@/types/music';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ThemeToggle';
interface AppState {
  input: string;
  mode: OutputMode;
  isLoading: boolean;
  error: string | null;
  results: Track[];
  setInput: (input: string) => void;
  setMode: (mode: OutputMode) => void;
  generate: () => void;
}
const useAppStore = create<AppState>((set, get) => ({
  input: `'Chan Chan' — Buena Vista Social Club\n'Jóga' — Björk`,
  mode: 'Broadcast',
  isLoading: false,
  error: null,
  results: [],
  setInput: (input) => set({ input }),
  setMode: (mode) => set({ mode }),
  generate: async () => {
    const { input, mode } = get();
    if (!input.trim()) return;
    set({ isLoading: true, results: [], error: null });
    const prompt = `Mode: ${mode}\n${input}`;
    const response = await chatService.sendMessage(prompt);
    if (response.success && response.content) {
      try {
        const parsedResults = JSON.parse(response.content);
        set({ isLoading: false, results: parsedResults });
      } catch (e) {
        console.error("Failed to parse agent response:", e);
        set({
          isLoading: false,
          error: "Received an invalid response. Displaying mock data as a fallback.",
          results: mockData
        });
      }
    } else {
      // Graceful fallback logic
      set({
        isLoading: false,
        error: "Live API call failed (API keys may be missing). Displaying mock data as a fallback.",
        results: mockData
      });
    }
  },
}));
const Header = () => (
  <header className="text-center">
    <h1
      className="text-5xl md:text-6xl font-bold text-foreground tracking-[0.2em] uppercase glitch-text"
      data-text="RetroWave Radio"
    >
      RetroWave Radio
    </h1>
    <p className="text-muted-foreground mt-2 text-lg tracking-wider">
      A I   C O M M E N T A R Y   A S S I S T A N T
    </p>
  </header>
);
const InputCard = () => {
  const { input, setInput, mode, setMode, isLoading, generate } = useAppStore();
  return (
    <div className="w-full glass rounded-xl shadow-lg p-6 md:p-8 space-y-6">
      <ToggleGroup
        type="single"
        value={mode}
        onValueChange={(value: OutputMode) => value && setMode(value)}
        className="grid grid-cols-3 gap-2"
        aria-label="Output Mode"
      >
        {['Broadcast', 'Prep', 'Double'].map((item) => (
          <ToggleGroupItem
            key={item}
            value={item}
            className={cn(
              "w-full border text-foreground rounded-md py-3 text-sm font-bold tracking-widest uppercase transition-all duration-300",
              "hover:bg-accent hover:text-accent-foreground",
              "data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
            )}
          >
            {item}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <Textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={`'Song Title' — Artist/Band\n'Another Song' — Another Artist`}
        className="min-h-[120px] bg-background/50 border rounded-md text-lg text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary transition-all duration-300"
      />
      <Button
        onClick={generate}
        disabled={isLoading}
        className="w-full bg-primary text-primary-foreground font-bold text-xl tracking-widest uppercase py-6 rounded-md transition-all duration-300 hover:bg-primary/90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <Loader className="w-6 h-6 mr-3 animate-spin" />
            <span>PROCESSING...</span>
          </div>
        ) : (
          'GENERATE'
        )}
      </Button>
    </div>
  );
};
const ResultsDisplay = () => {
  const { isLoading, results, mode, error } = useAppStore();
  return (
    <div className="w-full">
      <AnimatePresence>
        {isLoading && !results.length && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center text-muted-foreground text-lg tracking-widest"
          >
            <p>Reticulating Splines...</p>
          </motion.div>
        )}
        {error && (
           <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass border border-destructive/50 text-destructive p-4 rounded-lg flex items-center gap-4 mb-4"
          >
            <AlertTriangle className="w-6 h-6" />
            <p>{error}</p>
          </motion.div>
        )}
      </AnimatePresence>
      <ScrollArea className="h-full max-h-[60vh] w-full mt-4 pr-4">
        <div className="space-y-8">
          <AnimatePresence>
            {results.map((track, index) => (
              <motion.div
                key={track.id}
                initial="hidden"
                animate="visible"
                exit="hidden"
                custom={index}
                variants={{
                  hidden: { opacity: 0, y: 50 },
                  visible: (i) => ({
                    opacity: 1,
                    y: 0,
                    transition: {
                      delay: i * 0.2,
                      duration: 0.5,
                      ease: 'easeOut',
                    },
                  }),
                }}
              >
                <TrackResultCard track={track} mode={mode} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </ScrollArea>
    </div>
  );
};
export function HomePage() {
  return (
    <main className="min-h-screen w-full grainy-background scanline-effect flex flex-col items-center p-4 sm:p-6 lg:p-8 overflow-x-hidden">
      <ThemeToggle />
      <div className="w-full max-w-7xl mx-auto flex flex-col items-center space-y-12 py-16">
        <Header />
        <InputCard />
        <ResultsDisplay />
        <footer className="text-center text-muted-foreground text-sm mt-8 space-y-4">
          <div className="max-w-2xl mx-auto glass border border-amber-500/50 text-amber-600 dark:text-amber-400 p-4 rounded-lg text-xs">
            <h3 className="font-bold flex items-center justify-center gap-2"><AlertTriangle className="w-4 h-4" /> Important Note</h3>
            <p className="mt-2">
              The full AI research capabilities of this application require API keys which cannot be pre-configured in this public environment. To experience the complete functionality, please deploy this project to your own Cloudflare account and add your API keys.
            </p>
          </div>
          <p>Built with ❤️ at Cloudflare</p>
        </footer>
      </div>
    </main>
  );
}