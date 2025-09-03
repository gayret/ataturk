import SwipeWrapper from '../swipe-wrapper/SwipeWrapper'
import styles from './About.module.css'
import Contributors from './widgets/contributors/Contributors'
import Thanks from './widgets/thanks/Thanks'

export default function About({ lang }: { lang: string }) {
  return (
    <SwipeWrapper onlyNext>
      <div className={styles.content}>
        <div className={styles.description}>
          <h1 className={styles.title}>
            {
              lang === 'tr' ?
                'Çocuklara ve Türk Gençliğine!'
                :
                'To the Children and Youth of Turkey!'
            }
          </h1>
          <p>
            {
              lang === 'tr' ?
                'Ulu Önder Gazi Mustafa Kemal Atatürk, Türk milletinin bağımsızlık mücadelesine önderlik ederek Türkiye Cumhuriyeti&apos;nin kurucusu olmuştur.'
                :
                'The Great Leader Gazi Mustafa Kemal Atatürk led the Turkish nation\'s struggle for independence and became the founder of the Republic of Turkey.'
            }
          </p>

          <p>
            {
              lang === 'tr' ?
                'Bu projenin amacı, Atatürk&apos;ün cesaret, vizyon ve özveriyle dolu olan hayatını kronolojik olarak anlatıp gençlere ilham vermektir.'
                :
                'The aim of this project is to chronologically narrate Atatürk\'s life, filled with courage, vision, and self-sacrifice, and to inspire young people.'
            }
          </p>

          <h4>
            {
              lang === 'tr' ?
                'Kullanımı'
                :
                'Usage'
            }
          </h4>
          <p>
            {
              lang === 'tr' ?
                'Sayfanın altındaki zaman çizelgesinde Atatürk&apos;ün hayatındaki önemli olayları görebilirsiniz. Tarihlere tıklayarak olay detaylarını ve haritada ilgili bölgeleri inceleyebilirsiniz. Klavyenizdeki yön tuşlarıyla tarihler arasında geçiş yapabilirsiniz.'
                :
                'You can see important events in Atatürk\'s life on the timeline at the bottom of the page. Click on the dates to view event details and explore the relevant regions on the map. Use the arrow keys on your keyboard to navigate between dates.'
            }
          </p>

          <Contributors lang={lang} />

          <Thanks lang={lang} />
        </div>
      </div>
    </SwipeWrapper>
  )
}
