# PowerBI React Dashboard

> 📊 A modern, responsive React application for seamlessly embedding and managing PowerBI reports with advanced features, security best practices, and enterprise-ready deployment options.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![PowerBI](https://img.shields.io/badge/PowerBI-2.22.3-yellow.svg)](https://powerbi.microsoft.com/)
[![Material UI](https://img.shields.io/badge/Material_UI-5.x-purple.svg)](https://mui.com/)

## Overview

PowerBI React Dashboard is a production-ready solution for integrating PowerBI reports into React applications. It supports both the PowerBI JavaScript SDK for advanced customization and iframe embedding for simple integration. Built with modern best practices, it includes features like:

- 🚀 Multiple embedding methods (SDK/iframe)
- 🔒 Secure credential management
- 📱 Responsive design
- 🔄 Error handling and retry logic
- 📊 Performance monitoring
- 🛠️ Easy customization
- 🌐 Production-ready deployment

[View Demo](https://your-demo-url.com) | [Documentation](https://your-docs-url.com) | [Report Issues](https://github.com/yourusername/powerbi-react-dashboard/issues)

## Prerequisites

- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)
- A PowerBI account (for custom reports)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd powerbi-app
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with your PowerBI credentials (if using custom reports):
```env
REACT_APP_POWERBI_REPORT_ID=your_report_id
REACT_APP_POWERBI_WORKSPACE_ID=your_workspace_id
REACT_APP_POWERBI_EMBED_URL=your_embed_url
REACT_APP_POWERBI_ACCESS_TOKEN=your_access_token
```

## Running the Application

1. Start the development server:
```bash
npm start
```

2. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Load Testing

To perform load testing on the application:

1. Install k6:
```bash
npm install -g k6
```

2. Create a load test script (e.g., `loadtest.js`):
```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export default function () {
  const res = http.get('http://localhost:3000');
  check(res, {
    'status is 200': (r) => r.status === 200,
    'page loads under 2s': (r) => r.timings.duration < 2000
  });
  sleep(1);
}
```

3. Run the load test:
```bash
k6 run --vus 10 --duration 30s loadtest.js
```

## Customizing the Report

### Using PowerBI JavaScript SDK (Advanced)

1. Update the `powerbi.config.js` file with your report details:
```javascript
export const powerBiConfig = {
  embedUrl: 'your_embed_url',
  reportId: 'your_report_id',
  type: 'report',
  tokenType: 'Embed',
  settings: {
    navContentPaneEnabled: true,
    filterPaneEnabled: true
  }
};
```

2. Update the Reports component to use the PowerBI JavaScript SDK:
```javascript
import { powerBiConfig } from '../config/powerbi.config';

// Use the powerBiConfig in your component
reportInstance = window.powerbi.embed(container, powerBiConfig);
```

### Using Iframe Embedding (Simple)

1. In the Reports component, update the iframe src with your report URL:
```javascript
<iframe
  title="PowerBI Report"
  width="100%"
  height="541.25"
  src="your_report_embed_url"
  frameBorder="0"
  allowFullScreen={true}
/>
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `REACT_APP_POWERBI_REPORT_ID` | Your PowerBI report ID |
| `REACT_APP_POWERBI_WORKSPACE_ID` | Your PowerBI workspace ID |
| `REACT_APP_POWERBI_EMBED_URL` | The embed URL for your report |
| `REACT_APP_POWERBI_ACCESS_TOKEN` | Access token for authentication |

## Dependencies

### Core Dependencies
- React 18.x
- Material-UI 5.x
- PowerBI Client SDK 2.22.3 (optional, for advanced embedding)

### Development Dependencies
- Node.js 14.x or higher
- npm 6.x or higher
- k6 (for load testing)

### Browser Support
- Chrome (latest)
- Firefox (latest)
- Edge (latest)
- Safari (latest)

## Best Practices

### Security
1. Always secure your PowerBI credentials
2. Use environment variables for sensitive information
3. Implement HTTPS for production
4. Regularly rotate access tokens
5. Use token expiration and refresh mechanisms

### Performance
1. Implement lazy loading for reports
2. Use proper caching strategies
3. Monitor report load times
4. Optimize report settings
5. Implement retry logic for failed loads

### Error Handling
1. Implement graceful fallbacks
2. Log errors for debugging
3. Show user-friendly error messages
4. Handle network timeouts
5. Monitor error rates

### Monitoring
1. Track report usage metrics
2. Monitor API response times
3. Set up error alerting
4. Track user interactions
5. Monitor resource usage

## Troubleshooting

1. If the report fails to load:
   - Check browser console for errors
   - Verify PowerBI credentials
   - Ensure report URL is accessible

2. If you see CORS errors:
   - Verify your PowerBI workspace settings
   - Check if the embed URL is correct
   - Ensure your domain is whitelisted

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting pull requests.

## Deployment

### Development
```bash
npm start
```

### Production Build
```bash
npm run build
```

### Deployment Options

1. **Static Hosting (e.g., Netlify, Vercel)**:
   ```bash
   # Install Netlify CLI
   npm install -g netlify-cli
   
   # Deploy to Netlify
   netlify deploy
   ```

2. **Docker Deployment**:
   ```bash
   # Build Docker image
   docker build -t powerbi-app .
   
   # Run container
   docker run -p 80:80 powerbi-app
   ```

3. **Traditional Server**:
   ```bash
   # Build the app
   npm run build
   
   # Serve using a static server
   npm install -g serve
   serve -s build
   ```

### Environment Setup

1. **Development**:
   ```env
   NODE_ENV=development
   REACT_APP_API_URL=http://localhost:3000
   ```

2. **Production**:
   ```env
   NODE_ENV=production
   REACT_APP_API_URL=https://your-api.com
   ```

3. **Testing**:
   ```env
   NODE_ENV=test
   REACT_APP_API_URL=http://localhost:3000
   ```

### Monitoring Setup

1. **Application Monitoring**:
   - Set up Application Insights
   - Configure error tracking
   - Set up performance monitoring

2. **Infrastructure Monitoring**:
   - Monitor server resources
   - Set up uptime checks
   - Configure alerts

### CI/CD Pipeline

1. **GitHub Actions**:
   ```yaml
   name: CI/CD
   on: [push]
   jobs:
     build:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v2
         - run: npm install
         - run: npm test
         - run: npm run build
   ```

2. **Azure DevOps**:
   - Set up build pipeline
   - Configure release pipeline
   - Set up environment approvals

## License

This project is licensed under the MIT License - see the LICENSE file for details.
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
