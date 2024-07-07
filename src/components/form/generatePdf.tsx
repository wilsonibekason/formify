import { FormikValues } from "formik";
import jsPDF from "jspdf";

interface SlotSummary {
  name: string;
  email: string;
  phone_number: string;
  location: string;
  stage: string;
  backups: string;
  backups_num: string;
  category: "podcast" | "musical_video" | "media_training";
  date_time: string;
  logoImg: string; // base64 or URL of the image
}

export const generatePDF = (summary: FormikValues, logoImg: string) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Adding a rounded image at the center top
  const imgSize = 40;
  const imgX = (pageWidth - imgSize) / 2;
  const imgY = 10;

  const addRoundedImage = (
    doc: jsPDF,
    img: string,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
  ) => {
    doc.roundedRect(x, y, width, height, radius, radius, "S");
    doc.addImage(img, "JPEG", x, y, width, height);
  };

  addRoundedImage(doc, logoImg, imgX, imgY, imgSize, imgSize, imgSize / 2);

  // Centering text layout
  const centerText = (text: string, y: number) => {
    const textWidth = doc.getTextWidth(text);
    const x = (pageWidth - textWidth) / 2;
    doc.text(text, x, y);
  };

  // Background color
  doc.setFillColor(240, 240, 240); // Light grey
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  // Adding text centered
  const yStart = imgY + imgSize + 20;
  const lineHeight = 10;
  let currentY = yStart;

  centerText(`Slot Summary for ${summary.name}`, currentY);
  currentY += lineHeight;
  centerText(`Email: ${summary.email}`, currentY);
  currentY += lineHeight;
  centerText(`Phone Number: ${summary.phone_number}`, currentY);
  currentY += lineHeight;
  centerText(`Location: ${summary.location}`, currentY);
  currentY += lineHeight;
  centerText(`Stage: ${summary.stage}`, currentY);
  currentY += lineHeight;
  centerText(`Backups: ${summary.backups}`, currentY);
  currentY += lineHeight;
  centerText(`Number of Backups: ${summary.backups_num}`, currentY);
  currentY += lineHeight;
  centerText(`Category: ${summary.category}`, currentY);
  currentY += lineHeight;
  centerText(`Date: ${summary.date_time}`, currentY);
  //The Price for  ₦
  // Conditional text for categories
  if (summary.category === "podcast") {
    currentY += lineHeight;
    centerText(`Podcast is NGN30,000.00`, currentY);
  } else if (summary.category === "musical_video") {
    currentY += lineHeight;
    centerText(`Musical Video is NGN30,000.00`, currentY);
  } else if (summary.category === "media_training") {
    currentY += lineHeight;
    centerText(`Media Training is NGN50,000.00`, currentY);
  }

  // Save the PDF
  // doc.save('summary.pdf');
  // Save PDF to Blob
  const pdfBlob = doc.output("blob");

  // Create URL for the PDF Blob
  const pdf_url = URL.createObjectURL(pdfBlob);
  return pdf_url;
};
