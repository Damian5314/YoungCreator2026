import Image from 'next/image';
import { useT } from '@/i18n/I18nProvider';
import { SignalConnection } from './SplashSignals';
import styles from './splash.module.css';

/** Het echte merkteken, met het zachte licht, de korte gloed en de signaallijnen erachter. */
export function UnlistedLogo() {
  return (
    <div className={styles.mark}>
      <span className={styles.light} />
      <SignalConnection />
      <span className={styles.glow} />
      {/* object-cover snijdt de transparante rand boven/onder weg, net als in de header */}
      <Image src="/images/brand/logo.png" alt="" width={256} height={256} preload className={styles.logo} />
    </div>
  );
}

/** Het woordmerk in de merktypografie (zoals in de header), als geheel onthuld: geen typ-effect. */
export function UnlistedWordmark() {
  return <p className={styles.wordmark}>Unlisted</p>;
}

export function SplashTagline() {
  const { tagline } = useT().splash;

  return (
    <p className={styles.tagline}>
      {tagline.map((line) => (
        <span key={line} className="block">
          {line}
        </span>
      ))}
    </p>
  );
}

export function SplashProgress() {
  return (
    <div className={styles.progress}>
      <span className={styles.progressFill} />
    </div>
  );
}

export function SplashStatus() {
  const { status } = useT().splash;

  return (
    <p className={styles.status}>
      {status.map((text) => (
        <span key={text}>{text}</span>
      ))}
    </p>
  );
}
