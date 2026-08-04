import {
  Grid2x2,
  Wine,
  Sparkles,
  Droplet,
  Flame,
  Coffee,
  CircleDashed,
  Sailboat,
  Leaf,
  CupSoda,
} from "lucide-react";
import type { CategoryId } from "@/lib/types";

export const CATEGORY_ICONS: Record<CategoryId, typeof Wine> = {
  all: Grid2x2,
  wine: Wine,
  champagne: Sparkles,
  vodka: Droplet,
  tequila: Flame,
  whiskey: Coffee,
  cognac: CircleDashed,
  rum: Sailboat,
  liqueur: Leaf,
  mixed: CupSoda,
};
