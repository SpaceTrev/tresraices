/**
 * MenuLayout — Two-column responsive layout with filter sidebar and content area
 */

import type { ReactNode } from "react";

interface MenuLayoutProps {
  filterPanel: ReactNode;
  children: ReactNode;
}

export default function MenuLayout({ filterPanel, children }: MenuLayoutProps) {
  return (
    <div className="grid lg:grid-cols-[280px_1fr] gap-6 items-start">
      {/* Filter sidebar - only render if filterPanel is provided */}
      {filterPanel && (
        <aside className="lg:sticky lg:top-20">
          {filterPanel}
        </aside>
      )}
      
      {/* Main content area */}
      <main className={filterPanel ? "min-w-0" : "lg:col-span-2 min-w-0"}>
        {children}
      </main>
    </div>
  );
}
