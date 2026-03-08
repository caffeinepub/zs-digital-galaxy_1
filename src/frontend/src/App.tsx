import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toaster } from "@/components/ui/sonner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle,
  ChevronRight,
  Globe,
  Heart,
  Image,
  Layout,
  Mail,
  Menu,
  MessageCircle,
  Palette,
  PenTool,
  Share2,
  Sparkles,
  Star,
  Video,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SiWhatsapp } from "react-icons/si";
import { toast } from "sonner";
import { useActor } from "./hooks/useActor";

// ── Types ────────────────────────────────────────────────────────────
interface ServiceItem {
  icon: string;
  name: string;
  description: string;
}

interface PortfolioItem {
  title: string;
  description: string;
  imageUrl: string;
  category: string;
}

interface PricingPlan {
  name: string;
  price: number;
  features: string[];
  recommended: boolean;
}

// ── Static Fallback Data ─────────────────────────────────────────────
const STATIC_SERVICES: ServiceItem[] = [
  {
    icon: "Video",
    name: "Video Editing",
    description:
      "Cinematic cuts, color grading, transitions, and effects for YouTube, reels, and promotional content.",
  },
  {
    icon: "Palette",
    name: "Graphic Design",
    description:
      "Stunning visuals, brand assets, and digital artwork tailored to elevate your brand identity.",
  },
  {
    icon: "PenTool",
    name: "Logo Design",
    description:
      "Unique, memorable logos that capture your brand essence with scalable vector formats.",
  },
  {
    icon: "Image",
    name: "YouTube Thumbnail Design",
    description:
      "High-CTR thumbnails designed to maximize clicks and stand out in crowded feeds.",
  },
  {
    icon: "Layout",
    name: "Banner & Poster Design",
    description:
      "Eye-catching banners and posters for events, promotions, and digital marketing campaigns.",
  },
  {
    icon: "Heart",
    name: "Invitation & Wedding Cards",
    description:
      "Elegant, personalized invitation cards and wedding stationery for your most special moments.",
  },
  {
    icon: "Share2",
    name: "Social Media Design",
    description:
      "Consistent, on-brand social media posts, stories, and templates that grow your online presence.",
  },
];

const STATIC_PORTFOLIO: PortfolioItem[] = [
  {
    title: "Epic YouTube Thumbnail",
    description: "High-CTR gaming channel thumbnail with neon style",
    imageUrl: "/assets/generated/portfolio-thumbnail.dim_600x400.jpg",
    category: "Design",
  },
  {
    title: "Aurum Restaurant Logo",
    description: "Luxury brand identity for a fine dining restaurant",
    imageUrl: "/assets/generated/portfolio-logo.dim_600x400.jpg",
    category: "Design",
  },
  {
    title: "Sarah & James Wedding Card",
    description: "Elegant floral wedding invitation suite",
    imageUrl: "/assets/generated/portfolio-wedding.dim_600x400.jpg",
    category: "Print",
  },
  {
    title: "Digital Futures Summit Banner",
    description: "Bold event banner for tech conference",
    imageUrl: "/assets/generated/portfolio-banner.dim_600x400.jpg",
    category: "Design",
  },
  {
    title: "Neon Pulse Festival Poster",
    description: "Vibrant music festival poster with glitch art",
    imageUrl: "/assets/generated/portfolio-poster.dim_600x400.jpg",
    category: "Print",
  },
  {
    title: "Cinematic Brand Film",
    description:
      "Professional video edit with color grading for brand campaign",
    imageUrl: "/assets/generated/portfolio-video.dim_600x400.jpg",
    category: "Video",
  },
];

