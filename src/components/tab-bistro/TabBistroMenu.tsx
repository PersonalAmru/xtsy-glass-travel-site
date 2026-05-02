import { memo, useState } from "react";
import { menuSections } from "@/data/tabBistroMenu";

const TabBistroMenu = memo(() => {
  const [activeTab, setActiveTab] = useState(menuSections[0].id);
  const activeSection = menuSections.find((s) => s.id === activeTab)!;

  return (
    <section id="menu">
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground font-playfair mb-2">Our Menu</h2>
        <p className="text-muted-foreground text-sm">From Assam teas to sizzlers — explore the full TAB Bistro experience.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-hide">
        {menuSections.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveTab(s.id)}
            className={`flex items-center gap-1.5 whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeTab === s.id
                ? "bg-amber-500 text-black"
                : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-amber-500/30"
            }`}
          >
            <span>{s.icon}</span>
            {s.label}
          </button>
        ))}
      </div>

      {/* Categories — headings + price range only */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {activeSection.categories.map((cat) => {
          const nums = cat.items
            .flatMap((i) => i.price.match(/\d+/g) ?? [])
            .map((n) => parseInt(n, 10))
            .filter((n) => !isNaN(n));
          const min = nums.length ? Math.min(...nums) : null;
          const max = nums.length ? Math.max(...nums) : null;
          const range =
            min === null ? "" : min === max ? `₹${min}` : `₹${min} – ₹${max}`;
          return (
            <div
              key={cat.title}
              className="flex items-center justify-between gap-3 p-4 rounded-xl bg-card border border-border hover:border-amber-500/40 transition-colors"
            >
              <h3 className="text-sm sm:text-base font-semibold text-foreground flex items-center gap-2">
                <span className="w-1 h-5 bg-amber-500 rounded-full" />
                {cat.title}
              </h3>
              <span className="text-sm font-medium text-amber-400 whitespace-nowrap">{range}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
});

TabBistroMenu.displayName = "TabBistroMenu";
export default TabBistroMenu;
