# E-Ra Widget
Library to create E-Ra widget

## Installation
```bash
npm install @eohjsc/era-widget
```
```bash
yarn add @eohjsc/era-widget
```
## Usage
```javascript
import ERaWidget from '@eohjsc/era-widget';

const eraWidget = new ERaWidget();

eraWidget.onConfiguration((configuration) => {
  console.log('configuration', configuration);
});

eraWidget.onHistory((history) => {
  console.log('history', history);
});

eraWidget.onValues((values) => {
  console.log('values', values);
});

# call when is ready for use
eraWidget.ready(); 

# call when need to request history
eraWidget.requestHistories(startTime, endTime);


