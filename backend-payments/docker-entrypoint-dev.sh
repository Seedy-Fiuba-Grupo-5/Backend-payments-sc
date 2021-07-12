#!/bin/bash
until [ -f /app/deployments/localhost/Seedifyuba.json ]
do
  echo "Waiting for hardhat node to start"
  sleep 5
done
echo "Hardhat node has started"
npm run start-dev
