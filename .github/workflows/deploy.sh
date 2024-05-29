#!/bin/bash
echo "Running deploy script"
TAG=$([ "$BRANCH" == "main" ] && echo "latest" || echo "dev")

echo "Logging in to AWS"
aws ecr get-login-password --region us-east-1 | \
docker login --username AWS --password-stdin "${AWS_ECR}"
echo "Logged in successfully"

echo "Building Docker image for ${BRANCH}"
if [ "$BRANCH" == "main" ]; then
  docker build -t georgia-coast-atlas --no-cache .
else
  docker build -t georgia-coast-atlas --no-cache --file Dockerfile-dev .
fi

echo "Tagging image with ${TAG}"
docker tag georgia-coast-atlas "${AWS_ECR}/georgia-coast-atlas:${TAG}"

echo "Pushing image"
docker push "${AWS_ECR}/georgia-coast-atlas:${TAG}"

echo "Pushed succesfully"