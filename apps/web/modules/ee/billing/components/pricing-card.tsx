"use client";

import { CheckIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { TOrganization, TOrganizationBillingPeriod } from "@formbricks/types/organizations";
import { cn } from "@/lib/cn";
import { Badge } from "@/modules/ui/components/badge";
import { Button } from "@/modules/ui/components/button";
import { ConfirmationModal } from "@/modules/ui/components/confirmation-modal";
import { TPricingPlan } from "../api/lib/constants";

interface PricingCardProps {
  plan: TPricingPlan;
  planPeriod: TOrganizationBillingPeriod;
  organization: TOrganization;
  onUpgrade: () => Promise<void>;
  onManageSubscription: () => Promise<void>;
  projectFeatureKeys: {
    FREE: string;
    STARTUP: string;
    ENTERPRISE: string;
  };
}

export const PricingCard = ({
  planPeriod,
  plan,
  onUpgrade,
  onManageSubscription,
  organization,
  projectFeatureKeys,
}: PricingCardProps) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);

  const displayPrice = (() => {
    return planPeriod === "monthly" ? plan.price.monthly : plan.price.yearly;
  })();

  const isCurrentPlan = useMemo(() => {
    if (organization.billing.plan === projectFeatureKeys.FREE && plan.id === projectFeatureKeys.FREE) {
      return true;
    }

    if (
      organization.billing.plan === projectFeatureKeys.ENTERPRISE &&
      plan.id === projectFeatureKeys.ENTERPRISE
    ) {
      return true;
    }

    return organization.billing.plan === plan.id && organization.billing.period === planPeriod;
  }, [
    organization.billing.period,
    organization.billing.plan,
    plan.id,
    planPeriod,
    projectFeatureKeys.ENTERPRISE,
    projectFeatureKeys.FREE,
  ]);

  // Pick the correct Stripe checkout URL based on the selected billing period
  const resolvedHref = planPeriod === "yearly" && plan.hrefYearly ? plan.hrefYearly : plan.href;

  const CTAButton = useMemo(() => {
    if (isCurrentPlan) {
      return null;
    }

    // Check if the user is switching period on their current plan
    const isSwitchingPeriodOnCurrentPlan = organization.billing.plan === plan.id;

    if (plan.id === projectFeatureKeys.ENTERPRISE || plan.id === projectFeatureKeys.STARTUP) {
      // If we have a direct Stripe link, always use it
      if (resolvedHref) {
        return (
          <Button
            loading={loading}
            variant="default"
            onClick={async () => {
              window.open(resolvedHref, "_blank", "noopener,noreferrer");
            }}
            className="flex justify-center">
            {isSwitchingPeriodOnCurrentPlan
              ? t("environments.settings.billing.switch_plan")
              : (plan.CTA ?? t("common.start_free_trial"))}
          </Button>
        );
      }

      // If no Stripe link, fall back to the onUpgrade action (only for plan upgrades, not period switches usually)
      if (!isSwitchingPeriodOnCurrentPlan) {
        return (
          <Button
            loading={loading}
            variant="default"
            onClick={async () => {
              setLoading(true);
              await onUpgrade();
              setLoading(false);
            }}
            className="flex justify-center">
            {plan.CTA ?? t("common.start_free_trial")}
          </Button>
        );
      }

      // If switching period but no Stripe link, show the contact modal
      return (
        <Button
          loading={loading}
          onClick={() => {
            setContactModalOpen(true);
          }}
          className="flex justify-center">
          {t("environments.settings.billing.switch_plan")}
        </Button>
      );
    }

    return null;
  }, [
    isCurrentPlan,
    organization.billing.plan,
    plan.id,
    plan.CTA,
    projectFeatureKeys.ENTERPRISE,
    projectFeatureKeys.STARTUP,
    resolvedHref,
    loading,
    t,
    onUpgrade,
  ]);

  return (
    <div
      key={plan.id}
      className={cn(
        plan.featured
          ? "z-10 bg-white shadow-lg ring-1 ring-slate-900/10"
          : "bg-slate-100 ring-1 ring-white/10 lg:bg-transparent lg:pb-8 lg:ring-0",
        "relative rounded-xl"
      )}>
      <div className="p-8 lg:pt-12 xl:p-10 xl:pt-14">
        <div className="flex gap-x-2">
          <h2
            id={plan.id}
            className={cn(
              plan.featured ? "text-slate-900" : "text-slate-800",
              "text-sm font-semibold leading-6"
            )}>
            {plan.name}
          </h2>
          {isCurrentPlan && (
            <Badge type="success" size="normal" text={t("environments.settings.billing.current_plan")} />
          )}
        </div>
        <div className="flex flex-col items-end gap-6 sm:flex-row sm:justify-between lg:flex-col lg:items-stretch">
          <div className="mt-2 flex items-center gap-x-1">
            <p
              className={cn(
                plan.featured ? "text-slate-900" : "text-slate-800",
                "text-4xl font-bold tracking-tight"
              )}>
              {displayPrice}
            </p>
            <div className="flex flex-col text-sm leading-5">
              <p className={plan.featured ? "text-slate-700" : "text-slate-600"}>
                / {planPeriod === "monthly" ? "mo" : "yr"}
              </p>
              {planPeriod === "yearly" && plan.id !== projectFeatureKeys.FREE && (
                <Badge
                  type="success"
                  size="normal"
                  text={t("environments.settings.billing.two_months_free")}
                  className="mt-1 w-fit px-1.5 py-0 text-[10px]"
                />
              )}
            </div>
          </div>

          {CTAButton}

          {plan.id !== projectFeatureKeys.FREE && isCurrentPlan && (
            <Button
              loading={loading}
              onClick={async () => {
                setLoading(true);
                await onManageSubscription();
                setLoading(false);
              }}
              className="flex justify-center bg-[#635bff]">
              {t("environments.settings.billing.manage_subscription")}
            </Button>
          )}
        </div>
        <div className="mt-8 flow-root sm:mt-10">
          <ul
            className={cn(
              plan.featured
                ? "divide-slate-900/5 border-slate-900/5 text-slate-600"
                : "divide-white/5 border-white/5 text-slate-800",
              "-my-2 divide-y border-t text-sm leading-6 lg:border-t-0"
            )}>
            {plan.mainFeatures.map((mainFeature) => (
              <li key={mainFeature} className="flex gap-x-3 py-2">
                <CheckIcon
                  className={cn(plan.featured ? "text-brand-dark" : "text-slate-500", "h-6 w-5 flex-none")}
                  aria-hidden="true"
                />
                {mainFeature}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <ConfirmationModal
        title="Please reach out to us"
        open={contactModalOpen}
        setOpen={setContactModalOpen}
        onConfirm={() => setContactModalOpen(false)}
        buttonText="Close"
        buttonVariant="default"
        body="To switch your billing rhythm, please reach out to support@cohbyform.com"
      />
    </div>
  );
};
