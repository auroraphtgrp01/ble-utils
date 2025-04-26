function groupSleepData(sleepData) {
    const result = [];
    const typeMap = {};

    for (const item of sleepData) {
        if (!typeMap[item.sleepType]) {
            typeMap[item.sleepType] = {
                sleepType: item.sleepType,
                type: item.type,
                stageTime: []
            };
            result.push(typeMap[item.sleepType]);
        }

        typeMap[item.sleepType].stageTime.push({
            startTime: item.sleepStartTime,
            sleepLen: item.sleepLen
        });
    }

    return result;
}

// Dữ liệu đầu vào là mảng sleepData trực tiếp
const sleepData = [{
        "sleepType": 242,
        "type": "lightSleep",
        "sleepStartTime": "01:21 26/04/2025",
        "sleepLen": 1356
    },
    {
        "sleepType": 241,
        "type": "deepSleep",
        "sleepStartTime": "01:43 26/04/2025",
        "sleepLen": 336
    },
    // ... các mục dữ liệu khác ...
];

// Nhóm dữ liệu
const groupedData = groupSleepData(sleepData);

console.log(groupedData);