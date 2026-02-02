# CI/CD Pipeline Guide

This guide explains the GitHub Actions CI/CD pipeline for MusicStream.

## Overview

The CI/CD pipeline automatically:
1. **Tests** backend and frontend code
2. **Builds** Docker images
3. **Scans** for security vulnerabilities
4. **Deploys** to production (when configured)

## Workflows

### Main CI/CD Workflow
**File**: `.github/workflows/ci-cd.yml`

**Triggers**:
- Push to `main` or `develop` branches
- Pull requests to `main`

**Jobs**:

#### 1. Backend Build & Test
- Sets up JDK 17
- Builds with Maven
- Runs unit tests
- Generates test reports

#### 2. Frontend Build & Test
- Sets up Node.js 20
- Installs dependencies
- Runs linting
- Builds production bundle
- Runs tests

#### 3. Docker Build
- Only runs on push to `main`
- Builds and pushes Docker images to Docker Hub
- Tags images with `latest` and commit SHA
- Uses build cache for faster builds

#### 4. Security Scan
- Scans codebase with Trivy
- Uploads results to GitHub Security tab
- Identifies vulnerabilities in dependencies

## Required Secrets

Configure these in GitHub repository settings (`Settings > Secrets and variables > Actions`):

### Docker Hub
- `DOCKER_USERNAME` - Your Docker Hub username
- `DOCKER_PASSWORD` - Your Docker Hub access token

### Deployment (Optional)
- `DEPLOY_HOST` - Server hostname/IP
- `DEPLOY_USER` - SSH username
- `DEPLOY_KEY` - SSH private key

## Setting Up Docker Hub

1. Create Docker Hub account at https://hub.docker.com
2. Create access token:
   - Go to Account Settings > Security
   - Click "New Access Token"
   - Name it "GitHub Actions"
   - Copy the token

3. Add secrets to GitHub:
   - Go to your repository
   - Settings > Secrets and variables > Actions
   - Click "New repository secret"
   - Add `DOCKER_USERNAME` and `DOCKER_PASSWORD`

## Workflow Status

View workflow runs:
1. Go to your repository on GitHub
2. Click "Actions" tab
3. See all workflow runs and their status

## Testing the Pipeline

### Test on Pull Request
```bash
git checkout -b test-ci
git commit --allow-empty -m "Test CI pipeline"
git push origin test-ci
```

Create a PR on GitHub and watch the checks run.

### Test on Main Branch
```bash
git checkout main
git commit --allow-empty -m "Test deployment"
git push origin main
```

This will trigger the full pipeline including Docker image builds.

## Customizing the Pipeline

### Add More Tests
Edit `.github/workflows/ci-cd.yml`:

```yaml
- name: Run integration tests
  working-directory: ./backend
  run: mvn verify
```

### Change Node Version
```yaml
- name: Set up Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '22'  # Change version
```

### Add Code Coverage
```yaml
- name: Upload coverage to Codecov
  uses: codecov/codecov-action@v3
  with:
    files: ./backend/target/site/jacoco/jacoco.xml
```

## Deployment

### Manual Deployment
The deployment job is commented out by default. To enable:

1. Uncomment the `deploy` job in `.github/workflows/ci-cd.yml`
2. Add deployment secrets to GitHub
3. Update the deployment script with your server path

### Automatic Deployment
Once enabled, every push to `main` will:
1. Run tests
2. Build Docker images
3. Deploy to your server
4. Pull latest images
5. Restart containers

## Monitoring

### Build Status Badge
Add to README.md:
```markdown
![CI/CD](https://github.com/yourusername/musicstream/workflows/MusicStream%20CI%2FCD/badge.svg)
```

### Notifications
Configure GitHub notifications:
- Settings > Notifications
- Enable "Actions" notifications
- Get emails on workflow failures

## Troubleshooting

### Tests Failing
1. Check the workflow run logs
2. Run tests locally:
```bash
# Backend
cd backend && mvn test

# Frontend
cd frontend && npm test
```

### Docker Build Failing
1. Check Dockerfile syntax
2. Test build locally:
```bash
docker build -t test-backend ./backend
docker build -t test-frontend ./frontend
```

### Secrets Not Working
1. Verify secrets are set in repository settings
2. Check secret names match exactly
3. Secrets are case-sensitive

### Deployment Failing
1. Verify SSH key is correct
2. Test SSH connection manually:
```bash
ssh -i deploy_key user@host
```

## Best Practices

1. **Always run tests locally** before pushing
2. **Use feature branches** for development
3. **Create PRs** to trigger checks before merging
4. **Review security scan results** regularly
5. **Keep dependencies updated** to avoid vulnerabilities
6. **Monitor workflow execution times** and optimize if needed

## Advanced Features

### Matrix Builds
Test multiple versions:
```yaml
strategy:
  matrix:
    java: [17, 21]
    node: [18, 20, 22]
```

### Conditional Steps
```yaml
- name: Deploy to staging
  if: github.ref == 'refs/heads/develop'
  run: ./deploy-staging.sh
```

### Caching
Already configured for Maven and npm. Speeds up builds significantly.

## Next Steps

- Set up staging environment
- Configure automated database migrations
- Add performance testing
- Set up monitoring and alerting
- Implement blue-green deployments
