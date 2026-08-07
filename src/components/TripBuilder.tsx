/**
 * TripBuilder - Interactive multi-step trip planner for Meghalaya
 * Steps: Duration → Style → Destinations → Experiences → Preview → Lead Capture
 */
import { memo, useState, useCallback } from 'react';
import { Link } from '@/lib/router-compat';
import { 
  Clock, Backpack, Mountain, Heart, Camera, PawPrint, Trees,
  Waves, Tent, Footprints, Compass, Sun,
  MapPin, ChevronRight, ChevronLeft, Sparkles, Send, Check, Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getDestinationImageUrl, knownImageIndices } from '@/data/meghalayaDestinations';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

// ── Duration options ──
const DURATIONS = [
  { label: '2–3 Days', value: '2-3', desc: 'Quick getaway' },
  { label: '4–5 Days', value: '4-5', desc: 'Popular choice' },
  { label: '6–7 Days', value: '6-7', desc: 'Full experience' },
  { label: '10+ Days', value: '10+', desc: 'Deep exploration' },
];

// ── Travel styles ──
const STYLES = [
  { label: 'Backpacking', value: 'backpacking', icon: Backpack },
  { label: 'Adventure', value: 'adventure', icon: Mountain },
  { label: 'Nature & Waterfalls', value: 'nature', icon: Waves },
  { label: 'Romantic Getaway', value: 'romantic', icon: Heart },
  { label: 'Pet-Friendly', value: 'pet-friendly', icon: PawPrint },
  { label: 'Photography', value: 'photography', icon: Camera },
];

// ── Destinations ──
const DESTINATIONS = [
  { name: 'Shillong', slug: 'shillong-travel-guide', teaser: 'Scotland of the East', imageKey: 'shillong-peak' },
  { name: 'Cherrapunjee', slug: 'cherrapunji-travel-guide', teaser: 'Wettest place on Earth', imageKey: 'elephant-falls' },
  { name: 'Dawki – Umngot River', slug: 'dawki-umngot-river-guide', teaser: 'Crystal-clear river boating', imageKey: 'dawki-umngot-river' },
  { name: 'Mawlynnong Village', slug: 'mawlynnong-cleanest-village', teaser: "Asia's cleanest village", imageKey: 'mawlynnong-village' },
  { name: 'Nongriat Root Bridge', slug: 'double-decker-root-bridge', teaser: 'Iconic double-decker trek', imageKey: 'double-decker-living-root-bridge' },
  { name: 'Umiam Lake', slug: 'umiam-lake-shillong', teaser: 'Pine-surrounded lake', imageKey: 'umiam-lake' },
  { name: 'Laitlum Canyon', slug: 'laitlum-canyons-shillong', teaser: 'Canyon views above clouds', imageKey: 'laitlum-canyons' },
  { name: 'Shnongpdeng', slug: 'shnongpdeng-camping-meghalaya', teaser: 'Riverside camping & kayaking', imageKey: 'ranikor' },
];

// ── Experiences ──
const EXPERIENCES = [
  { label: 'Waterfall Chasing', value: 'waterfalls', icon: Waves },
  { label: 'Cave Exploration', value: 'caves', icon: Mountain },
  { label: 'River Camping', value: 'camping', icon: Tent },
  { label: 'Trekking', value: 'trekking', icon: Footprints },
  { label: 'Local Village Culture', value: 'culture', icon: Trees },
  { label: 'Sunrise Viewpoints', value: 'sunrise', icon: Sun },
  { label: 'Kayaking', value: 'kayaking', icon: Compass },
];

const getDestImage = (imageKey: string) => {
  const indices = knownImageIndices[imageKey];
  if (indices && indices.length > 0) {
    return getDestinationImageUrl(imageKey, indices[0]);
  }
  return getDestinationImageUrl(imageKey, 1);
};

