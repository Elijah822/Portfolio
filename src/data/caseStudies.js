// Case study content sourced from Google Docs (public export)
export const CASE_STUDIES = {
  "02": {
    docUrl: "https://docs.google.com/document/d/1ChYHqMfBycpp4P4KBoxAtJ6oZiLi5A9IoGFLxJYM3XI/edit",
    role: "Lead UX/Product Designer",
    productType: "Retail Self-Checkout · Mobile",
    overview:
      "QueuePay is a smart mobile self-checkout system built to help retail stores cut down long checkout lines. Customers scan items with their phones and pay instantly — no extra hardware required.",
    problem:
      "Retail stores still struggle with long checkout lines, especially during busy hours. Traditional POS systems depend heavily on staff availability, while self-checkout stations are expensive and slow when customers have trouble scanning. Advanced solutions like Amazon's Just Walk Out require costly infrastructure.",
    solution:
      "QueuePay gives shoppers a way to check out without standing in long lines. Customers pick items, scan with their phone, pay however they prefer, and show a digital receipt at the exit. For store owners, a simple QR code and easy-to-manage dashboard are all they need.",
    features: [
      { title: "Smart Mobile Self-Checkout", desc: "Customers scan barcodes or enter product codes manually. The app keeps a running total so they always know what they're spending." },
      { title: "Multiple Payment Options", desc: "Pay by transfer, debit/credit card, or cash at the cashier. Instant payment confirmation and receipt generation." },
      { title: "Secure Checkout Checkpoint", desc: "A digital receipt with a scannable code allows security to verify purchases quickly without slowing customers down." },
      { title: "Clean Design System", desc: "Soft neutral palette, bold accent for key actions, consistent typography and reusable components across customer, cashier, and security interfaces." },
    ],
    impact: [
      "Checkout time reduced by up to 60%",
      "Transaction processing improved by 45% during peak hours",
      "Queue congestion reduced by approximately 40%",
      "Operational costs lowered by up to 30%",
      "Customer satisfaction improved — clearer, faster, less stressful checkout",
    ],
    conclusion:
      "Future improvements will focus on easier onboarding, loyalty integrations, and a smoother experience at the security checkpoint.",
  },
  "03": {
    docUrl: "https://docs.google.com/document/d/1MBuWculh8cmyFkV6YTYoB46WUmCmqyjtKmUFB1250lw/edit",
    role: "UI/UX Designer & Product Designer",
    productType: "Medical Simulation & Clinical Training",
    overview:
      "SimPat is a clinical training platform that helps medical students and doctors practice patient consultations through realistic simulated scenarios — built around the structure of real OSCE exams.",
    problem:
      "Many simulation platforms struggle to feel realistic and easy to use. The earlier version had slow-loading case cards, premium-gated tools, visual clutter, and text-only interaction that reduced immersion in clinical practice.",
    goal:
      "Improve usability and realism so doctors can practice consultations in a way that feels natural, structured, and closer to real clinical interactions.",
    solution:
      "The platform was redesigned around a clear workflow: Explore cases → Start simulation → Review feedback. Voice-based consultation replaced text-only interaction, and a side-by-side transcript + AI examiner feedback experience strengthened the learning loop.",
    highlights: [
      "Improved case discovery with ratings and difficulty indicators",
      "Fixed slow-loading case cards that previously appeared broken",
      "Replaced text-heavy interaction with voice-based simulations",
      "Simplified the simulation interface by reducing visual clutter",
      "Made the consultation timer accessible to all users",
      "Introduced participant system for collaborative training scenarios",
      "Designed side-by-side transcript and AI examiner feedback experience",
    ],
    impact: [
      "Simulation start rates increased by approximately 35%",
      "Average completion rates improved by 28%",
      "Case selection time decreased by 40%",
      "Users spent 2× longer reviewing transcripts and feedback",
    ],
    conclusion:
      "Through usability improvements, product thinking, and realistic interaction design, SimPat moves closer to its mission of bringing life to medicine through simulated patient experiences.",
  },
  "04": {
    docUrl: "https://docs.google.com/document/d/1R_vC6x2TyhNrT7VsrtSxfwunvhQXv327/edit",
    role: "Product Design & UX Strategy",
    productType: "Learning Resource & School Management Platform",
    overview:
      "The Autism Helper is a digital platform supporting educators and schools working with autistic students — structured learning materials, assessments, and subscription-based access in a single system.",
    problem:
      "Challenges spanned UX, system architecture, and business model: a rigid 4-layer navigation hierarchy, fragmented Shopify integrations causing subscription sync failures, hardcoded content structure, and no school team management.",
    approach: [
      "Make access to content fast and predictable",
      "Bring critical system functions under control",
      "Shift the product from one-time usage to continuous engagement",
    ],
    solution:
      "Navigation was simplified from four layers to two. Subscription handling was restructured for immediate access. Content management became dynamic. Schools gained seat management, roles, and permissions. A student assessment system encouraged continuous engagement.",
    highlights: [
      "Navigation restructure: Subject → Level → Unit → Resource reduced to a faster 2-layer structure",
      "Controlled subscription flow with immediate payment-to-access alignment",
      "Flexible content management — categories, classes, and resources without developer intervention",
      "School and seat management with roles, permissions, and team invites",
      "Student assessment system with immediate results",
      "Progress tracking and ongoing content updates for continuous engagement",
    ],
    impact: [
      "Time to locate resources reduced by over 50%",
      "Task completion for accessing materials increased by approximately 70%",
      "Subscription-related support issues reduced by more than 50%",
      "Payment-to-access delays effectively eliminated",
      "Active monthly usage increased by 40%+",
      "Schools transitioned from shared accounts to structured access",
    ],
    conclusion:
      "The Autism Helper evolved from a content-driven platform into a structured system that supports both teaching and learning — easier to use, easier to manage, and more sustainable over time.",
  },
  "05": {
    docUrl: "https://docs.google.com/document/d/1zz1loB6rtQX5-xiOtHbVXYP65flR9w4BDa7JPt0EZw0/edit",
    role: "Product Designer & UI/UX Designer",
    productType: "iOS & Android Mobile App",
    overview:
      "Dreamtter is a personal growth companion app that helps users transform abstract dreams into actionable habits and measurable progress — guided by an AI sensei that keeps users focused and accountable.",
    problem:
      "Most people have dreams they want to pursue but struggle with vague aspirations, lack of structure, lost momentum without accountability, and isolation in their journey. Traditional goal apps miss the emotional and motivational aspects.",
    goal:
      "Create an experience where ambition meets structure — inspiring, not overwhelming — with AI-guided support and human connection through mentorship.",
    solution:
      "The core experience centres around 'The Guided Path': dream creation with AI prompts, habit tracker with visual progress, vision board, mentor connection, and task breakdown with deadlines and milestones. Bold purple/blue gradients and dreamy 3D illustrations set the visual tone.",
    highlights: [
      "Dream creation flows with AI-powered question prompts",
      "Habit tracker with visual progress indicators",
      "Vision board for visual goal representation",
      "Mentor connection for accountability partnerships",
      "Task breakdown system with deadlines and milestones",
    ],
    impact: [
      "68% onboarding completion — more than double the 20–30% industry average",
      "42% of users returned after 7 days",
      "Users broke dreams into an average of 3.2 habits and 8 tasks per dream",
      "35% increase in weekly active users with AI sensei vs. early beta",
    ],
    problemsSolved: [
      "Vague aspirations → Structured action through habit and task breakdown",
      "Lost momentum → Sustained engagement via AI sensei guidance",
    ],
    conclusion:
      "By combining structure with inspiration, guidance with autonomy, and individual progress with community support, Dreamtter bridges the gap between who we are and who we aspire to be.",
  },
  "06": {
    docUrl: "https://docs.google.com/document/d/1ETxZag8GQCnDgxl0yvWnrO-T4K34_Rdth3vZO4YgDBU/edit",
    role: "Lead UX/Product Designer",
    productType: "Career Management & Job Application Platform",
    overview:
      "Career Tracker Plus is a career management platform for modern professionals — track applications, tailor resumes, organise documents, record accomplishments, and plan long-term career growth in one place.",
    problem:
      "Finding a job has become a full-time job. People apply to several roles weekly, track conversations in different places, forget follow-ups, and send resumes not tailored to each role — creating frustration, burnout, and missed opportunities.",
    solution:
      "A single workspace for the entire job search: visual application pipeline, resume & cover letter builder tailored to job descriptions, document repository, career development system, accomplishment manager, and goal tracking.",
    features: [
      { title: "Job Application Tracker", desc: "Visual pipeline from saved to applied, interview, offer, and acceptance — with reminders and follow-ups." },
      { title: "Resume & Cover Letter Builder", desc: "Paste a job description and instantly generate tailored application materials." },
      { title: "Document Repository", desc: "Central hub for resumes, certificates, portfolios, and references." },
      { title: "Career Development System", desc: "Plan future roles, identify skill gaps, and map career moves." },
      { title: "Job Accomplishment Manager", desc: "Log wins, promotions, projects, and milestones as they happen." },
      { title: "Goal Tracking System", desc: "Set career goals and track measurable progress over time." },
    ],
    impact: [
      "Over 70% of users complete onboarding",
      "Users track an average of 8–10 applications per month",
      "More than 60% use resume tailoring for at least one application",
      "Most active users return weekly to update progress",
      "Acquired by LinkedIn",
    ],
    problemsSolved: [
      "Scattered job search → One organised system for all applications and follow-ups",
      "Generic resumes → Role-specific applications aligned to each job description",
      "Lost career history → Documented growth for future applications and reviews",
    ],
    conclusion:
      "When people are given the right structure, they apply with more confidence and stay in control of their career journey — not just more organised applications, but a better way to build a career.",
  },
  "07": {
    docUrl: "https://docs.google.com/document/d/1EnV3NOnfl4xMjPBKxxmeziL3argjPgiLOi-I2d2cKRY/edit",
    role: "Product Design & UX Strategy",
    productType: "Expert Consultation Platform",
    overview:
      "Svar.se connects people to verified experts for help with construction, interior design, garden projects, and accommodation — through video calls and chat, in real time.",
    problem:
      "When someone needs specialised help, they don't know where to begin. Online information is too general or contradictory. Getting professional help usually requires upfront payment and long back-and-forth — the earlier version's broad directories made it hard to know where to start.",
    goal:
      "Help people avoid costly mistakes by giving them easy access to expert guidance and the right professionals in one place.",
    solution:
      "Redesigned around: Search for help → Explore expert options → Decide how to move forward. AI-powered natural language search, user-controlled booking, guest access, free chat, and a 100% free first video session for new users.",
    highlights: [
      "Shifted from broad directories to a search-led, guided experience",
      "AI-powered search understands natural language and improves discovery",
      "Users control booking time and session length",
      "Guest access and free chat reduce early commitment",
      "100% free first session for new users encourages risk-free onboarding",
    ],
    impact: [
      "Search usage increased by over 40%",
      "Time reviewing expert profiles increased by about 30%",
      "Average time from search to booked session dropped to under 2 minutes",
      "Free chat usage grew by over 35%",
      "Checkout abandonment reduced by nearly 20%",
    ],
    conclusion:
      "Svar.se meets people where they are, removes friction from finding expert help, and guides users toward the right professionals without pressure.",
  },
  "01": {
    challenge:
      "Enterprise clients needed compliant payment, KYC, and design infrastructure at scale — without slowing delivery or exposing the business to regulatory penalty.",
    approach: [
      "Mapped regulatory requirements across EU DMA, Thailand, South Africa, and other markets.",
      "Built a Claude MCP-integrated design system automating tokens, components, and documentation.",
      "Operated as sole designer across three concurrent enterprise workstreams.",
    ],
    deliverables: ["Payment flows", "KYC compliance UX", "AI design system", "Enterprise dashboards"],
    outcomes: [
      "€40M+ regulatory exposure avoided across KYC workstreams.",
      "Tens of millions saved in App Store commission via compliant billing alternatives.",
      "50% faster design delivery through AI-assisted system workflows.",
    ],
  },
  "08": {
    challenge:
      "Identify major product opportunity gaps without internal roadmap access — then design and publish solutions before incumbents ship.",
    approach: [
      "Applied platform trajectory analysis and user psychology to read where Netflix and WhatsApp were heading.",
      "Designed and published public solutions for both opportunity gaps.",
    ],
    deliverables: ["Netflix Reels concept", "WhatsApp Channels monetization thesis"],
    outcomes: [
      "2/2 public predictions validated by shipped products.",
      "Estimated tens of millions in Netflix retention value.",
      "100M+ WhatsApp users onboarded to Channels infrastructure.",
    ],
  },
}

export function getCaseStudy(id) {
  return CASE_STUDIES[id] ?? null
}