const STATIC_PRICING: PricingPlan[] = [
  {
    name: "Basic",
    price: 15,
    features: [
      "Logo or Thumbnail Design",
      "2 Revisions",
      "3-Day Delivery",
      "High-Res PNG Export",
      "Basic Support",
    ],
    recommended: false,
  },
  {
    name: "Standard",
    price: 35,
    features: [
      "Up to 3 Design Pieces",
      "5 Revisions",
      "2-Day Delivery",
      "Source Files Included",
      "Priority Support",
      "Social Media Sizes",
    ],
    recommended: true,
  },
  {
    name: "Premium",
    price: 65,
    features: [
      "Full Brand Package",
      "Unlimited Revisions",
      "1-Day Delivery",
      "All Source Files",
      "Priority VIP Support",
      "Social Media Kit",
      "Video Editing Included",
    ],
    recommended: false,
  },
];

const SERVICE_ICON_MAP: Record<string, React.ReactNode> = {
  Video: <Video className="w-7 h-7" />,
  Palette: <Palette className="w-7 h-7" />,
  PenTool: <PenTool className="w-7 h-7" />,
  Image: <Image className="w-7 h-7" />,
  Layout: <Layout className="w-7 h-7" />,
  Heart: <Heart className="w-7 h-7" />,
  Share2: <Share2 className="w-7 h-7" />,
  Sparkles: <Sparkles className="w-7 h-7" />,
  Zap: <Zap className="w-7 h-7" />,
  Globe: <Globe className="w-7 h-7" />,
};

// ── Starfield Component ──────────────────────────────────────────────
function StarField({ count = 80 }: { count?: number }) {
  const stars = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2.5 + 0.5,
    dur: (Math.random() * 3 + 2).toFixed(1),
    delay: (Math.random() * 4).toFixed(1),
  }));

  return (
    <div className="star-field" aria-hidden="true">
      {stars.map((s) => (
        <span
          key={s.id}
          className="star"
          style={
            {
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              "--dur": `${s.dur}s`,
              "--delay": `${s.delay}s`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

// ── useSectionFade hook ──────────────────────────────────────────────
function useSectionFade() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        }
      },
      { threshold: 0.1 },
    );

    const elements = document.querySelectorAll(".section-fade");
    for (const el of elements) observer.observe(el);

    return () => observer.disconnect();
  }, []);
}

