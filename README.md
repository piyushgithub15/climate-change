# Instagram Auto-Poster + Climate Change Content Pipeline

Schedule and auto-publish posts to Instagram, with an AI-powered pipeline that automatically generates climate change infographics and posts them twice daily.

## Features

- **Manual posting**: Schedule image posts, carousels, and reels via the web dashboard
- **AI content pipeline**: Automatically generates climate change infographics using GPT-4o + gpt-image-1
- **15 topic rotation**: Cycles through climate topics (emissions, biodiversity, health, economics, etc.)
- **5 infographic templates**: Dark overlay, gradient sidebar, bottom card, bold center, split facts
- **Twice-daily auto-posting**: Configurable schedule (default: 9 AM and 6 PM)
- **Non-expiring tokens**: Set up Meta credentials once, works forever
- **Docker ready**: Deployable to Azure Container Apps or any container platform

## Prerequisites

1. **Node.js 18+**
2. **Instagram Creator/Business account** linked to a Facebook Page
3. **Meta Developer App** at [developers.facebook.com](https://developers.facebook.com)
4. **OpenAI API key** from [platform.openai.com](https://platform.openai.com) (for the content pipeline)
5. **Cloudinary account** (free) from [cloudinary.com](https://cloudinary.com) (for image hosting)

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Fill in your `.env` with:

| Variable | Where to get it |
|----------|----------------|
| `META_APP_ID` | Meta App Dashboard |
| `META_APP_SECRET` | Meta App Dashboard |
| `INSTAGRAM_ACCOUNT_ID` | Graph API Explorer: `me/accounts?fields=instagram_business_account` |
| `FACEBOOK_PAGE_ID` | Graph API Explorer: `me/accounts` |
| `ACCESS_TOKEN` | Graph API Explorer (generate with `instagram_basic`, `instagram_content_publish`, `pages_show_list`, `pages_read_engagement`) |
| `OPENAI_API_KEY` | [platform.openai.com/api-keys](https://platform.openai.com/api-keys) |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary Dashboard |
| `CLOUDINARY_API_KEY` | Cloudinary Dashboard |
| `CLOUDINARY_API_SECRET` | Cloudinary Dashboard |

### 3. Run

```bash
# Development (auto-reload)
npm run dev

# Production
npm run build && npm start
```

Open [http://localhost:3000](http://localhost:3000) to access the dashboard.

## How the Pipeline Works

1. **Topic Selection** -- Cycles through 15 climate change topics (top polluters, biodiversity loss, health impacts, etc.)
2. **Content Generation** -- GPT-4o creates a title, 4 key facts with real statistics, source attribution, and an Instagram caption with hashtags
3. **Background Image** -- gpt-image-1 generates a dramatic, artistic background image
4. **Infographic Assembly** -- Puppeteer renders an HTML/CSS template (randomly chosen from 5 designs) with the AI background and text overlay
5. **Upload & Publish** -- Uploads the infographic to Cloudinary and posts to Instagram

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/posts` | List all posts |
| POST | `/api/posts` | Create a scheduled post |
| DELETE | `/api/posts/:id` | Cancel a pending post |
| POST | `/api/upload` | Upload file to Cloudinary |
| GET | `/api/rate-limit` | Check Instagram publishing rate limit |
| POST | `/api/pipeline/generate` | Manually trigger the content pipeline |
| GET | `/api/pipeline/logs` | Get pipeline run history |
| GET | `/api/pipeline/topics` | List all climate topics |
| GET | `/api/pipeline/status` | Check pipeline configuration status |
| GET | `/api/health` | Health check |

## Docker

### Build and run locally

```bash
docker compose up --build
```

### Deploy to Azure Container Apps

```bash
# 1. Login to Azure
az login

# 2. Create a resource group
az group create --name climate-poster-rg --location eastus

# 3. Create a container registry
az acr create --resource-group climate-poster-rg --name climateposteracr --sku Basic
az acr login --name climateposteracr

# 4. Build and push the image
docker build -t climateposteracr.azurecr.io/instagram-poster:latest .
docker push climateposteracr.azurecr.io/instagram-poster:latest

# 5. Create Container Apps environment
az containerapp env create \
  --name climate-poster-env \
  --resource-group climate-poster-rg \
  --location eastus

# 6. Deploy the container app
az containerapp create \
  --name climate-poster \
  --resource-group climate-poster-rg \
  --environment climate-poster-env \
  --image climateposteracr.azurecr.io/instagram-poster:latest \
  --registry-server climateposteracr.azurecr.io \
  --target-port 3000 \
  --ingress external \
  --min-replicas 1 \
  --max-replicas 1 \
  --cpu 0.5 \
  --memory 1.0Gi \
  --env-vars \
    META_APP_ID=your_id \
    META_APP_SECRET=secretref:meta-app-secret \
    INSTAGRAM_ACCOUNT_ID=your_ig_id \
    FACEBOOK_PAGE_ID=your_page_id \
    ACCESS_TOKEN=secretref:access-token \
    OPENAI_API_KEY=secretref:openai-key \
    CLOUDINARY_CLOUD_NAME=your_cloud \
    CLOUDINARY_API_KEY=your_key \
    CLOUDINARY_API_SECRET=secretref:cloudinary-secret
```

For secrets, use:
```bash
az containerapp secret set --name climate-poster \
  --resource-group climate-poster-rg \
  --secrets meta-app-secret=YOUR_SECRET \
            access-token=YOUR_TOKEN \
            openai-key=YOUR_KEY \
            cloudinary-secret=YOUR_SECRET
```

## Cost Estimate

| Service | Monthly Cost |
|---------|-------------|
| Azure Container Apps (0.5 vCPU, 1 GB) | ~$10-15 |
| OpenAI API (2 posts/day) | ~$6-9 |
| Cloudinary (free tier) | $0 |
| **Total** | **~$16-24** |

## Limitations

- Images must be JPEG format for Instagram
- Max 100 API-published posts per 24 hours
- Media must be publicly accessible via URL at publish time
- Reels require video processing time
- GPT-4o content is based on training data; always verify critical statistics
