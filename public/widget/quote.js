(function () {
  'use strict';

  const DATA_ATTRIBUTE = 'data-ataturk-quote-widget';
  const MOUNTED_ATTRIBUTE = 'data-widget-mounted';

  const currentScript = document.currentScript;
  const defaultLanguage = currentScript?.getAttribute('data-language') || 'tr';
  const defaultTheme = currentScript?.getAttribute('data-theme') || 'light';
  const scriptSrc = currentScript?.src || '';
  const baseUrl =
    currentScript?.getAttribute('data-base-url') ||
    scriptSrc.replace(/\/widget\/quote\.js(\?.*)?$/, '');
  const MESSAGE_TYPE = 'ATATURK_QUOTE_WIDGET_SIZE';
  const iframeRegistry = new Map();
  const generateWidgetId = (() => {
    let counter = 0;
    return () => `ataturk-quote-widget-${Date.now()}-${++counter}`;
  })();
  const allowedOrigin = (() => {
    try {
      return new URL(baseUrl).origin;
    } catch (error) {
      return null;
    }
  })();

  const buildUrl = (element, widgetId) => {
    const params = new URLSearchParams();
    params.set('language', element.getAttribute('data-language') || defaultLanguage);
    params.set('theme', element.getAttribute('data-theme') || defaultTheme);

    const quoteId = element.getAttribute('data-quote-id');
    const eventId = element.getAttribute('data-event-id');
    const random = element.getAttribute('data-random');
    const hideImage = element.getAttribute('data-hide-image');
    const hideSignature = element.getAttribute('data-hide-signature');

    if (quoteId) {
      params.set('quoteId', quoteId);
      params.set('random', 'false');
    } else if (eventId) {
      params.set('eventId', eventId);
      params.set('random', random === 'false' ? 'false' : 'true');
    } else if (random === 'false') {
      params.set('random', 'false');
    } else {
      params.set('random', 'true');
    }

    if (hideImage === 'true') {
      params.set('hideImage', 'true');
    }

    if (hideSignature === 'true') {
      params.set('hideSignature', 'true');
    }

    if (widgetId) {
      params.set('widgetId', widgetId);
    }

    return `${baseUrl}/widget/quote?${params.toString()}`;
  };

  const createIframe = (element) => {
    const iframe = document.createElement('iframe');
    const widgetId = element.getAttribute('data-widget-id') || generateWidgetId();
    iframe.setAttribute('data-widget-id', widgetId);
    iframe.setAttribute('title', 'Atat?rk S?z? Widget');
    iframe.setAttribute('loading', 'lazy');
    iframe.setAttribute('role', 'presentation');
    iframe.setAttribute('allowtransparency', 'true');
    iframe.style.border = '0';
    iframe.style.width = element.getAttribute('data-width') || '100%';
    iframe.style.minWidth = element.getAttribute('data-min-width') || '280px';
    iframe.style.maxWidth = element.getAttribute('data-max-width') || '420px';
    iframe.style.height = element.getAttribute('data-height') || '320px';
    iframe.src = buildUrl(element, widgetId);
    return { iframe, widgetId };
  };

  const mount = (root) => {
    if (root.getAttribute(MOUNTED_ATTRIBUTE) === 'true') {
      return;
    }
    root.setAttribute(MOUNTED_ATTRIBUTE, 'true');
    const { iframe, widgetId } = createIframe(root);
    root.innerHTML = '';
    root.appendChild(iframe);
    iframeRegistry.set(widgetId, iframe);
  };

  const initialize = () => {
    const targets = document.querySelectorAll(`[${DATA_ATTRIBUTE}]`);
    targets.forEach(mount);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }

  const observer = new MutationObserver(() => initialize());
  observer.observe(document.documentElement, { childList: true, subtree: true });

  const handleResizeMessage = (event) => {
    if (!event.data || event.data.type !== MESSAGE_TYPE) {
      return;
    }

    if (allowedOrigin && event.origin !== allowedOrigin) {
      return;
    }

    const { widgetId, height } = event.data;
    if (!widgetId || typeof height !== 'number' || Number.isNaN(height)) {
      return;
    }

    const targetIframe = iframeRegistry.get(widgetId);
    if (!targetIframe) {
      return;
    }

    const nextHeight = Math.max(height, 200);
    targetIframe.style.height = `${nextHeight}px`;
  };

  window.addEventListener('message', handleResizeMessage);
})();
