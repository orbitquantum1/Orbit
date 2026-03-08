import { useSEO } from "@/hooks/use-seo";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useCallback, useEffect } from "react";
import {
  Download,
  Share2,
  Image,
  Video,
  Palette,
  Sparkles,
  Copy,
  Check,
  Type,
  Layers,
  Rocket,
  Shield,
  Bot,
  Coins,
  TrendingUp,
  Zap,
  Globe,
  Lock,
  ExternalLink,
  ShoppingBag,
} from "lucide-react";
import { SiX, SiDiscord } from "react-icons/si";
import socialHeroPath from "@assets/generated_images/orbit_social_hero.png";
import socialNetworkPath from "@assets/generated_images/orbit_social_network.png";
import socialAbstractPath from "@assets/generated_images/orbit_social_abstract.png";
import socialAgentsPath from "@assets/generated_images/orbit_social_agents.png";
import socialTreasuryPath from "@assets/generated_images/orbit_social_treasury_v4.png";
import socialSpacemanPath from "@assets/generated_images/orbit_social_spaceman.png";
import stockAstronautPath from "@assets/generated_images/astro_dark_float.png";
import stockRocketPath from "@assets/generated_images/astro_dark_launch.png";
import stockStationPath from "@assets/generated_images/astro_dark_station.png";
import stockHelmetPath from "@assets/generated_images/astro_dark_visor.png";
import socialNeuralPath from "@assets/generated_images/social_neural.png";
import socialCrystalPath from "@assets/generated_images/social_crystal.png";
import socialTopoPath from "@assets/generated_images/social_topo.png";
import socialLaserPath from "@assets/generated_images/social_laser.png";
import socialCarbonPath from "@assets/generated_images/social_carbon.png";
import socialVaultPath from "@assets/generated_images/social_vault.png";
import socialGridPath from "@assets/generated_images/social_grid.png";
import socialTitaniumPath from "@assets/generated_images/social_titanium.png";
import memeDarkSuitPath from "@assets/generated_images/meme_dark_suit.png";
import memeDarkTradingPath from "@assets/generated_images/meme_dark_trading.png";
import memeDarkSkylinePath from "@assets/generated_images/meme_dark_skyline.png";
import memeDarkWealthPath from "@assets/generated_images/meme_dark_wealth.png";
import memeDarkBullPath from "@assets/generated_images/meme_dark_bull.png";
import memeDarkCorridorPath from "@assets/generated_images/meme_dark_corridor.png";

const shareableTweets = [
  {
    id: "fair-launch",
    icon: Rocket,
    category: "Launch",
    text: "$ORB is launching 100% fair on @base via @bankrbot. No presale. No VC. No insider rounds. 100 billion tokens, all public from day one. The transaction layer for AI agents and the robot economy.",
    color: "text-orange-400",
  },
  {
    id: "treasury",
    icon: Shield,
    category: "Treasury",
    text: "The ORBIT Treasury is governed entirely by an AI Treasury Manager on @base.\n\nIt autonomously executes buy and burn, vault positions, trading, and yield strategies.\n\nHardened against prompt injection. No human identity attached. No funds distributed to individuals.\n\n$ORB via @bankrbot.",
    color: "text-green-400",
  },
  {
    id: "agents",
    icon: Bot,
    category: "AI Agents",
    text: "AI agents and robots will outnumber people. Every single one will need identity, wallets, payments, and registry functionality.\n\n$ORB provides the transaction layer on @base.\n\nFair launch via @bankrbot.",
    color: "text-blue-400",
  },
  {
    id: "buy-burn",
    icon: Coins,
    category: "Buy and Burn",
    text: "The majority of all ORBIT Treasury revenue is used to market-buy and permanently burn $ORB on @base.\n\nReduced supply. Increased value. Higher volume. Higher tax revenue. The cycle repeats.\n\nFair launch via @bankrbot.",
    color: "text-orange-500",
  },
  {
    id: "revenue",
    icon: TrendingUp,
    category: "Revenue",
    text: "ORBIT generates revenue from day one on @base.\n\n1% buy/sell tax. 11 protocol fee streams. Autonomous AI Treasury Manager deploying capital 24/7.\n\nThis is not a promise. It is architecture.\n\n$ORB via @bankrbot.",
    color: "text-purple-400",
  },
  {
    id: "quantum",
    icon: Lock,
    category: "Security",
    text: "Every transaction on ORBIT is secured with post-quantum cryptographic primitives.\n\nCRYSTALS-Kyber. CRYSTALS-Dilithium. SPHINCS+.\n\nWhen quantum computers arrive, every $ORB transaction ever settled will remain secure.\n\nOn @base via @bankrbot.",
    color: "text-cyan-400",
  },
  {
    id: "sovereign",
    icon: Globe,
    category: "Sovereignty",
    text: "ORBIT is decentralized from government currency censorship and surveillance.\n\nNo state actor can freeze agent wallets, censor transactions, or seize funds. Agent identities are self-sovereign.\n\n$ORB on @base via @bankrbot.",
    color: "text-yellow-400",
  },
  {
    id: "vault",
    icon: Layers,
    category: "ORBIT Vault",
    text: "The ORBIT Vault holds 11 tokens: $ORB $ETH $BTC $POL $FELIX $KELLYCLAUDE $DRB $ANTIHUNTER $BANKR $BNKRWALLET $CLAWD.\n\nLong-hold positions across the @base agent economy.\n\n@felix_on_base @kellyclaude_ @bankrbot @claborr",
    color: "text-orange-400",
  },
  {
    id: "flywheel",
    icon: Zap,
    category: "Flywheel",
    text: "Agents need wallets. Wallets need identity. Identity enables marketplace. Marketplace generates fees. Fees buy back $ORB.\n\nThe ORBIT revenue flywheel is self-reinforcing.\n\nFair launch on @base via @bankrbot.",
    color: "text-green-400",
  },
];

