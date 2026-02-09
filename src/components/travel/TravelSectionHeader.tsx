interface TravelSectionHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  badgeIcon?: string;
  id?: string;
}

const TravelSectionHeader = ({ title, subtitle, badge, badgeIcon, id }: TravelSectionHeaderProps) => (
  <div id={id} className="text-center mb-8 sm:mb-10 md:mb-12 scroll-mt-20">
    {badge && (
      <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-50 border border-amber-200 rounded-full mb-4 text-xs sm:text-sm font-semibold text-amber-700 uppercase tracking-wider">
        {badgeIcon && <span>{badgeIcon}</span>}
        {badge}
      </div>
    )}
    <h2 className="font-playfair text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3">
      {title}
    </h2>
    {subtitle && (
      <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
        {subtitle}
      </p>
    )}
    <div className="flex items-center justify-center gap-3 mt-4">
      <div className="w-12 h-px bg-gradient-to-r from-transparent to-amber-400/50" />
      <div className="w-1.5 h-1.5 rotate-45 bg-amber-400" />
      <div className="w-12 h-px bg-gradient-to-l from-transparent to-amber-400/50" />
    </div>
  </div>
);

export default TravelSectionHeader;
