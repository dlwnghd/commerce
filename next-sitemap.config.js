/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SiteURL || 'https://localhost:3000',
  generateRobotsTxt: true,
}
