const Influx = require('influx');

const influx = new Influx.InfluxDB({
    host: 'localhost', // InfluxDB服务器地址
    port: 8086,        // InfluxDB端口
    database: 'history', // 要连接的数据库名

});



const id="001";
const name = "001";
const address = "111";

// 将数据插入到 InfluxDB
influx.writePoints([
    {
        measurement: 'm_reg',
        fields: { id, name, address },
    },
]).then(() => {
    res.status(200).send('Data inserted successfully');
}).catch(err => {
    console.error('Error writing data to InfluxDB!', err);
    res.status(500).send('Error writing data to InfluxDB');
});





influx.query('select * from m_reg')
    .then(results => {
        console.log('Query results:', results);
        // 在这里处理查询结果，results 是一个数组，包含查询返回的数据点

        // 例如，遍历结果并处理每个数据点
        results.forEach(point => {
            console.log(`ID: ${point.id}, Name: ${point.name}, Address: ${point.address}`);
            // 根据需要进行进一步的处理
        });
    })
    .catch(err => {
        console.error('Error querying InfluxDB:', err);
        // 处理查询过程中的错误
    });




// // 起始时间和结束时间，精确到小时
// const startTime = '2024-04-25T15:00:00Z'; // 开始时间
// const endTime = '2024-05-10T07:00:00Z';   // 结束时间
//
// // 查询数据示例
// influx.query(`
//   SELECT *
//   FROM testdata
//   WHERE time >= '${startTime}'
//     AND time <= '${endTime}'
// `)
// .then(results => {
//     const orderDataValues = results.map(result => {
//         return {
//             time: result.time,
//             data: result.data,
//             tag: result.state_1     };
//     });
//     console.log(orderDataValues)
//     // 在这里处理查询结果，例如将其发送到前端
// })
// .catch(error => {
//     console.error('Error fetching data from InfluxDB', error);
// });






