import SwipeWrapper from '../swipe-wrapper/SwipeWrapper'
import styles from './About.module.css'
import Contributors from './widgets/contributors/Contributors'

export default function About() {
  return (
    <SwipeWrapper onlyNext>
      <div className={styles.content}>
        <div className={styles.description}>
          <h1 className={styles.title}>Çocuklara ve Türk Gençliğine!</h1>
          <p>
            Ulu Önder Gazi Mustafa Kemal Atatürk, Türk milletinin bağımsızlık mücadelesine önderlik
            ederek Türkiye Cumhuriyeti&apos;nin kurucusu olmuştur.
          </p>

          <p>
            Bu projenin amacı, Atatürk&apos;ün cesaret, vizyon ve özveriyle dolu olan hayatını
            kronolojik olarak anlatıp gençlere ilham vermektir.
          </p>

          <h2>Kullanımı</h2>
          <p>
            Sayfanın altındaki zaman çizelgesinde Atatürk&apos;ün hayatındaki önemli olayları
            görebilirsiniz. Tarihlere tıklayarak olay detaylarını ve haritada ilgili bölgeleri
            inceleyebilirsiniz. Klavyenizdeki yön tuşlarıyla tarihler arasında geçiş yapabilirsiniz.
          </p>

          <Contributors />

          <h2>Projenin hikayesi</h2>
          <iframe
            src='https://www.linkedin.com/embed/feed/update/urn:li:share:7357917656097730560?collapsed=1'
            height='1000px'
            width='100%'
            frameBorder='0'
            title='Gömülü gönderi'
          ></iframe>
        </div>
      </div>
    </SwipeWrapper>
  )
}
