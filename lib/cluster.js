const cluster = require('cluster');

if (cluster.isMaster) {
    for(let i = 0; i < require('os').cpus().length; i++) {
        //console.log(`cluster.fork - ${i}`)
        cluster.fork();

    }
    
}

cluster.on('exit', function(worker, code, signal) {
    console.log(`Worker ${worker.process.pid} died with code/signal ${signal || code}. Restarting worker...`);//, worker.process.pid, signal || code);
    cluster.fork();
});

module.exports = cluster;