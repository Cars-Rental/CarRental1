import { hasLocale, NextIntlClientProvider } from "next-intl";
import { Geist, Geist_Mono, Cairo, Noto_Serif } from "next/font/google";
import { getMessages } from "next-intl/server";
import { AppProviders } from "@/providers/app-providers";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const cairo = Cairo({ variable: "--font-cairo", subsets: ["arabic", "latin"] });
const notoSerif = Noto_Serif({
  subsets: ["latin"],
  variable: "--font-noto-serif",
  display: "swap",
});

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  if (!hasLocale(routing.locales, locale)) notFound();

  const direction = locale === "ar" ? "rtl" : "ltr";

  return (
    <html
      lang={locale}
      dir={direction}
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${cairo.variable} ${notoSerif.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning>
        <NextIntlClientProvider messages={messages}>
          <AppProviders key={locale}>
            <Navbar locale={locale} />
            <main className="pt-16">{children}</main>
            <Footer locale={locale} />
          </AppProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
