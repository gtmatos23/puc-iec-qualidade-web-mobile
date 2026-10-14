import { useSyncExternalStore } from 'react';
import { testIDs } from '@/utils/testIDs';

function subscribe(listener: () => void) {
  window.addEventListener('online', listener);
  window.addEventListener('offline', listener);
  return () => {
    window.removeEventListener('online', listener);
    window.removeEventListener('offline', listener);
  };
}

export default function OfflineBanner() {
  const online = useSyncExternalStore(subscribe, () => navigator.onLine, () => true);
  if (online) return null;
  return (
    <div className="offline-banner" data-testid={testIDs.shell.offlineBanner} role="status">
      Você está offline — mostrando dados do cache
    </div>
  );
}
