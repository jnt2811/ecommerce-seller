import sha256 from "sha256";

export const encrypt256 = (key) => {
  try {
    return sha256(key);
  } catch (error) {
    console.log("encrypt error", error);
  }
};

export const currencyParser = (val) => {
  try {
    // for when the input gets clears
    if (typeof val === "string" && !val.length) {
      val = null;
    }
    if (val != null) {
      // detecting and parsing between comma and dot
      var group = new Intl.NumberFormat("vi-VN").format(1111).replace(/1/g, "");
      var decimal = new Intl.NumberFormat("vi-VN").format(1.1).replace(/1/g, "");
      var reversedVal = val.replace(new RegExp("\\" + group, "g"), "");
      reversedVal = reversedVal.replace(new RegExp("\\" + decimal, "g"), ".");

      // removing everything except the digits and dot
      // reversedVal = reversedVal.replace(/[^0-9.]/g, "");
      //  => 1232.21

      // appending digits properly
      const digitsAfterDecimalCount = (reversedVal.split(".")[1] || []).length;
      const needsDigitsAppended = digitsAfterDecimalCount > 2;

      if (needsDigitsAppended) {
        reversedVal = reversedVal * Math.pow(10, digitsAfterDecimalCount - 2);
      }

      return Number.isNaN(reversedVal) ? 0 : reversedVal;
    }
  } catch (error) {
    console.error(error);
  }
};

//format định dạng giá khi thao tác ô input giá
export const formatNumberToPrice = (string, currency = "") => {
  if (!string || string === "" || string === 0) return 0;
  string = string.toString();
  string = string.replace(/ /g, "");
  var pattern = /(-?\d+)(\d{3})/;
  while (pattern.test(string)) string = string.replace(pattern, "$1.$2");
  if (typeof currency === "string") {
    string = currency !== "" ? string + " " + currency : string;
  }
  return string;
};

export const toCode = (string) => {
  string = string.toLowerCase();

  string = string.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, "a");
  string = string.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, "e");
  string = string.replace(/i|í|ì|ỉ|ĩ|ị/gi, "i");
  string = string.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, "o");
  string = string.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, "u");
  string = string.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, "y");
  string = string.replace(/đ/gi, "d");

  string = string.replace(/`|~|!|@|#|\||\$|%|\^|&|\*|\(|\)|\+|=|,|\.|\/|\?|>|<|'|"|:|;|_/gi, "");

  string = string.replace(/ /gi, "");

  string = string.replace(/-----/gi, "");
  string = string.replace(/----/gi, "");
  string = string.replace(/---/gi, "");
  string = string.replace(/--/gi, "");

  string = "@" + string + "@";
  string = string.replace(/@-|-@|@/gi, "");

  return string.toUpperCase();
};

export const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => resolve(reader.result);

    reader.onerror = (error) => reject(error);
  });
