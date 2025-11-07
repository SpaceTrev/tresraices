/**
 * Breadcrumbs — Navigation breadcrumb trail
 */

import Link from "next/link";

interface BreadcrumbsProps {
  region: string;
  prettyRegion: string;
}

export default function Breadcrumbs({ region, prettyRegion }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-slate-600">
      <ol className="flex items-center gap-2">
        <li>
          <Link href="/" className="hover:text-federalBlue transition-colors">
            Inicio
          </Link>
        </li>
        <li aria-hidden="true">/</li>
        <li>
          <Link href={`/menu/${region}`} className="hover:text-federalBlue transition-colors">
            Menú
          </Link>
        </li>
        <li aria-hidden="true">/</li>
        <li className="text-slate-900 font-medium" aria-current="page">
          {prettyRegion}
        </li>
      </ol>
    </nav>
  );
}