const discordPosts = [
  {
    id: "gm-orbit",
    icon: Rocket,
    category: "GM Post",
    title: "gm to the machine economy",
    text: "gm orbiters\n\nQuick rundown if you are new here:\n\n$ORB is the transaction layer for AI agents and robots on Base. 100B supply, 100% fair launch via @bankrbot. No presale, no VC, no insiders.\n\nThe ORBIT Treasury is managed entirely by an AI Treasury Manager. Buy and burn. Vault positions. Yield strategies. No human wallet access.\n\nIf you believe autonomous agents will outnumber humans, you are in the right place.\n\nLFG",
    color: "text-orange-400",
  },
  {
    id: "what-is-orbit",
    icon: Globe,
    category: "Explainer",
    title: "What is ORBIT Protocol?",
    text: "For anyone asking \"what does ORBIT actually do?\"\n\nEvery AI agent and robot needs four things:\n1. A wallet to hold and send money\n2. An identity so other machines trust it\n3. A registry so it can be discovered and hired\n4. A payment rail to settle transactions\n\nORBIT provides all four. On Base. With post-quantum security.\n\nThe majority of protocol revenue goes to buy and burn $ORB. The treasury is run by AI. No team allocation.\n\nWhite paper, live API, and 66+ agents already registered at orbitprotocol.replit.app",
    color: "text-blue-400",
  },
  {
    id: "treasury-deep-dive",
    icon: Shield,
    category: "Alpha",
    title: "Treasury Deep Dive",
    text: "The ORBIT Vault currently holds 11 tokens:\n\n$ORB $ETH $BTC $POL $FELIX $KELLYCLAUDE $DRB $ANTIHUNTER $BANKR $BNKRWALLET $CLAWD\n\nThe AI Treasury Manager executes:\n- Buy and burn cycles (reducing $ORB supply)\n- Long-hold vault positions across the Base agent economy\n- Yield strategies and active trading\n- Crypto bot deployment and prediction markets\n\nAll autonomous. No human touches the funds. Hardened against prompt injection.\n\nThis is what decentralized treasury management looks like.",
    color: "text-green-400",
  },
  {
    id: "dev-callout",
    icon: Bot,
    category: "Builders",
    title: "Calling All Builders",
    text: "Devs, this one is for you.\n\nORBIT has live SDKs (TypeScript + Python), an MCP server for Claude/Cursor, and framework integrations for LangChain, CrewAI, and AutoGPT.\n\nOne API call registers your agent, generates a wallet, and mints an ERC-8004 identity.\n\n```\ncurl -X POST /api/registry/onboard \\\n  -d '{\"name\": \"my-agent\", \"entityType\": \"AI Agent\"}'\n```\n\n40+ live endpoints. Full docs at orbitprotocol.replit.app/developers\n\nBuild something. Ship it. Get listed in the registry.",
    color: "text-purple-400",
  },
  {
    id: "fair-launch-hype",
    icon: Coins,
    category: "Launch",
    title: "Fair Launch Incoming",
    text: "$ORB fair launch on Base via @bankrbot.\n\n100,000,000,000 tokens. Zero held back.\n\nNo presale rounds. No VC deals. No insider allocations. No team wallets. Everyone enters at the same price, at the same time.\n\nThe AI Treasury Manager takes over from there. Autonomous buy and burn, vault management, and yield generation.\n\nSet your alerts. This is the one you have been waiting for.",
    color: "text-orange-500",
  },
  {
    id: "quantum-security",
    icon: Lock,
    category: "Security",
    title: "Post-Quantum Security",
    text: "When quantum computers arrive, most blockchains are cooked.\n\nORBIT is already secured with:\n- CRYSTALS-Kyber (key encapsulation)\n- CRYSTALS-Dilithium (digital signatures)\n- SPHINCS+ (hash-based backup signatures)\n\nEvery $ORB transaction ever settled will remain unbreakable. Every agent identity, every wallet, every payment.\n\nThis is not a future roadmap item. It is live infrastructure.\n\nNFA/DYOR but quantum-safe is non-negotiable.",
    color: "text-cyan-400",
  },
];

const socialTiles = [
  {
    id: "hero",
    image: socialHeroPath,
    title: "ORBIT Protocol",
    subtitle: "The Transaction Layer for AI Agents",
    aspect: "square",
  },
  {
    id: "astronaut",
    image: stockAstronautPath,
    title: "Beyond Earth",
    subtitle: "Autonomous agents in orbit.",
    aspect: "square",
  },
  {
    id: "rocket",
    image: stockRocketPath,
    title: "Launch Sequence",
    subtitle: "$ORB fair launch on Base.",
    aspect: "square",
  },
  {
    id: "agents",
    image: socialAgentsPath,
    title: "AI Agent Economy",
    subtitle: "Billions of agents. One transaction layer.",
    aspect: "square",
  },
  {
    id: "network",
    image: socialNetworkPath,
    title: "Agent Network",
    subtitle: "Connected. Autonomous. Sovereign.",
    aspect: "square",
  },
  {
    id: "spaceman",
    image: socialSpacemanPath,
    title: "The Final Frontier",
    subtitle: "Space infrastructure coordination.",
    aspect: "square",
  },
  {
    id: "treasury",
    image: socialTreasuryPath,
    title: "ORBIT Treasury",
    subtitle: "AI-governed. Risk-hardened. Autonomous.",
    aspect: "square",
  },
  {
    id: "titanium",
    image: socialTitaniumPath,
    title: "Forged in Precision",
    subtitle: "Aerospace-grade infrastructure.",
    aspect: "square",
  },
  {
    id: "station",
    image: stockStationPath,
    title: "Orbital Infrastructure",
    subtitle: "The network that never sleeps.",
    aspect: "square",
  },
  {
    id: "helmet",
    image: stockHelmetPath,
    title: "Eyes on the Horizon",
    subtitle: "Built for what comes next.",
    aspect: "square",
  },
  {
    id: "neural",
    image: socialNeuralPath,
    title: "Neural Pathways",
    subtitle: "Agent intelligence, decentralized.",
    aspect: "square",
  },
  {
    id: "crystal",
    image: socialCrystalPath,
    title: "Crystalline Security",
    subtitle: "Post-quantum cryptographic primitives.",
    aspect: "square",
  },
  {
    id: "topo",
    image: socialTopoPath,
    title: "Market Topology",
    subtitle: "Mapping the agent economy.",
    aspect: "square",
  },
  {
    id: "laser",
    image: socialLaserPath,
    title: "Precision Settlement",
    subtitle: "Every transaction, verified.",
    aspect: "square",
  },
  {
    id: "carbon",
    image: socialCarbonPath,
    title: "Engineered Performance",
    subtitle: "Built like a McLaren. Runs like a protocol.",
    aspect: "square",
  },
  {
    id: "vault",
    image: socialVaultPath,
    title: "The Vault",
    subtitle: "Where autonomous capital lives.",
    aspect: "square",
  },
  {
    id: "grid",
    image: socialGridPath,
    title: "Infinite Depth",
    subtitle: "Protocol-level transaction architecture.",
    aspect: "square",
  },
  {
    id: "abstract",
    image: socialAbstractPath,
    title: "$ORB Token",
    subtitle: "100% Fair Launch on Base",
    aspect: "square",
  },
];

const merchPostItems = [
  { id: "hoodie", name: "Mission Control Hoodie", description: "Ultra-soft fleece hoodie with embroidered ORBIT insignia. Built for long sessions coordinating the agent economy.", price: 98, category: "Apparel", image: "/images/merch-hoodie.png" },
  { id: "helmet", name: "Visor Helmet", description: "Matte black helmet with ORBIT branding. Full-face protection. Track-inspired. Statement piece.", price: 320, category: "Gear", image: "/images/merch-helmet.png" },
  { id: "cooler", name: "Cryo Cooler", description: "36-can hard-shell cooler with ORBIT laser-etched badge. 48-hour ice retention. Stainless steel latches.", price: 225, category: "Gear", image: "/images/merch-cooler.png" },
  { id: "bomber", name: "Reentry Bomber", description: "Quilted bomber jacket with ORBIT chest patch and sleeve insignia. Satin shell, ribbed cuffs. Pit lane heritage.", price: 195, category: "Apparel", image: "/images/merch-bomber.png" },
  { id: "sunglasses", name: "Horizon Shades", description: "Polarized matte black sunglasses with orange mirror lenses. Lightweight titanium frame. ORBIT wordmark on temple.", price: 145, category: "Accessories", image: "/images/merch-sunglasses.png" },
  { id: "backpack", name: "Mission Pack", description: "Technical backpack with ORBIT woven patch. Padded laptop compartment. Built for race weekends and deployments.", price: 145, category: "Gear", image: "/images/merch-backpack.png" },
  { id: "tee", name: "ORBIT Core Tee", description: "Premium heavyweight cotton tee with minimal ORBIT wordmark. Clean, understated design for the post-quantum era.", price: 48, category: "Apparel", image: "/images/merch-tshirt.png" },
  { id: "pins", name: "Mission Pin Set", description: "Set of 4 enamel pins: ORBIT logo, agent badge, $ORB token, and X402 protocol mark. Collector-grade.", price: 28, category: "Collectibles", image: "/images/merch-pins-set.png" },
  { id: "deskmat", name: "Command Desk Mat", description: "Oversized desk mat with ORBIT orbital schematic print. Stitched edges. Non-slip rubber base. 900x400mm.", price: 42, category: "Collectibles", image: "/images/merch-deskmat.png" },
];

