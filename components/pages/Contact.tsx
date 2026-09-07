'use client';

import { useEffect, useState } from 'react';
import { contact } from '@/data/portfolio';
import { handwrittenHandle } from '@/data/handwriting';
import HandwrittenText from '@/components/HandwrittenText';
import { useScroll } from '@/context/ScrollContext';
import Parallax from '@/components/Parallax';
import type { IconType } from 'react-icons';
import {
  FaEnvelope,
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaTelegram,
  FaXTwitter,
} from 'react-icons/fa6';

// The rings' pose target reaches its final Contact keyframe exactly when
// scrollProgress hits 1; they then lerp into place over ~1s. Hold the pen
// until they've settled.
const RING_SETTLE_MS = 800;

// Icon per contact.links `icon` key (content/portfolio.yaml). One family
// (Font Awesome 6) so the row keeps a consistent visual weight — Simple
// Icons dropped LinkedIn for brand-policy reasons.
const LINK_ICONS: Record<string, IconType> = {
  github: FaGithub,
  linkedin: FaLinkedin,
  twitter: FaXTwitter,
  x: FaXTwitter,
  instagram: FaInstagram,
  telegram: FaTelegram,
  mail: FaEnvelope,
};

// The Contact section is fully off-screen once the scroll is back above the
// Quote page (it only starts sliding in during page 6). Resetting there — not
// the moment the rings leave their final pose — gives the trigger hysteresis:
// small scrolls within/near the contact page never blank the word.
const EXIT_PAGE = 6;

// scrollProgress hits exactly 1 only at the precise bottom scroll position,
// but Lenis eases in asymptotically and can settle a sub-pixel short of the
// last-page boundary — which would leave progress at ~0.9998 forever and the
// trigger unfired. 0.999 ≈ within ~6px of the bottom; the rings' pose is
// visually final there.
const RINGS_FINAL_PROGRESS = 0.995;

export default function Contact() {
  // Write the handle once the rings settle into their final position; keep
  // it drawn through small scrolls, and only reset after fully exiting the
  // section so the next arrival writes it again.
  const { currentPage, subscribe } = useScroll();
  // Boolean derived from a continuous value: track it via the scroll
  // subscription and setState only on threshold crossings, so scrolling
  // near the boundary doesn't churn re-renders.
  const [ringsAtFinal, setRingsAtFinal] = useState(false);
  const fullyExited = currentPage < EXIT_PAGE;
  const [play, setPlay] = useState(false);

  useEffect(() => {
    return subscribe((snap) => {
      const next = snap.scrollProgress >= RINGS_FINAL_PROGRESS;
      setRingsAtFinal((prev) => (prev === next ? prev : next));
    });
  }, [subscribe]);

  useEffect(() => {
    if (!ringsAtFinal) return;
    const timer = setTimeout(() => setPlay(true), RING_SETTLE_MS);
    return () => clearTimeout(timer);
  }, [ringsAtFinal]);

  useEffect(() => {
    if (!fullyExited) return;
    // Async: effects must not set state synchronously.
    const raf = requestAnimationFrame(() => setPlay(false));
    return () => cancelAnimationFrame(raf);
  }, [fullyExited]);

  return (
    <div className="relative min-h-screen flex flex-col items-center px-6">
      {/* The handle holds the middle of the section, written on by hand once
          the rings settle into their final pose. */}
      <div className="flex-1 flex items-center justify-center">
        <Parallax speed={0.3} className="w-full">
          <h2 className="w-full">
            <HandwrittenText handwriting={handwrittenHandle} durationMs={2400} />
          </h2>
        </Parallax>

      </div>

      {/* Socials + footer ride the bottom edge — this is the last section, so
          they land at the very bottom of the page. */}
      <div className="w-full max-w-xl text-center space-y-8 pb-10">
        {/* Social Links — drifting far slower than the handle above, both to
            read as further back and to keep the offset they rest at (the page
            bottom cuts the sweep short down here) down to a few px. */}
        <Parallax speed={0.12}>
          <div className="flex items-center justify-center gap-6">
            {contact.links.map((link) => {
              const Icon = LINK_ICONS[link.icon];
              // mailto: opens the mail client — a _blank tab would be dead.
              const isMail = link.url.startsWith('mailto:');
              return (
              <a
                key={link.label}
                href={link.url}
                target={isMail ? undefined : '_blank'}
                rel={isMail ? undefined : 'noopener noreferrer'}
                className="group flex flex-col items-center gap-2"
              >
                <span className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:border-blue-400 group-hover:bg-blue-400/10 transition-all">
                  {Icon && (
                    <Icon
                      aria-hidden
                      className="w-5 h-5 text-white/70 group-hover:text-blue-400 transition-colors"
                    />
                  )}
                </span>
                <span className="text-xs text-white/40 group-hover:text-white/70 transition-colors">
                  {link.label}
                </span>
              </a>
              );
            })}
          </div>
        </Parallax>
        {/* Footer */}
        <Parallax speed={0.06}>
          <p className="text-white/20 text-sm">
            &copy; {new Date().getFullYear()} Shritesh Jamulkar. All rights
            reserved.
            <br/>
            Made with ❤️ by Shri from London, UK 🇬🇧
          </p>
        </Parallax>
      </div>
    </div>
  );
}
