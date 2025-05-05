import React from "react";

export default function FooterLink({ text }) {
  return (
    <a href="#" className="hover:text-blue-300 transition-colors">
      {text}
    </a>
  );
}
