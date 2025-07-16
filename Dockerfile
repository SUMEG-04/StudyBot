# Step 1: Use an official Node.js image from the Docker Hub
FROM node:14

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy the package.json and package-lock.json (if available)
# This helps in caching Docker layers, so dependencies aren't re-installed every time
COPY package*.json ./

# Step 4: Install the dependencies
RUN npm install

# Step 5: Copy the rest of the app files
COPY . .

# Step 6: Expose the port your app will run on (default is 3000)
EXPOSE 3000

# Step 7: Define the command to run your app
CMD ["npm", "start"]
