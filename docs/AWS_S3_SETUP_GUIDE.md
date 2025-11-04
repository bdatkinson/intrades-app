# AWS S3 Setup Guide for InTrades File Upload System

## Required AWS S3 Credentials

To integrate the file upload system with AWS S3, you'll need the following credentials and configurations:

### 1. AWS Account Credentials

```env
# Add these to your .env file
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
AWS_REGION=us-east-1
S3_BUCKET=intrades-submissions
```

### 2. Step-by-Step AWS Setup

#### Step 1: Create an AWS Account
1. Go to [AWS Console](https://aws.amazon.com/)
2. Sign up for an AWS account if you don't have one
3. Complete the verification process

#### Step 2: Create an IAM User
1. Navigate to **IAM** (Identity and Access Management)
2. Click **Users** → **Add users**
3. User name: `intrades-s3-user`
4. Select **Programmatic access**
5. Click **Next: Permissions**

#### Step 3: Set IAM User Permissions
Create a custom policy with these permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:GetObjectVersion",
        "s3:ListBucket",
        "s3:PutObjectAcl",
        "s3:GetObjectAcl"
      ],
      "Resource": [
        "arn:aws:s3:::intrades-submissions/*",
        "arn:aws:s3:::intrades-submissions"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:ListAllMyBuckets",
        "s3:GetBucketLocation"
      ],
      "Resource": "*"
    }
  ]
}
```

1. Attach this policy to the IAM user
2. Complete user creation
3. **Save the Access Key ID and Secret Access Key** (shown only once!)

#### Step 4: Create S3 Bucket
1. Navigate to **S3** service
2. Click **Create bucket**
3. Bucket name: `intrades-submissions` (must be globally unique)
4. Region: `US East (N. Virginia) us-east-1` (or your preferred region)
5. **Block Public Access settings**:
   - ✅ Block all public access (we'll use signed URLs)
6. **Bucket Versioning**: Enable (recommended)
7. **Encryption**: Enable server-side encryption with S3 managed keys (SSE-S3)
8. Click **Create bucket**

#### Step 5: Configure Bucket CORS
Add this CORS configuration to your bucket:

1. Go to your bucket → **Permissions** → **CORS**
2. Add this configuration:

```json
[
  {
    "AllowedHeaders": [
      "*"
    ],
    "AllowedMethods": [
      "GET",
      "HEAD",
      "POST",
      "PUT",
      "DELETE"
    ],
    "AllowedOrigins": [
      "http://localhost:3000",
      "http://localhost:8080",
      "https://intrades.com"
    ],
    "ExposeHeaders": [
      "ETag",
      "x-amz-server-side-encryption",
      "x-amz-request-id",
      "x-amz-id-2"
    ],
    "MaxAgeSeconds": 3000
  }
]
```

#### Step 6: Set Bucket Lifecycle Policy (Optional)
To automatically clean up old files and save costs:

1. Go to **Management** → **Lifecycle rules**
2. Create rule: "Delete old submissions"
3. Configuration:
   - Transition to **Infrequent Access** after 30 days
   - Transition to **Glacier** after 90 days
   - **Delete** after 365 days
   - Apply to prefix: `temp/` (for temporary uploads)

### 3. Environment Configuration

Create a `.env` file in your project root:

```bash
# AWS S3 Configuration
AWS_ACCESS_KEY_ID=your-access-key-id-here
AWS_SECRET_ACCESS_KEY=your-secret-access-key-here
AWS_REGION=us-east-1
S3_BUCKET=intrades-submissions

# Optional: CloudFront CDN (for faster delivery)
CLOUDFRONT_DOMAIN=your-cloudfront-domain.cloudfront.net
CLOUDFRONT_KEY_PAIR_ID=your-key-pair-id
CLOUDFRONT_PRIVATE_KEY_PATH=./keys/cloudfront-private-key.pem
```

### 4. Cost Optimization Tips

#### Estimated Monthly Costs:
- **Storage**: $0.023 per GB (first 50 TB)
- **Requests**: 
  - PUT/POST: $0.005 per 1,000 requests
  - GET: $0.0004 per 1,000 requests
- **Data Transfer**: $0.09 per GB (after 1 GB free)

#### Cost Saving Strategies:
1. **Use Intelligent-Tiering**: Automatically moves objects between tiers
2. **Set lifecycle policies**: Archive or delete old files
3. **Enable S3 Transfer Acceleration**: For global users (additional cost)
4. **Use CloudFront CDN**: Reduce S3 requests and bandwidth costs
5. **Compress files**: Before upload when possible

### 5. Security Best Practices

#### Required Security Measures:
1. **Never commit credentials** to version control
2. **Use IAM roles** in production (EC2/ECS/Lambda)
3. **Enable MFA** on AWS root account
4. **Rotate access keys** regularly (every 90 days)
5. **Use bucket policies** to restrict access
6. **Enable CloudTrail** for audit logging
7. **Use VPC endpoints** for private connectivity

#### Bucket Policy Example:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "DenyInsecureConnections",
      "Effect": "Deny",
      "Principal": "*",
      "Action": "s3:*",
      "Resource": [
        "arn:aws:s3:::intrades-submissions/*",
        "arn:aws:s3:::intrades-submissions"
      ],
      "Condition": {
        "Bool": {
          "aws:SecureTransport": "false"
        }
      }
    }
  ]
}
```