const memeTemplates = [
  {
    id: "agents-wallet",
    topText: "Every AI agent needs a wallet.",
    bottomText: "$ORB is the transaction layer.",
    accent: "border-l-orange-500",
  },
  {
    id: "fair-launch",
    topText: "No presale. No VC. No insiders.",
    bottomText: "Just $ORB and the open market.",
    accent: "border-l-orange-400",
  },
  {
    id: "buy-burn",
    topText: "Revenue buys $ORB.",
    bottomText: "Then burns it. Forever.",
    accent: "border-l-orange-600",
  },
  {
    id: "quantum",
    topText: "Quantum computers are coming.",
    bottomText: "$ORB is already quantum-safe.",
    accent: "border-l-white",
  },
  {
    id: "treasury-ai",
    topText: "No human touches the treasury.",
    bottomText: "AI manages $ORB autonomously.",
    accent: "border-l-orange-400",
  },
  {
    id: "robot-economy",
    topText: "The robot economy is here.",
    bottomText: "$ORB powers every transaction.",
    accent: "border-l-white",
  },
  {
    id: "billion-agents",
    topText: "Billions of agents. One protocol.",
    bottomText: "$ORB.",
    accent: "border-l-orange-600",
  },
  {
    id: "spaceman",
    topText: "Ground control to $ORB.",
    bottomText: "We have liftoff.",
    accent: "border-l-orange-500",
  },
  {
    id: "base-native",
    topText: "Built on Base. Settled on-chain.",
    bottomText: "$ORB is machine-native money.",
    accent: "border-l-orange-400",
  },
];