// ── Navigation ───────────────────────────────────────────────────────
function Navigation({ onOrderNow }: { onOrderNow: () => void }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const links = [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Portfolio", href: "#portfolio" },
    { label: "Pricing", href: "#pricing" },
    { label: "Contact", href: "#contact" },
  ];

  const handleNav = (href: string) => {
    setOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "nav-blur shadow-lg" : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          type="button"
          onClick={() => handleNav("#home")}
          className="flex items-center gap-3 group"
          data-ocid="nav.link.1"
        >
          <img
            src="/assets/generated/zsdg-logo-transparent.dim_300x300.png"
            alt="ZS Digital Galaxy Logo"
            className="w-10 h-10 rounded-full object-cover ring-2 ring-galaxy-blue/30 group-hover:ring-galaxy-blue/70 transition-all"
          />
          <span className="font-display font-bold text-lg hidden sm:block gradient-text">
            ZS Digital Galaxy
          </span>
        </button>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-1">
          {links.slice(1).map((link, i) => (
            <button
              type="button"
              key={link.href}
              onClick={() => handleNav(link.href)}
              className="px-4 py-2 text-sm font-medium text-foreground/70 hover:text-foreground hover:text-galaxy-blue transition-colors rounded-md"
              data-ocid={`nav.link.${i + 2}`}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden lg:flex items-center gap-3">
          <Button
            onClick={onOrderNow}
            className="glow-btn bg-galaxy-blue/20 hover:bg-galaxy-blue/40 text-galaxy-blue border border-galaxy-blue/50 font-semibold"
            data-ocid="nav.primary_button"
          >
            Order Now
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          type="button"
          className="lg:hidden text-foreground/80 hover:text-foreground p-2"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {open && (
        <div className="lg:hidden nav-blur border-t border-border/30 pb-4">
          {links.map((link, i) => (
            <button
              type="button"
              key={link.href}
              onClick={() => handleNav(link.href)}
              className="block w-full text-left px-6 py-3 text-foreground/80 hover:text-galaxy-blue transition-colors font-medium"
              data-ocid={`nav.link.${i + 1}`}
            >
              {link.label}
            </button>
          ))}
          <div className="px-6 pt-2">
            <Button
              onClick={() => {
                setOpen(false);
                onOrderNow();
              }}
              className="w-full glow-btn bg-galaxy-blue/20 hover:bg-galaxy-blue/40 text-galaxy-blue border border-galaxy-blue/50 font-semibold"
            >
              Order Now
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}

// ── Hero Section ─────────────────────────────────────────────────────
function HeroSection({ onOrderNow }: { onOrderNow: () => void }) {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ paddingTop: "4rem" }}
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('/assets/generated/hero-galaxy.dim_1600x800.jpg')",
        }}
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-space-dark/70 via-space-dark/50 to-space-dark" />
      {/* Star field overlay */}
      <StarField count={100} />
      {/* Nebula glow orbs */}
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, oklch(0.58 0.24 290), transparent)",
        }}
      />
      <div
        className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full opacity-15 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, oklch(0.75 0.2 220), transparent)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-galaxy-blue/30 bg-galaxy-blue/10 text-galaxy-blue text-sm font-medium mb-8 animate-pulse-glow">
          <Sparkles className="w-4 h-4" />
          Creative Digital Services
        </div>

        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
          <span className="gradient-text glow-text-blue">Creative Digital</span>
          <br />
          <span className="text-foreground">Solutions for</span>
          <br />
          <span className="gradient-text glow-text-violet">Your Brand</span>
        </h1>

        <p className="text-lg sm:text-xl text-foreground/70 max-w-2xl mx-auto mb-10 leading-relaxed">
          <strong className="text-galaxy-cyan">ZS Digital Galaxy</strong> —
          Professional Video Editing, Graphic Design & More for Businesses,
          Creators & Local Shops
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            onClick={onOrderNow}
            size="lg"
            className="glow-btn px-8 py-6 text-base font-bold bg-galaxy-blue hover:bg-galaxy-blue/90 text-space-dark border-0 rounded-xl"
            data-ocid="hero.primary_button"
          >
            <Zap className="w-5 h-5 mr-2" />
            Get Your Design Today
          </Button>
          <a
            href="https://wa.me/+923001234567"
            target="_blank"
            rel="noopener noreferrer"
            data-ocid="hero.secondary_button"
          >
            <Button
              size="lg"
              variant="outline"
              className="px-8 py-6 text-base font-semibold border-green-400/50 text-green-400 hover:bg-green-400/10 hover:border-green-400 rounded-xl transition-all"
            >
              <SiWhatsapp className="w-5 h-5 mr-2" />
              Contact on WhatsApp
            </Button>
          </a>
        </div>

        {/* Stats bar */}
        <div className="mt-16 flex flex-wrap justify-center gap-8 text-center">
          {[
            { value: "200+", label: "Projects Delivered" },
            { value: "50+", label: "Happy Clients" },
            { value: "3+", label: "Years Experience" },
          ].map((s) => (
            <div key={s.label} className="min-w-[100px]">
              <div className="text-3xl font-display font-bold gradient-text glow-text-cyan">
                {s.value}
              </div>
              <div className="text-sm text-foreground/60 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-foreground/30">
        <ChevronRight className="w-6 h-6 rotate-90" />
      </div>
    </section>
  );
}

// ── About Section ────────────────────────────────────────────────────
function AboutSection() {
  return (
    <section id="about" className="py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 right-0 w-[500px] h-[500px] opacity-5 blur-3xl rounded-full"
          style={{
            background:
              "radial-gradient(circle, oklch(0.75 0.2 220), transparent)",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text */}
          <div className="section-fade">
            <Badge className="mb-6 bg-galaxy-violet/20 text-galaxy-violet border-galaxy-violet/40 text-sm">
              About Us
            </Badge>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 leading-tight">
              About{" "}
              <span className="gradient-text glow-text-blue">
                ZS Digital Galaxy
              </span>
            </h2>
            <p className="text-lg text-foreground/70 leading-relaxed mb-8">
              We are a growing digital creative team passionate about helping
              businesses, creators, and local shops improve their online
              presence. From stunning video edits to eye-catching graphic
              designs, we deliver professional quality at affordable prices.
            </p>
            <p className="text-foreground/60 leading-relaxed mb-10">
              Whether you're a startup building your brand, a content creator
              seeking standout visuals, or a local business ready to go digital
              — ZS Digital Galaxy is your creative partner in the galaxy.
            </p>

            <div className="flex flex-wrap gap-4">
              {[
                "Creative Vision",
                "Affordable Rates",
                "Fast Delivery",
                "Client-First",
              ].map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-1.5 rounded-full border border-galaxy-blue/30 bg-galaxy-blue/10 text-galaxy-blue text-sm font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Right: Stats Cards */}
          <div className="section-fade grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4">
            {[
              {
                icon: <Star className="w-8 h-8" />,
                value: "200+",
                label: "Projects Completed",
                color: "galaxy-blue",
              },
              {
                icon: <CheckCircle className="w-8 h-8" />,
                value: "50+",
                label: "Happy Clients",
                color: "galaxy-violet",
              },
              {
                icon: <Zap className="w-8 h-8" />,
                value: "3+",
                label: "Years of Experience",
                color: "galaxy-cyan",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="glass-card rounded-2xl p-6 flex items-center gap-5"
              >
                <div
                  className={`text-${stat.color} p-3 rounded-xl bg-current/10`}
                >
                  {stat.icon}
                </div>
                <div>
                  <div
                    className={`text-3xl font-display font-bold text-${stat.color} glow-text-blue`}
                  >
                    {stat.value}
                  </div>
                  <div className="text-foreground/60 text-sm mt-0.5">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Services Section ─────────────────────────────────────────────────
function ServicesSection({ services }: { services: ServiceItem[] }) {
  return (
    <section
      id="services"
      className="py-24 px-4 relative overflow-hidden"
      style={{ background: "oklch(0.08 0.018 270 / 0.5)" }}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute bottom-0 left-0 w-[600px] h-[600px] opacity-5 blur-3xl rounded-full"
          style={{
            background:
              "radial-gradient(circle, oklch(0.58 0.24 290), transparent)",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 section-fade">
          <Badge className="mb-4 bg-galaxy-blue/20 text-galaxy-blue border-galaxy-blue/40">
            What We Do
          </Badge>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Our <span className="gradient-text glow-text-blue">Services</span>
          </h2>
          <p className="text-foreground/60 text-lg max-w-2xl mx-auto">
            End-to-end creative solutions designed to elevate your digital
            presence
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {services.map((service, i) => (
            <div
              key={service.name}
              className="glass-card rounded-2xl p-6 flex flex-col gap-4 group cursor-default"
              data-ocid={`services.card.${i + 1}`}
            >
              <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-galaxy-blue/15 text-galaxy-blue group-hover:bg-galaxy-blue/25 transition-colors border border-galaxy-blue/20">
                {SERVICE_ICON_MAP[service.icon] || (
                  <Sparkles className="w-7 h-7" />
                )}
              </div>
              <div>
                <h3 className="font-display font-semibold text-lg text-foreground mb-2 group-hover:text-galaxy-blue transition-colors">
                  {service.name}
                </h3>
                <p className="text-foreground/55 text-sm leading-relaxed">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Portfolio Section ────────────────────────────────────────────────
const CATEGORIES = ["All", "Video", "Design", "Print"];

function PortfolioSection({ items }: { items: PortfolioItem[] }) {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All"
      ? items
      : items.filter((item) => item.category === activeCategory);

  return (
    <section id="portfolio" className="py-24 px-4 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 section-fade">
          <Badge className="mb-4 bg-galaxy-violet/20 text-galaxy-violet border-galaxy-violet/40">
            Our Work
          </Badge>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Featured{" "}
            <span className="gradient-text glow-text-violet">Portfolio</span>
          </h2>
          <p className="text-foreground/60 text-lg max-w-2xl mx-auto">
            Explore our recent creative projects across video, design, and print
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex justify-center mb-10 section-fade">
          <Tabs value={activeCategory} onValueChange={setActiveCategory}>
            <TabsList className="bg-space-card/50 border border-border/50 p-1 rounded-full">
              {CATEGORIES.map((cat) => (
                <TabsTrigger
                  key={cat}
                  value={cat}
                  data-ocid="portfolio.tab"
                  className="rounded-full px-5 py-2 text-sm font-medium data-[state=active]:bg-galaxy-blue data-[state=active]:text-space-dark data-[state=active]:shadow-glow-blue transition-all"
                >
                  {cat}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item, i) => (
            <div
              key={item.title}
              className="portfolio-img-hover glass-card rounded-2xl overflow-hidden group"
              data-ocid={`portfolio.item.${i + 1}`}
            >
              <div className="relative aspect-[3/2]">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                {/* Category badge overlay */}
                <div className="absolute top-3 left-3">
                  <Badge
                    className={`text-xs font-semibold border-0 ${
                      item.category === "Video"
                        ? "bg-galaxy-blue/80 text-space-dark"
                        : item.category === "Print"
                          ? "bg-galaxy-violet/80 text-white"
                          : "bg-galaxy-cyan/80 text-space-dark"
                    }`}
                  >
                    {item.category}
                  </Badge>
                </div>
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-space-dark/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-5">
                  <div>
                    <h4 className="font-display font-semibold text-foreground text-base">
                      {item.title}
                    </h4>
                    <p className="text-foreground/60 text-sm mt-1">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h4 className="font-semibold text-foreground text-sm">
                  {item.title}
                </h4>
                <p className="text-foreground/50 text-xs mt-1 line-clamp-2">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Pricing Section ──────────────────────────────────────────────────
function PricingSection({
  plans,
  onOrderNow,
}: { plans: PricingPlan[]; onOrderNow: () => void }) {
  return (
    <section
      id="pricing"
      className="py-24 px-4 relative overflow-hidden"
      style={{ background: "oklch(0.075 0.015 265)" }}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] opacity-5 blur-3xl rounded-full"
          style={{
            background:
              "radial-gradient(ellipse, oklch(0.58 0.24 290), oklch(0.75 0.2 220), transparent)",
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 section-fade">
          <Badge className="mb-4 bg-galaxy-cyan/20 text-galaxy-cyan border-galaxy-cyan/40">
            Pricing
          </Badge>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Affordable{" "}
            <span className="gradient-text glow-text-cyan">Plans</span>
          </h2>
          <p className="text-foreground/60 text-lg max-w-2xl mx-auto">
            Transparent pricing for businesses and creators of every size
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-8 flex flex-col gap-6 border section-fade ${
                plan.recommended
                  ? "recommended-glow glass-card border-galaxy-violet/50 scale-105"
                  : "glass-card"
              }`}
              data-ocid={`pricing.card.${i + 1}`}
            >
              {plan.recommended && (
                <div className="text-center">
                  <Badge className="bg-galaxy-violet text-white border-0 font-semibold px-4 py-1">
                    ⭐ Most Popular
                  </Badge>
                </div>
              )}

              <div>
                <h3
                  className={`font-display text-xl font-bold mb-2 ${plan.recommended ? "text-galaxy-violet" : "text-foreground"}`}
                >
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1">
                  <span
                    className={`text-4xl font-display font-extrabold ${plan.recommended ? "gradient-text glow-text-violet" : "text-foreground"}`}
                  >
                    ${plan.price}
                  </span>
                  <span className="text-foreground/50 text-sm">/project</span>
                </div>
              </div>

              <ul className="flex flex-col gap-3 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <CheckCircle
                      className={`w-4 h-4 mt-0.5 flex-shrink-0 ${plan.recommended ? "text-galaxy-violet" : "text-galaxy-blue"}`}
                    />
                    <span className="text-foreground/75">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={onOrderNow}
                className={`w-full font-semibold rounded-xl py-5 transition-all ${
                  plan.recommended
                    ? "bg-galaxy-violet hover:bg-galaxy-violet/90 text-white glow-btn"
                    : "bg-galaxy-blue/20 hover:bg-galaxy-blue/40 text-galaxy-blue border border-galaxy-blue/50"
                }`}
                data-ocid={`pricing.primary_button.${i + 1}`}
              >
                Order Now
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── CTA Banner ───────────────────────────────────────────────────────
function CTABanner({ onOrderNow }: { onOrderNow: () => void }) {
  return (
    <section className="py-20 px-4 relative overflow-hidden">
      <div
        className="max-w-5xl mx-auto rounded-3xl p-12 text-center relative overflow-hidden section-fade"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.1 0.04 265) 0%, oklch(0.12 0.08 280) 50%, oklch(0.1 0.03 220) 100%)",
          border: "1px solid oklch(0.75 0.2 220 / 0.2)",
          boxShadow:
            "0 0 60px oklch(0.58 0.24 290 / 0.15), 0 0 120px oklch(0.75 0.2 220 / 0.08)",
        }}
      >
        <StarField count={40} />
        <div className="relative z-10">
          <Sparkles className="w-10 h-10 text-galaxy-blue mx-auto mb-6 animate-float" />
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Ready to{" "}
            <span className="gradient-text glow-text-blue">Transform</span> Your
            Brand?
          </h2>
          <p className="text-foreground/65 text-lg mb-10 max-w-xl mx-auto">
            Join 50+ businesses who trust ZS Digital Galaxy for their creative
            needs.
          </p>
          <Button
            onClick={onOrderNow}
            size="lg"
            className="glow-btn px-10 py-6 text-base font-bold bg-galaxy-blue hover:bg-galaxy-blue/90 text-space-dark border-0 rounded-xl"
            data-ocid="cta.primary_button"
          >
            <Zap className="w-5 h-5 mr-2" />
            Get Your Design Today
          </Button>
        </div>
      </div>
    </section>
  );
}

// ── Contact Section ──────────────────────────────────────────────────
interface ContactFormState {
  name: string;
  email: string;
  service: string;
  message: string;
}

function ContactSection({
  onSubmitContact,
}: {
  onSubmitContact: (data: ContactFormState) => Promise<void>;
}) {
  const [form, setForm] = useState<ContactFormState>({
    name: "",
    email: "",
    service: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.service ||
      !form.message.trim()
    ) {
      setError("All fields are required.");
      return;
    }
    if (!emailRegex.test(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    try {
      await onSubmitContact(form);
      setSubmitted(true);
      toast.success("Message sent! We'll contact you soon.");
      setForm({ name: "", email: "", service: "", message: "" });
    } catch {
      setError("Failed to send message. Please try again.");
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const services = [
    "Video Editing",
    "Graphic Design",
    "Logo Design",
    "YouTube Thumbnail Design",
    "Banner & Poster Design",
    "Invitation & Wedding Cards",
    "Social Media Design",
    "Other",
  ];

  return (
    <section
      id="contact"
      className="py-24 px-4 relative overflow-hidden"
      style={{ background: "oklch(0.07 0.015 265)" }}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute bottom-0 right-0 w-[500px] h-[500px] opacity-5 blur-3xl rounded-full"
          style={{
            background:
              "radial-gradient(circle, oklch(0.75 0.2 220), transparent)",
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 section-fade">
          <Badge className="mb-4 bg-galaxy-blue/20 text-galaxy-blue border-galaxy-blue/40">
            Get In Touch
          </Badge>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Start Your{" "}
            <span className="gradient-text glow-text-blue">Project</span>
          </h2>
          <p className="text-foreground/60 text-lg">
            Ready to elevate your brand? Reach out and let's create something
            amazing.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left: Contact Info */}
          <div className="section-fade flex flex-col gap-6">
            <div className="glass-card rounded-2xl p-8">
              <h3 className="font-display font-semibold text-xl text-foreground mb-6">
                Contact Details
              </h3>

              <div className="flex flex-col gap-5">
                <a
                  href="https://wa.me/+923001234567"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-xl bg-green-500/10 border border-green-500/30 hover:bg-green-500/20 hover:border-green-500/60 transition-all group"
                >
                  <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <SiWhatsapp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-green-400 text-sm">
                      WhatsApp
                    </div>
                    <div className="text-foreground font-medium">
                      +92 300 1234567
                    </div>
                    <div className="text-foreground/50 text-xs">
                      Available 9am–9pm PKT
                    </div>
                  </div>
                </a>

                <div className="flex items-center gap-4 p-4 rounded-xl bg-galaxy-blue/10 border border-galaxy-blue/30">
                  <div className="w-12 h-12 rounded-full bg-galaxy-blue/20 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-galaxy-blue" />
                  </div>
                  <div>
                    <div className="font-semibold text-galaxy-blue text-sm">
                      Email
                    </div>
                    <a
                      href="mailto:zsdigitalgalaxy@gmail.com"
                      className="text-foreground hover:text-galaxy-blue transition-colors font-medium"
                    >
                      zsdigitalgalaxy@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-8">
              <div className="flex items-start gap-3">
                <MessageCircle className="w-6 h-6 text-galaxy-violet mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-foreground mb-2">
                    Quick Response Guarantee
                  </h4>
                  <p className="text-foreground/60 text-sm leading-relaxed">
                    We respond to all inquiries within 2 hours during business
                    hours. For urgent projects, contact us on WhatsApp for
                    immediate assistance.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div className="section-fade">
            <form
              onSubmit={handleSubmit}
              className="glass-card rounded-2xl p-8 flex flex-col gap-5"
              noValidate
            >
              <h3 className="font-display font-semibold text-xl text-foreground mb-1">
                Place Your Order
              </h3>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="contact-name"
                  className="text-sm font-medium text-foreground/70"
                >
                  Full Name *
                </label>
                <Input
                  id="contact-name"
                  placeholder="Your full name"
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, name: e.target.value }))
                  }
                  className="bg-space-card/50 border-border/60 focus:border-galaxy-blue/70 h-11"
                  data-ocid="contact.input"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="contact-email"
                  className="text-sm font-medium text-foreground/70"
                >
                  Email Address *
                </label>
                <Input
                  id="contact-email"
                  type="email"
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, email: e.target.value }))
                  }
                  className="bg-space-card/50 border-border/60 focus:border-galaxy-blue/70 h-11"
                  data-ocid="contact.email.input"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="contact-service"
                  className="text-sm font-medium text-foreground/70"
                >
                  Service Required *
                </label>
                <Select
                  value={form.service}
                  onValueChange={(v) => setForm((p) => ({ ...p, service: v }))}
                >
                  <SelectTrigger
                    className="bg-space-card/50 border-border/60 h-11"
                    data-ocid="contact.select"
                  >
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                  <SelectContent className="bg-space-card border-border/60">
                    {services.map((svc) => (
                      <SelectItem
                        key={svc}
                        value={svc}
                        className="hover:bg-galaxy-blue/10"
                      >
                        {svc}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="contact-message"
                  className="text-sm font-medium text-foreground/70"
                >
                  Project Details *
                </label>
                <Textarea
                  id="contact-message"
                  placeholder="Describe your project, style preferences, deadlines..."
                  value={form.message}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, message: e.target.value }))
                  }
                  className="bg-space-card/50 border-border/60 focus:border-galaxy-blue/70 min-h-[120px] resize-none"
                  data-ocid="contact.textarea"
                  required
                />
              </div>

              {error && (
                <p
                  className="text-destructive text-sm"
                  data-ocid="contact.error_state"
                  role="alert"
                >
                  {error}
                </p>
              )}

              {submitted && (
                <div
                  className="flex items-center gap-2 p-3 rounded-lg bg-green-500/15 border border-green-500/30 text-green-400 text-sm"
                  data-ocid="contact.success_state"
                >
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  Message sent successfully! We'll reach out shortly.
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full py-5 text-base font-bold glow-btn bg-galaxy-blue hover:bg-galaxy-blue/90 text-space-dark border-0 rounded-xl mt-1 disabled:opacity-60"
                data-ocid="contact.submit_button"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-space-dark/30 border-t-space-dark rounded-full animate-spin" />
                    Sending...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Send Message
                  </span>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Footer ───────────────────────────────────────────────────────────
function Footer() {
  const year = new Date().getFullYear();
  const links = [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Portfolio", href: "#portfolio" },
    { label: "Pricing", href: "#pricing" },
    { label: "Contact", href: "#contact" },
  ];

  const handleNav = (href: string) => {
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer
      className="border-t border-border/30 py-12 px-4"
      style={{ background: "oklch(0.06 0.012 265)" }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/assets/generated/zsdg-logo-transparent.dim_300x300.png"
                alt="ZS Digital Galaxy"
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="font-display font-bold text-lg gradient-text">
                ZS Digital Galaxy
              </span>
            </div>
            <p className="text-foreground/50 text-sm leading-relaxed max-w-xs">
              Creative Digital Solutions for Every Brand. Professional design
              services for businesses, creators, and local shops.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wider text-galaxy-blue">
              Quick Links
            </h4>
            <nav className="flex flex-col gap-2">
              {links.map((link, i) => (
                <button
                  type="button"
                  key={link.href}
                  onClick={() => handleNav(link.href)}
                  className="text-foreground/55 hover:text-galaxy-blue transition-colors text-sm w-fit text-left"
                  data-ocid={`footer.link.${i + 1}`}
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wider text-galaxy-blue">
              Contact
            </h4>
            <div className="flex flex-col gap-3">
              <a
                href="https://wa.me/+923001234567"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-green-400 hover:text-green-300 transition-colors"
              >
                <SiWhatsapp className="w-4 h-4" />
                +92 300 1234567
              </a>
              <a
                href="mailto:zsdigitalgalaxy@gmail.com"
                className="flex items-center gap-2 text-sm text-foreground/55 hover:text-galaxy-blue transition-colors"
              >
                <Mail className="w-4 h-4" />
                zsdigitalgalaxy@gmail.com
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border/20 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-foreground/40">
          <p>© {year} ZS Digital Galaxy. All rights reserved.</p>
          <p>
            Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-galaxy-blue/70 hover:text-galaxy-blue transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

// ── Main App ─────────────────────────────────────────────────────────
export default function App() {
  const { actor } = useActor();

  const [services, setServices] = useState<ServiceItem[]>(STATIC_SERVICES);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(STATIC_PORTFOLIO);
  const [pricing, setPricing] = useState<PricingPlan[]>(STATIC_PRICING);
  const seededRef = useRef(false);

  // Seed + fetch data on first actor availability
  useEffect(() => {
    if (!actor || seededRef.current) return;
    seededRef.current = true;

    const init = async () => {
      try {
        await actor.seedData();
        const [svcs, items, plans] = await Promise.all([
          actor.getAllServices(),
          actor.getAllPortfolioItems(),
          actor.getAllPricingPlans(),
        ]);
        if (svcs.length > 0) setServices(svcs);
        if (items.length > 0) setPortfolio(items);
        if (plans.length > 0) setPricing(plans);
      } catch {
        // silently fall back to static data
      }
    };

    init();
  }, [actor]);

  // Section fade observer
  useSectionFade();

  const scrollToContact = () => {
    document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmitContact = async (data: ContactFormState) => {
    if (!actor) throw new Error("Not connected");
    await actor.submitContact(
      data.name,
      data.email,
      data.service,
      data.message,
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Toaster richColors position="top-right" />
      <Navigation onOrderNow={scrollToContact} />
      <main>
        <HeroSection onOrderNow={scrollToContact} />
        <AboutSection />
        <ServicesSection services={services} />
        <PortfolioSection items={portfolio} />
        <PricingSection plans={pricing} onOrderNow={scrollToContact} />
        <CTABanner onOrderNow={scrollToContact} />
        <ContactSection onSubmitContact={handleSubmitContact} />
      </main>
      <Footer />
    </div>
  );
}
