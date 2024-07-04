# Use the official MongoDB image as the base image
FROM mongo:5.0

ARG MONGO_USERNAME
ARG MONGO_PASSWORD
ARG MONGO_DATABASE

# Set environment variables
ENV MONGO_INITDB_ROOT_USERNAME=${MONGO_USERNAME} \
    MONGO_INITDB_ROOT_PASSWORD=${MONGO_PASSWORD} \
    MONGO_INITDB_DATABASE=${MONGO_DATABASE}

# Install additional MongoDB tools
RUN apt-get update \
    && apt-get install -y \
        mongodb-org-shell \
    && rm -rf /var/lib/apt/lists/*

# Add /usr/bin to the PATH
ENV PATH="/usr/bin:${PATH}"

# Expose the MongoDB port
EXPOSE 27017

# Set the default command to run when the container starts
CMD ["mongod"]