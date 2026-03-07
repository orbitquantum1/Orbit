import { useState } from "react";
import { useSEO } from "@/hooks/use-seo";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Star } from "lucide-react";

interface MerchItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  sizes?: string[];
}

const merchItems: MerchItem[] = [
  {
    id: "orbit-mission-hoodie",
    name: "Mission Control Hoodie",
    description: "Ultra-soft fleece hoodie with embroidered ORBIT insignia. Built for long sessions coordinating the agent economy.",
    price: 98,
    image: "/images/merch-hoodie.png",
    category: "Apparel",
    sizes: ["S", "M", "L", "XL", "XXL"],
  },
  {
    id: "orbit-visor-helmet",
    name: "Visor Helmet",
    description: "Matte black helmet with ORBIT branding. Full-face protection. Track-inspired. Statement piece.",
    price: 320,
    image: "/images/merch-helmet.png",
    category: "Gear",
  },
  {
    id: "orbit-sunglasses",
    name: "Horizon Shades",
    description: "Polarized matte black sunglasses with orange mirror lenses. Lightweight titanium frame. ORBIT wordmark on temple.",
    price: 145,
    image: "/images/merch-sunglasses.png",
    category: "Accessories",
  },
  {
    id: "orbit-flag",
    name: "Mission Flag",
    description: "3x5ft double-sided flag with ORBIT emblem. Reinforced grommets. UV-resistant print. Fly it at the track or HQ.",
    price: 42,
    image: "/images/merch-flag.png",
    category: "Collectibles",
  },
  {
    id: "orbit-blanket",
    name: "Dark Side Blanket",
    description: "Sherpa-lined stadium blanket with ORBIT woven logo. 60x80 inches. Folds into carry pouch. Tailgate essential.",
    price: 68,
    image: "/images/merch-blanket.png",
    category: "Gear",
  },
  {
    id: "orbit-mission-pack",
    name: "Mission Pack",
    description: "Technical backpack with ORBIT woven patch. Padded laptop compartment. Built for race weekends and deployments.",
    price: 145,
    image: "/images/merch-backpack.png",
    category: "Gear",
  },
  {
    id: "orbit-trucker-hat",
    name: "Signal Trucker",
    description: "Classic mesh-back trucker hat with embroidered ORBIT patch. Curved brim. Adjustable snap closure. Black-on-black with orange accent stitch.",
    price: 34,
    image: "/images/merch-trucker.png",
    category: "Accessories",
  },
  {
    id: "orbit-cooler",
    name: "Cryo Cooler",
    description: "36-can hard-shell cooler with ORBIT laser-etched badge. 48-hour ice retention. Stainless steel latches. Matte black exterior.",
    price: 225,
    image: "/images/merch-cooler.png",
    category: "Gear",
  },
  {
    id: "orbit-grid-polo",
    name: "Grid Polo",
    description: "Technical fabric polo with ORBIT chest mark. Pit lane ready. Breathable, structured, and race-day approved.",
    price: 72,
    image: "/images/merch-polo.png",
    category: "Apparel",
    sizes: ["S", "M", "L", "XL", "XXL"],
  },
  {
    id: "orbit-hydra-bottle",
    name: "Hydra Bottle",
    description: "Insulated stainless steel bottle with ORBIT mark. Keeps cold for 24 hours. Matte black finish.",
    price: 34,
    image: "/images/merch-bottle.png",
    category: "Accessories",
  },
  {
    id: "orbit-core-tee",
    name: "ORBIT Core Tee",
    description: "Premium heavyweight cotton tee with minimal ORBIT wordmark. Clean, understated design for the post-quantum era.",
    price: 48,
    image: "/images/merch-tshirt.png",
    category: "Apparel",
    sizes: ["S", "M", "L", "XL", "XXL"],
  },
  {
    id: "orbit-debrief-mug",
    name: "Debrief Mug",
    description: "Matte black ceramic mug with ORBIT wordmark. For post-race debriefs and late-night protocol reviews.",
    price: 24,
    image: "/images/merch-mug.png",
    category: "Accessories",
  },
  {
    id: "orbit-command-cap",
    name: "Command Cap",
    description: "Structured snapback with woven ORBIT patch. Low-profile design. Built for mission commanders.",
    price: 38,
    image: "/images/merch-hat.png",
    category: "Accessories",
  },
  {
    id: "orbit-trucker-orange",
    name: "Blaze Trucker",
    description: "High-visibility orange front panel trucker with black mesh back. Rubber ORBIT badge. Stands out on race day.",
    price: 36,
    image: "/images/merch-trucker-orange.png",
    category: "Accessories",
  },
  {
    id: "orbit-soft-cooler",
    name: "Reentry Soft Cooler",
    description: "Insulated soft cooler with ORBIT woven patch. Leak-proof liner. Shoulder strap. 24-can capacity. Tailgate and paddock ready.",
    price: 78,
    image: "/images/merch-soft-cooler.png",
    category: "Gear",
  },
  {
    id: "orbit-tumbler",
    name: "G-Force Tumbler",
    description: "30oz vacuum-insulated tumbler with ORBIT orbital ring lid. Keeps drinks cold 12 hours, hot 6. Matte black with orange seal.",
    price: 38,
    image: "/images/merch-tumbler.png",
    category: "Accessories",
  },
  {
    id: "orbit-bomber",
    name: "Reentry Bomber",
    description: "Quilted bomber jacket with ORBIT chest patch and sleeve insignia. Satin shell, ribbed cuffs. Pit lane heritage.",
    price: 195,
    image: "/images/merch-bomber.png",
    category: "Apparel",
    sizes: ["S", "M", "L", "XL", "XXL"],
  },
  {
    id: "orbit-racing-gloves",
    name: "Grid Gloves",
    description: "Touchscreen-compatible racing-style gloves with ORBIT knuckle print. Synthetic leather palms. Track-day grip.",
    price: 54,
    image: "/images/merch-gloves.png",
    category: "Gear",
  },
  {
    id: "orbit-desk-mat",
    name: "Command Desk Mat",
    description: "Oversized desk mat with ORBIT orbital schematic print. Stitched edges. Non-slip rubber base. 900x400mm.",
    price: 42,
    image: "/images/merch-deskmat.png",
    category: "Collectibles",
  },
  {
    id: "orbit-pin-set",
    name: "Mission Pin Set",
    description: "Set of 4 enamel pins: ORBIT logo, agent badge, $ORB token, and X402 protocol mark. Collector-grade. Display case included.",
    price: 28,
    image: "/images/merch-pins-set.png",
    category: "Collectibles",
  },
  {
    id: "orbit-flask",
    name: "Fuel Flask",
    description: "8oz matte black stainless steel flask with ORBIT insignia. Leakproof cap. Wrapped in ballistic nylon sleeve.",
    price: 32,
    image: "/images/merch-flask.png",
    category: "Accessories",
  },
  {
    id: "orbit-duffel",
    name: "Transit Duffel",
    description: "Ballistic nylon duffel with ORBIT woven tag. Shoe compartment, padded straps. Built for race weekends and deployments.",
    price: 168,
    image: "/images/merch-duffel.png",
    category: "Gear",
  },
  {
    id: "orbit-watch-cap",
    name: "Night Ops Beanie",
    description: "Ribbed merino wool watch cap with woven ORBIT tab. Low-key warmth for cold server rooms and late-night deploys.",
    price: 32,
    image: "/images/merch-beanie.png",
    category: "Accessories",
  },
  {
    id: "orbit-socks",
    name: "Telemetry Socks",
    description: "Crew-length performance socks with ORBIT data-stream pattern. Cushioned sole. Moisture-wicking. 3-pack.",
    price: 28,
    image: "/images/merch-socks.png",
    category: "Apparel",
    sizes: ["S/M", "L/XL"],
  },
  {
    id: "orbit-koozie",
    name: "Throttle Koozie",
    description: "Neoprene can koozie with ORBIT embossed logo. Collapsible. Fits standard 12oz cans. Race-day hydration.",
    price: 8,
    image: "/images/merch-koozie.png",
    category: "Accessories",
  },
  {
    id: "orbit-towel",
    name: "Pit Towel",
    description: "Oversized microfiber towel with ORBIT wordmark stripe. Quick-dry. 30x60 inches. Track, pool, or mission control.",
    price: 34,
    image: "/images/merch-towel.png",
    category: "Gear",
  },
  {
    id: "orbit-sticker-pack",
    name: "Protocol Sticker Pack",
    description: "Set of 12 die-cut vinyl stickers. ORBIT logos, agent icons, protocol marks. Laptop and helmet ready.",
    price: 12,
    image: "/images/merch-stickers.png",
    category: "Collectibles",
  },
  {
    id: "orbit-poster",
    name: "Orbital Poster",
    description: "Limited edition 24x36 poster featuring ORBIT orbital diagram on heavyweight matte stock. Numbered series.",
    price: 36,
    image: "/images/merch-poster.png",
    category: "Collectibles",
  },
  {
    id: "orbit-model",
    name: "Satellite Model",
    description: "1:48 scale die-cast ORBIT satellite replica. Articulated solar panels. Display stand included. Collector edition.",
    price: 125,
    image: "/images/merch-satellite.png",
    category: "Collectibles",
  },
];

