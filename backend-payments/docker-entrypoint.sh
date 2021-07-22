#!/bin/sh
until [ -f /etc/datadog-agent/datadog.yaml ]
do
  echo "Waiting for datadog.yaml to be generated"
  sleep 5
done

datadog-agent run > /dev/null &
/opt/datadog-agent/embedded/bin/trace-agent --config=/etc/datadog-agent/datadog.yaml > /dev/null &
/opt/datadog-agent/embedded/bin/process-agent --config=/etc/datadog-agent/datadog.yaml > /dev/null &

npm run start-prod
