
// const { Base64 } = require('./base64');
// const crypto = require('./crypto-js/crypto-js');
//
// const accessid = "LTAIklypW1uiMOZl";//oss keyId
// const accesskey = "r3DNwh1c4fC9Y8uYULZczdb8sC7yzF";//oss keySecret
// const host = "https://test.weizhukeji.com";//上传地址
// const timestamp = Date.now() + 1 * 60 * 1000;//一分钟后过期
//
// const policyText = {
//     "expiration": `${new Date(timestamp).toISOString()}`, //设置该Policy的失效时间，超过这个失效时间之后，就没有办法通过这个policy上传文件了
//     "conditions": [
//         ["content-length-range", 0, 1024 * 1024 * 2] // 设置上传文件的大小限制
//     ]
// };
// const policyBase64 = Base64.encode(JSON.stringify(policyText));
// const signature = crypto.createHmac("sha1", accesskey)
//     .update(policyBase64)
//     .digest()
//     .toString("base64");
//
// module.exports={ code: 0, result: { accessid, policy: policyBase64, signature, host } };
