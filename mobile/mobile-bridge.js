const isNative = Boolean(window.Capacitor?.isNativePlatform?.());

document.documentElement.classList.add('win12-mobile-shell');

if (isNative) {
  document.documentElement.classList.add('win12-native-shell');
}
window.addEventListener('DOMContentLoaded', () => {
  const viewport = document.querySelector('meta[name="viewport"]');
  viewport?.setAttribute(
    'content',
    'width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no'
  );
});
