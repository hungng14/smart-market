
import React from 'react';
import { QrReader } from 'react-qr-reader';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { toast } from "sonner";

interface QRCodeScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (storeId: string) => void;
}

export const QRCodeScanner = ({ isOpen, onClose, onScan }: QRCodeScannerProps) => {
  const handleScan = (result: any) => {
    if (result) {
      try {
        const data = JSON.parse(result?.text);
        if (data.storeId) {
          onScan(data.storeId);
          onClose();
        }
      } catch (error) {
        toast.error("Invalid QR code");
        onClose();
      }
    }
  };

  const handleError = (error: any) => {
    console.error(error);
    toast.error("Error accessing camera");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <div className="aspect-square w-full max-w-sm mx-auto overflow-hidden">
          <QrReader
            constraints={{ facingMode: 'environment' }}
            onResult={handleScan}
            className="w-full h-full"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
