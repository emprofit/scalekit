export type ScaleKitProductCategory =
  | "Research & Insights"
  | "SEO & Discovery"
  | "Performance & Speed"
  | "Themes & Design"
  | "API & Integration"
  | "CRO & Conversion"
  | "Automation & Growth"
  | "Technical Utilities";

export type ScaleKitProductImageKey =
  | "research-insights"
  | "seo-discovery"
  | "performance-speed"
  | "themes-design"
  | "api-integration"
  | "cro-conversion"
  | "automation-growth"
  | "technical-utilities";

export type ScaleKitProductDefinition = {
  id: string;
  slug: string;
  title: string;
  category: ScaleKitProductCategory;
  shortDescription: string;
  priceUsdCents: number;
  currency: "USD";
  featured: boolean;
  deliveryType: "email-download";
  fileKey: string;
  imageKey: ScaleKitProductImageKey;
  rating: number;
  reviewCount: number;
  details: {
    summary: string;
    businessBenefits: string[];
    productivityBenefits: string[];
  };
};

type RawScaleKitProduct = Omit<
  ScaleKitProductDefinition,
  "currency" | "featured" | "deliveryType" | "rating" | "reviewCount" | "details"
> & {
  summary: string;
  primaryBusinessBenefit: string;
  primaryProductivityBenefit: string;
};

const categoryBenefits: Record<
  ScaleKitProductCategory,
  { business: string; productivity: string }
> = {
  "Research & Insights": {
    business:
      "Supports better commercial decisions with clearer market and customer evidence.",
    productivity:
      "Reduces the time required to gather, organise, and interpret research inputs.",
  },
  "SEO & Discovery": {
    business:
      "Improves search visibility, discoverability, and technical search readiness.",
    productivity:
      "Turns repetitive search checks into a more structured and repeatable workflow.",
  },
  "Performance & Speed": {
    business:
      "Helps protect conversion, usability, and customer confidence through faster experiences.",
    productivity:
      "Makes performance issues easier to identify, prioritise, and resolve.",
  },
  "Themes & Design": {
    business:
      "Creates a more professional storefront experience aligned with customer expectations.",
    productivity:
      "Shortens design and implementation time with a reusable launch foundation.",
  },
  "API & Integration": {
    business:
      "Connects operational systems and commerce workflows more reliably.",
    productivity:
      "Reduces manual transfer, duplicated work, and avoidable integration delays.",
  },
  "CRO & Conversion": {
    business:
      "Strengthens buyer confidence and improves the path from interest to purchase.",
    productivity:
      "Provides a structured framework for identifying and acting on conversion opportunities.",
  },
  "Automation & Growth": {
    business:
      "Creates repeatable growth systems that can operate with less manual intervention.",
    productivity:
      "Automates recurring marketing preparation, activation, and follow-up tasks.",
  },
  "Technical Utilities": {
    business:
      "Reduces technical risk and protects the reliability of customer-facing experiences.",
    productivity:
      "Speeds up diagnosis and resolution with a focused technical workflow.",
  },
};

