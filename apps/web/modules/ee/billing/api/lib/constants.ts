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
  /** Stripe buy link for monthly billing */
  href?: string;
  /** Stripe buy link for annual billing (2 months free) */
  hrefYearly?: string;
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
      "700 monthly responses",
      "200 contacts (MIU)",
      "1 workspace",
      "CohbyForm branding included",
      "No AI features",
      "No integrations",
      "No follow-up emails",
      t("environments.settings.billing.unlimited_team_members"),
      t("environments.settings.billing.logic_jumps_hidden_fields_recurring_surveys"),
    ],
  };

  const startupPlan: TPricingPlan = {
    id: "startup",
    name: t("environments.settings.billing.startup"),
    featured: true,
    CTA: "Start free trial",
    description: t("environments.settings.billing.startup_description"),
    price: { monthly: "£25", yearly: "£250" },
    // Monthly Stripe link
    href: "https://buy.stripe.com/7sYcN565E6zd4tf3do8EM00",
    // Annual Stripe link — 2 months free (£250 instead of £300)
    hrefYearly: "https://buy.stripe.com/7sYcN565E6zd4tf3do8EM00?prefilled_promo_code=2MONTHSFREE",
    mainFeatures: [
      t("environments.settings.billing.everything_in_free"),
      "5,000 monthly responses",
      "7,500 contacts",
      "3 workspaces",
      "Remove CohbyForm branding",
      "All integrations",
      "Follow-up emails",
      "Logo upload",
      "No AI features",
    ],
  };

  const enterprisePlan: TPricingPlan = {
    id: "enterprise",
    name: "Enterprise",
    featured: false,
    CTA: "Start free trial",
    description: t("environments.settings.billing.enterprise_description"),
    price: {
      monthly: "£89.99",
      yearly: "£899.99",
    },
    // Monthly Stripe link
    href: "https://buy.stripe.com/00wbJ12Ts8Hl1h315g8EM02",
    // Annual Stripe link — 2 months free (£899.99 instead of £1,079.88)
    hrefYearly: "https://buy.stripe.com/00wbJ12Ts8Hl1h315g8EM02?prefilled_promo_code=2MONTHSFREE",
    mainFeatures: [
      t("environments.settings.billing.everything_in_startup"),
      "AI Form Builder",
      "AI response analysis",
      t("environments.settings.billing.email_follow_ups"),
      "Unlimited responses",
      "Unlimited contacts",
      "Unlimited workspaces",
      "Custom branding & white-label",
      t("environments.settings.billing.team_access_roles"),
      t("environments.workspace.languages.multi_language_surveys"),
      "Priority onboarding & dedicated support",
      t("environments.settings.billing.uptime_sla_99"),
      t("environments.settings.billing.premium_support_with_slas"),
      "Custom data retention",
      "SSO / SAML ready",
    ],
  };

  return {
    plans: [freePlan, startupPlan, enterprisePlan],
  };
};
