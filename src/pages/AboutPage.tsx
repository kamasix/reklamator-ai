import { Link } from "react-router-dom";
import { ShieldCheck, Cpu, Heart, ArrowRight, FileText } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DisclaimerBox } from "@/components/common/DisclaimerBox";

export function AboutPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">O aplikacji</h1>
        <p className="max-w-2xl text-muted-foreground">
          Reklamator AI to darmowe, lokalne narzędzie, które pomaga przygotować
          formalne pismo reklamacyjne lub odwoławcze po polsku. Powstało z myślą
          o osobach, które nie wiedzą, jak napisać reklamację, zwrot, gwarancję,
          odwołanie albo monit po nieautoryzowanej opłacie.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <FileText className="size-5" />
            </div>
            <CardTitle>Bez kosztów</CardTitle>
            <CardDescription>
              Aplikacja jest darmowa. Bez kont premium, bez ukrytych płatności,
              bez kampanii zachęcających do zakupu.
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex size-10 items-center justify-center rounded-lg bg-success/15 text-success">
              <Cpu className="size-5" />
            </div>
            <CardTitle>Pracuje lokalnie</CardTitle>
            <CardDescription>
              Generowanie pism i zapis spraw odbywają się w pamięci Twojej
              przeglądarki. Aplikacja nie wysyła Twoich danych na żaden serwer
              zewnętrzny.
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex size-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
              <ShieldCheck className="size-5" />
            </div>
            <CardTitle>Świadome ograniczenia</CardTitle>
            <CardDescription>
              Reklamator AI nie zastępuje porady prawnika. W skomplikowanych
              sprawach skorzystaj z pomocy rzecznika konsumentów, UOKiK lub
              kancelarii prawnej.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Do czego służy aplikacja</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-foreground/90">
          <p>
            Reklamator AI pomaga uporządkować fakty, daty i kwoty związane ze
            sprawą konsumencką. Na podstawie wybranej kategorii oraz Twoich
            odpowiedzi generuje pismo, które możesz wysłać do firmy (e-mailem
            lub listem poleconym), a także listę kroków do wykonania.
          </p>
          <p>
            Pismo można dowolnie edytować w przeglądarce, zmienić jego ton
            (formalny, stanowczy, krótki, bardzo dokładny, spokojny), a następnie
            skopiować lub pobrać jako PDF.
          </p>
          <p>
            Wszystkie sprawy możesz wyeksportować do pliku JSON i przenieść na
            inne urządzenie. To Twój własny, prywatny backup.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Zastrzeżenie prawne</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-foreground/90">
          <p>
            Aplikacja nie jest kancelarią prawną i nie zastępuje porady
            prawnika. Pomaga uporządkować informacje i przygotować pismo na
            podstawie danych wpisanych przez użytkownika. Przed wysłaniem
            sprawdź poprawność danych.
          </p>
          <p>
            Reklamator AI nie gwarantuje konkretnego rozstrzygnięcia sprawy. W
            skomplikowanych przypadkach – zwłaszcza dotyczących znacznych kwot,
            sporów z dużymi firmami lub spraw o znaczeniu prawnym – skorzystaj
            z pomocy specjalisty (rzecznik praw konsumentów, miejski rzecznik
            konsumentów, UOKiK, kancelaria prawna).
          </p>
        </CardContent>
      </Card>

      <DisclaimerBox />

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-4">
        <div className="flex items-center gap-2 text-sm">
          <Heart className="size-4 text-primary" />
          Aplikacja open-source. Możesz ją uruchomić u siebie na GitHub Pages.
        </div>
        <Button asChild variant="outline">
          <Link to="/cases/new">
            Rozpocznij sprawę
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
