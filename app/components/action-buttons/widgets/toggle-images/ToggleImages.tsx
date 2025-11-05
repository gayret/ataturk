import styles from "./ToggleImages.module.css";
import Image from "next/image";
import { useImagesStore } from "@/app/stores/imagesStore";
import { useLanguageStore } from "@/app/stores/languageStore";
import pictureIcon from "@/app/assets/icons/picture.svg";
import pictureOffIcon from "@/app/assets/icons/picture-slash.svg";
import { useState } from "react";

export default function ToggleImages() {
  const { showImages, toggleImages } = useImagesStore();
  const { t } = useLanguageStore();
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const getButtonTitle = () => {
    return showImages
      ? t.ActionButtons.toggleImagesHide
      : t.ActionButtons.toggleImagesShow;
  };

  return (
    <>
      <button
        className={styles.toggleImages}
        onClick={toggleImages}
        onMouseOver={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          setTooltipPosition({
            x: rect.left + rect.width / 2,
            y: rect.top,
          });
          setShowTooltip(true);
          setTimeout(() => setShowTooltip(false), 1500);
        }}
        onMouseLeave={() => {
          setShowTooltip(false);
        }}
      >
        <Image
          src={showImages ? pictureIcon : pictureOffIcon}
          alt=""
          width={16}
          height={16}
        />
      </button>

      {/* Custom Tooltip */}
      {showTooltip && (
        <div
          className={styles.tooltip}
          style={{
            left: tooltipPosition.x,
            top: tooltipPosition.y,
          }}
        >
          {getButtonTitle()}
        </div>
      )}
    </>
  );
}
