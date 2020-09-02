export function isDef(value) {
    return value !== undefined && value !== null;
}

export function isObj(x) {
    const type = typeof x;
    return x !== null && (type === 'object' || type === 'function');
}

export function isNumber(value) {
    return /^\d+(\.\d+)?$/.test(value);
}

export function range(num, min, max) {
    return Math.min(Math.max(num, min), max);
}

export function nextTick(fn) {
    setTimeout(() => {
        fn();
    }, 1000 / 30);
}

let systemInfo = null;

export function getSystemInfoSync() {
    if (systemInfo == null) {
        systemInfo = wx.getSystemInfoSync();
    }
    return systemInfo;
}

export function addUnit(value) {
    if (!isDef(value)) {
        return undefined;
    }
    value = String(value);
    return isNumber(value) ? `${value}px` : value;
}

export function clearNoNum(value) {
    value = value.replace(/[^\d.]/g, ""); //清除“数字”和“.”以外的字符
    value = value.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
    value = value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
    value = value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数
    if (value.indexOf(".") < 0 && value != "") { //以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
      return   value = parseFloat(value);
    }else{
        return value
    }
}
