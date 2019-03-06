module.exports = {
    modules: [{
        name: '测试环境',
        env: 'test',
        ssh: {
            host: '120.79.203.172',
            username: 'root',
            privateKey: require('fs').readFileSync(`${require('os').homedir()}/.ssh/id_rsa`)
        },
        buildCommand: 'build',
        localPath: 'dist',
        localTarFileDir: '/tmp/js', // 指定目录，否则同机发布有问题
        remotePath: '/home/nginx/html/yw/project/performance/mb',
    },{
        name: '发布环境',
        env: 'prod',
        ssh: {
            host: '47.96.137.21',
            username: 'root',
            privateKey: require('fs').readFileSync(`${require('os').homedir()}/.ssh/id_rsa`)
        },
        buildCommand: 'build',
        localPath: 'dist',
        remotePath: '/home/nginx/html/yw/project/performance/mb',
    }]
}