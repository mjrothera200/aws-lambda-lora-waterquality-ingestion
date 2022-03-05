
const fs = require('fs');
const readline = require('readline');

const constants = require('./constants');

async function decode(deviceid, payload, writeClient) {
    try {
        // base 64 decode
        // Create a buffer from the string
        let bufferObj = Buffer.from(payload, "base64");
        //let decodedString = bufferObj.toString("utf8");
        
        console.log(bufferObj.toString('hex'))

        // Parse out the values
        values = []

        // Battery 
        const battery = ((bufferObj[0]<<8 | bufferObj[1])&0x7fff)/1000
        console.log(`battery: ${battery}`)
        const temp_c = (bufferObj[3]*256+bufferObj[4])/100
        console.log(`temp c: ${temp_c}`)
        const temp_f = ((temp_c * 9)/5)+32
        console.log(`temp f: ${temp_f}`)
        values.push(temp_f)
        // 5 & 6 are reserved and correspond to register 0
        const ec=(bufferObj[7]*256+bufferObj[8])
        console.log(`ec: ${ec} us/cm`)
        values.push(ec)
        const salinity = (bufferObj[9]*256+bufferObj[10])
        console.log(`salinity: ${salinity} mg/L`)
        values.push(salinity)
        const tds = (bufferObj[11]*256+bufferObj[12])
        console.log(`tds: ${tds} mg/L`)
        values.push(tds)

        values.push(battery)

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

    value = (values[4].toString().trim().length > 0) ? parseFloat(values[4].toString()) : 0.0;
    const record5 = {
        'Dimensions': dimensions,
        'MeasureName': 'battery1',
        'MeasureValue': value.toString(),
        'MeasureValueType': 'DOUBLE',
        'Time': timestamp.toString(),
        'Version': version
    };

    records.push(record5);
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
