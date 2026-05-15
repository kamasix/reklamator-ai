import { Link } from "react-router-dom";
import {
  Sparkles,
  ShieldCheck,
  FileText,
  ListChecks,
  Lock,
  Cpu,
  Mail,
  ArrowRight,
  CheckCircle2,
  Banknote,
  Box,
  Truck,
  CreditCard,
  Wrench,
  Wifi,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DisclaimerBox } from "@/components/common/DisclaimerBox";

const HOW_IT_WORKS = [
  {
    icon: ListChecks,
    title: "1. Wybierz typ sprawy",
    description:
      "Reklamacja, zwrot, gwarancja, brak dostawy, nieautoryzowana opłata, zablokowane konto i inne.",
  },
  {
    icon: FileText,
    title: "2. Odpowiedz na kilka pytań",
    description:
      "Krótki kreator zbiera dane potrzebne do napisania konkretnego pisma.",
  },
  {
    icon: Sparkles,
    title: "3. Otrzymaj gotowe pismo",
    description:
      "Generator składa formalne pismo po polsku, checklistę i miejsce na notatki. PDF jednym kliknięciem.",
  },
];

const EXAMPLES = [
  { icon: Banknote, title: "Sklep nie chce oddać pieniędzy" },
  { icon: Truck, title: "Paczka nie dotarła" },
  { icon: Box, title: "Produkt ma wadę" },
  { icon: Wrench, title: "Serwis odrzucił gwarancję" },
  { icon: CreditCard, title: "Nieautoryzowana opłata" },
  { icon: Lock, title: "Zablokowane konto online" },
  { icon: Mail, title: "Support nie odpowiada" },
  { icon: Wifi, title: "Problem z operatorem" },
];

const SECURITY = [
  {
    icon: Lock,
    title: "Bez konta i logowania",
    description:
      "Nie zakładasz konta. Nie podajesz numeru telefonu. Aplikacja po prostu działa.",
  },
  {
    icon: Cpu,
    title: "Pracuje w Twojej przeglądarce",
    description:
      "Generowanie pisma i zapis spraw odbywają się lokalnie. Twoje dane nie są wysyłane na żaden serwer.",
  },
  {
    icon: ShieldCheck,
    title: "Możesz zrobić własny backup",
    description:
      "Wyeksportuj wszystkie sprawy do pliku JSON i przenieś je na inne urządzenie. Bez chmury.",
  },
];

const FAQ = [
  {
    q: "Czy Reklamator AI jest całkowicie darmowy?",
    a: "Tak. Aplikacja jest w 100% darmowa. Nie ma kont premium, planów płatnych ani ukrytych opłat.",
  },
  {
    q: "Czy moje dane są bezpieczne?",
    a: "Wszystkie sprawy są zapisywane w pamięci Twojej przeglądarki (IndexedDB). Nie są wysyłane na żaden serwer. Jeżeli wyczyścisz dane przeglądarki, sprawy znikną – pamiętaj o eksporcie kopii JSON.",
  },
  {
    q: "Czy aplikacja zastępuje prawnika?",
    a: "Nie. Reklamator AI pomaga uporządkować informacje i przygotować pismo. W skomplikowanych sprawach skonsultuj się z prawnikiem, rzecznikiem konsumentów lub UOKiK.",
  },
  {
    q: "Czy mogę używać aplikacji offline?",
    a: "Tak. Po pierwszym otwarciu aplikacja działa również w trybie offline (PWA). Możesz dodać ją do ekranu domowego.",
  },
  {
    q: "Co jeśli zmienię urządzenie?",
    a: "Skorzystaj z opcji „Eksportuj dane” w ustawieniach, prześlij plik JSON na nowe urządzenie i zaimportuj go.",
  },
];

export function LandingPage() {
  return (
    <div className="space-y-16">
      <section className="grid items-center gap-8 pt-2 lg:grid-cols-[1.1fr_1fr]">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
            <Sparkles className="size-3.5 text-primary" />
            Darmowy generator reklamacji
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Wygeneruj reklamację za darmo
          </h1>
          <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
            Opisz problem, wybierz typ sprawy, a Reklamator AI przygotuje gotowe
            pismo, checklistę i PDF. Bez konta, bez płatności, bez wysyłania
            danych na serwer.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <Link to="/cases/new">
                Rozpocznij sprawę
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="#przyklady">Zobacz przykłady</a>
            </Button>
          </div>
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="size-4 text-success" />
              Bez konta
            </li>
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="size-4 text-success" />
              Bez płatności
            </li>
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="size-4 text-success" />
              Działa lokalnie
            </li>
            <li className="flex items-center gap-1.5">
              <CheckCircle2 className="size-4 text-success" />
              Po polsku
            </li>
          </ul>
        </div>
        <Card className="overflow-hidden">
          <CardContent className="space-y-3 p-6">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
              <FileText className="size-4 text-primary" />
              Przykładowe pismo
            </div>
            <div className="letter-paper text-sm">
              <div>[Imię i nazwisko]</div>
              <div className="mt-1">12 maja 2026</div>
              <div className="mt-3">
                ABC Sklep sp. z o.o.
                <br />
                [Adres siedziby]
              </div>
              <div className="mt-4 font-semibold">
                Dotyczy: Żądanie zwrotu pieniędzy – zamówienie ZA-2024-12345
              </div>
              <div className="mt-3">Szanowni Państwo,</div>
              <div className="mt-2">
                Niniejszym wnoszę o zwrot uiszczonej przeze mnie kwoty 299,00 zł
                w związku z transakcją z dnia 28 kwietnia 2026 (numer
                zamówienia: ZA-2024-12345)…
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">Jak to działa</h2>
          <p className="max-w-2xl text-muted-foreground">
            Trzy proste kroki. Nie musisz znać prawa ani umieć pisać pism –
            wystarczy, że opowiesz, co się stało.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {HOW_IT_WORKS.map((step) => (
            <Card key={step.title}>
              <CardHeader>
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <step.icon className="size-5" />
                </div>
                <CardTitle>{step.title}</CardTitle>
                <CardDescription>{step.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section id="przyklady" className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">
            Przykładowe sprawy
          </h2>
          <p className="text-muted-foreground">
            Te problemy najczęściej rozwiązują użytkownicy Reklamator AI.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {EXAMPLES.map((example) => (
            <div
              key={example.title}
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-4"
            >
              <div className="flex size-9 items-center justify-center rounded-lg bg-muted text-primary">
                <example.icon className="size-4" />
              </div>
              <div className="text-sm font-medium">{example.title}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">
            Dlaczego działa bez konta i bezpiecznie
          </h2>
          <p className="text-muted-foreground">
            Reklamator AI jest świadomie zaprojektowany jako narzędzie 100%
            lokalne. Nie potrzebujemy Twoich danych do działania.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SECURITY.map((item) => (
            <Card key={item.title}>
              <CardHeader>
                <div className="flex size-10 items-center justify-center rounded-lg bg-success/15 text-success">
                  <item.icon className="size-5" />
                </div>
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">FAQ</h2>
          <p className="text-muted-foreground">
            Krótkie odpowiedzi na najczęstsze pytania.
          </p>
        </div>
        <div className="space-y-3">
          {FAQ.map((item) => (
            <Card key={item.q}>
              <CardHeader>
                <CardTitle className="text-base">{item.q}</CardTitle>
                <CardDescription className="text-sm leading-relaxed text-foreground/80">
                  {item.a}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <DisclaimerBox />
    </div>
  );
}
