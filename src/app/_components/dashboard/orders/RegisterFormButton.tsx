/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { useToast } from "~/components/ui/use-toast";

export const RegisterPdfButton = ({booking}:{booking:BookingDetailProps}) => {

  const [disable, setDisable] = useState<boolean>(false);
  const toast = useToast();

  const handleGeneratePDF = async () => {
    try {
      setDisable(() => true);
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body:JSON.stringify({
          booking: booking
        })
      });
      const result = await response.json();
      const byteCharacters = atob(result.pdf);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/pdf" });

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = result.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setDisable(false);
    } catch (error) {
      toast.toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong",
      });
      setDisable(false);
    }
  };

  return (
    <Button type="button" className="w-full" variant={'outline'} onClick={handleGeneratePDF} disabled={disable}>
      Register form
    </Button>
  );
};
