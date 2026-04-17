import QRCode from "qrcode";

export async function qrDataUrl(text: string): Promise<string> {
  return QRCode.toDataURL(text, { errorCorrectionLevel: "M", margin: 0, scale: 4 });
}

export function verificationUrl(hash: string, base = process.env.NEXT_PUBLIC_APP_URL || "https://demo.careai.health") {
  return `${base}/verify/${hash}`;
}