// ── Itinerary generator ──
const generateItinerary = (
  duration: string,
  destinations: string[]
): string[] => {
  const days = duration === '2-3' ? 3 : duration === '4-5' ? 5 : duration === '6-7' ? 7 : 10;
  const destNames = destinations.map(slug => 
    DESTINATIONS.find(d => d.slug === slug)?.name || slug
  );
  
  const itinerary: string[] = [];
  itinerary.push('Arrival in Shillong — check in & explore local cafés');
  
  for (let i = 0; i < Math.min(destNames.length, days - 2); i++) {
    itinerary.push(`${destNames[i]} — full day exploration`);
  }
  
  // Fill remaining days
  const fillers = [
    'Local market visit & street food trail',
    'Scenic drive through pine forests',
    'Free day for spontaneous adventures',
    'Photography walk & sunset viewpoint',
  ];
  while (itinerary.length < days - 1) {
    itinerary.push(fillers[itinerary.length % fillers.length]);
  }
  
  itinerary.push('Departure — carry Meghalaya memories home');
  return itinerary.slice(0, days);
};

// ── Step components ──

const StepDuration = memo(({ selected, onSelect }: { selected: string; onSelect: (v: string) => void }) => (
  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
    {DURATIONS.map(d => (
      <button
        key={d.value}
        onClick={() => onSelect(d.value)}
        className={cn(
          "relative rounded-xl border p-4 text-left transition-all duration-200",
          selected === d.value
            ? "border-primary bg-primary/10 ring-1 ring-primary/30"
            : "border-border/50 bg-card hover:border-primary/30 hover:bg-primary/5"
        )}
      >
        <Clock className={cn("h-5 w-5 mb-2", selected === d.value ? "text-primary" : "text-muted-foreground")} />
        <div className="font-semibold text-sm text-foreground">{d.label}</div>
        <div className="text-xs text-muted-foreground mt-0.5">{d.desc}</div>
        {selected === d.value && (
          <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
            <Check className="h-3 w-3 text-primary-foreground" />
          </div>
        )}
      </button>
    ))}
  </div>
));
StepDuration.displayName = 'StepDuration';

const StepStyles = memo(({ selected, onToggle }: { selected: string[]; onToggle: (v: string) => void }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
    {STYLES.map(s => {
      const Icon = s.icon;
      const active = selected.includes(s.value);
      return (
        <button
          key={s.value}
          onClick={() => onToggle(s.value)}
          className={cn(
            "flex items-center gap-3 rounded-xl border p-4 transition-all duration-200",
            active
              ? "border-primary bg-primary/10 ring-1 ring-primary/30"
              : "border-border/50 bg-card hover:border-primary/30 hover:bg-primary/5"
          )}
        >
          <div className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
            active ? "bg-primary/20" : "bg-muted/50"
          )}>
            <Icon className={cn("h-5 w-5", active ? "text-primary" : "text-muted-foreground")} />
          </div>
          <span className={cn("text-sm font-medium", active ? "text-foreground" : "text-muted-foreground")}>
            {s.label}
          </span>
          {active && <Check className="h-4 w-4 text-primary ml-auto" />}
        </button>
      );
    })}
  </div>
));
StepStyles.displayName = 'StepStyles';

