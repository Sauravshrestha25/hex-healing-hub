import { PageHeader } from "@/features/admin/components/page-header";
import { PaymentForm } from "@/features/admin/components/payment-form";
import { getViewer } from "@/features/admin/server/viewer";
import { container } from "@/features/shared/server/container";

export const metadata = { title: "Payment" };

export default async function PaymentPage() {
  const [viewer, settings] = await Promise.all([getViewer(), container().payments.settings()]);
  return (
    <>
      <PageHeader title="Payment" description="The QR code visitors pay with when they book a healer online." />
      <PaymentForm settings={settings} readOnly={!viewer.isVerified} />
    </>
  );
}
