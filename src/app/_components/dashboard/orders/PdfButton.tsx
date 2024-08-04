import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";

export const PdfButton = () => {
  const generatePDFMutation = api.booking.generatePdf.useMutation();

  const handleGeneratePDF = async () => {
    const pdfUrl = await generatePDFMutation.mutateAsync();
    window.open(pdfUrl, "_blank");
  };

  return <Button type="button" onClick={handleGeneratePDF}>Generate PDF</Button>;
};
