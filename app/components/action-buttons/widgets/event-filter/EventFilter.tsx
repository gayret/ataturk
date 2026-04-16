"use client";

import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import styles from "./EventFilter.module.css";
import filterIcon from "../../../../assets/icons/event-filter.svg";
import EventTypes from "@/app/constants/EventTypes";
import { useLanguageStore } from "@/app/stores/languageStore";

export default function EventFilter() {
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguageStore();

  const handleClick = (label: string) => {
    const params = new URLSearchParams(searchParams.toString());
    // Mevcut değerleri array’e al
    const currentValues = params.get("displayed-locations")?.split(",") || [];
    let newValues: string[];
    if (currentValues.includes(label)) {
      // varsa çıkar
      newValues = currentValues.filter((val) => val !== label);
    } else {
      // yoksa ekle
      newValues = [...currentValues, label];
    }
    if (newValues.length > 0) {
      params.set("displayed-locations", newValues.join(","));
    } else {
      params.delete("displayed-locations");
    }

    const url = new URL(window.location.href);
    if (newValues.length > 0) {
      url.searchParams.set("displayed-locations", newValues.join(","));
    } else {
      url.searchParams.delete("displayed-locations");
    }
    window.history.pushState({}, "", url.toString());
  };

  // Eğer kullanıcı sayfanın dışına tıklarsa open'ı false yap
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
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
    <div className={styles.filter} ref={filterRef}>
      <button
        onClick={() => setOpen(!open)}
        title={
          open
            ? t.ActionButtons.eventFilterClose
            : t.ActionButtons.eventFilterOpen
        }
      >
        <Image src={filterIcon} alt="" width={16} height={16} />
      </button>

      {open && (
        <div className={styles.opened}>
          {EventTypes.map((eventType) => {
            const isActive = searchParams
              .get("displayed-locations")
              ?.split(",")
              .includes(eventType.title);
            return (
              <button
                type="button"
                key={eventType?.id}
                className={`${styles.filterItemWrapper} ${
                  isActive ? styles.activeFilterItemWrapper : ""
                }`}
                title={
                  t.ActionButtons.filters[
                    eventType.title as keyof typeof t.ActionButtons.filters
                  ]
                }
                onClick={() => handleClick(eventType.title)}
              >
                <span className={styles.filterItemLabel}>
                  {
                    t.ActionButtons.filters[
                      eventType.title as keyof typeof t.ActionButtons.filters
                    ]
                  }
                </span>
                <Image
                  src={eventType?.icon}
                  alt={
                    t.ActionButtons.filters[
                      eventType.title as keyof typeof t.ActionButtons.filters
                    ]
                  }
                  width={16}
                  height={16}
                  className={styles.filterItemIcon}
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
