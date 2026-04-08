import { Shield, Award, MapPin, Users } from 'lucide-react';

const TrustSignals = () => (
  <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
    {[
      { icon: Award, label: '4.8★ Google Rating', sub: '320+ verified reviews' },
      { icon: Users, label: '5,000+ Guests', sub: 'Hosted since 2024' },
      { icon: MapPin, label: 'Local Experts', sub: 'Based in Shillong' },
      { icon: Shield, label: 'Verified Business', sub: 'GST registered' },
    ].map(({ icon: Icon, label, sub }) => (
      <div key={label} className="flex flex-col items-center text-center p-3 rounded-lg bg-muted/30 border border-border/50">
        <Icon className="h-5 w-5 text-primary mb-1.5" />
        <span className="text-xs font-medium text-foreground">{label}</span>
        <span className="text-[10px] text-muted-foreground">{sub}</span>
      </div>
    ))}
  </div>
);

export default TrustSignals;
