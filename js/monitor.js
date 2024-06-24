var taskSizeChart1 = echarts.init(document.getElementById('taskSize1'));
var taskSizeChart2 = echarts.init(document.getElementById('taskSize2'));
var taskSizeChart3 = echarts.init(document.getElementById('taskSize3'));
var startTime = new Date();
var todaySyncedNum = 0;
var todayNoSyncNum = 0;
var delayNum = 0;
var names = [];
var values = [];
var names1 = [];
var values1 = [];
var names4 = [];
var values4 = [];
var data2=[];
var data4=[];
var tags = [];
var tags1 = [];
var tags4 = [];
var i = 0;
var names2=[];
var tags2=[];
// 初始化数组用于存储数据
$(function () {
    $('input').bind('input propertychange', function () {
        $('.commonTable tbody tr').hide()
            .filter(":contains('" + ($(this).val()) + "')").show();
    });

    $("#refreshBtn").off('click').on('click', function () {
        initTable();
    });

    //initTable();
    setInterval(initTable, 1000);
    setInterval(tick, 1000);
    
});



function tick() {
    var today = new Date();
    document.getElementById("localtime").innerHTML = showLocale(today);

    var t = today - startTime;
    var day = Math.floor(t / 1000 / 60 / 60 / 24);
    var hour = Math.floor(t / 1000 / 60 / 60 % 24);
    var min = Math.floor(t / 1000 / 60 % 60);
    var sec = Math.floor(t / 1000 % 60);
    $("#runTimeTj").html(day + " 天 " + hour + " 小时 " + min + " 分 " + sec + " 秒");
}
function showLocale(objD) {
    var str, colorhead, colorfoot;
    var yy = objD.getYear();
    if (yy < 1900) yy = yy + 1900;
    var MM = objD.getMonth() + 1;
    if (MM < 10) MM = '0' + MM;
    var dd = objD.getDate();
    if (dd < 10) dd = '0' + dd;
    var hh = objD.getHours();
    if (hh < 10) hh = '0' + hh;
    var mm = objD.getMinutes();
    if (mm < 10) mm = '0' + mm;
    var ss = objD.getSeconds();
    if (ss < 10) ss = '0' + ss;
    var ww = objD.getDay();
    if (ww == 0) colorhead = "<font color=\"#ffffff\">";
    if (ww > 0 && ww < 6) colorhead = "<font color=\"#ffffff\">";
    if (ww == 6) colorhead = "<font color=\"#ffffff\">";
    if (ww == 0) ww = "星期日";
    if (ww == 1) ww = "星期一";
    if (ww == 2) ww = "星期二";
    if (ww == 3) ww = "星期三";
    if (ww == 4) ww = "星期四";
    if (ww == 5) ww = "星期五";
    if (ww == 6) ww = "星期六";
    colorfoot = "</font>"
    str = colorhead + yy + "-" + MM + "-" + dd + " " + hh + ":" + mm + ":" + ss + "  " + ww + colorfoot;
    return (str);
}


