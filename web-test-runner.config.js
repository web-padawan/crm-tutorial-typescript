const { esbuildPlugin } = require('@web/dev-server-esbuild');
const { fromRollup } = require('@web/dev-server-rollup');
const litCss = require('rollup-plugin-lit-css');

const css = fromRollup(litCss)

module.exports = {
  nodeResolve: true,
  mimeTypes: {
    'frontend/components/**/*.css': 'js'
  },
  plugins: [
    esbuildPlugin({ ts: true }),
    css({
      include: 'frontend/components/**/*.css'
    })
  ]
};
