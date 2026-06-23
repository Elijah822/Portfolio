import { PROJECT_MEDIA, videoPoster } from "./projectMedia.js"

const media = id => {
  const url = PROJECT_MEDIA[id]?.hero?.url ?? null
  return url ? { type: "video", url, poster: videoPoster(url) } : null
}

export const SERVICES = [
  {
    id: "product",
    num: "01",
    title: "Product & UX Design",
    desc: "End-to-end product design for web and mobile — from research and flows to polished UI that ships. I design what can actually be built: every flow respects the technical limits of your stack, so engineering isn't left reverse-engineering comps.",
    includes: [
      "User research & journey mapping",
      "Wireframes & interactive prototypes",
      "UI design for web & mobile",
      "Stack-aware UX (feasibility built in)",
      "Usability testing & dev-ready Figma handoff",
    ],
    accent: "#c9aa7c",
    media: media("03"),
  },
  {
    id: "systems",
    num: "02",
    title: "Design Systems & AI",
    desc: "Scalable design systems with AI-native workflows. At Toke I built a Claude MCP-integrated system that cut design cycles in half across three enterprise clients.",
    includes: [
      "Component libraries & tokens",
      "Documentation & governance",
      "Claude MCP & AI tooling",
      "Cross-team design ops",
      "Regulatory & compliance patterns",
    ],
    accent: "#9b7ec8",
    media: media("02"),
  },
  {
    id: "zero-to-one",
    num: "03",
    title: "0→1 Product Strategy",
    desc: "For founders and teams launching something new. I shape the product story, define the MVP scope, and design experiences that convert — not just look good.",
    includes: [
      "Product discovery & positioning",
      "MVP scoping & prioritisation",
      "Onboarding & retention UX",
      "Growth & conversion flows",
      "Pitch decks & investor materials",
    ],
    accent: "#5ecfb1",
    media: media("07"),
  },
  {
    id: "motion",
    num: "04",
    title: "Motion & Prototyping",
    desc: "High-fidelity motion that sells the product before anyone reads a word. Launch videos, product walkthroughs, and micro-interactions that make interfaces feel alive.",
    includes: [
      "Product launch videos",
      "UI motion & micro-interactions",
      "Interactive prototypes",
      "Marketing & social cuts",
      "Lottie & web animations",
    ],
    accent: "#f0c060",
    media: media("02"),
  },
  {
    id: "frontend",
    num: "05",
    title: "Front-End Development",
    desc: "I don't stop at Figma — I ship front-end in React, Vite, and Next.js. I work alongside backend engineers on APIs and integration, so design decisions stay grounded in what your stack can deliver.",
    includes: [
      "React, Vite & Next.js front-end",
      "Design-to-code — I build what I design",
      "Collaboration with backend engineers",
      "API integration & component implementation",
      "Designs scoped to real technical constraints",
    ],
    accent: "#5ba3f5",
    media: media("07"),
  },
]