function taskSizeTj1() {

    var option = {
        color: ['#00b3ac'],
        legend: {
            data: ['基于振动预测结果'],
            x: 'center',
            y: 40,
            // 添加 textStyle 配置来改变图例文本样式
            textStyle: {
                color: '#FFFFFF', // 更改图例文字颜色，这里以亮红色为例
                fontStyle: 'normal', // 字体风格，默认为normal，可选'italic'（斜体）,'oblique'（偏斜体）
                fontWeight: 'bold', // 加粗字体，可选'normal','bold','bolder','lighter',或具体的数字
                fontSize: 30, // 设置字体大小
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
            formatter: function (params) {
                var dataIndex = params[0].dataIndex; // 获取当前悬停点的数据索引
                var tag = tags[dataIndex]; // 假设 tags 数组包含了与数据点对应的标签
                var xValue = names[dataIndex]; // 获取 x 轴的值
                var yValue = values[dataIndex]; // 获取 y 轴的值，这里假设是二维数据

                // 格式化 tooltip 显示的内容
                return 'Tag: ' + tag + '<br/>' + // 显示标签
                    'X: ' + xValue + '<br/>' + // 显示 x 轴数据
                    'Y: ' + yValue; // 显示 y 轴数据
            }
        },


        xAxis: [
            {
                data: names,
                type: 'category',
                splitLine: {
                    show: false
                },
                axisLabel: {
                    interval: 0,
                    show: true,
                    textStyle: {
                        color: '#c3dbff',  //更改坐标轴文字颜色
                        fontSize: 14      //更改坐标轴文字大小
                    }
                }
            }
        ],
        yAxis: [
            {
                min: 0,  // 设置最小值
                max: 500,  // 设置最大值
                type: 'value',
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: '#c3dbff'
                    }
                }
            }
        ],
        series: [
            {
                name: '数据量（条）',
                type: 'line',
                smooth: true,
                barWidth: '60%',
                data: values,
                symbolSize: 8, // 设置数据点的大小为 8
                itemStyle: {
                    normal: {
                        color: function (params) {
                            // 获取当前数据点的索引
                            var dataIndex = params.dataIndex;
                            // 根据 tags 数组的值来决定颜色
                            return tags[dataIndex] == '[9]' ? 'green' : 'red';
                        },
                        lineStyle: {
                            color: 'white' // 设置折线的颜色为黑色
                        }
                    }
                }
            }
        ]



    };

    // 使用 fetch() 方法从服务器获取数据
    fetch('http://localhost:40000/lastdata001') // 修改为你的服务器地址和端口
        .then(response => response.json()) // 将响应解析为 JSON 格式
        .then(data => {
            const lastData = data.last_data;
            const lastTag = data.last_state;
            const time = data.time;


            if(values[values.length-1]!=data.last_data*10000){
                names.push(time);
                i = i + 1;
                values.push(lastData*10000);
                tags.push(lastTag);
                if (names.length === 15 && values.length === 15) {
                    // If they are, remove the earliest data from both arrays
                    names.shift(); // Remove the earliest element from 'names'
                    values.shift(); // Remove the earliest element from 'values'
                    tags.shift();
                    i = 0;
                }
                option.xAxis[0].data.value = names;
                option.series[0].data.value = values;
                taskSizeChart1.setOption(option);
            }



            // tags.push(tags);s



        })
        .catch(error => console.error('Error fetching data:', error));
}
function taskSizeTj2() {

    var option = {
        color: ['#00b3ac'],
        legend: {
            data: ['基于音频预测结果'],
            x: 'center',
            y: 40,
            // 添加 textStyle 配置来改变图例文本样式
            textStyle: {
                color: '#FFFFFF', // 更改图例文字颜色，这里以亮红色为例
                fontStyle: 'normal', // 字体风格，默认为normal，可选'italic'（斜体）,'oblique'（偏斜体）
                fontWeight: 'bold', // 加粗字体，可选'normal','bold','bolder','lighter',或具体的数字
                fontSize: 30, // 设置字体大小
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
            formatter: function (params) {
                var dataIndex = params[0].dataIndex; // 获取当前悬停点的数据索引
                var tag = tags1[dataIndex]; // 假设 tags 数组包含了与数据点对应的标签
                var xValue = names1[dataIndex]; // 获取 x 轴的值
                var yValue = values1[dataIndex]; // 获取 y 轴的值，这里假设是二维数据

                // 格式化 tooltip 显示的内容
                return 'Tag: ' + tag + '<br/>' + // 显示标签
                    'X: ' + xValue + '<br/>' + // 显示 x 轴数据
                    'Y: ' + yValue; // 显示 y 轴数据
            }
        },


        xAxis: [
            {
                data: names1,
                type: 'category',
                splitLine: {
                    show: false
                },
                axisLabel: {
                    interval: 0,
                    show: true,
                    textStyle: {
                        color: '#c3dbff',  //更改坐标轴文字颜色
                        fontSize: 14      //更改坐标轴文字大小
                    }
                }
            }
        ],
        yAxis: [
            {
                min: 0,  // 设置最小值
                max: 500,  // 设置最大值
                type: 'value',
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: '#c3dbff'
                    }
                }
            }
        ],
        series: [
            {
                name: '数据量（条）',
                type: 'line',
                smooth: true,
                barWidth: '60%',
                data: values1,
                symbolSize: 8, // 设置数据点的大小为 8
                itemStyle: {
                    normal: {
                        color: function (params) {
                            // 获取当前数据点的索引
                            var dataIndex = params.dataIndex;
                            // 根据 tags 数组的值来决定颜色
                            return tags1[dataIndex] == '[9]' ? 'green' : 'red';
                        },
                        lineStyle: {
                            color: 'white' // 设置折线的颜色为黑色
                        }
                    }
                }
            }
        ]



    };

    // 使用 fetch() 方法从服务器获取数据
    fetch('http://localhost:40000/lastdata002') // 修改为你的服务器地址和端口
        .then(response => response.json()) // 将响应解析为 JSON 格式
        .then(data => {
            const lastData = data.last_data;
            const lastTag = data.last_state;
            const time = data.time;


            if(values1[values1.length-1]!=data.last_data*10000){
                names1.push(time);
                i = i + 1;
                values1.push(lastData*10000);
                tags1.push(lastTag);
                if (names1.length === 15 && values1.length === 15) {
                    // If they are, remove the earliest data from both arrays
                    names1.shift(); // Remove the earliest element from 'names'
                    values1.shift(); // Remove the earliest element from 'values'
                    tags1.shift();
                    i = 0;
                }
                option.xAxis[0].data.value = names1;
                option.series[0].data.value = values1;
                taskSizeChart2.setOption(option);
            }



            // tags.push(tags);s



        })
        .catch(error => console.error('Error fetching data:', error));
}
function taskSizeTj3() {

    var option = {
        color: ['#00b3ac'],
        legend: {
            data: ['同步量统计'],
            x: 'center',
            y: 30
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
            formatter: function (params) {
                var dataIndex = params[0].dataIndex; // 获取当前悬停点的数据索引
                var tag = tags4[dataIndex]; // 假设 tags 数组包含了与数据点对应的标签
                var xValue = names4[dataIndex]; // 获取 x 轴的值
                var yValue = data4[dataIndex]; // 获取 y 轴的值，这里假设是二维数据

                // 格式化 tooltip 显示的内容
                return 'Tag: ' + tag + '<br/>' + // 显示标签
                    'X: ' + xValue + '<br/>' + // 显示 x 轴数据
                    'Y: ' + yValue; // 显示 y 轴数据
            }
        },
        xAxis: [
            {
                data: names2,
                type: 'category',
                splitLine: {
                    show: false
                },
                axisLabel: {
                    interval: 0,
                    show: true,
                    textStyle: {
                        color: '#c3dbff',  //更改坐标轴文字颜色
                        fontSize: 14      //更改坐标轴文字大小
                    }
                }
            }
        ],
        yAxis: [
            {
                min: 0,  // 设置最小值
                max: 500,  // 设置最大值
                type: 'value',
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: '#c3dbff'
                    }
                }
            }
        ],
        series: [
            {
                name: '数据量（条）',
                type: 'line',
                smooth: true,
                data: data2,
                symbolSize: 8, // 设置数据点的大小为 8
                itemStyle: {
                    normal: {
                        color: function (params) {
                            // 获取当前数据点的索引
                            var dataIndex = params.dataIndex;
                            // 根据 tags 数组的值来决定颜色
                            return tags[dataIndex] == '[9]' ? 'green' : 'red';
                        },
                        lineStyle: {
                            color: 'white' // 设置折线的颜色为黑色
                        }
                    }
                }
            }
        ]
    };
    document.getElementById('queryButton').addEventListener('click', () => {



        // 获取开始年、月、日和小时的值
        const startYear = document.getElementById('startYear').value;
        const startMonth = document.getElementById('startMonth').value;
        const startDay = document.getElementById('startDay').value;
        const startHour = document.getElementById('startHour').value;

        // 获取结束年、月、日和小时的值
        const endYear = document.getElementById('endYear').value;
        const endMonth = document.getElementById('endMonth').value;
        const endDay = document.getElementById('endDay').value;
        const endHour = document.getElementById('endHour').value;

        const starttime = `${startYear}-${startMonth < 10 ? '0' + startMonth : startMonth}-${startDay < 10 ? '0' + startDay : startDay}T${startHour < 10 ? '0' + startHour : startHour}:00:00Z`;
        const endtime = `${endYear}-${endMonth < 10 ? '0' + endMonth : endMonth}-${endDay < 10 ? '0' + endDay : endDay}T${endHour < 10 ? '0' + endHour : endHour}:00:00Z`;

        // 构建 API 请求的 URL
        const url = `http://localhost:40000/orderdata?starttime=${starttime}&endtime=${endtime}`;



        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // 初始化三个数组
                const timesArray = [];
                const dataArray = [];
                const tagsArray = [];

                data2.length=0;
                tags2.length=0;
                names2.length=0;


                data.forEach(item => {
                    // 分别将时间、数据、标签添加到对应的数组中
                    timesArray.push(item.time);
                    dataArray.push(item.data*10000);
                    tagsArray.push(item.tag);
                });

                data2.push(...dataArray);
                names2.push(...timesArray);
                tags2.push(...tagsArray);

                // 打印或进一步处理这三个数组
                console.log("Times Array:", timesArray);
                console.log("Data Array:", dataArray);
                console.log("Tags Array:", tagsArray);
                console.log("dd:", data2);
                console.log("tags:", tags2);
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    });


    taskSizeChart3.hideLoading();
    taskSizeChart3.setOption(option);


}
function timestampToTime(fmt, timestamp) {
    var date = new Date(timestamp);
    var ret;
    var opt = {
        "Y+": date.getFullYear().toString(),        // 年
        "m+": (date.getMonth() + 1).toString(),     // 月
        "d+": date.getDate().toString(),            // 日
        "H+": date.getHours().toString(),           // 时
        "M+": date.getMinutes().toString(),         // 分
        "S+": date.getSeconds().toString()          // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
    };
    for (var k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
            fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
        };
    };
    return fmt;
}

function mySort(data) {
    var arr = [];
    for (i in data) {
        if ("flag" != i && "exceptions" != i && "delay" != i) {
            var temp = data[i];
            temp["name"] = i;
            arr.push(temp);
        }
    }
    arr.sort(function (a, b) { return b['todayOffset'] > a['todayOffset'] ? 1 : -1 })
    return arr;
}

function initTable() {
    taskSizeTj1();
    taskSizeTj2();
    taskSizeTj3();
}
