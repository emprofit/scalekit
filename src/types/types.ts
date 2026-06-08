export type ModelSlug =
  | "node"
  | "consult"
  | "lab"
  | "leap"
  | "suite"
  | "cloud"
  | "ScaleKit"
  | "one";

export type ModelSection = {
  title: string;
  description: string;
  items?: string[];
};

export type ModelCTA = {
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
};

export type ModelConfig = {
  slug: ModelSlug;
  name: string;
  shortName: string;
  eyebrow: string;
  heroTitle: string;
  heroDescription: string;
  seoTitle: string;
  seoDescription: string;
  subdomain?: string;
  sections: ModelSection[];
  cta: ModelCTA;
};
