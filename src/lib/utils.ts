import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/--+/g, "-") // Replace multiple - with single -
    .trim(); // Trim - from start and end
}

export function deslugify(slug: string): string {
  return slug
    .replace(/-/g, " ") // Replace - with space
    .replace(/(^\w|\s\w)/g, (letter) => letter.toUpperCase()); // Capitalize first letter of each word
}
