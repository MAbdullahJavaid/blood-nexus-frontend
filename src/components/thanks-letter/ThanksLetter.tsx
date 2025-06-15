
import React from "react";
import { DropletIcon, Heart } from "lucide-react";

interface ThanksLetterProps {
  donorName?: string;
  donationDate?: string;
  donationType?: string; // e.g. Blood, Platelets, etc.
  organizationName?: string;
  signatureName?: string;
  letterNumber?: string;
}

export default function ThanksLetter({
  donorName = "Dear Donor",
  donationDate = "____/____/______",
  donationType = "Blood",
  organizationName = "Blood Care Foundation",
  signatureName = "Director, Blood Care Foundation",
  letterNumber = "TL-2024-0001"
}: ThanksLetterProps) {
  return (
    <div className="max-w-lg mx-auto bg-white shadow-xl rounded-xl border border-gray-200 p-10 print:p-14 relative font-serif" style={{ fontFamily: "serif" }}>
      {/* Decorative top bar and logo */}
      <div className="flex items-center gap-3 mb-8 justify-center">
        <DropletIcon className="text-blood h-10 w-10 drop-shadow-md" />
        <span className="font-bold text-3xl text-blood tracking-wide">{organizationName}</span>
      </div>
      <div className="absolute top-8 right-10 opacity-10 print:hidden">
        <Heart className="h-24 w-24 text-blood" />
      </div>
      {/* Letter Number and Date */}
      <div className="flex justify-between items-center text-sm mb-6 print:mb-2">
        <span className="italic text-gray-600">
          Letter No.: 
          <span className="ml-1 font-medium">{letterNumber}</span>
        </span>
        <span className="italic text-gray-600">
          Date: <span className="ml-1 font-medium">{donationDate}</span>
        </span>
      </div>
      {/* Letter Content */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-center text-blood mb-8">Thank You for Saving Lives!</h1>
        <p className="mb-5 leading-relaxed text-lg">
          {donorName},
        </p>
        <p className="mb-5 leading-relaxed text-gray-700">
          On behalf of <span className="font-semibold text-blood">{organizationName}</span>, we express our heartfelt gratitude for your generous <span className="font-medium">{donationType}</span> donation on <span className="underline">{donationDate}</span>. Your compassion and kindness have helped bring hope and a second chance to children and families battling blood disorders.
        </p>
        <p className="mb-5 leading-relaxed text-gray-700">
          Every drop you give is a drop of life—and your selfless contribution inspires our mission to serve those in need, 24/7. You are a true hero!
        </p>
        <p className="leading-relaxed text-gray-700">
          We are proud to have you as part of our lifesaving community.
          <br />
          Thank you again for making a real difference.
        </p>
      </div>
      {/* Signature Section */}
      <div className="flex justify-end items-end mt-16 mb-4">
        <div>
          <div className="h-14 border-b-2 border-gray-300 w-48" />
          <div className="text-blood font-semibold mt-2">{signatureName}</div>
        </div>
      </div>
      {/* Decorative bottom bar */}
      <div className="flex flex-col items-center mt-8">
        <div className="w-full h-2 bg-gradient-to-r from-blood via-white to-blood rounded-full opacity-70" />
        <span className="text-xs text-gray-400 mt-2">
          “Together, we give hope. Together, we save lives.”
        </span>
      </div>
    </div>
  );
}

