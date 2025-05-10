export const powerBiConfig = {
  reportId: process.env.REACT_APP_POWERBI_REPORT_ID,
  workspaceId: process.env.REACT_APP_POWERBI_WORKSPACE_ID,
  embedUrl: process.env.REACT_APP_POWERBI_EMBED_URL || 'https://playground.powerbi.com/sampleReportEmbed',
  accessToken: process.env.REACT_APP_POWERBI_ACCESS_TOKEN,
};
