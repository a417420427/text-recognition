import type { UserConfigExport } from "@tarojs/cli"

export default {
   logger: {
    quiet: false,
    stats: true
  },
  mini: {},
  h5: {
    devServer: {
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
          pathRewrite: { '^/api': '/api' },
        },
      },
    },
  }
} satisfies UserConfigExport<'webpack5'>
