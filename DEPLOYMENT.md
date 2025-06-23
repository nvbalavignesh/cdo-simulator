# CDO Simulator - AWS Deployment

## Deployment Options

### Option 1: AWS Amplify (Recommended)

AWS Amplify is the easiest way to deploy React apps with automatic CI/CD.

#### Steps:

1. **Create a GitHub Repository** (if you haven't already):
   ```bash
   git init
   git add .
   git commit -m "Initial commit - CDO Simulator"
   git branch -M main
   git remote add origin https://github.com/yourusername/cdo-simulator.git
   git push -u origin main
   ```

2. **Deploy with AWS Amplify**:
   - Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
   - Click "New app" → "Host web app"
   - Connect your GitHub repository
   - AWS will automatically detect it's a React app
   - Use the included `amplify.yml` for build settings
   - Deploy!

3. **Your app will be live** at a URL like: `https://main.d1234567890.amplifyapp.com`

### Option 2: AWS S3 + CloudFront

For more control, you can use S3 for storage and CloudFront for CDN.

#### Steps:

1. **Build your app**:
   ```bash
   npm run build
   ```

2. **Create S3 bucket** (via AWS CLI or Console):
   ```bash
   aws s3 mb s3://your-cdo-simulator-bucket --region us-east-1
   ```

3. **Upload build files**:
   ```bash
   aws s3 sync build/ s3://your-cdo-simulator-bucket --delete
   ```

4. **Enable static website hosting** on the S3 bucket

5. **Set up CloudFront distribution** for global CDN

### Option 3: AWS EC2 with nginx

For a traditional server setup.

## Quick Start with Amplify

The fastest way is using AWS Amplify:

1. Push your code to GitHub
2. Connect GitHub to AWS Amplify
3. Deploy automatically!

## Environment Variables

If you need environment variables, create a `.env` file:
```
REACT_APP_API_URL=your_api_url_here
REACT_APP_ENVIRONMENT=production
```

## Custom Domain

Once deployed, you can add a custom domain through the Amplify console.

## Cost Estimation

- **AWS Amplify**: ~$1-5/month for a simple app
- **S3 + CloudFront**: ~$0.50-2/month for low traffic
- **EC2**: ~$5-20/month depending on instance size
