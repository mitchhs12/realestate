import { Inter, Montserrat } from "next/font/google";

export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700"],
});
