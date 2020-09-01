(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["loadZipAsync"] = factory();
	else
		root["loadZipAsync"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/zip_comment.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/zip_comment.js":
/*!****************************!*\
  !*** ./src/zip_comment.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("/**\n * zip 格式参考：https://blog.csdn.net/a200710716/article/details/51644421\n * @param {*} file \n */\n\nfunction loadZipAsync(file) {\n    return new Promise(function(resolve, reject) {\n        var reader = new FileReader();\n        reader.addEventListener('load', function(event) {\n            var buffer = event.target.result;\n            var unit8Array = new Uint8Array(buffer);\n            try {\n                var comment = readEndOfCentral(unit8Array);\n                resolve(comment);\n            } catch (error) {\n                reject(error);\n            }\n        });\n        reader.addEventListener('error', (error) => {\n            reject(error);\n        });\n        reader.readAsArrayBuffer(file);\n    });\n}\n\nfunction readEndOfCentral(data) {\n    var offset = lastIndexOfSignature(data, 'PK\\x05\\x06');\n    if (offset === -1) {\n        throw new Error('does not find the end of central directory');\n    }\n\n    startIndex = offset + 20;\n    var commentLenSize = 2;\n    var zipCommentLength = readInt(data, startIndex, commentLenSize);\n    if (!zipCommentLength) {\n        return null;\n    }\n\n    startIndex += commentLenSize;\n\n    var zipComment = data.slice(startIndex, startIndex + zipCommentLength);\n    var zipCommentStr = decodeFile(zipComment);\n    return zipCommentStr;\n}\n\nfunction lastIndexOfSignature(data, sig) {\n    const sig0 = sig.charCodeAt(0),\n        sig1 = sig.charCodeAt(1),\n        sig2 = sig.charCodeAt(2),\n        sig3 = sig.charCodeAt(3);\n\n    for (var i = data.length - 4; i >= 0; i--) {\n        if (data[i] === sig0 && data[i + 1] === sig1 && data[i + 2] === sig2 && data[i + 3] === sig3) {\n            return i;\n        }\n    }\n\n    return -1;\n}\n\n/**\n * Get the next number with a given byte size.\n * @param {number} size the number of bytes to read.\n * @return {number} the corresponding number.\n */\nfunction readInt(data, startIndex, size) {\n    var result = 0,\n        i;\n    for (i = startIndex + size - 1; i >= startIndex; i--) {\n        result = (result << 8) + data[i];\n    }\n    return result;\n}\n\nfunction decodeFile(data) {\n    return String.fromCharCode.apply(null, data);\n}\n\n// 获取字符编码对应字符的字节长度（比如汉字是 2 个字节，ascii 是 1 个字节）\nvar _utf8len = (function() {\n    var _utf8len = new Array(256);\n    for (var i = 0; i < 256; i++) {\n        _utf8len[i] = (i >= 252 ? 6 : i >= 248 ? 5 : i >= 240 ? 4 : i >= 224 ? 3 : i >= 192 ? 2 : 1);\n    }\n    _utf8len[254] = _utf8len[254] = 1; // Invalid sequence start\n    return _utf8len;\n})();\n\nfunction decodeFile(buf) {\n    var str, i, out, c, c_len;\n    var len = buf.length;\n\n    // Reserve max possible length (2 words per char)\n    // NB: by unknown reasons, Array is significantly faster for\n    //     String.fromCharCode.apply than Uint16Array.\n    var utf16buf = new Array(len * 2);\n\n    for (out = 0, i = 0; i < len;) {\n        c = buf[i++];\n        // quick process ascii\n        if (c < 0x80) { utf16buf[out++] = c; continue; }\n\n        c_len = _utf8len[c];\n        // skip 5 & 6 byte codes\n        if (c_len > 4) {\n            utf16buf[out++] = 0xfffd;\n            i += c_len - 1;\n            continue;\n        }\n\n        // apply mask on first byte\n        c &= c_len === 2 ? 0x1f : c_len === 3 ? 0x0f : 0x07;\n        // join the rest\n        while (c_len > 1 && i < len) {\n            c = (c << 6) | (buf[i++] & 0x3f);\n            c_len--;\n        }\n\n        // terminated by end of string?\n        if (c_len > 1) { utf16buf[out++] = 0xfffd; continue; }\n\n        if (c < 0x10000) {\n            utf16buf[out++] = c;\n        } else {\n            c -= 0x10000;\n            utf16buf[out++] = 0xd800 | ((c >> 10) & 0x3ff);\n            utf16buf[out++] = 0xdc00 | (c & 0x3ff);\n        }\n    }\n\n    // shrinkBuf(utf16buf, out)\n    if (utf16buf.length !== out) { // 含有 utf8 字符\n        if (utf16buf.subarray) {\n            utf16buf = utf16buf.subarray(0, out);\n        } else {\n            utf16buf.length = out;\n        }\n    }\n\n    return String.fromCharCode.apply(null, utf16buf);\n};\n\nmodule.exports = loadZipAsync;\n\n//# sourceURL=webpack://loadZipAsync/./src/zip_comment.js?");

/***/ })

/******/ });
});