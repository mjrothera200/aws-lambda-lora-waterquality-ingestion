
const fs = require('fs');
const readline = require('readline');

const constants = require('./constants');

async function decode(deviceid, payload, writeClient) {
    try {
        // base 64 decode
        // Create a buffer from the string
        let bufferObj = Buffer.from(payload, "base64");
        let decodedString = bufferObj.toString("utf8");
        //
        var values = decodedString.toString().split(',');
        result = await process(deviceid, values, writeClient)
        return result
    } catch (e) {
        console.log('e', e);
        return { exception: e }
    }
}

async function process(deviceid, values, writeClient) {
    const currentTime = Date.now().toString(); // Unix time in milliseconds

    var records = [];
    var counter = 0;
    var processed = 0;

    const promises = [];

    var start_time = Date.now()

    const dimensions = [
        { 'Name': 'sensorid', 'Value': deviceid }
    ];
    const recordTime = currentTime - counter * 50;
    let version = Date.now();
    const timestamp = Date.now();
    var value = 0.0
    value = (values[0].toString().trim().length > 0) ? parseFloat(values[0].toString()) : 0.0;
    const record1 = {
        'Dimensions': dimensions,
        'MeasureName': 'tempf',
        'MeasureValue': value.toString(),
        'MeasureValueType': 'DOUBLE',
        'Time': timestamp.toString(),
        'Version': version
    };

    records.push(record1);
    counter++;

    value = (values[1].toString().trim().length > 0) ? parseFloat(values[1].toString()) : 0.0;
    const record2 = {
        'Dimensions': dimensions,
        'MeasureName': 'ec',
        'MeasureValue': value.toString(),
        'MeasureValueType': 'DOUBLE',
        'Time': timestamp.toString(),
        'Version': version
    };

    records.push(record2);
    counter++;

    value = (values[2].toString().trim().length > 0) ? parseFloat(values[2].toString()) : 0.0;
    const record3 = {
        'Dimensions': dimensions,
        'MeasureName': 'salinity',
        'MeasureValue': value.toString(),
        'MeasureValueType': 'DOUBLE',
        'Time': timestamp.toString(),
        'Version': version
    };

    records.push(record3);
    counter++;

    value = (values[3].toString().trim().length > 0) ? parseFloat(values[3].toString()) : 0.0;
    const record4 = {
        'Dimensions': dimensions,
        'MeasureName': 'tds',
        'MeasureValue': value.toString(),
        'MeasureValueType': 'DOUBLE',
        'Time': timestamp.toString(),
        'Version': version
    };

    records.push(record4);
    counter++


    // 
    processed++;



    if (records.length !== 0) {
        promises.push(submitBatch(records, counter, writeClient));
    }

    await Promise.all(promises).then(() => {

    });

    var end_time = Date.now()
    var processing_time = (end_time - start_time)
    
    console.log("Complete.")
    console.log(`Ingested ${counter} records.  Processed ${processed} records.`);
    var results = {
        ingested: counter,
        processed: processed,
        startTime: new Date(start_time).toString(),
        endTime: new Date(end_time).toString(),
        processingTime: processing_time

    }
    return results;

}

function submitBatch(records, counter, writeClient) {
    const params = {
        DatabaseName: constants.DATABASE_NAME,
        TableName: constants.TABLE_NAME,
        Records: records
    };

    var promise = writeClient.writeRecords(params).promise();

    return promise.then(
        (data) => {
            console.log(`Processed ${counter} records.`);
        },
        (err) => {
            console.log("Error writing records:", err);
        }
    );
}

module.exports = { decode, process };
