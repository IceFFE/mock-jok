class FormatUnit {
    /**
     * 判断数据是不是Null或者空字符串
     * @param {*} value
     */
    static isNullOrEmpty(value) {
        if (value === null || value === undefined || value === "") {
            return true;
        }

        return false;
    }

    /**
     * 判断数据是不是Json格式的字符串
     * @param {*} value
     */
    static isJsonString(value) {
        if (typeof value == "string") {
            try {
                const obj = JSON.parse(value);
                if (typeof obj == "object" && obj) {
                    return true;
                } else {
                    return false;
                }
            } catch (e) {
                return false;
            }
        }

        return false;
    }
}

module.exports = FormatUnit;
