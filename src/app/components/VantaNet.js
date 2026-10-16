"use client";

import { useEffect, useRef } from "react";

export default function VantaNet() {
  const vantaRef = useRef(null);
  const effectRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    const loadScript = (src, globalName) => new Promise((resolve, reject) => {
      if (window[globalName]) {
        resolve();
        return;
      }

      const existingScript = document.querySelector(`script[src="${src}"]`);
      if (existingScript) {
        existingScript.addEventListener("load", () => {
          if (window[globalName]) {
            resolve();
          } else {
            reject(new Error(`${globalName} did not become available`));
          }
        }, { once: true });
        return;
      }

      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        if (window[globalName]) {
          resolve();
        } else {
          reject(new Error(`${globalName} did not become available`));
        }
      };
      script.onerror = reject;
      document.body.appendChild(script);
    });

    const initializeBackground = async () => {
      try {
        await loadScript("https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js", "THREE");
        await loadScript("https://cdnjs.cloudflare.com/ajax/libs/vanta/0.5.21/vanta.net.min.js", "VANTA");

        if (!cancelled && vantaRef.current && window.VANTA?.NET) {
          effectRef.current = window.VANTA.NET({
            el: vantaRef.current,
            mouseControls: false,
            touchControls: false,
            gyroControls: false,
            minHeight: 200,
            minWidth: 200,
            scale: 1,
            scaleMobile: 1,
            color: 0x8c5e5e,
            backgroundColor: 0x202025,
            points: 11,
            maxDistance: 20,
            spacing: 19,
          });
        }
      } catch (error) {
        console.error("Unable to load the animated background:", error);
      }
    };

    initializeBackground();

    return () => {
      cancelled = true;
      effectRef.current?.destroy();
      effectRef.current = null;
    };
  }, []);

  return <div ref={vantaRef} className="vanta-background" aria-hidden="true" />;
}