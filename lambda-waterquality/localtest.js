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

  // "38.2,12.5,25,67"
  await waterQuality.decode("6d415eb9-30cc-441f-88a4-16bd3c7612bc", "MzguMiwxMi41LDI1LDY3", writeClient).then((value) => {
    console.log(value)
  })

}

callServices();