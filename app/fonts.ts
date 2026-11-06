import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";

export const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-heading",
  display: "swap",
});

export const geistSans = Geist({ variable: "--font-sans", subsets: ["latin"] });

export const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const fontVariables = `${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable}`;
