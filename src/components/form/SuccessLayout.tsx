import React from "react";

interface SuccessLayoutProps {
  slotSummaryUrl?: string;
}

const SuccessLayout: React.FC<SuccessLayoutProps> = ({ slotSummaryUrl }) => {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6 text-center">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-blue-600 mb-4">
          You have successfully registered at SpeedMedia Program
        </h1>
        <p className="text-lg sm:text-xl text-gray-700 mb-6">
          Thank you for registering! Please download your slot summary for more
          details about your registration.
        </p>
        <a
          href={slotSummaryUrl}
          download="slot_summary.pdf"
          className="mt-4 w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-300"
        >
          Download Slot Summary
        </a>
      </div>
    </main>
  );
};

export default SuccessLayout;
