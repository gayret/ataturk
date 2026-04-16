"use client";

import { useSearchParams } from "next/navigation";
import styles from "./LanguageSelector.module.css";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import languageIcon from "@/app/assets/icons/language.svg";
import { useLanguageStore } from "@/app/stores/languageStore";
import { availableLanguages } from "@/app/stores/languageStore";
import chevronRight from "@/app/assets/icons/chevron-right.svg";

export default function LanguageSelector() {
  const searchParams = useSearchParams();
  const { t, setLanguage, currentLanguageCode } = useLanguageStore();
  const languageRef = useRef<HTMLDivElement>(null);

  const handleSelect = (langCode: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set("language", langCode);
    window.history.pushState({}, "", url.toString());
    setLanguage(langCode);
    setOpen(false);
  };

  const [open, setOpen] = useState(false);

  // Eğer kullanıcı sayfanın dışına tıklarsa open'ı false yap
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        languageRef.current &&
        !languageRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.language} ref={languageRef}>
      <button
        onClick={() => setOpen(!open)}
        title={t.ActionButtons.languageSelectorTitle}
      >
        <Image
          src={languageIcon}
          alt={t.ActionButtons.languageSelectorIconAlt}
          width={16}
          height={16}
        />
      </button>

      {open && (
        <div className={styles.opened}>
          {availableLanguages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleSelect(language.code)}
              title={language.name}
              aria-label={language.name}
              disabled={language.code === currentLanguageCode}
              className={
                language.code === currentLanguageCode ? styles.active : ""
              }
            >
              {language.code === currentLanguageCode && (
                <Image
                  src={chevronRight}
                  alt={t.ActionButtons.languageSelectorIconAlt}
                  width={8}
                  height={8}
                />
              )}
              {language.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
