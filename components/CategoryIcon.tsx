import {
  Brain,
  MessageSquare,
  Workflow,
  Database,
  ScanEye,
  Bot,
  Rocket,
  Target,
  Tag,
  type LucideIcon,
} from "lucide-react";

// One lucide glyph per taxonomy category (replaces the old emoji map). Keeping
// a single icon family + shared strokeWidth per the design system's icon rule.
const CATEGORY_ICON_MAP: Record<string, LucideIcon> = {
  "AI/ML Engineering": Brain,
  "LLM & Prompt Engineering": MessageSquare,
  "Automation / RPA": Workflow,
  "Data Engineering": Database,
  "Computer Vision": ScanEye,
  "Conversational AI / Chatbot": Bot,
  MLOps: Rocket,
  "AI Product / Strategy": Target,
};

export function CategoryIcon({
  category,
  size = 18,
  className,
}: {
  category: string;
  size?: number;
  className?: string;
}) {
  const Icon = CATEGORY_ICON_MAP[category] ?? Tag;
  return <Icon size={size} strokeWidth={1.75} className={className} aria-hidden />;
}