### 6. Testing S3 Integration

#### Test Upload with AWS CLI:
```bash
# Install AWS CLI
pip install awscli

# Configure credentials
aws configure

# Test upload
echo "test" > test.txt
aws s3 cp test.txt s3://intrades-submissions/test/test.txt

# Test download
aws s3 cp s3://intrades-submissions/test/test.txt downloaded.txt

# List files
aws s3 ls s3://intrades-submissions/

# Delete test file
aws s3 rm s3://intrades-submissions/test/test.txt
```

#### Test with Node.js:
```javascript
// test-s3.js
import AWS from 'aws-sdk';
import dotenv from 'dotenv';

dotenv.config();

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

// Test connection
s3.listBuckets((err, data) => {
  if (err) {
    console.error('Error:', err);
  } else {
    console.log('Buckets:', data.Buckets);
  }
});

// Test upload
const params = {
  Bucket: process.env.S3_BUCKET,
  Key: 'test/hello.txt',
  Body: 'Hello from InTrades!'
};

s3.upload(params, (err, data) => {
  if (err) {
    console.error('Upload error:', err);
  } else {
    console.log('Upload success:', data.Location);
  }
});
```

### 7. Production Deployment

#### Using IAM Roles (Recommended for EC2/ECS):
Instead of access keys, use IAM roles:

1. Create IAM role for EC2/ECS
2. Attach S3 policy to role
3. Assign role to EC2 instance or ECS task
4. Remove access keys from .env (SDK will use role automatically)

#### Environment Variables in Production:
```bash
# Heroku
heroku config:set AWS_ACCESS_KEY_ID=your-key
heroku config:set AWS_SECRET_ACCESS_KEY=your-secret
heroku config:set AWS_REGION=us-east-1
heroku config:set S3_BUCKET=intrades-submissions

# Docker
docker run -e AWS_ACCESS_KEY_ID=your-key \
           -e AWS_SECRET_ACCESS_KEY=your-secret \
           -e AWS_REGION=us-east-1 \
           -e S3_BUCKET=intrades-submissions \
           your-image

# Kubernetes Secret
kubectl create secret generic aws-s3 \
  --from-literal=AWS_ACCESS_KEY_ID=your-key \
  --from-literal=AWS_SECRET_ACCESS_KEY=your-secret
```

### 8. Monitoring and Alerts

#### CloudWatch Metrics to Monitor:
1. **BucketSizeBytes**: Total storage used
2. **NumberOfObjects**: Total files stored
3. **AllRequests**: API request count
4. **4xxErrors**: Client errors
5. **5xxErrors**: Server errors

#### Set Up Billing Alerts:
1. Go to **AWS Billing** → **Budgets**
2. Create budget: $50/month (adjust as needed)
3. Set alert at 80% threshold
4. Add email notification

### 9. Troubleshooting Common Issues

#### Issue: Access Denied
```
Solution: Check IAM permissions and bucket policy
aws s3api get-bucket-policy --bucket intrades-submissions
```

#### Issue: CORS Errors
```
Solution: Verify CORS configuration and allowed origins
Ensure your domain is in AllowedOrigins
```

#### Issue: Slow Uploads
```
Solution: 
1. Use multipart upload for files > 5MB
2. Enable Transfer Acceleration
3. Use nearest AWS region
```

#### Issue: High Costs
```
Solution:
1. Review CloudWatch metrics
2. Enable lifecycle policies
3. Use Intelligent-Tiering
4. Compress files before upload
```

### 10. Alternative Solutions

If AWS S3 costs are a concern, consider these alternatives:

#### 1. **Cloudinary** (Recommended for images)
- Free tier: 25GB storage, 25GB bandwidth
- Automatic image optimization
- Built-in CDN

#### 2. **Firebase Storage**
- Free tier: 5GB storage, 1GB/day download
- Easy integration with Firebase Auth
- Good for small projects

#### 3. **DigitalOcean Spaces**
- $5/month: 250GB storage, 1TB bandwidth
- S3-compatible API
- Built-in CDN included

#### 4. **Local Storage** (Development only)
- Already configured in the code
- Set `NODE_ENV=development`
- Files stored in `./uploads` directory

### Support and Resources

- [AWS S3 Documentation](https://docs.aws.amazon.com/s3/)
- [AWS SDK for JavaScript](https://docs.aws.amazon.com/sdk-for-javascript/)
- [S3 Pricing Calculator](https://calculator.aws/#/createCalculator/S3)
- [AWS Free Tier](https://aws.amazon.com/free/) - 5GB storage free for 12 months

---

## Quick Start Checklist

- [ ] Create AWS account
- [ ] Create IAM user with S3 permissions
- [ ] Create S3 bucket `intrades-submissions`
- [ ] Configure CORS on bucket
- [ ] Save credentials in `.env` file
- [ ] Test with AWS CLI
- [ ] Run application with `npm run dev`
- [ ] Test file upload through API
- [ ] Set up monitoring and alerts
- [ ] Configure production deployment