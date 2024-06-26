const ALLOW_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  'https://app.e-ra.io',
  'https://staging-app.e-ra.io',
];

class EraWidget {
  constructor({origins = ALLOW_ORIGINS, onConfiguration, onValues, onHistories, ready=true, mobileHeight = null}) {
    this.origins = origins;
    this.urlParams = new URLSearchParams(window.location.search);
    this.eraOrigin = this.urlParams.get('eraOrigin');
    this.eraWidgetId = parseInt(this.urlParams.get('eraWidget'), 10);
    this.onConfiguration = [onConfiguration];
    this.onValues = [onValues];
    this.onHistories = [onHistories];
    this.init();
    if (ready) {
      this.ready()
    }
    if (mobileHeight) {
      this.requestAdjustMobileHeight(mobileHeight)
    }
  }

  init() {
    if (!this.origins.includes(this.eraOrigin)) {
      throw new Error('Invalid eraOrigin')
    }
    window.addEventListener('message',  this.handleMessage.bind(this));
  }

  handleMessage(event) {
    // iframe and webview
    if (event.origin !== this.eraOrigin && event.origin !== window.location.origin) {
      return;
    }
    if (event.data?.source !== 'eraIframeWidget') {
      return;
    }
    const {type, data} = event.data;
    switch (type) {
      case 'configuration':
        this.triggerCallbacks(this.onConfiguration, data);
        break;
      case 'values':
        this.triggerCallbacks(this.onValues, data);
        break
      case 'histories':
        this.triggerCallbacks(this.onHistories, data);
        break
    }
  }

  triggerCallbacks(callbacks, data) {
    callbacks.forEach(cb => cb(data));
  }

  on(event, callback) {
    switch (event) {
      case 'configuration':
        this.onConfiguration.push(callback);
        break;
      case 'values':
        this.onValues.push(callback);
        break;
      case 'histories':
        this.onHistories.push(callback);
        break;
    }
  }

  off(event, callback) {
    switch (event) {
      case 'configuration':
        this.onConfiguration = this.onConfiguration.filter(cb => cb !== callback);
        break;
      case 'values':
        this.onValues = this.onValues.filter(cb => cb !== callback);
        break;
      case 'histories':
        this.onHistories = this.onHistories.filter(cb => cb !== callback);
        break;
    }
  }

  requestHistories(startTime, endTime) {
    this.postMessage('requestHistories', [
      startTime,
      endTime,
    ]);
  }

  postMessage(type, data) {
    const message = {
      source: 'eraIframeWidget',
      type,
      data,
      eraWidgetId: this.eraWidgetId,
    }

    if (window.parent !== window) {
      window.parent.postMessage(message, this.eraOrigin);
      return;
    }
    window.ReactNativeWebView.postMessage(JSON.stringify(message));
  }

  ready() {
    this.postMessage('ready');
  }

  requestAdjustMobileHeight(height) {
    this.postMessage('requestAdjustMobileHeight', height);
  }
}
try {
  module.exports = EraWidget;
}
catch (e) {
  window.EraWidget = EraWidget;
}
