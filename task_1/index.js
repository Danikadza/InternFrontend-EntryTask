import { encoded, translations } from './data.js'

console.log("Let's rock")
console.log(encoded, translations)

const valueCounts = {};

const isExcludedKey = (key) => {
    return key !== "groupId" && key !== "service" && key !== "formatSize" && key !== "ca"
}

const decoded = encoded.map((obj) => {
    const newObj = {};
    for (const key in obj) {
        if (key.endsWith("Id") && isExcludedKey(key)) {
            newObj[key] = translations[obj[key]] || null;
            const value = obj[key];
            if (!valueCounts[value]) {
                valueCounts[value] = 0;
            }
            valueCounts[value]++;
        } else {
            newObj[key] = obj[key];
        }
    }
    return newObj;
});

const unique = [];

for (const value in valueCounts) {
    if (valueCounts[value] === 1) {
        unique.push(value);
    }
}

console.log(decoded, unique)