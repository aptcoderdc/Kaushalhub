import { GraduationCap, School, Sparkles, type LucideIcon } from "lucide-react";
import { programs } from "@/lib/programs";

/** Featured program, promoted in navigation and on the homepage. */
export const featuredProgram = {
  to: "/experience-to-enterprise",
  title: "Experience to Enterprise",
  tagline: "Test the leap before you take it.",
  description: "A 12-week venture-building program for experienced professionals exploring entrepreneurship.",
} as const;

const icons: Record<string, LucideIcon> = {
  "entrepreneurship-for-school-students": School,
  "entrepreneurship-for-undergraduates": GraduationCap,
  "generative-ai-in-action": Sparkles,
};

/**
 * The other programs, straight from the program data: title, description, destination and
 * stated eligibility. Only the icon is presentational.
 */
export const supportingPrograms = programs.map((program) => ({
  to: program.path,
  title: program.title,
  description: program.description,
  eligibility: program.metadata.find((item) => item.label === "Eligibility")?.value ?? "",
  metadata: program.metadata,
  icon: icons[program.slug] ?? Sparkles,
}));
