#!/bin/bash

# Colors for terminal output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Todo List Application Starter ===${NC}\n"

# Check if .env file exists
if [ ! -f .env ]; then
  echo -e "${YELLOW}No .env file found. Creating a sample one...${NC}"
  cat > .env << EOL
DATABASE_URL="postgresql://postgres:password@localhost:5432/todoapp"
NEXTAUTH_SECRET="$(openssl rand -base64 32)"
NEXTAUTH_URL="http://localhost:3000"
EOL
  echo -e "${GREEN}✓ Created .env file with sample configuration${NC}"
  echo -e "${YELLOW}⚠️  Please edit the .env file with your actual database credentials${NC}\n"
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
  echo -e "${YELLOW}Installing dependencies...${NC}"
  npm install
  if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Failed to install dependencies${NC}"
    exit 1
  fi
  echo -e "${GREEN}✓ Dependencies installed${NC}\n"
else
  echo -e "${GREEN}✓ Dependencies already installed${NC}\n"
fi

# Check if Prisma client is generated
if [ ! -d "src/generated/prisma" ]; then
  echo -e "${YELLOW}Generating Prisma client...${NC}"
  npx prisma generate
  if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Failed to generate Prisma client${NC}"
    exit 1
  fi
  echo -e "${GREEN}✓ Prisma client generated${NC}\n"
fi

# Ask if user wants to push schema to database
echo -e "${YELLOW}Do you want to push the Prisma schema to your database? (y/n)${NC}"
read -r answer
if [[ "$answer" =~ ^[Yy]$ ]]; then
  echo -e "${YELLOW}Pushing schema to database...${NC}"
  npx prisma db push
  if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Failed to push schema to database${NC}"
    echo -e "${YELLOW}Please check your database connection details in the .env file${NC}"
  else
    echo -e "${GREEN}✓ Schema pushed to database${NC}\n"
  fi
fi

echo -e "${GREEN}Starting development server...${NC}"
npm run dev 