// push-subscribe.js — gère la demande de permission et l'abonnement aux notifications EtaChop

const ETA_VAPID_PUBLIC_KEY = 'BEMZb9tY_YaHadXv6w68f7AIo3W9QMwswIcDiBN0W8HI8fljsu2MZC8695LZO2IcoXSmQi3oITKi5rTXyBveMDY';
const ETA_SUPABASE_URL = 'https://reghryppfweynclehwgv.supabase.co';

function etaUrlBase64ToUint8Array(base64String){
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i);
  return outputArray;
}

// subscriberType: 'vendor' ou 'customer'
async function subscribeToEtaNotifications(subscriberType, extra){
  if(!('serviceWorker' in navigator) || !('PushManager' in window)) return false;

  try {
    const permission = await Notification.requestPermission();
    if(permission !== 'granted') return false;

    const reg = await navigator.serviceWorker.ready;
    let sub = await reg.pushManager.getSubscription();
    if(!sub){
      sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: etaUrlBase64ToUint8Array(ETA_VAPID_PUBLIC_KEY),
      });
    }

    await fetch(`${ETA_SUPABASE_URL}/functions/v1/save-push-subscription`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subscriberType,
        storeId: extra.storeId || null,
        customerPhone: extra.customerPhone || null,
        subscription: sub.toJSON(),
      }),
    });
    return true;
  } catch(err){
    console.warn('Abonnement notifications échoué', err);
    return false;
  }
}
