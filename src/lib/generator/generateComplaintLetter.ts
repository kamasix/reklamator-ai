import type { GeneratorInput, LetterSections } from "@/types/case";
import { applyTone } from "./applyTone";
import { renderSections } from "./renderSections";
import { refundTemplate } from "./templates/refund";
import { productComplaintTemplate } from "./templates/product_complaint";
import { warrantyTemplate } from "./templates/warranty";
import { missingDeliveryTemplate } from "./templates/missing_delivery";
import { subscriptionChargeTemplate } from "./templates/subscription_charge";
import { blockedAccountTemplate } from "./templates/blocked_account";
import { serviceProviderTemplate } from "./templates/service_provider";
import { repairServiceTemplate } from "./templates/repair_service";
import { otherTemplate } from "./templates/other";

function buildSections(input: GeneratorInput): LetterSections {
  switch (input.category) {
    case "refund":
      return refundTemplate(input);
    case "product_complaint":
      return productComplaintTemplate(input);
    case "warranty":
      return warrantyTemplate(input);
    case "missing_delivery":
      return missingDeliveryTemplate(input);
    case "subscription_charge":
      return subscriptionChargeTemplate(input);
    case "blocked_account":
      return blockedAccountTemplate(input);
    case "service_provider":
      return serviceProviderTemplate(input);
    case "repair_service":
      return repairServiceTemplate(input);
    case "other":
      return otherTemplate(input);
  }
}

export function generateComplaintLetter(input: GeneratorInput): string {
  const sections = buildSections(input);
  const toned = applyTone(sections, input.tone);
  return renderSections(toned);
}

export function generateLetterSections(input: GeneratorInput): LetterSections {
  return applyTone(buildSections(input), input.tone);
}
