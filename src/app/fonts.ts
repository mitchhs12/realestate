import { Inter, Montserrat, Comfortaa, Poppins } from "next/font/google";

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

export const comfortaa = Comfortaa({
  subsets: ["latin"],
  display: "swap",
  style: ["normal"],
  weight: ["300", "400", "500", "600", "700"],
});

export const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});
