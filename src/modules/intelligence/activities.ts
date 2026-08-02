import {
  BookOpen,
  Brain,
  BrainCircuit,
  Calculator,
  Code2,
  Crown,
  FlaskConical,
  GraduationCap,
  Languages,
  Music2,
  Palette,
  PenLine,
  Search,
  type LucideIcon,
} from "lucide-react";

export const intelligenceActivityTypes = [
  "programming",
  "reading",
  "chess",
  "study",
  "languages",
  "mathematics",
  "science",
  "writing",
  "music_practice",
  "online_course",
  "research",
  "memory_training",
  "creative_projects",
  "custom",
] as const;

export type IntelligenceActivityType = (typeof intelligenceActivityTypes)[number];

export type IntelligenceActivity = {
  type: IntelligenceActivityType;
  label: string;
  description: string;
  icon: LucideIcon;
};

export const intelligenceActivities: IntelligenceActivity[] = [
  { type: "programming", label: "Programación", description: "Desarrollo, arquitectura y resolución técnica", icon: Code2 },
  { type: "reading", label: "Lectura", description: "Conocimiento adquirido mediante lectura formativa", icon: BookOpen },
  { type: "chess", label: "Ajedrez", description: "Estrategia, partidas y análisis", icon: Crown },
  { type: "study", label: "Estudio académico", description: "Aprendizaje estructurado de una disciplina", icon: GraduationCap },
  { type: "languages", label: "Idiomas", description: "Estudio y práctica de una lengua", icon: Languages },
  { type: "mathematics", label: "Matemáticas", description: "Teoría, problemas y razonamiento", icon: Calculator },
  { type: "science", label: "Ciencia", description: "Conocimiento y práctica científica", icon: FlaskConical },
  { type: "writing", label: "Escritura", description: "Redacción, ensayo o creación narrativa", icon: PenLine },
  { type: "music_practice", label: "Práctica musical", description: "Técnica, teoría y entrenamiento auditivo", icon: Music2 },
  { type: "online_course", label: "Curso o certificación", description: "Formación guiada y progreso estructurado", icon: GraduationCap },
  { type: "research", label: "Investigación", description: "Búsqueda, análisis y síntesis de información", icon: Search },
  { type: "memory_training", label: "Memoria y lógica", description: "Entrenamiento cognitivo y razonamiento", icon: BrainCircuit },
  { type: "creative_projects", label: "Proyecto creativo", description: "Diseño, creación y experimentación", icon: Palette },
  { type: "custom", label: "Otra disciplina", description: "Define tu propia ruta de desarrollo", icon: Brain },
];

export function getIntelligenceActivity(type: string | null | undefined) {
  return intelligenceActivities.find((activity) => activity.type === type) ?? intelligenceActivities[0];
}

export function intelligenceActivityLabel(type: string | null | undefined, customLabel?: string | null) {
  if (type === "custom" && customLabel?.trim()) return customLabel.trim();
  return getIntelligenceActivity(type).label;
}
