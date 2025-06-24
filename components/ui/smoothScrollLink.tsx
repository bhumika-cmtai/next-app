"use client";

import { animate } from "framer-motion";
import { ReactNode } from "react";

type Props = {
  href: string;
  children: ReactNode;
  className?: string;
};

export const SmoothScrollLink = ({ href, children, className }: Props) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();

    const targetId = href.substring(1); 
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY;
      animate(window.scrollY, offsetPosition, {
        type: "spring",   
        stiffness: 100,
        damping: 30,
        restDelta: 0.001,
        onUpdate: (latest) => window.scrollTo(0, latest),
      });
    }
  };

  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  );
};