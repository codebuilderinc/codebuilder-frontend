# Codebuilder Webapp

[![Deploy Production Docker Container](https://github.com/codebuilderinc/codebuilder-frontend/actions/workflows/deploy-docker.yml/badge.svg)](https://github.com/codebuilderinc/codebuilder-frontend/actions/workflows/deploy-docker.yml)


This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, setup your mysql database and edit the .env.example file. 

```bash 
cp .env.example .env.local
```

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Build the production Docker container:
```bash
docker run -d --network host -p 3000:3000 --env-file .env --name codebuilder-webapp codebuilder-webapp:latest
```

Note: The production website will automatically build & deploy through a GH action anytime a push is made to main.

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Activity
![Alt](https://repobeats.axiom.co/api/embed/f01e046c8b7d8a2c653ee751c55c2345072872c4.svg "Repobeats analytics image")
