// Load the SDK
const AWS = require("aws-sdk");

// Load Code
const waterQuality = require("./lora-waterquality-to-timeseries");


// Configuring AWS SDK
AWS.config.update({ region: "us-east-1" });

// Creating TimestreamWrite and TimestreamQuery client

/**
 * Recommended Timestream write client SDK configuration:
 *  - Set SDK retry count to 10.
 *  - Use SDK DEFAULT_BACKOFF_STRATEGY
 *  - Set RequestTimeout to 20 seconds .
 *  - Set max connections to 5000 or higher.
 */
var https = require('https');
var agent = new https.Agent({
  maxSockets: 5000
});
writeClient = new AWS.TimestreamWrite({
  maxRetries: 10,
  httpOptions: {
    timeout: 20000,
    agent: agent
  }
});
queryClient = new AWS.TimestreamQuery();


async function callServices() {


 /* FIRST TEST PRIOR TO CALIBRATION */

  // Test Value:  Pure Water
  // DUoBBuoAAADcAHkAbgAAAAAAJQ==
  // Output:
  /*
  battery: 3.402
  temp c: 17.7
  temp f: 63.86
  ec: 220 us/cm
  salinity: 121 mg/L
  tds: 110 mg/L
   */

  // Test Value:  1413 uS/cm
  // DUoBB0QAAAWCAwcCwQAAAAAA2Q==
  // Output:
  /*
  battery: 3.402
  temp c: 18.6
  temp f: 65.48
  ec: 1410 us/cm
  salinity: 775 mg/L
  tds: 705 mg/L
  */

  // Test Value:  12,880 us/cm
  // DUoBCCoAADCEGq8YQgAAAAAH2A==
  /*
  0d4a01082a000030841aaf18420000000007d8
  battery: 3.402
  temp c: 20.9
  temp f: 69.62
  ec: 12420 us/cm
  salinity: 6831 mg/L
tds: 6210 mg/L
*/

// After calibration....

// Test Value:  1413 uS/cm
  // DUoBCboAAAYsA2UDFgAAAAABFg==
  // Output:
  /*
  0d4a0109100000066803860334000000000116
battery: 3.402
temp c: 23.2
temp f: 73.75999999999999
ec: 1640 us/cm
salinity: 902 mg/L
tds: 820 mg/L
  */

// Test Value:  1413 uS/cm
  // DUoBCYgAADGSG0MYyQAAAAAIoA==
  // Output:
  /*
0d4a010988000031921b4318c90000000008a0
battery: 3.402
temp c: 24.4
temp f: 75.92
ec: 12690 us/cm
salinity: 6979 mg/L
tds: 6345 mg/L
  */

// Chesapeake Bay
// DUoBAwIAAE4gKvgnEAAAAAAJNg==
/*
0d4a01030200004e202af82710000000000936
battery: 3.402
temp c: 7.7
temp f: 45.86
ec: 20000 us/cm
salinity: 11000 mg/L
tds: 10000 mg/L
*/


  // "38.2,12.5,25,67"
  await waterQuality.decode("6d415eb9-30cc-441f-88a4-16bd3c7612bc", "DUoBAwIAAE4gKvgnEAAAAAAJNg==", writeClient).then((value) => {
    console.log(value)
  })

}

callServices();