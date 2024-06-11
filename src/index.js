const ALLOW_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  'https://app.e-ra.io',
  'https://staging-app.e-ra.io',
];

class EraWidget {
  constructor(origins = null) {
    this.origins = origins || ALLOW_ORIGINS;
    this.urlParams = new URLSearchParams(window.location.search);
    this.eraOrigin = this.urlParams.get('eraOrigin');
    this.eraWidgetId = parseInt(this.urlParams.get('eraWidget'), 10);
    this.onConfigurationCallbacks = [];
    this.onValuesCallbacks = [];
    this.onHistoriesCallbacks = [];
    this.init();
  }

  init() {
    if (!this.origins.includes(this.eraOrigin)) {
      throw new Error('Invalid eraOrigin')
    }
    window.addEventListener('message',  this.handleMessage.bind(this));
  }

  handleMessage(event) {
    if (event.origin !== this.eraOrigin) {
      return;
    }
    if (event.data?.source !== 'eraIframeWidget') {
      return;
    }
    const {type, data} = event.data;
    switch (type) {
      case 'configuration':
        this.triggerCallbacks(this.onConfigurationCallbacks, data);
        break;
      case 'configValues':
        this.triggerCallbacks(this.onValuesCallbacks, data);
        break
      case 'chartData':
        this.triggerCallbacks(this.onHistoriesCallbacks, data);
        break
    }
  }

  triggerCallbacks(callbacks, data) {
    callbacks.forEach(cb => cb(data));
  }

  on(event, callback) {
    switch (event) {
      case 'configuration':
        this.onConfigurationCallbacks.push(callback);
        break;
      case 'configValues':
        this.onValuesCallbacks.push(callback);
        break;
      case 'configHistory':
        this.onHistoriesCallbacks.push(callback);
        break;
    }
  }

  off(event, callback) {
    switch (event) {
      case 'configuration':
        this.onConfigurationCallbacks = this.onConfigurationCallbacks.filter(cb => cb !== callback);
        break;
      case 'values':
        this.onValuesCallbacks = this.onValuesCallbacks.filter(cb => cb !== callback);
        break;
      case 'histories':
        this.onHistoriesCallbacks = this.onHistoriesCallbacks.filter(cb => cb !== callback);
        break;
    }
  }

  onConfiguration(callback) {
    this.on('configuration', callback);
  }

  onValues(callback) {
    this.on('values', callback);
  }

  onHistories(callback) {
    this.on('histories', callback);
  }
  offConfiguration(callback) {
    this.off('configuration', callback);
  }

  offValues(callback) {
    this.off('values', callback);
  }

  offHistories(callback) {
    this.off('histories', callback);
  }

  requestHistories(startTime, endTime) {
    this.postMessage('requestHistories', [
      startTime,
      endTime,
    ]);
  }

  postMessage(type, data) {
    window.parent.postMessage({
      source: 'eraIframeWidget',
      type,
      data,
      eraWidgetId: this.eraWidgetId,
    }, this.eraOrigin);
  }

  ready() {
    this.postMessage('ready');
  }
}

export default EraWidget;