const categories = ["All", "Apparel", "Accessories", "Gear", "Collectibles"];

export default function Merch() {
  useSEO({ title: "Merchandise", description: "Mission-ready ORBIT gear. Premium apparel, accessories, and collectibles for the machine economy." });
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All"
      ? merchItems
      : merchItems.filter((m) => m.category === activeCategory);

  return (
    <div className="min-h-screen pt-20 lg:pt-32 pb-16 lg:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase mb-3 block" data-testid="text-merch-label">
            Official Gear
          </span>
          <h1 className="font-display font-bold text-3xl lg:text-6xl tracking-tight mb-4" data-testid="text-merch-title">
            Merchandise
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed mb-4">
            Premium gear for builders of the machine economy. Mission-ready.
          </p>
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-mono tracking-wider border border-orange-500/30 bg-orange-500/10 text-orange-500" data-testid="badge-coming-soon">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
            COMING SOON
          </span>
        </motion.div>

        <div className="flex items-center justify-center gap-2 mb-12 flex-wrap" data-testid="merch-categories">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={activeCategory === cat ? "default" : "secondary"}
              size="sm"
              onClick={() => setActiveCategory(cat)}
              data-testid={`button-category-${cat.toLowerCase().replace(/\s/g, "-")}`}
            >
              {cat}
            </Button>
          ))}
        </div>

        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {filtered.map((item, i) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              className="group rounded-md border border-border/50 bg-card/50 dark:bg-white/[0.02] overflow-visible hover-elevate"
              data-testid={`card-merch-${item.id}`}
            >
              <div className="relative aspect-[3/4] bg-muted/20 dark:bg-black/40 rounded-t-md overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  data-testid={`img-merch-${item.id}`}
                />
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-display font-semibold text-base tracking-tight" data-testid={`text-name-${item.id}`}>
                    {item.name}
                  </h3>
                  <span className="font-display font-bold text-lg flex-shrink-0" data-testid={`text-price-${item.id}`}>
                    ${item.price}
                  </span>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed mb-4" data-testid={`text-desc-${item.id}`}>
                  {item.description}
                </p>

                {item.sizes && (
                  <div className="flex items-center gap-1.5 mb-4 flex-wrap" data-testid={`sizes-${item.id}`}>
                    {item.sizes.map((size) => (
                      <span
                        key={size}
                        className="w-8 h-8 rounded-md border border-border/50 bg-muted/30 text-[10px] font-mono font-medium flex items-center justify-center text-muted-foreground"
                      >
                        {size}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-3 h-3 fill-orange-500 text-orange-500" />
                  ))}
                  <span className="text-[10px] text-muted-foreground ml-1">(4.9)</span>
                </div>

                <Button className="w-full" size="sm" data-testid={`button-add-${item.id}`}>
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Notify Me
                </Button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24 text-center"
          data-testid="section-merch-footer"
        >
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            All merchandise is premium quality. Black-on-black everything. Designed in collaboration with mission control. Ships worldwide.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
