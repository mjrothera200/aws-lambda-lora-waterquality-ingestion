#!/bin/sh

# Set these variables for your installation
ROOT=oyster-haven-waterquality
AWS_ACCOUNTID=922129242138
# For AWS Time Series
DATABASE_NAME=oyster-haven
TABLE_NAME=water-quality

# Remove any previous function.zip
rm -rf function.zip

cd ../lambda-waterquality
zip -r function.zip .
cd ../setup
mv ../lambda-waterquality/function.zip .

aws lambda create-function --function-name $ROOT \
--zip-file fileb://function.zip --handler index.handler --runtime nodejs16.x \
--timeout 30 --memory-size 1024 \
--role arn:aws:iam::$AWS_ACCOUNTID:role/$ROOT-role

echo "Waiting for it to be created...."
sleep 60
echo "Finishing Process!"


aws lambda get-policy --function-name $ROOT
