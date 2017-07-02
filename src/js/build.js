({
    baseUrl: '.',
    paths: {
        app: '.',
        jquery: '../../node_modules/jquery/dist/jquery',
        waterfall: 'component/waterFall',
        exposure: 'component/exposure'
    },
    name: 'main', //表示在哪里开始解析
    out: './index.merge.js'
})