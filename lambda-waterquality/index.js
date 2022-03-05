// dependencies
const AWS = require('aws-sdk');
const util = require('util');
const waterQuality = require("./lora-waterquality-to-timeseries");

// Modeled after:
// https://docs.aws.amazon.com/lambda/latest/dg/with-s3-tutorial.html


// get reference to S3 client
const s3 = new AWS.S3();

exports.handler = async (event, context, callback) => {

    // Setup timestream
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
    let payload = ""
    let deviceid = ""
    
    if (event.PayloadData) {
        console.log(event.PayloadData)
        payload = event.PayloadData
    } else {
        console.log("ERROR:  Missing Payload Data")
        payload = "ERROR"
    }
    if (event.WirelessDeviceId) {
        console.log(event.WirelessDeviceId)
        deviceid = event.WirelessDeviceId
    } else {
        console.log("ERROR:  Missing Device ID")
        deviceid = "ERROR"
    }

    try {
        

        // Parse the stream
        console.log("Processing. ")

        // Testing for now - get the real payload!
        const result = await waterQuality.decode(deviceid, payload, writeClient)
      

    } catch (error) {
        console.log(error);
        return;
    }


};
