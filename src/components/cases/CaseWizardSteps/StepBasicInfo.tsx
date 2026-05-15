import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  stepBasicInfoSchema,
  type StepBasicInfoValues,
} from "@/types/schemas";

type StepBasicInfoProps = {
  values: StepBasicInfoValues;
  onChange: (values: StepBasicInfoValues) => void;
  onValidityChange: (valid: boolean) => void;
};

export function StepBasicInfo({
  values,
  onChange,
  onValidityChange,
}: StepBasicInfoProps) {
  const {
    register,
    watch,
    formState: { errors, isValid },
  } = useForm<StepBasicInfoValues>({
    resolver: zodResolver(stepBasicInfoSchema),
    mode: "onChange",
    defaultValues: values,
  });

  useEffect(() => {
    const subscription = watch((next) => {
      onChange(next as unknown as StepBasicInfoValues);
    });
    return () => subscription.unsubscribe();
  }, [watch, onChange]);

  useEffect(() => {
    onValidityChange(isValid);
  }, [isValid, onValidityChange]);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="md:col-span-2 space-y-1.5">
        <Label htmlFor="companyName">Nazwa firmy lub sklepu *</Label>
        <Input
          id="companyName"
          {...register("companyName")}
          placeholder="np. ABC Sklep sp. z o.o."
        />
        {errors.companyName ? (
          <p className="text-xs text-destructive">{errors.companyName.message}</p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="purchaseDate">Data zakupu</Label>
        <Input
          id="purchaseDate"
          type="date"
          {...register("purchaseDate")}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="orderNumber">Numer zamówienia / faktury</Label>
        <Input
          id="orderNumber"
          {...register("orderNumber")}
          placeholder="np. ZA-2024-12345"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="amount">Kwota</Label>
        <Input
          id="amount"
          {...register("amount")}
          placeholder="np. 299,99 zł"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="contactEmail">Twój e-mail kontaktowy</Label>
        <Input
          id="contactEmail"
          type="email"
          {...register("contactEmail")}
          placeholder="ty@example.com"
        />
        {errors.contactEmail ? (
          <p className="text-xs text-destructive">{errors.contactEmail.message}</p>
        ) : null}
      </div>

      <div className="md:col-span-2 space-y-1.5">
        <Label htmlFor="userGoal">Czego oczekujesz? *</Label>
        <Input
          id="userGoal"
          {...register("userGoal")}
          placeholder="np. zwrot pieniędzy, wymiana, odblokowanie konta"
        />
        {errors.userGoal ? (
          <p className="text-xs text-destructive">{errors.userGoal.message}</p>
        ) : null}
      </div>

      <div className="md:col-span-2 space-y-1.5">
        <Label htmlFor="shortProblemDescription">Krótki opis problemu *</Label>
        <Textarea
          id="shortProblemDescription"
          rows={4}
          {...register("shortProblemDescription")}
          placeholder="W kilku zdaniach opisz, co się stało."
        />
        {errors.shortProblemDescription ? (
          <p className="text-xs text-destructive">
            {errors.shortProblemDescription.message}
          </p>
        ) : null}
      </div>
    </div>
  );
}
