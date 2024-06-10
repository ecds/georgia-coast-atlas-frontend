#!/bin/bash
echo "Running deploy script"
TAG=$([ "$BRANCH" == "main" ] && echo "latest" || echo "dev")

echo "Logging in to AWS"
aws ecr get-login-password --region us-east-1 | \
docker login --username AWS --password-stdin "${AWS_ECR}"
echo "Logged in successfully"

docker build -t georgia-coast-atlas --no-cache .

echo "Tagging image with ${TAG}"
docker tag georgia-coast-atlas "${AWS_ECR}/georgia-coast-atlas:${TAG}"

echo "Pushing image"
docker push "${AWS_ECR}/georgia-coast-atlas:${TAG}"

echo "Pushed succesfully"