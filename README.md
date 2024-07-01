# E-Ra Widget
Library to create E-Ra widget

## Installation
```bash
npm install @eohjsc/era-widget
```
```bash
yarn add @eohjsc/era-widget
```
```html
<script src="https://www.unpkg.com/@eohjsc/era-widget@1.0.16/src/index.js"></script>
```
## Usage
```javascript
import EraWidget from '@eohjsc/era-widget';
```
```javascript
const eraWidget = new EraWidget({
  onConfiguration: (configuration) => {
    console.log('configuration', configuration);
  },
  onHistory: (history) => {
    console.log('history', history);
  },
  onValues: (values) => {
    console.log('values', values);
  },
});


# call when need to request history
eraWidget.requestHistories(startTime, endTime);
```
## Options
| Name            | Type     | Default | Description                                      |
|-----------------|----------|---------|--------------------------------------------------|
| onConfiguration | Function | null    | Callback function when configuration is received |
| onHistory       | Function | null    | Callback function when history is received       |
| onValues        | Function | null    | Callback function when values are received       |
| ready           | boolean  | true    | Auto send ready message after initializing       |
| mobileHeight    | number   | 300     | Height of widget on mobile                       |

## Methods
| Name                                            | Description                     |
|-------------------------------------------------|---------------------------------|
| requestAdjustMobileHeight(height: integer)      | Request to adjust mobile height |
| ready()                                         | Send ready message              |
| requestHistories(start: datetime, end:datetime) | Request histories               |

## Events
| Name          | Description           | Example                                                                                                                                   |
|---------------|-----------------------|-------------------------------------------------------------------------------------------------------------------------------------------|
| configuration | widget configuration  | ```{url, realtime_configs : [ { name, color, sensor_id, chip_id, id } ], history_configs: [ { name, color, sensor_id, chip_id, id } ]}``` |
| values        | realtime config value | ```{ 1 : {value: 2} }```                                                                                                                  |
| histories     | history data          | ```[{data: [{x, y}], name, color, sensor_id, chip_id, id }]```                                                                            |
