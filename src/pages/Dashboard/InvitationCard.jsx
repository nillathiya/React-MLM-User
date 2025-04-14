import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import QRCode from "react-qr-code";
import { Copy, CopyCheck } from "lucide-react";

function InvitationCard() {
  const [isCopiedLink, setIsCopiedLink] = useState(false);
  const { currentUser: loggedInUser } = useSelector((state) => state.auth);
  const referralLink = `${window.location.origin}?ref=${loggedInUser?.username}`;

  const handleCopyLink = () => {
    if (!referralLink) {
      alert("Referral link is not available. Please try again later.");
      return;
    }

    navigator.clipboard
      .writeText(referralLink)
      .then(() => {
        setIsCopiedLink(true);
      })
      .catch((err) => {
        console.error("Failed to copy link:", err);
        alert("Failed to copy the link. Please try again.");
      });
  };

  // Reset isCopiedLink after 2 seconds
  useEffect(() => {
    if (isCopiedLink) {
      const timeoutId = setTimeout(() => {
        setIsCopiedLink(false);
      }, 2000);
      return () => clearTimeout(timeoutId);
    }
  }, [isCopiedLink]);

  return (
    <div className="flex items-center justify-center min-h-[400px] !p-4">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden transform hover:scale-105 transition-all duration-300">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1584982751601-97dcc096659c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-blue-600/20" />

        {/* Card Content */}
        <div className="relative z-10 !p-6">
          {/* Header */}
          <h2 className="text-2xl font-bold text-center text-gray-800 !mb-4 animate-pulse">
            Invite Your Friends! ✨
          </h2>

          {/* QR Code */}
          <div className="flex justify-center !mb-6">
            <div className="!p-3 bg-white rounded-lg shadow-md">
              <QRCode
                value={referralLink}
                size={140}
                bgColor="#ffffff"
                fgColor="#4B0082"
              />
            </div>
          </div>

          {/* Referral Link */}
          <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-lg !p-3 !mb-4">
            <p className="text-sm font-medium text-gray-600 text-center !mb-2">
              Your unique referral link:
            </p>
            <div className="flex items-center gap-2 rounded-md !p-2 shadow-sm">
              <span className="!text-sm sm:!text-base  text-gray-950 font-semibold truncate flex-1">
                {referralLink}
              </span>
              <button
                onClick={handleCopyLink}
                className="!p-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors duration-200"
                title="Copy Link"
              >
                {isCopiedLink ? <CopyCheck size={16} /> : <Copy size={16} />}
              </button>
            </div>
          </div>

          {/* Call to Action */}
          <p className="text-center text-gray-600 text-sm">
            Share this link with friends and earn rewards when they join!
          </p>
        </div>

        {/* Shiny Effect */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 shine" />
        </div>
      </div>

      {/* CSS for Shine Effect */}
      <style jsx>{`
        .shine {
          background: linear-gradient(
            45deg,
            rgba(255, 255, 255, 0) 45%,
            rgba(255, 255, 255, 0.5) 50%,
            rgba(255, 255, 255, 0) 55%
          );
          animation: shine 3s infinite;
          transform: translateX(-100%);
        }

        @keyframes shine {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}

export default InvitationCard;
