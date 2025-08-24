import type { ClassValue } from "clsx";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("vi-VN").format(value) + " đ";
}
