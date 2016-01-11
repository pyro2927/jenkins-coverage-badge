# See https://github.com/nodesource/docker-node
FROM    nodesource/jessie:LTS

# cache package.json and node_modules to speed up builds
ADD     package.json package.json
RUN     npm install

# Expose the default jenkins-coverage-badge port
EXPOSE  9913

# Add your source files
ADD     . .
CMD     ["npm","start"]
