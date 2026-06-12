import { useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, MapPin, Check } from "lucide-react";
import {
  SIGNATURE_PACKAGES,
  formatPackagePrice,
  type SignaturePackage,
} from "@/data/signaturePackages";
import { openWhatsAppDirectly } from "@/utils/privacyCompliantWhatsApp";

const enquire = (pkg: SignaturePackage) => {
  const msg = `Hi XTSY! I'm interested in the "${pkg.title}" (${pkg.duration}) at ${formatPackagePrice(
    pkg.pricePerPerson,
  )} per person. Please share availability and details.`;
  openWhatsAppDirectly(msg);
};

const PackageCard = ({ pkg }: { pkg: SignaturePackage }) => (
  <Card className="flex flex-col overflow-hidden border-border/60 bg-card transition-shadow hover:shadow-lg">
    <CardContent className="flex flex-1 flex-col p-5">
      <Badge variant="secondary" className="mb-3 w-fit">
        {pkg.region}
      </Badge>
      <h3 className="font-playfair text-lg font-bold leading-snug text-foreground">
        {pkg.title}
      </h3>
      <p className="mt-2 text-sm text-muted-foreground">{pkg.shortDescription}</p>

      <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" /> {pkg.duration}
        </span>
        {pkg.minGroup && (
          <span className="inline-flex items-center gap-1">
            <Users className="h-3.5 w-3.5" /> Min {pkg.minGroup} travellers
          </span>
        )}
        <span className="inline-flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5" /> {pkg.pickupDrop}
        </span>
      </div>

      <ul className="mt-4 space-y-1.5">
        {pkg.highlights.map((h) => (
          <li key={h} className="flex items-start gap-2 text-sm text-foreground/80">
            <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
            <span>{h}</span>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {pkg.idealFor.map((aud) => (
          <Badge key={aud} variant="outline" className="text-[11px] font-normal">
            {aud}
          </Badge>
        ))}
      </div>

      <div className="mt-auto flex items-end justify-between gap-3 pt-5">
        <div>
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
            Starting from
          </p>
          <p className="font-playfair text-2xl font-bold text-primary">
            {formatPackagePrice(pkg.pricePerPerson)}
          </p>
          <p className="text-[11px] text-muted-foreground">per person</p>
        </div>
        <Button
          size="sm"
          onClick={() => enquire(pkg)}
          className="min-h-[44px]"
          aria-label={`Enquire about ${pkg.title}`}
        >
          Enquire Now
        </Button>
      </div>
    </CardContent>
  </Card>
);

interface Props {
  /** Optional filter to a single region. */
  region?: SignaturePackage["region"];
  className?: string;
}

const SignaturePackages = ({ region, className }: Props) => {
  const packages = useMemo(
    () => (region ? SIGNATURE_PACKAGES.filter((p) => p.region === region) : SIGNATURE_PACKAGES),
    [region],
  );

  const offerSchema = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "XTSY Northeast India Signature Tour Packages",
      numberOfItems: packages.length,
      itemListElement: packages.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "TouristTrip",
          name: p.title,
          description: p.shortDescription,
          touristType: p.idealFor,
          offers: {
            "@type": "Offer",
            price: p.pricePerPerson,
            priceCurrency: "INR",
            availability: "https://schema.org/InStock",
            url: `https://xtsy.one/tours/${p.slug}`,
          },
        },
      })),
    }),
    [packages],
  );

  return (
    <section
      id="signature-packages"
      className={`py-12 sm:py-16 ${className ?? ""}`}
      aria-labelledby="signature-packages-heading"
    >
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(offerSchema)}</script>
      </Helmet>
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <Badge variant="secondary" className="mb-3">
            Fixed-Price Signature Packages
          </Badge>
          <h2
            id="signature-packages-heading"
            className="font-playfair text-2xl font-bold text-foreground sm:text-3xl"
          >
            Northeast India Tour Packages
          </h2>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Transparent, fixed per-person pricing across Meghalaya and Arunachal Pradesh.
            No hidden costs — what you see is what you pay.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg) => (
            <PackageCard key={pkg.slug} pkg={pkg} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SignaturePackages;
