"use client";

import styles from "./Content.module.css";
import { useSearchParams } from "next/navigation";
import { formatDate } from "@/app/helpers/date";
import { useEffect, useState } from "react";
import SwipeWrapper from "../swipe-wrapper/SwipeWrapper";
import Images from "./widgets/Images";
import { useEventsData } from "@/app/helpers/data";
import Quote from "../quote/Quote";
import { ImageType } from "./widgets/Images";
import { useLanguageStore } from "@/app/stores/languageStore";
import SourceLink from "@/app/components/source-link/SourceLink";

export type QuoteType = {
  text: string;
  source?: string;
};

export type ItemType = {
  id: number;
  date: string;
  title: string;
  description?: string;
  images?: ImageType[] | null;
  source?: string;
  sounds?: { url: string; alt: string; source?: string }[] | null;
  quotes?: QuoteType[] | null;
};

export default function Content() {
  const [computedAge, setComputedAge] = useState<number | null>(null);
  const [formattedDate, setFormattedDate] = useState<string>("");
  const searchParams = useSearchParams();
  const events = useEventsData() as ItemType[];
  const currentLanguageCode = useLanguageStore(
    (state) => state.currentLanguageCode
  );
  const { t } = useLanguageStore();

  const selectedItem =
    events.find(
      (item: ItemType) => item.id === Number(searchParams.get("id"))
    ) || events[0];

  useEffect(() => {
    document.title = selectedItem.title
      ? `${selectedItem.title} - Atatürk Kronolojisi`
      : "Atatürk Kronolojisi";
  }, [selectedItem]);

  useEffect(() => {
    setComputedAge(
      selectedItem?.date
        ? new Date(selectedItem.date).getFullYear() - 1881
        : null
    );
    setFormattedDate(formatDate(selectedItem?.date || "", currentLanguageCode));
  }, [selectedItem, currentLanguageCode]);

  return (
    <SwipeWrapper>
      <div className={styles.content}>
        <div className={styles.dateAndTitle}>
          <div className={styles.date}>
            {formattedDate}
            {computedAge !== null && computedAge > 0 && computedAge <= 57 && (
              <span className={styles.computedAge}>
                {computedAge}. {t.Content.ageText}
              </span>
            )}
          </div>
          <h1 className={styles.title}>
            {selectedItem?.title}
            {selectedItem?.source && (
              <SourceLink
                href={selectedItem.source}
                label={t.InformationSource}
              />
            )}
          </h1>
          {selectedItem?.description && (
            <p className={styles.description}>{selectedItem.description}</p>
          )}
        </div>

        <Images />

        {/* if selectedItem has quotes render each Quote component */}
        {selectedItem?.quotes && selectedItem.quotes.length > 0 && (
          <>
            {selectedItem.quotes.map((quote, index) => (
              <Quote key={index} quote={quote} />
            ))}
          </>
        )}

        {selectedItem?.sounds && selectedItem.sounds.length > 0 && (
          <div className={styles.sounds}>
            {selectedItem.sounds.map((sound, index) => (
              <div key={index} className={styles.sound}>
                <p title={`${t.InformationSource}: ${sound.source}`}>
                  {sound.alt}
                  {sound.source && (
                    <SourceLink
                      href={sound.source}
                      label={t.InformationSource}
                    />
                  )}
                </p>
                <audio
                  controls
                  controlsList="nodownload"
                  onContextMenu={(e) => e.preventDefault()}
                  aria-label={`Play sound of ${sound.alt}`}
                >
                  <source src={sound.url} type="audio/mpeg" />
                  İnternet tarayıcınız ses yürütmeyi desteklemiyor.
                </audio>
              </div>
            ))}
          </div>
        )}
      </div>
    </SwipeWrapper>
  );
}