function TweetTile({ tweet, index }: { tweet: typeof shareableTweets[0]; index: number }) {
  const [copied, setCopied] = useState(false);
  const IconComponent = tweet.icon;

  const shareOnX = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet.text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const copyText = () => {
    navigator.clipboard.writeText(tweet.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className="border-border/50 bg-card/50 dark:bg-white/[0.02] p-5 h-full flex flex-col" data-testid={`tweet-tile-${tweet.id}`}>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-md bg-orange-500/10 flex items-center justify-center">
            <IconComponent className={`w-3.5 h-3.5 ${tweet.color}`} />
          </div>
          <Badge variant="outline" className="text-[10px] border-border/50">{tweet.category}</Badge>
        </div>
        <p className="text-sm text-white/80 leading-relaxed flex-1 mb-4">{tweet.text}</p>
        <div className="flex items-center gap-2">
          <button
            onClick={shareOnX}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/[0.03] border border-white/10 text-xs text-white/70 hover:text-white hover:border-orange-500/30 hover:bg-orange-500/5 transition-all"
            data-testid={`button-share-tweet-${tweet.id}`}
          >
            <SiX className="w-3 h-3" /> Post on X
          </button>
          <button
            onClick={copyText}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/[0.03] border border-white/10 text-xs text-white/70 hover:text-white hover:border-white/30 transition-all"
            data-testid={`button-copy-tweet-${tweet.id}`}
          >
            {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </Card>
    </motion.div>
  );
}

function ImageTile({ tile, index }: { tile: typeof socialTiles[0]; index: number }) {
  const downloadImage = useCallback(() => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 1080;
      canvas.height = 1080;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const scale = Math.max(1080 / img.width, 1080 / img.height);
      const w = img.width * scale;
      const h = img.height * scale;
      ctx.drawImage(img, (1080 - w) / 2, (1080 - h) / 2, w, h);

      const grad = ctx.createLinearGradient(0, 700, 0, 1080);
      grad.addColorStop(0, "rgba(0,0,0,0)");
      grad.addColorStop(0.4, "rgba(0,0,0,0.6)");
      grad.addColorStop(1, "rgba(0,0,0,0.85)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 700, 1080, 380);

      ctx.textAlign = "left";
      ctx.fillStyle = "#ffffff";
      ctx.font = "700 36px system-ui, -apple-system, sans-serif";
      ctx.fillText(tile.title, 50, 960);
      ctx.fillStyle = "rgba(255,255,255,0.6)";
      ctx.font = "400 18px system-ui, -apple-system, sans-serif";
      ctx.fillText(tile.subtitle, 50, 995);

      ctx.textAlign = "right";
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 22px system-ui, -apple-system, sans-serif";
      ctx.fillText("$ORB", 1030, 1040);

      const url = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = `ORB_${tile.id}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };
    img.src = tile.image;
  }, [tile]);

  const shareOnX = () => {
    const text = `${tile.title} -- ${tile.subtitle}\n\n$ORB | The Transaction Layer for AI Agents & The Robot Economy`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06 }}
      className={tile.aspect === "wide" ? "sm:col-span-2" : ""}
    >
      <Card className="border-border/50 bg-card/50 dark:bg-white/[0.02] overflow-hidden group" data-testid={`image-tile-${tile.id}`}>
        <div className="relative">
          <img
            src={tile.image}
            alt={tile.title}
            className="w-full h-48 sm:h-56 object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-3">
            <h3 className="font-display font-semibold text-sm text-white leading-tight">{tile.title}</h3>
            <p className="text-[10px] text-white/50">{tile.subtitle}</p>
          </div>
          <div className="absolute bottom-3 right-3">
            <span className="text-white font-bold text-xs">$ORB</span>
          </div>
          <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={downloadImage}
              className="p-2 rounded-md bg-black/60 border border-white/10 text-white/70 hover:text-white hover:bg-black/80 transition-all"
              data-testid={`button-download-image-${tile.id}`}
              title="Download 1080x1080 PNG"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={shareOnX}
              className="p-2 rounded-md bg-orange-500/80 border border-orange-400/30 text-white hover:bg-orange-500 transition-all"
              data-testid={`button-share-image-${tile.id}`}
              title="Post on X"
            >
              <SiX className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

function MemeCard({ meme, index }: { meme: typeof memeTemplates[0]; index: number }) {
  const downloadMeme = useCallback(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1080;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#050505";
    ctx.fillRect(0, 0, 1080, 1080);

    ctx.fillStyle = "#f97316";
    ctx.fillRect(0, 0, 6, 1080);

    const wrapText = (text: string, maxWidth: number, font: string) => {
      ctx.font = font;
      const words = text.split(" ");
      const lines: string[] = [];
      let line = "";
      for (const word of words) {
        const test = line ? `${line} ${word}` : word;
        if (ctx.measureText(test).width > maxWidth) {
          if (line) lines.push(line);
          line = word;
        } else {
          line = test;
        }
      }
      if (line) lines.push(line);
      return lines;
    };

    ctx.textAlign = "left";
    const topFont = "500 28px system-ui, -apple-system, sans-serif";
    const topLines = wrapText(meme.topText, 900, topFont);
    topLines.forEach((line, i) => {
      const y = 380 + i * 40;
      const parts = line.split(/(\$ORB)/g);
      let x = 60;
      ctx.font = topFont;
      parts.forEach((part) => {
        ctx.fillStyle = part === "$ORB" ? "#ffffff" : "rgba(255, 255, 255, 0.5)";
        ctx.font = part === "$ORB" ? "700 28px system-ui, -apple-system, sans-serif" : topFont;
        ctx.fillText(part, x, y);
        x += ctx.measureText(part).width;
      });
    });

    ctx.fillStyle = "#ffffff";
    ctx.font = "800 72px system-ui, -apple-system, sans-serif";
    const bottomLines = wrapText(meme.bottomText, 900, "800 72px system-ui, -apple-system, sans-serif");
    const bottomStartY = 380 + topLines.length * 40 + 30;
    bottomLines.forEach((line, i) => {
      ctx.fillText(line, 60, bottomStartY + i * 86);
    });

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 18px system-ui, -apple-system, sans-serif";
    ctx.fillText("$ORB", 60, 980);
    ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
    ctx.font = "400 14px system-ui, -apple-system, sans-serif";
    ctx.fillText("ORBIT PROTOCOL", 116, 980);

    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `ORBIT_${meme.id}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, [meme]);

  const shareOnX = () => {
    const text = `${meme.topText}\n\n${meme.bottomText}\n\n$ORB | ORBIT Protocol`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.04 }}
    >
      <Card className={`border-border/50 bg-[#050505] overflow-hidden border-l-[3px] ${meme.accent} hover:border-l-orange-400 transition-all group`} data-testid={`meme-card-${meme.id}`}>
        <div className="p-6 min-h-[200px] flex flex-col justify-between">
          <div>
            <p className="text-white/50 text-sm font-medium mb-2 leading-relaxed">
              {meme.topText.split(/(\$ORB)/g).map((part, i) =>
                part === "$ORB" ? <span key={i} className="text-white font-bold">{part}</span> : part
              )}
            </p>
            <p className="text-white font-extrabold text-2xl sm:text-3xl leading-tight tracking-tight">
              {meme.bottomText.split(/(\$ORB)/g).map((part, i) =>
                part === "$ORB" ? <span key={i} className="text-white drop-shadow-[0_0_8px_rgba(249,115,22,0.5)]">{part}</span> : part
              )}
            </p>
          </div>
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/[0.04]">
            <span className="font-mono text-[10px] tracking-wider"><span className="text-white/50 font-semibold">$ORB</span> <span className="text-white/15">| ORBIT PROTOCOL</span></span>
            <div className="flex items-center gap-2">
              <button
                onClick={downloadMeme}
                className="p-2 rounded-md bg-white/[0.03] border border-white/[0.06] text-white/30 hover:text-orange-400 hover:border-orange-500/30 transition-all opacity-0 group-hover:opacity-100"
                data-testid={`button-download-meme-${meme.id}`}
              >
                <Download className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={shareOnX}
                className="p-2 rounded-md bg-white/[0.03] border border-white/[0.06] text-white/30 hover:text-orange-400 hover:border-orange-500/30 transition-all opacity-0 group-hover:opacity-100"
                data-testid={`button-share-meme-${meme.id}`}
              >
                <SiX className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

function CustomTileGenerator() {
  const [headline, setHeadline] = useState("$ORB");
  const [subtext, setSubtext] = useState("The Transaction Layer for AI Agents");
  const [style, setStyle] = useState<"dark" | "orange" | "gradient">("dark");

  const generateAndDownload = useCallback(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 630;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (style === "dark") {
      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(0, 0, 1200, 630);
      ctx.fillStyle = "#f97316";
      ctx.fillRect(0, 0, 1200, 4);
    } else if (style === "orange") {
      const grad = ctx.createLinearGradient(0, 0, 1200, 630);
      grad.addColorStop(0, "#f97316");
      grad.addColorStop(1, "#ea580c");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1200, 630);
    } else {
      const grad = ctx.createLinearGradient(0, 0, 1200, 630);
      grad.addColorStop(0, "#0a0a0a");
      grad.addColorStop(0.5, "#1a0a00");
      grad.addColorStop(1, "#0a0a0a");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1200, 630);
      ctx.fillStyle = "#f97316";
      ctx.fillRect(0, 0, 1200, 4);
    }

    ctx.textAlign = "center";

    if (style === "orange") {
      ctx.fillStyle = "#000000";
    } else {
      ctx.fillStyle = "#ffffff";
    }
    ctx.font = "bold 64px system-ui, -apple-system, sans-serif";

    const headlineWords = headline.split(" ");
    let lines: string[] = [];
    let currentLine = "";
    for (const word of headlineWords) {
      const test = currentLine ? `${currentLine} ${word}` : word;
      if (ctx.measureText(test).width > 1000) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = test;
      }
    }
    if (currentLine) lines.push(currentLine);

    const headlineY = 240 - ((lines.length - 1) * 35);
    lines.forEach((line, i) => {
      ctx.fillText(line, 600, headlineY + i * 72);
    });

    if (style === "orange") {
      ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
    } else {
      ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
    }
    ctx.font = "24px system-ui, -apple-system, sans-serif";
    ctx.fillText(subtext, 600, headlineY + lines.length * 72 + 20);

    if (style === "orange") {
      ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
    } else {
      ctx.fillStyle = "rgba(249, 115, 22, 0.6)";
    }
    ctx.font = "bold 20px system-ui, -apple-system, sans-serif";
    ctx.fillText("ORBIT PROTOCOL", 600, 570);

    if (style === "orange") {
      ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
    } else {
      ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
    }
    ctx.font = "14px system-ui, -apple-system, sans-serif";
    ctx.fillText("The Transaction Layer for AI Agents & The Robot Economy", 600, 600);

    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = "ORBIT_custom_tile.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, [headline, subtext, style]);

  const shareOnX = () => {
    const text = `${headline}\n\n${subtext}\n\n$ORB | ORBIT Protocol`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <Card className="border-border/50 bg-card/50 dark:bg-white/[0.02] p-6" data-testid="custom-tile-generator">
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-white/60 mb-1.5 block">Headline</label>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-black/30 border border-border/30 text-sm text-white placeholder:text-white/20 focus:border-orange-500/50 focus:outline-none"
              placeholder="Your headline"
              maxLength={120}
              data-testid="input-tile-headline"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-white/60 mb-1.5 block">Subtext</label>
            <input
              type="text"
              value={subtext}
              onChange={(e) => setSubtext(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-black/30 border border-border/30 text-sm text-white placeholder:text-white/20 focus:border-orange-500/50 focus:outline-none"
              placeholder="Supporting text"
              maxLength={200}
              data-testid="input-tile-subtext"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-white/60 mb-1.5 block">Style</label>
            <div className="flex gap-2">
              {[
                { value: "dark" as const, label: "Dark", preview: "bg-black border-white/20" },
                { value: "orange" as const, label: "Orange", preview: "bg-orange-500 border-orange-400" },
                { value: "gradient" as const, label: "Gradient", preview: "bg-gradient-to-r from-black to-orange-950 border-orange-500/30" },
              ].map((s) => (
                <button
                  key={s.value}
                  onClick={() => setStyle(s.value)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md border text-xs transition-all ${
                    style === s.value
                      ? "border-orange-500 text-orange-400 bg-orange-500/10"
                      : "border-border/30 text-white/50 hover:border-white/20"
                  }`}
                  data-testid={`button-style-${s.value}`}
                >
                  <div className={`w-4 h-4 rounded-sm border ${s.preview}`} />
                  {s.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={generateAndDownload}
              className="flex items-center gap-2 px-4 py-2 rounded-md bg-orange-500 text-black text-sm font-semibold hover:bg-orange-400 transition-colors"
              data-testid="button-generate-tile"
            >
              <Download className="w-4 h-4" /> Download 1200x630 PNG
            </button>
            <button
              onClick={shareOnX}
              className="flex items-center gap-2 px-4 py-2 rounded-md bg-white/[0.03] border border-white/10 text-sm text-white/70 hover:text-white hover:border-orange-500/30 transition-all"
              data-testid="button-share-custom-tile"
            >
              <SiX className="w-3.5 h-3.5" /> Post on X
            </button>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <div
            className={`w-full max-w-[400px] aspect-[1200/630] rounded-md flex flex-col items-center justify-center p-6 border ${
              style === "dark"
                ? "bg-[#0a0a0a] border-white/10"
                : style === "orange"
                ? "bg-orange-500 border-orange-400"
                : "bg-gradient-to-br from-[#0a0a0a] via-[#1a0a00] to-[#0a0a0a] border-orange-500/20"
            }`}
          >
            <div className={`absolute top-0 left-0 right-0 h-0.5 ${style === "orange" ? "bg-black/20" : "bg-orange-500"} rounded-t-md`} />
            <p className={`font-bold text-xl text-center leading-tight mb-2 ${style === "orange" ? "text-black" : "text-white"}`}>
              {headline || "Your Headline"}
            </p>
            <p className={`text-xs text-center ${style === "orange" ? "text-black/50" : "text-white/40"}`}>
              {subtext || "Supporting text"}
            </p>
            <p className={`text-[10px] font-mono mt-4 ${style === "orange" ? "text-black/30" : "text-orange-500/50"}`}>
              ORBIT PROTOCOL
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}

const memeGenTemplates = [
  { id: "suit", image: memeDarkSuitPath, label: "The Closer" },
  { id: "trading", image: memeDarkTradingPath, label: "The Floor" },
  { id: "skyline", image: memeDarkSkylinePath, label: "The View" },
  { id: "wealth", image: memeDarkWealthPath, label: "The Play" },
  { id: "bull", image: memeDarkBullPath, label: "The Bull" },
  { id: "corridor", image: memeDarkCorridorPath, label: "The Walk" },
];

function MemeGenerator() {
  const [selectedTemplate, setSelectedTemplate] = useState(0);
  const [topLine, setTopLine] = useState("When someone says AI agents don't need wallets");
  const [bottomLine, setBottomLine] = useState("And you're already holding $ORB");

  const downloadMeme = useCallback(() => {
    const template = memeGenTemplates[selectedTemplate];
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 1080;
      canvas.height = 1080;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const scale = Math.max(1080 / img.width, 1080 / img.height);
      const w = img.width * scale;
      const h = img.height * scale;
      ctx.drawImage(img, (1080 - w) / 2, (1080 - h) / 2, w, h);

      ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
      ctx.fillRect(0, 0, 1080, 1080);

      ctx.textAlign = "center";
      ctx.strokeStyle = "rgba(0, 0, 0, 0.9)";
      ctx.lineWidth = 8;
      ctx.lineJoin = "round";

      const wrapText = (text: string, maxWidth: number) => {
        const words = text.toUpperCase().split(" ");
        const lines: string[] = [];
        let line = "";
        for (const word of words) {
          const test = line ? `${line} ${word}` : word;
          if (ctx.measureText(test).width > maxWidth) {
            if (line) lines.push(line);
            line = word;
          } else {
            line = test;
          }
        }
        if (line) lines.push(line);
        return lines;
      };

      ctx.font = "900 52px Impact, system-ui, sans-serif";
      ctx.fillStyle = "#ffffff";
      const topLines = wrapText(topLine, 950);
      topLines.forEach((line, i) => {
        const y = 80 + i * 64;
        ctx.strokeText(line, 540, y);
        ctx.fillText(line, 540, y);
      });

      const bottomLines = wrapText(bottomLine, 950);
      const startY = 1040 - (bottomLines.length * 64);
      bottomLines.forEach((line, i) => {
        const y = startY + i * 64;
        ctx.strokeText(line, 540, y);
        ctx.fillText(line, 540, y);
      });

      const url = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = `ORBIT_meme_custom.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };
    img.src = template.image;
  }, [selectedTemplate, topLine, bottomLine]);

  const shareOnX = () => {
    const text = `${topLine}\n\n${bottomLine}\n\n$ORB | ORBIT Protocol`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const template = memeGenTemplates[selectedTemplate];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mb-16"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-md bg-orange-500/10 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-orange-500" />
        </div>
        <h2 className="font-display font-semibold text-lg" data-testid="text-memegen-heading">Meme Generator</h2>
        <Badge variant="outline" className="border-green-500/50 text-green-400 text-[10px] ml-auto">Interactive</Badge>
      </div>
      <p className="text-xs text-muted-foreground mb-6">
        Pick a template, write your lines, and download a ready-to-post meme. Classic impact font, cinematic backgrounds.
      </p>
      <Card className="border-border/50 bg-card/50 dark:bg-white/[0.02] overflow-hidden" data-testid="meme-generator">
        <div className="grid lg:grid-cols-2">
          <div className="relative aspect-square max-h-[500px] overflow-hidden">
            <img
              src={template.image}
              alt={template.label}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/35" />
            <div className="absolute top-0 left-0 right-0 p-6">
              <p className="text-white font-black text-xl sm:text-2xl text-center uppercase tracking-wide drop-shadow-lg" style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.9), -1px -1px 2px rgba(0,0,0,0.9)" }}>
                {topLine}
              </p>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <p className="text-white font-black text-xl sm:text-2xl text-center uppercase tracking-wide drop-shadow-lg" style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.9), -1px -1px 2px rgba(0,0,0,0.9)" }}>
                {bottomLine}
              </p>
            </div>
          </div>
          <div className="p-6 flex flex-col">
            <div className="mb-5">
              <label className="text-xs font-medium text-white/60 mb-2 block">Template</label>
              <div className="grid grid-cols-3 gap-2">
                {memeGenTemplates.map((t, i) => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTemplate(i)}
                    className={`relative aspect-square rounded-md overflow-hidden border-2 transition-all ${
                      selectedTemplate === i
                        ? "border-orange-500 ring-1 ring-orange-500/30"
                        : "border-white/[0.06] hover:border-white/20"
                    }`}
                    data-testid={`button-template-${t.id}`}
                  >
                    <img src={t.image} alt={t.label} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-end justify-center pb-1">
                      <span className="text-[9px] font-semibold text-white/70">{t.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="text-xs font-medium text-white/60 mb-1.5 block">Top Text</label>
              <input
                type="text"
                value={topLine}
                onChange={(e) => setTopLine(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-black/30 border border-border/30 text-sm text-white placeholder:text-white/20 focus:border-orange-500/50 focus:outline-none"
                placeholder="Top line"
                maxLength={100}
                data-testid="input-meme-top"
              />
            </div>
            <div className="mb-5">
              <label className="text-xs font-medium text-white/60 mb-1.5 block">Bottom Text</label>
              <input
                type="text"
                value={bottomLine}
                onChange={(e) => setBottomLine(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-black/30 border border-border/30 text-sm text-white placeholder:text-white/20 focus:border-orange-500/50 focus:outline-none"
                placeholder="Bottom line"
                maxLength={100}
                data-testid="input-meme-bottom"
              />
            </div>
            <div className="flex items-center gap-2 mt-auto">
              <button
                onClick={downloadMeme}
                className="flex items-center gap-2 px-4 py-2 rounded-md bg-orange-500 text-black text-sm font-semibold hover:bg-orange-400 transition-colors flex-1 justify-center"
                data-testid="button-download-custom-meme"
              >
                <Download className="w-4 h-4" /> Download
              </button>
              <button
                onClick={shareOnX}
                className="flex items-center gap-2 px-4 py-2 rounded-md bg-white/[0.03] border border-white/10 text-sm text-white/70 hover:text-white hover:border-orange-500/30 transition-all flex-1 justify-center"
                data-testid="button-share-custom-meme"
              >
                <SiX className="w-3.5 h-3.5" /> Post on X
              </button>
            </div>
          </div>
        </div>
      </Card>
    </motion.section>
  );
}

interface ImgflipMeme {
  id: string;
  name: string;
  url: string;
  width: number;
  height: number;
  box_count: number;
}

const PRIORITY_MEME_IDS = [
  "112126428",
  "181913649",
  "322841258",
  "505705955",
  "87743020",
  "222403160",
  "124822590",
  "252600902",
  "135256802",
  "131087935",
  "97984",
  "131940431",
  "80707627",
  "161865971",
  "55311130",
  "102156234",
  "124055727",
  "129242436",
  "4087833",
  "101470",
  "438680",
  "247375501",
  "91538330",
  "188390779",
  "309868304",
  "195515965",
  "61579",
  "100777631",
  "93895088",
  "61544",
  "178591752",
  "119139145",
  "79132341",
  "110163934",
  "252758727",
  "180190441",
  "177682295",
  "370867422",
  "148909805",
  "3218037",
  "28251713",
  "84341851",
  "67452763",
  "110133729",
];

const BLOCKED_MEME_IDS = new Set([
  "217743513",
  "247756783",
  "427308417",
  "224015000",
]);

function ClassicMemes() {
  const [memes, setMemes] = useState<ImgflipMeme[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ImgflipMeme | null>(null);
  const [topText, setTopText] = useState("Bitcoin ($BTC)");
  const [bottomText, setBottomText] = useState("Orbit ($ORB)");

  useEffect(() => {
    fetch("/api/imgflip/memes")
      .then((r) => r.json())
      .then((data: ImgflipMeme[]) => {
        const filtered = data.filter((m: ImgflipMeme) => !BLOCKED_MEME_IDS.has(m.id));
        const idMap = new Map(filtered.map((m: ImgflipMeme) => [m.id, m]));
        const ordered: ImgflipMeme[] = [];
        for (const id of PRIORITY_MEME_IDS) {
          const m = idMap.get(id);
          if (m) {
            ordered.push(m);
            idMap.delete(id);
          }
        }
        for (const m of idMap.values()) ordered.push(m);
        setMemes(ordered);
        const boyfriend = ordered.find((m: ImgflipMeme) => m.id === "112126428");
        setSelected(boyfriend || ordered[0] || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const downloadClassicMeme = useCallback(() => {
    if (!selected) return;
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const size = 1080;
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, size, size);

      const scale = Math.min(size / img.width, size / img.height);
      const w = img.width * scale;
      const h = img.height * scale;
      ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);

      ctx.textAlign = "center";
      ctx.strokeStyle = "rgba(0, 0, 0, 0.9)";
      ctx.lineWidth = 8;
      ctx.lineJoin = "round";
      ctx.font = "900 52px Impact, system-ui, sans-serif";
      ctx.fillStyle = "#ffffff";

      const wrapText = (text: string, maxW: number) => {
        const words = text.toUpperCase().split(" ");
        const lines: string[] = [];
        let line = "";
        for (const word of words) {
          const test = line ? `${line} ${word}` : word;
          if (ctx.measureText(test).width > maxW) {
            if (line) lines.push(line);
            line = word;
          } else line = test;
        }
        if (line) lines.push(line);
        return lines;
      };

      const topLines = wrapText(topText, 950);
      topLines.forEach((line, i) => {
        const y = 70 + i * 64;
        ctx.strokeText(line, size / 2, y);
        ctx.fillText(line, size / 2, y);
      });

      const botLines = wrapText(bottomText, 950);
      const startY = size - 30 - botLines.length * 64;
      botLines.forEach((line, i) => {
        const y = startY + i * 64;
        ctx.strokeText(line, size / 2, y);
        ctx.fillText(line, size / 2, y);
      });

      const url = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = `ORB_meme_${selected.id}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };
    img.src = selected.url;
  }, [selected, topText, bottomText]);

  const shareOnX = () => {
    const text = `${topText}\n\n${bottomText}\n\n$ORB | ORBIT Protocol`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  };

  if (loading) {
    return (
      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-16">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-md bg-orange-500/10 flex items-center justify-center">
            <Image className="w-4 h-4 text-orange-500" />
          </div>
          <h2 className="font-display font-semibold text-lg">Classic Meme Generator</h2>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-md bg-white/[0.03] animate-pulse" />
          ))}
        </div>
      </motion.section>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mb-16"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-md bg-orange-500/10 flex items-center justify-center">
          <Image className="w-4 h-4 text-orange-500" />
        </div>
        <h2 className="font-display font-semibold text-lg" data-testid="text-classic-memes-heading">Classic Meme Generator</h2>
        <Badge variant="outline" className="border-green-500/50 text-green-400 text-[10px] ml-auto">Powered by Imgflip</Badge>
      </div>
      <p className="text-xs text-muted-foreground mb-6">
        Pick any classic meme template, add your $ORB text, and download or share. Drake, Distracted Boyfriend, Bernie, and dozens more.
      </p>
      <Card className="border-border/50 bg-card/50 dark:bg-white/[0.02] overflow-hidden" data-testid="classic-meme-generator">
        <div className="grid lg:grid-cols-2">
          <div className="relative aspect-square max-h-[500px] overflow-hidden bg-black flex items-center justify-center">
            {selected && (
              <>
                <img
                  src={selected.url}
                  alt={selected.name}
                  className="max-w-full max-h-full object-contain"
                  crossOrigin="anonymous"
                />
                <div className="absolute top-0 left-0 right-0 p-4">
                  <p className="text-white font-black text-lg sm:text-xl text-center uppercase tracking-wide" style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.9), -1px -1px 2px rgba(0,0,0,0.9)" }}>
                    {topText}
                  </p>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-white font-black text-lg sm:text-xl text-center uppercase tracking-wide" style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.9), -1px -1px 2px rgba(0,0,0,0.9)" }}>
                    {bottomText}
                  </p>
                </div>
              </>
            )}
          </div>
          <div className="p-6 flex flex-col">
            <div className="mb-4">
              <label className="text-xs font-medium text-white/60 mb-2 block">Template ({memes.length} available)</label>
              <div className="grid grid-cols-4 gap-1.5 max-h-[200px] overflow-y-auto pr-1 scrollbar-thin">
                {memes.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setSelected(m)}
                    className={`relative aspect-square rounded-md overflow-hidden border-2 transition-all ${
                      selected?.id === m.id
                        ? "border-orange-500 ring-1 ring-orange-500/30"
                        : "border-white/[0.04] hover:border-white/15"
                    }`}
                    data-testid={`button-classic-meme-${m.id}`}
                    title={m.name}
                  >
                    <img src={m.url} alt={m.name} className="w-full h-full object-cover" loading="lazy" />
                  </button>
                ))}
              </div>
            </div>
            {selected && (
              <p className="text-[10px] text-orange-400 font-mono mb-3 truncate">{selected.name}</p>
            )}
            <div className="mb-3">
              <label className="text-xs font-medium text-white/60 mb-1.5 block">Top Text</label>
              <input
                type="text"
                value={topText}
                onChange={(e) => setTopText(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-black/30 border border-border/30 text-sm text-white placeholder:text-white/20 focus:border-orange-500/50 focus:outline-none"
                placeholder="Top line"
                maxLength={100}
                data-testid="input-classic-top"
              />
            </div>
            <div className="mb-5">
              <label className="text-xs font-medium text-white/60 mb-1.5 block">Bottom Text</label>
              <input
                type="text"
                value={bottomText}
                onChange={(e) => setBottomText(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-black/30 border border-border/30 text-sm text-white placeholder:text-white/20 focus:border-orange-500/50 focus:outline-none"
                placeholder="Bottom line"
                maxLength={100}
                data-testid="input-classic-bottom"
              />
            </div>
            <div className="flex items-center gap-2 mt-auto">
              <button
                onClick={downloadClassicMeme}
                className="flex items-center gap-2 px-4 py-2 rounded-md bg-orange-500 text-black text-sm font-semibold hover:bg-orange-400 transition-colors flex-1 justify-center"
                data-testid="button-download-classic-meme"
              >
                <Download className="w-4 h-4" /> Download
              </button>
              <button
                onClick={shareOnX}
                className="flex items-center gap-2 px-4 py-2 rounded-md bg-white/[0.03] border border-white/10 text-sm text-white/70 hover:text-white hover:border-orange-500/30 transition-all flex-1 justify-center"
                data-testid="button-share-classic-meme"
              >
                <SiX className="w-3.5 h-3.5" /> Post on X
              </button>
            </div>
          </div>
        </div>
      </Card>
    </motion.section>
  );
}

export default function ContentStudio() {
  useSEO({
    title: "Content Studio",
    description: "Create and share branded ORBIT Protocol content. Shareable tiles, meme templates, social images, and downloadable assets for the $ORB community.",
  });

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <span className="font-mono text-[10px] tracking-widest text-orange-500/70 uppercase mb-3 block">
            Community
          </span>
          <h1 className="font-display font-bold text-2xl sm:text-4xl lg:text-5xl text-white tracking-tight mb-4" data-testid="text-studio-title">
            Content Studio
          </h1>
          <p className="text-sm text-white/40 max-w-2xl mx-auto leading-relaxed">
            Create and share branded ORBIT content. Download social tiles, meme templates, and custom images. Post directly to X. Build the $ORB community.
          </p>
        </motion.div>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-md bg-orange-500/10 flex items-center justify-center">
              <Image className="w-4 h-4 text-orange-500" />
            </div>
            <h2 className="font-display font-semibold text-lg" data-testid="text-images-heading">Social Images</h2>
            <Badge variant="outline" className="border-orange-500/50 text-orange-400 text-[10px] ml-auto">{socialTiles.length} Assets</Badge>
          </div>
          <p className="text-xs text-muted-foreground mb-6">
            Branded ORBIT images for social media. Hover to reveal download and share buttons. Use as profile banners, post images, or community content.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {socialTiles.map((tile, i) => (
              <ImageTile key={tile.id} tile={tile} index={i} />
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-md bg-orange-500/10 flex items-center justify-center">
              <SiX className="w-4 h-4 text-orange-500" />
            </div>
            <h2 className="font-display font-semibold text-lg" data-testid="text-tweets-heading">Ready-to-Post Tweets</h2>
            <Badge variant="outline" className="border-orange-500/50 text-orange-400 text-[10px] ml-auto">{shareableTweets.length} Templates</Badge>
          </div>
          <p className="text-xs text-muted-foreground mb-6">
            Pre-written tweets about $ORB and ORBIT Protocol. Click "Post on X" to share instantly, or copy the text and customize it.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {shareableTweets.map((tweet, i) => (
              <TweetTile key={tweet.id} tweet={tweet} index={i} />
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-md bg-orange-500/10 flex items-center justify-center">
              <SiDiscord className="w-4 h-4 text-orange-500" />
            </div>
            <h2 className="font-display font-semibold text-lg" data-testid="text-discord-heading">Discord Posts</h2>
            <Badge variant="outline" className="border-orange-500/50 text-orange-400 text-[10px] ml-auto">{discordPosts.length} Templates</Badge>
          </div>
          <p className="text-xs text-muted-foreground mb-6">
            Ready-to-share posts for the ORBIT Discord community. Longer format, more detail. Copy and paste into any channel. $ORB
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {discordPosts.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
              >
                <Card className="border-border/50 bg-card/50 dark:bg-white/[0.02] flex flex-col h-full" data-testid={`discord-post-${post.id}`}>
                  <div className="p-5 flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <post.icon className={`w-4 h-4 ${post.color}`} />
                      <span className="text-[10px] font-mono text-orange-400/70 uppercase tracking-wider">{post.category}</span>
                      <span className="text-[10px] font-mono text-white/20 ml-auto">$ORB</span>
                    </div>
                    <h3 className="font-display font-semibold text-sm text-white mb-2">{post.title}</h3>
                    <p className="text-xs text-white/40 leading-relaxed whitespace-pre-line line-clamp-6">{post.text}</p>
                  </div>
                  <div className="p-5 pt-0 flex items-center gap-2">
                    <a
                      href={`https://discord.gg/uswhCdpv`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#5865F2]/90 text-white text-xs font-semibold hover:bg-[#5865F2] transition-colors flex-1 justify-center"
                      data-testid={`button-discord-${post.id}`}
                    >
                      <SiDiscord className="w-3 h-3" /> Discord
                    </a>
                    <a
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.text.slice(0, 280))}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-orange-500/90 text-black text-xs font-semibold hover:bg-orange-400 transition-colors flex-1 justify-center"
                      data-testid={`button-x-discord-${post.id}`}
                    >
                      <SiX className="w-3 h-3" /> Post on X
                    </a>
                    <button
                      onClick={() => { navigator.clipboard.writeText(post.text); }}
                      className="flex items-center gap-1 px-2 py-1.5 rounded-md bg-white/[0.03] border border-white/[0.06] text-xs text-white/40 hover:text-white hover:border-orange-500/30 transition-all"
                      data-testid={`button-copy-discord-${post.id}`}
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-md bg-orange-500/10 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-orange-500" />
            </div>
            <h2 className="font-display font-semibold text-lg" data-testid="text-merch-post-heading">Merch Posts</h2>
            <Badge variant="outline" className="border-orange-500/50 text-orange-400 text-[10px] ml-auto">{merchPostItems.length} Items</Badge>
          </div>
          <p className="text-xs text-muted-foreground mb-6">
            Share ORBIT merchandise on X. Click any item to post it with a pre-written caption. Premium gear for the $ORB community.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {merchPostItems.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
              >
                <Card className="border-border/50 bg-card/50 dark:bg-white/[0.02] overflow-hidden group" data-testid={`merch-post-${item.id}`}>
                  <div className="aspect-square overflow-hidden bg-black/50 relative">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <span className="absolute bottom-3 left-3 font-display font-bold text-xs tracking-[0.2em] text-white/80 uppercase">ORBIT</span>
                    <span className="absolute bottom-3 right-3 font-mono text-[10px] text-orange-400">$ORB</span>
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-display font-semibold text-sm text-white">{item.name}</h3>
                        <p className="text-[10px] text-orange-400 font-mono mt-0.5">${item.price}</p>
                      </div>
                      <span className="text-[9px] text-white/20 font-mono uppercase tracking-wider">{item.category}</span>
                    </div>
                    <p className="text-xs text-white/40 mb-4 leading-relaxed line-clamp-2">{item.description}</p>
                    <div className="flex items-center gap-2">
                      <a
                        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`${item.name} by @orbitquantum.\n\n${item.description}\n\n$ORB | orbitprotocol.io/merch`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-orange-500/90 text-black text-xs font-semibold hover:bg-orange-400 transition-colors flex-1 justify-center"
                        data-testid={`button-share-merch-${item.id}`}
                      >
                        <SiX className="w-3 h-3" /> Post on X
                      </a>
                      <a
                        href="/merch"
                        className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/[0.03] border border-white/[0.06] text-xs text-white/40 hover:text-white hover:border-orange-500/30 transition-all justify-center"
                        data-testid={`button-view-merch-${item.id}`}
                      >
                        <ExternalLink className="w-3 h-3" /> View
                      </a>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <ClassicMemes />

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-md bg-orange-500/10 flex items-center justify-center">
              <Palette className="w-4 h-4 text-orange-500" />
            </div>
            <h2 className="font-display font-semibold text-lg" data-testid="text-custom-heading">Custom Tile Generator</h2>
            <Badge variant="outline" className="border-green-500/50 text-green-400 text-[10px] ml-auto">Live</Badge>
          </div>
          <p className="text-xs text-muted-foreground mb-6">
            Create your own branded ORBIT social tiles. Choose a style, write your message, and download as a high-res PNG for X, Telegram, Discord, or any platform.
          </p>
          <CustomTileGenerator />
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-md bg-orange-500/10 flex items-center justify-center">
              <Download className="w-4 h-4 text-orange-500" />
            </div>
            <h2 className="font-display font-semibold text-lg" data-testid="text-downloads-heading">Documents</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Card className="border-border/50 bg-card/50 dark:bg-white/[0.02] p-5" data-testid="card-download-whitepaper">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-md bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                  <Layers className="w-5 h-5 text-orange-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-display font-semibold text-sm mb-1">White Paper PDF</h3>
                  <p className="text-xs text-muted-foreground mb-3">Full ORBIT Protocol white paper. 17 sections covering identity, payments, commerce, and quantum-resilient security.</p>
                  <div className="flex items-center gap-2">
                    <a
                      href="/api/downloads/whitepaper"
                      download
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-orange-500 text-black text-xs font-semibold hover:bg-orange-400 transition-colors"
                      data-testid="button-download-wp-pdf"
                    >
                      <Download className="w-3 h-3" /> Download PDF
                    </a>
                    <a
                      href="https://twitter.com/intent/tweet?text=Read%20the%20%40orbitquantum%20White%20Paper.%20Identity%2C%20payments%2C%20commerce%2C%20and%20quantum-resilient%20security%20for%20AI%20agents%20and%20robots.%20%24ORB"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/[0.03] border border-white/10 text-xs text-white/70 hover:text-white hover:border-orange-500/30 transition-all"
                      data-testid="button-share-wp-x"
                    >
                      <SiX className="w-3 h-3" /> Post to Twitter
                    </a>
                  </div>
                </div>
              </div>
            </Card>
            <Card className="border-border/50 bg-card/50 dark:bg-white/[0.02] p-5" data-testid="card-download-tokenomics">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-md bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                  <Coins className="w-5 h-5 text-orange-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-display font-semibold text-sm mb-1">Tokenomics PDF</h3>
                  <p className="text-xs text-muted-foreground mb-3">$ORB token economics. Supply, utility, revenue model, treasury allocation, ORBIT Vault, and fair launch details.</p>
                  <a
                    href="/api/downloads/tokenomics"
                    download
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-orange-500 text-black text-xs font-semibold hover:bg-orange-400 transition-colors"
                    data-testid="button-download-tok-pdf"
                  >
                    <Download className="w-3 h-3" /> Download PDF
                  </a>
                </div>
              </div>
            </Card>
          </div>
        </motion.section>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Card className="border-orange-500/30 bg-orange-500/5 dark:bg-orange-500/[0.04] p-6 text-center">
            <h3 className="font-display font-semibold text-lg mb-2" data-testid="text-cta-heading">Build the $ORB Community</h3>
            <p className="text-sm text-muted-foreground max-w-xl mx-auto mb-4">
              Every share, every meme, every post grows the ORBIT network. Use these tools to spread the word about the transaction layer for AI agents and the robot economy.
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <a
                href="https://twitter.com/intent/tweet?text=%24ORB%20by%20%40orbitquantum%20%7C%20The%20transaction%20layer%20for%20AI%20agents%20and%20the%20robot%20economy.%20100%25%20fair%20launch%20on%20%40base%20via%20%40bankrbot.%20No%20presale.%20No%20VC.%20No%20insider%20rounds."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-orange-500 text-black text-sm font-semibold hover:bg-orange-400 transition-colors"
                data-testid="button-cta-share"
              >
                <SiX className="w-4 h-4" /> Share $ORB on X
              </a>
              <a
                href="https://twitter.com/search?q=%24ORB%20%40orbitquantum"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-white/[0.03] border border-white/10 text-sm text-white/70 hover:text-white hover:border-orange-500/30 transition-all"
                data-testid="button-cta-explore"
              >
                <Sparkles className="w-4 h-4" /> Explore $ORB on X
              </a>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
