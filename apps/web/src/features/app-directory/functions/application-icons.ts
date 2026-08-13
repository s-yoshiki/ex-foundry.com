import { BarChart3, Gamepad2, Wrench } from "lucide-react";
import type { ApplicationCategory } from "../types/application";

export const CATEGORY_ICONS: Record<ApplicationCategory, typeof Wrench> = {
  data: BarChart3,
  entertainment: Gamepad2,
  tool: Wrench,
};
