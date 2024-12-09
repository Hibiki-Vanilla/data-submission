import CryptoJS from 'crypto-js';
//DES 加密
export function encryptByDES(message, key) {
  var keyHex = CryptoJS.enc.Utf8.parse(key);
  var encrypted = CryptoJS.DES.encrypt(message, keyHex, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });
  return encrypted.ciphertext.toString();
}

//DES 解密
export function decryptByDES(ciphertext, key) {
  try {
  var keyHex = CryptoJS.enc.Utf8.parse(key);
  var decrypted = CryptoJS.DES.decrypt(
    {
      ciphertext: CryptoJS.enc.Hex.parse(ciphertext)
    },
    keyHex,
    {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    }
  );
  var result_value = decrypted.toString(CryptoJS.enc.Utf8);
  return result_value === ''?null:result_value;
  }
  catch (error) {
    // 解密失败的处理
    console.log("Decryption failed:", error);
    // 可以根据需要进行错误处理，例如返回一个特定的错误码或默认值
    return null;
  }
}