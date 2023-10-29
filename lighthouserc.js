module.exports = {
  ci: {
    collect: {
      startServerCommand: 'yarn dev',
      startServerReadyPattern: 'ready on',
      url: ['http://localhost:3000'],
    },
    assert: {
      preset: 'lighthouse:recommended',
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
}