const rawProducts: RawScaleKitProduct[] = [
  {
    id: "sk_001",
    slug: "winning-product-research-tool",
    title: "Winning Product Research Tool",
    category: "Research & Insights",
    shortDescription:
      "A structured product research system for identifying stronger market opportunities.",
    priceUsdCents: 5000,
    fileKey: "winning-product-research-tool.zip",
    imageKey: "research-insights",
    summary:
      "Use a focused research workflow to compare product demand, competition, positioning, and commercial potential before committing resources.",
    primaryBusinessBenefit:
      "Helps reduce poor product decisions by screening opportunities against practical market signals.",
    primaryProductivityBenefit:
      "Keeps product findings, comparisons, and decisions in one repeatable process.",
  },
  {
    id: "sk_002",
    slug: "keyword-research-tool",
    title: "Keyword Research Tool",
    category: "SEO & Discovery",
    shortDescription:
      "Discover search demand, keyword opportunities, and content priorities more systematically.",
    priceUsdCents: 10000,
    fileKey: "keyword-research-tool.zip",
    imageKey: "seo-discovery",
    summary:
      "Build a clearer keyword strategy around search intent, opportunity, competition, and relevance to your products or services.",
    primaryBusinessBenefit:
      "Helps attract more relevant search traffic by aligning content with real customer queries.",
    primaryProductivityBenefit:
      "Organises keyword discovery and prioritisation into a faster research workflow.",
  },
  {
    id: "sk_003",
    slug: "audience-research-tool",
    title: "Audience Research Tool",
    category: "Research & Insights",
    shortDescription:
      "Understand customer needs, motivations, objections, language, and buying behaviour.",
    priceUsdCents: 10000,
    fileKey: "audience-research-tool.zip",
    imageKey: "research-insights",
    summary:
      "Develop practical audience insights that can improve product positioning, messaging, offers, and campaign decisions.",
    primaryBusinessBenefit:
      "Improves relevance by grounding commercial decisions in clearer customer understanding.",
    primaryProductivityBenefit:
      "Provides a reusable structure for collecting and converting audience information into action.",
  },
  {
    id: "sk_004",
    slug: "product-importation-tool",
    title: "Product Importation Tool",
    category: "API & Integration",
    shortDescription:
      "A structured tool for moving product data into a store with fewer manual errors.",
    priceUsdCents: 10000,
    fileKey: "product-importation-tool.zip",
    imageKey: "api-integration",
    summary:
      "Prepare, organise, and import product information more efficiently across supported commerce workflows.",
    primaryBusinessBenefit:
      "Helps accelerate catalogue setup while protecting product-data consistency.",
    primaryProductivityBenefit:
      "Reduces repetitive entry and simplifies bulk product preparation.",
  },
  {
    id: "sk_005",
    slug: "api-integration-tool",
    title: "API Integration Tool",
    category: "API & Integration",
    shortDescription:
      "Connect applications, services, and commerce workflows through a clearer integration process.",
    priceUsdCents: 25000,
    fileKey: "api-integration-tool.zip",
    imageKey: "api-integration",
    summary:
      "Use a practical integration framework to plan endpoints, authentication, data movement, error handling, and deployment checks.",
    primaryBusinessBenefit:
      "Enables more connected customer and operational experiences across business systems.",
    primaryProductivityBenefit:
      "Makes integration requirements and implementation steps easier to manage.",
  },
  {
    id: "sk_006",
    slug: "cro-audit-tool",
    title: "CRO Audit Tool",
    category: "CRO & Conversion",
    shortDescription:
      "Audit conversion barriers across pages, offers, trust signals, and checkout journeys.",
    priceUsdCents: 5000,
    fileKey: "cro-audit-tool.zip",
    imageKey: "cro-conversion",
    summary:
      "Review the customer journey using a structured conversion audit that highlights friction, weak messaging, and missed buying triggers.",
    primaryBusinessBenefit:
      "Helps improve conversion decisions by exposing the most important points of customer friction.",
    primaryProductivityBenefit:
      "Turns a broad conversion review into a prioritised audit workflow.",
  },
  {
    id: "sk_007",
    slug: "velocitycore-performance-analyzer",
    title: "VelocityCore Performance Analyzer",
    category: "Performance & Speed",
    shortDescription:
      "Analyse website performance bottlenecks and establish practical optimisation priorities.",
    priceUsdCents: 12000,
    fileKey: "velocitycore-performance-analyzer.zip",
    imageKey: "performance-speed",
    summary:
      "Assess loading behaviour, page weight, responsiveness, and performance risks using a focused diagnostic process.",
    primaryBusinessBenefit:
      "Supports faster customer experiences that can improve engagement and conversion.",
    primaryProductivityBenefit:
      "Helps technical teams prioritise performance work instead of troubleshooting without direction.",
  },
  {
    id: "sk_008",
    slug: "hyperlink-integrity-scanner",
    title: "HyperLink Integrity Scanner",
    category: "SEO & Discovery",
    shortDescription:
      "Identify broken, redirected, unsafe, or inconsistent links across website content.",
    priceUsdCents: 7000,
    fileKey: "hyperlink-integrity-scanner.zip",
    imageKey: "seo-discovery",
    summary:
      "Review internal and external links to protect navigation quality, search signals, and customer trust.",
    primaryBusinessBenefit:
      "Reduces customer frustration and search-quality problems caused by unreliable links.",
    primaryProductivityBenefit:
      "Speeds up link checking and creates a clearer repair list.",
  },
  {
    id: "sk_009",
    slug: "indexsync-robots",
    title: "IndexSync Robots",
    category: "SEO & Discovery",
    shortDescription:
      "Coordinate crawler access, indexing rules, and search-engine readiness.",
    priceUsdCents: 15000,
    fileKey: "indexsync-robots.zip",
    imageKey: "seo-discovery",
    summary:
      "Review robots directives and indexing controls so important pages remain discoverable while restricted areas stay protected.",
    primaryBusinessBenefit:
      "Helps prevent valuable pages from being hidden or low-value pages from being indexed unnecessarily.",
    primaryProductivityBenefit:
      "Centralises crawler and indexing checks in a repeatable technical process.",
  },
  {
    id: "sk_010",
    slug: "seo-optimization-tool",
    title: "SEO Optimization Tool",
    category: "SEO & Discovery",
    shortDescription:
      "A comprehensive SEO implementation system for technical, on-page, and content improvements.",
    priceUsdCents: 85000,
    fileKey: "seo-optimization-tool.zip",
    imageKey: "seo-discovery",
    summary:
      "Plan and execute search optimisation across site structure, metadata, content, internal linking, and technical readiness.",
    primaryBusinessBenefit:
      "Supports sustainable organic visibility and stronger search acquisition.",
    primaryProductivityBenefit:
      "Combines major SEO workstreams into a single prioritised implementation framework.",
  },
  {
    id: "sk_011",
    slug: "speed-optimization-tool",
    title: "Speed Optimization Tool",
    category: "Performance & Speed",
    shortDescription:
      "Improve loading speed, responsiveness, and Core Web Vitals through a structured workflow.",
    priceUsdCents: 40000,
    fileKey: "speed-optimization-tool.zip",
    imageKey: "performance-speed",
    summary:
      "Identify and address performance issues involving assets, scripts, rendering, caching, and page delivery.",
    primaryBusinessBenefit:
      "Helps protect user experience, search performance, and conversion on slower pages.",
    primaryProductivityBenefit:
      "Provides a clear sequence for diagnosing, implementing, and verifying speed improvements.",
  },
  {
    id: "sk_012",
    slug: "custom-premium-theme",
    title: "Custom Premium Theme",
    category: "Themes & Design",
    shortDescription:
      "A premium customisable theme foundation for a distinctive, conversion-ready storefront.",
    priceUsdCents: 50000,
    fileKey: "custom-premium-theme.zip",
    imageKey: "themes-design",
    summary:
      "Launch a highly adaptable storefront experience with stronger design flexibility, presentation, and commercial structure.",
    primaryBusinessBenefit:
      "Supports a more differentiated brand and customer experience.",
    primaryProductivityBenefit:
      "Reduces the time needed to build a premium storefront foundation from scratch.",
  },
  {
    id: "sk_013",
    slug: "advanced-premium-theme",
    title: "Advanced Premium Theme",
    category: "Themes & Design",
    shortDescription:
      "An advanced storefront theme with richer presentation and commerce-ready components.",
    priceUsdCents: 35000,
    fileKey: "advanced-premium-theme.zip",
    imageKey: "themes-design",
    summary:
      "Use an enhanced theme structure designed for professional product presentation, navigation, and conversion.",
    primaryBusinessBenefit:
      "Improves storefront credibility and supports more sophisticated selling experiences.",
    primaryProductivityBenefit:
      "Provides advanced reusable components that shorten implementation time.",
  },
  {
    id: "sk_014",
    slug: "basic-premium-theme",
    title: "Basic Premium Theme",
    category: "Themes & Design",
    shortDescription:
      "A clean, practical premium theme for launching a professional storefront quickly.",
    priceUsdCents: 20000,
    fileKey: "basic-premium-theme.zip",
    imageKey: "themes-design",
    summary:
      "Start with a polished theme foundation focused on clarity, usability, and dependable product presentation.",
    primaryBusinessBenefit:
      "Helps smaller stores establish a more professional digital presence.",
    primaryProductivityBenefit:
      "Simplifies launch by providing a ready-made visual and layout foundation.",
  },
  {
    id: "sk_015",
    slug: "robot-txt-tool",
    title: "Robot TXT Tool",
    category: "SEO & Discovery",
    shortDescription:
      "Create, review, and validate robots.txt rules with greater confidence.",
    priceUsdCents: 15000,
    fileKey: "robot-txt-tool.zip",
    imageKey: "seo-discovery",
    summary:
      "Manage crawler permissions and exclusions while reducing the risk of accidental indexing restrictions.",
    primaryBusinessBenefit:
      "Protects search visibility by reducing harmful robots.txt mistakes.",
    primaryProductivityBenefit:
      "Makes crawler-rule preparation and validation faster and easier to document.",
  },
  {
    id: "sk_016",
    slug: "broken-links-tool",
    title: "Broken Links Tool",
    category: "SEO & Discovery",
    shortDescription:
      "Find and organise broken-link issues before they affect customers or search performance.",
    priceUsdCents: 25000,
    fileKey: "broken-links-tool.zip",
    imageKey: "seo-discovery",
    summary:
      "Identify broken internal and external destinations, classify their impact, and prepare a reliable correction plan.",
    primaryBusinessBenefit:
      "Protects navigation quality, trust, and search equity across the website.",
    primaryProductivityBenefit:
      "Produces a structured repair workflow instead of relying on manual page-by-page checks.",
  },
  {
    id: "sk_017",
    slug: "api-plugin",
    title: "API Plugin",
    category: "API & Integration",
    shortDescription:
      "A reusable plugin foundation for adding API-powered capabilities to supported systems.",
    priceUsdCents: 20000,
    fileKey: "api-plugin.zip",
    imageKey: "api-integration",
    summary:
      "Extend supported platforms with a structured API plugin approach covering requests, responses, configuration, and error handling.",
    primaryBusinessBenefit:
      "Enables new connected features without rebuilding the entire application.",
    primaryProductivityBenefit:
      "Provides reusable integration patterns that shorten implementation time.",
  },
  {
    id: "sk_018",
    slug: "trust-badges",
    title: "Trust Badges",
    category: "CRO & Conversion",
    shortDescription:
      "Add clear trust, payment, security, and assurance signals to customer journeys.",
    priceUsdCents: 8000,
    fileKey: "trust-badges.zip",
    imageKey: "cro-conversion",
    summary:
      "Use practical trust assets and placement guidance to reduce hesitation around products, payments, and fulfilment.",
    primaryBusinessBenefit:
      "Helps strengthen customer confidence at important purchase-decision points.",
    primaryProductivityBenefit:
      "Provides ready-to-use trust elements and a clearer placement workflow.",
  },
  {
    id: "sk_019",
    slug: "conversation-booster",
    title: "Conversation Booster",
    category: "CRO & Conversion",
    shortDescription:
      "Improve sales conversations, objection handling, and conversion-focused customer engagement.",
    priceUsdCents: 150000,
    fileKey: "conversation-booster.zip",
    imageKey: "cro-conversion",
    summary:
      "Apply a structured conversation system to move prospects from enquiry to clearer decisions and stronger next actions.",
    primaryBusinessBenefit:
      "Supports higher-quality customer conversations and more consistent conversion opportunities.",
    primaryProductivityBenefit:
      "Gives teams reusable prompts, response structures, and follow-up workflows.",
  },
  {
    id: "sk_020",
    slug: "direct-revenue-trigger-tool",
    title: "Direct Revenue Trigger Tool (DRT 0.2)",
    category: "CRO & Conversion",
    shortDescription:
      "Identify and deploy direct response triggers around high-intent customer actions.",
    priceUsdCents: 50000,
    fileKey: "direct-revenue-trigger-tool.zip",
    imageKey: "cro-conversion",
    summary:
      "Create focused revenue triggers that connect buyer intent, offers, urgency, proof, and clear calls to action.",
    primaryBusinessBenefit:
      "Helps convert high-intent moments into measurable revenue opportunities.",
    primaryProductivityBenefit:
      "Provides a repeatable system for planning, deploying, and reviewing conversion triggers.",
  },
  {
    id: "sk_021",
    slug: "demand-traffic-transformer-tool",
    title: "Demand Traffic Transformer Tool (DTT 0.1.2)",
    category: "Automation & Growth",
    shortDescription:
      "Turn market demand into structured, qualified traffic acquisition workflows.",
    priceUsdCents: 65000,
    fileKey: "demand-traffic-transformer-tool.zip",
    imageKey: "automation-growth",
    summary:
      "Connect demand signals, audience intent, channels, and campaign actions into a more deliberate traffic system.",
    primaryBusinessBenefit:
      "Improves the quality and commercial relevance of acquired traffic.",
    primaryProductivityBenefit:
      "Organises demand-to-traffic planning into a reusable execution framework.",
  },
  {
    id: "sk_022",
    slug: "dynamic-marketing-trigger-tool",
    title: "Dynamic Marketing Trigger Tool (DMT 0.2)",
    category: "Automation & Growth",
    shortDescription:
      "Activate contextual marketing actions based on customer behaviour and timing.",
    priceUsdCents: 120000,
    fileKey: "dynamic-marketing-trigger-tool.zip",
    imageKey: "automation-growth",
    summary:
      "Plan dynamic triggers that respond to visitor activity, purchase intent, lifecycle stage, and campaign conditions.",
    primaryBusinessBenefit:
      "Enables more relevant and timely marketing interactions.",
    primaryProductivityBenefit:
      "Reduces manual campaign intervention through structured trigger logic.",
  },
  {
    id: "sk_023",
    slug: "ma-research-plugin",
    title: "M&A Research Plugin",
    category: "Research & Insights",
    shortDescription:
      "A structured research plugin for screening merger and acquisition opportunities.",
    priceUsdCents: 25000,
    fileKey: "ma-research-plugin.zip",
    imageKey: "research-insights",
    summary:
      "Organise company, market, strategic-fit, risk, and due-diligence observations for preliminary M&A research.",
    primaryBusinessBenefit:
      "Supports clearer early-stage assessment of acquisition or partnership opportunities.",
    primaryProductivityBenefit:
      "Centralises preliminary M&A research into a repeatable review structure.",
  },
  {
    id: "sk_024",
    slug: "automated-pre-marketing-machine",
    title: "Automated Pre-Marketing Machine (APM)",
    category: "Automation & Growth",
    shortDescription:
      "Automate campaign preparation, asset readiness, and pre-launch marketing workflows.",
    priceUsdCents: 110000,
    fileKey: "automated-pre-marketing-machine.zip",
    imageKey: "automation-growth",
    summary:
      "Prepare campaigns through a structured system covering audience inputs, messaging, assets, channels, checks, and launch readiness.",
    primaryBusinessBenefit:
      "Improves campaign consistency before marketing spend is activated.",
    primaryProductivityBenefit:
      "Reduces repetitive preparation work and missed pre-launch tasks.",
  },
  {
    id: "sk_025",
    slug: "automated-google-search-marketing-machine",
    title: "Automated Google Search Marketing Machine (AGAMM)",
    category: "SEO & Discovery",
    shortDescription:
      "Systematise Google search marketing research, campaign preparation, and optimisation.",
    priceUsdCents: 120000,
    fileKey: "automated-google-search-marketing-machine.zip",
    imageKey: "seo-discovery",
    summary:
      "Coordinate keyword intent, campaign structure, landing-page alignment, measurement, and optimisation for Google search marketing.",
    primaryBusinessBenefit:
      "Supports more deliberate and commercially aligned search acquisition.",
    primaryProductivityBenefit:
      "Automates and standardises recurring search-marketing preparation tasks.",
  },
  {
    id: "sk_026",
    slug: "technical-error-javascript",
    title: "Technical Error JavaScript (TESV)",
    category: "Technical Utilities",
    shortDescription:
      "Diagnose, organise, and resolve JavaScript errors through a focused technical workflow.",
    priceUsdCents: 40000,
    fileKey: "technical-error-javascript.zip",
    imageKey: "technical-utilities",
    summary:
      "Use a systematic process for collecting error evidence, isolating causes, prioritising fixes, and verifying JavaScript stability.",
    primaryBusinessBenefit:
      "Helps reduce customer-facing failures caused by unresolved JavaScript issues.",
    primaryProductivityBenefit:
      "Speeds up debugging by replacing unstructured trial-and-error with a repeatable process.",
  },
];

export const scaleKitProductDefinitions: ScaleKitProductDefinition[] =
  rawProducts.map((product) => {
    const category = categoryBenefits[product.category];

    return {
      id: product.id,
      slug: product.slug,
      title: product.title,
      category: product.category,
      shortDescription: product.shortDescription,
      priceUsdCents: product.priceUsdCents,
      currency: "USD",
      featured: true,
      deliveryType: "email-download",
      fileKey: product.fileKey,
      imageKey: product.imageKey,
      rating: 0,
      reviewCount: 0,
      details: {
        summary: product.summary,
        businessBenefits: [
          product.primaryBusinessBenefit,
          category.business,
          "Provides a clearer implementation path supported by secure product delivery.",
        ],
        productivityBenefits: [
          product.primaryProductivityBenefit,
          category.productivity,
          "Keeps the resource available for repeat use after secure download.",
        ],
      },
    };
  });

export function getScaleKitProductDefinitionById(productId: string) {
  return scaleKitProductDefinitions.find((product) => product.id === productId);
}