import SwipeWrapper from '../swipe-wrapper/SwipeWrapper'
import styles from './About.module.css'
import Contributors from './widgets/Contributors'
import DonateButton from './widgets/donate-button/DonateButton'

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

          <h4>Kullanımı</h4>
          <p>
            Sayfanın altındaki zaman çizelgesinde Atatürk&apos;ün hayatındaki önemli olayları
            görebilirsiniz. Tarihlere tıklayarak olay detaylarını ve haritada ilgili bölgeleri
            inceleyebilirsiniz. Klavyenizdeki yön tuşlarıyla tarihler arasında geçiş yapabilirsiniz.
          </p>

          <h4>Katkıda bulunun</h4>
          <p>
            Projenin kaynak kodları ve verileri herkese açıktır. Katkıda bulunmak için{' '}
            <a href='https://github.com/gayret/ataturk' target='_blank'>
              GitHub&#39;a
            </a>{' '}
            göz atabilirsiniz.
          </p>

          <Contributors />

          <h4>Teşekkür</h4>
          <small>
            Projeyi hayata geçirmem için yardımcı olan biricik karım İrem Çiftler Gayret&apos;e
            teşekkür ederim.
          </small>

          <DonateButton />
        </div>
      </div>
    </SwipeWrapper>
  )
}
