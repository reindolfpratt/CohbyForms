import { TFunction } from "i18next";

export type TPricingPlan = {
  id: string;
  name: string;
  featured: boolean;
  CTA?: string;
  description: string;
  price: {
    monthly: string;
    yearly: string;
  };
  mainFeatures: string[];
  href?: string;
};

export const getCloudPricingData = (t: TFunction): { plans: TPricingPlan[] } => {
  const freePlan: TPricingPlan = {
    id: "free",
    name: t("environments.settings.billing.free"),
    featured: false,
    description: t("environments.settings.billing.free_description"),
    price: { monthly: "£0", yearly: "£0" },
    mainFeatures: [
      t("environments.settings.billing.unlimited_surveys"),
      "Monthly 700 Responses",
      "200 Contacts (MIU)",
      "1 Workspace",
      "CohbyForm Branding included",
      "No AI features",
      "No Integrations",
      "No Follow-up emails",
      t("environments.settings.billing.unlimited_team_members"),
      t("environments.settings.billing.logic_jumps_hidden_fields_recurring_surveys"),
    ],
  };

  const startupPlan: TPricingPlan = {
    id: "startup",
    name: t("environments.settings.billing.startup"),
    featured: true,
    CTA: t("common.start_free_trial"),
    description: t("environments.settings.billing.startup_description"),
    price: { monthly: "£25", yearly: "£250" },
    href: "https://buy.stripe.com/7sYcN565E6zd4tf3do8EM00",
    mainFeatures: [
      t("environments.settings.billing.everything_in_free"),
      "5,000 monthly responses",
      "7,500 contacts",
      "3 workspaces",
      "Remove CohbyForm Branding",
      "All Integrations",
      "Follow-up emails",
      "No AI features",
    ],
  };

  const enterprisePlan: TPricingPlan = {
    id: "enterprise",
    name: "Enterprise",
    featured: false,
    CTA: t("common.start_free_trial"),
    description: t("environments.settings.billing.enterprise_description"),
    price: {
      monthly: "£89.99",
      yearly: "£899.99",
    },
    href: "https://buy.stripe.com/00wbJ12Ts8Hl1h315g8EM02",
    mainFeatures: [
      t("environments.settings.billing.everything_in_startup"),
      "AI Form Builder included",
      "AI Response Analysis",
      t("environments.settings.billing.email_follow_ups"),
      "Unlimited responses",
      "Unlimited contacts",
      "Unlimited workspaces",
      t("environments.settings.billing.team_access_roles"),
      t("environments.workspace.languages.multi_language_surveys"),
      t("environments.settings.billing.uptime_sla_99"),
      t("environments.settings.billing.premium_support_with_slas"),
    ],
  };

  return {
    plans: [freePlan, startupPlan, enterprisePlan],
  };
};