const StepDestinations = memo(({ selected, onToggle }: { selected: string[]; onToggle: (v: string) => void }) => (
  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
    {DESTINATIONS.map(d => {
      const active = selected.includes(d.slug);
      return (
        <div key={d.slug} className="relative">
          <button
            onClick={() => onToggle(d.slug)}
            className={cn(
              "w-full rounded-xl border overflow-hidden transition-all duration-200 text-left",
              active
                ? "border-primary ring-1 ring-primary/30"
                : "border-border/50 hover:border-primary/30"
            )}
          >
            <div className="relative h-[100px] overflow-hidden">
              <img
                src={getDestImage(d.imageKey)}
                alt={d.name}
                loading="lazy"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              {active && (
                <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                  <Check className="h-3.5 w-3.5 text-primary-foreground" />
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 p-2.5">
                <div className="text-white text-sm font-semibold leading-tight">{d.name}</div>
              </div>
            </div>
            <div className="px-2.5 py-2 bg-card">
              <span className="text-[11px] text-muted-foreground">{d.teaser}</span>
            </div>
          </button>
          {/* SEO internal link */}
          <Link to={`/${d.slug}`} className="absolute bottom-0.5 right-1.5 text-[10px] text-primary/60 hover:text-primary">
            Guide →
          </Link>
        </div>
      );
    })}
  </div>
));
StepDestinations.displayName = 'StepDestinations';

const StepExperiences = memo(({ selected, onToggle }: { selected: string[]; onToggle: (v: string) => void }) => (
  <div className="flex flex-wrap gap-2.5">
    {EXPERIENCES.map(e => {
      const Icon = e.icon;
      const active = selected.includes(e.value);
      return (
        <button
          key={e.value}
          onClick={() => onToggle(e.value)}
          className={cn(
            "inline-flex items-center gap-2 px-4 py-2.5 rounded-full border transition-all duration-200 text-sm",
            active
              ? "border-primary bg-primary/10 text-primary font-medium"
              : "border-border/50 bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground"
          )}
        >
          <Icon className="h-4 w-4" />
          {e.label}
          {active && <Check className="h-3.5 w-3.5" />}
        </button>
      );
    })}
  </div>
));
StepExperiences.displayName = 'StepExperiences';

// ── Main TripBuilder ──
const STEPS = ['Duration', 'Travel Style', 'Destinations', 'Experiences'];

const TripBuilder = memo(() => {
  const [step, setStep] = useState(0);
  const [duration, setDuration] = useState('');
  const [styles, setStyles] = useState<string[]>([]);
  const [destinations, setDestinations] = useState<string[]>([]);
  const [experiences, setExperiences] = useState<string[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', dates: '', groupSize: '', message: '' });

  const toggleMulti = useCallback((arr: string[], setter: React.Dispatch<React.SetStateAction<string[]>>, val: string) => {
    setter(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);
  }, []);

  const canProceed = step === 0 ? !!duration : step === 1 ? styles.length > 0 : step === 2 ? destinations.length > 0 : experiences.length > 0;

  const itinerary = destinations.length > 0 && duration
    ? generateItinerary(duration, destinations)
    : [];

  const handleSubmit = useCallback(async () => {
    if (!formData.name || !formData.email) {
      toast.error('Please fill in your name and email');
      return;
    }
    setSubmitting(true);
    // Simulate submission delay
    await new Promise(r => setTimeout(r, 1200));
    setSubmitting(false);
    setShowForm(false);
    toast.success('Trip request sent! Our Meghalaya travel team will send you a customized itinerary.');
    // Reset
    setStep(0);
    setDuration('');
    setStyles([]);
    setDestinations([]);
    setExperiences([]);
    setFormData({ name: '', email: '', dates: '', groupSize: '', message: '' });
  }, [formData]);

  const showPreview = step === 3 && experiences.length > 0 && itinerary.length > 0;

  return (
    <>
      <section className="py-14 md:py-20 bg-background">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Sparkles className="h-4 w-4" />
              Trip Builder
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground leading-tight">
              Plan Your Meghalaya Adventure
            </h2>
            <p className="mt-3 text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
              Build your perfect trip in seconds — choose destinations, experiences, and travel style.
            </p>
          </div>

          {/* Progress */}
          <div className="flex items-center justify-center gap-1 mb-8">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center">
                <button
                  onClick={() => i < step && setStep(i)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                    i === step
                      ? "bg-primary text-primary-foreground"
                      : i < step
                      ? "bg-primary/20 text-primary cursor-pointer hover:bg-primary/30"
                      : "bg-muted/30 text-muted-foreground"
                  )}
                >
                  <span className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold bg-white/20">
                    {i < step ? '✓' : i + 1}
                  </span>
                  <span className="hidden sm:inline">{s}</span>
                </button>
                {i < STEPS.length - 1 && (
                  <div className={cn("w-6 sm:w-10 h-px mx-1", i < step ? "bg-primary/40" : "bg-border/30")} />
                )}
              </div>
            ))}
          </div>

          {/* Step content */}
          <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-5 sm:p-8">
            <h3 className="text-lg font-semibold text-foreground mb-1">
              {step === 0 && 'How long is your trip?'}
              {step === 1 && 'What\'s your travel style?'}
              {step === 2 && 'Pick your destinations'}
              {step === 3 && 'Choose your experiences'}
            </h3>
            <p className="text-xs text-muted-foreground mb-5">
              {step === 0 && 'Select your ideal trip duration'}
              {step === 1 && 'Select one or more styles (multiple allowed)'}
              {step === 2 && 'Select the places you want to visit'}
              {step === 3 && 'Tag the activities you\'re excited about'}
            </p>

            {step === 0 && <StepDuration selected={duration} onSelect={setDuration} />}
            {step === 1 && <StepStyles selected={styles} onToggle={v => toggleMulti(styles, setStyles, v)} />}
            {step === 2 && <StepDestinations selected={destinations} onToggle={v => toggleMulti(destinations, setDestinations, v)} />}
            {step === 3 && <StepExperiences selected={experiences} onToggle={v => toggleMulti(experiences, setExperiences, v)} />}

            {/* Itinerary preview */}
            {showPreview && (
              <div className="mt-6 rounded-xl border border-primary/20 bg-primary/5 p-5">
                <h4 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Your Suggested Itinerary
                </h4>
                <div className="space-y-2">
                  {itinerary.map((day, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-16 text-xs font-semibold text-primary">Day {i + 1}</div>
                      <div className="flex-1 text-sm text-muted-foreground">{day}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/30">
              <button
                onClick={() => setStep(Math.max(0, step - 1))}
                disabled={step === 0}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                  step > 0
                    ? "text-foreground hover:bg-muted/50"
                    : "text-muted-foreground/30 cursor-not-allowed"
                )}
              >
                <ChevronLeft className="h-4 w-4" /> Back
              </button>

              {step < 3 ? (
                <button
                  onClick={() => canProceed && setStep(step + 1)}
                  disabled={!canProceed}
                  className={cn(
                    "flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-sm font-medium transition-all",
                    canProceed
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                  )}
                >
                  Next <ChevronRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={() => setShowForm(true)}
                  disabled={!canProceed}
                  className={cn(
                    "flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all",
                    canProceed
                      ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20"
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                  )}
                >
                  <Sparkles className="h-4 w-4" />
                  Get My Custom Trip Plan
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Lead capture modal */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Send className="h-5 w-5 text-primary" />
              Get Your Custom Trip Plan
            </DialogTitle>
          </DialogHeader>

          <p className="text-sm text-muted-foreground mb-4">
            Our Meghalaya travel team will send you a customized itinerary based on your selections.
          </p>

          {/* Summary */}
          <div className="rounded-lg bg-muted/30 p-3 mb-4 space-y-1.5">
            <div className="flex items-center gap-2 text-xs">
              <Clock className="h-3.5 w-3.5 text-primary" />
              <span className="text-muted-foreground">Duration:</span>
              <span className="text-foreground font-medium">{DURATIONS.find(d => d.value === duration)?.label}</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <MapPin className="h-3.5 w-3.5 text-primary" />
              <span className="text-muted-foreground">Destinations:</span>
              <span className="text-foreground font-medium">
                {destinations.map(s => DESTINATIONS.find(d => d.slug === s)?.name).filter(Boolean).join(', ')}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Compass className="h-3.5 w-3.5 text-primary" />
              <span className="text-muted-foreground">Styles:</span>
              <span className="text-foreground font-medium">
                {styles.map(s => STYLES.find(st => st.value === s)?.label).filter(Boolean).join(', ')}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <Input
              placeholder="Your name *"
              value={formData.name}
              onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
            />
            <Input
              placeholder="Email address *"
              type="email"
              value={formData.email}
              onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                placeholder="Travel dates"
                value={formData.dates}
                onChange={e => setFormData(p => ({ ...p, dates: e.target.value }))}
              />
              <Input
                placeholder="Group size"
                value={formData.groupSize}
                onChange={e => setFormData(p => ({ ...p, groupSize: e.target.value }))}
              />
            </div>
            <Textarea
              placeholder="Any special requests or questions?"
              value={formData.message}
              onChange={e => setFormData(p => ({ ...p, message: e.target.value }))}
              rows={3}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full mt-4 flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all disabled:opacity-60"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Send My Trip Request
              </>
            )}
          </button>
        </DialogContent>
      </Dialog>
    </>
  );
});

TripBuilder.displayName = 'TripBuilder';
export default TripBuilder;
