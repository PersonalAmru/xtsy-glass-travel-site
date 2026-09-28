import { Fragment } from 'react';
import { Link } from "@/lib/router-compat";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Helmet } from "react-helmet-async";

interface BreadcrumbsProps {
  items: Array<{ label: string; href?: string }>;
}

const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
  // Build JSON-LD BreadcrumbList schema
  const schemaItems = [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://xtsy.one/" },
    ...items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 2,
      name: item.label,
      ...(item.href ? { item: `https://xtsy.one${item.href}` } : {}),
    })),
  ];

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: schemaItems,
  };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          {items.map((item, i) => (
            <Fragment key={i}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {item.href ? (
                  <BreadcrumbLink asChild>
                    <Link to={item.href}>{item.label}</Link>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
            </Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </>
  );
};

export default Breadcrumbs;
