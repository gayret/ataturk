import Image from "next/image";
import Link from "next/link";
import styles from "./not-found.module.css";
import fourOhFour from "./assets/images/404-ataturk.png";


export default function NotFound() {
  return (
    <section className={styles.card}>
      <div className={styles.media}>
        <Image
          src={fourOhFour}
          alt="404 - Sayfa bulunamadı"
          style={{ width: "100%", height: "100%" }}
          priority
        />
      </div>

      <div className={styles.content}>
        <h1 className={styles.title}>Sayfa bulunamadı</h1>
        <p className={styles.subtitle}>
          Aradığınız sayfa bulunamadı veya taşınmış olabilir.
        </p>
        <Link
          href="/"
          className={styles.link}
          aria-label="Atatürk kronolojisine geri dön"
        >
          Atatürk'ün kronolojisine geri dön
        </Link>
      </div>
    </section>
  );
}
