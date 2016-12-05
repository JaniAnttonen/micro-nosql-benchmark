# micro-nosql-benchmark
NoSQL benchmark comparing Redis with MongoDB for a thesis.
## Made with:
- [Micro](https://github.com/zeit/micro) for the server magic
- [Perfy](https://github.com/onury/perfy) to measure it happening

To get it running, you must have a default configuration of Redis and MongoDB running on your localhost, and the MongoDB must have a db called test and a collection named sessiontest. (Alternatively, change the code to suit your database configuration.)

## Stating the obvious
- Run these:
```
git clone git@github.com:JaniAnttonen/micro-nosql-benchmark.git
cd micro-nosql-benchmark
npm install
npm start
```
- Open [localhost:3000](http://localhost:3000) and you should see your results.