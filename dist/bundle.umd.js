(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.loadZipAsync = factory());
}(this, (function () { 'use strict';

    /**
     * zip 格式参考：https://blog.csdn.net/a200710716/article/details/51644421
     * @param {*} file 
     */

    function loadZipAsync(file) {
        return new Promise(function(resolve, reject) {
            var reader = new FileReader();
            reader.addEventListener('load', function(event) {
                var buffer = event.target.result;
                var unit8Array = new Uint8Array(buffer);
                try {
                    var comment = readEndOfCentral(unit8Array);
                    resolve(comment);
                } catch (error) {
                    reject(error);
                }
            });
            reader.addEventListener('error', (error) => {
                reject(error);
            });
            reader.readAsArrayBuffer(file);
        });
    }

    function readEndOfCentral(data) {
        var offset = lastIndexOfSignature(data, 'PK\x05\x06');
        if (offset === -1) {
            throw new Error('does not find the end of central directory');
        }

        startIndex = offset + 20;
        var commentLenSize = 2;
        var zipCommentLength = readInt(data, startIndex, commentLenSize);
        if (!zipCommentLength) {
            return null;
        }

        startIndex += commentLenSize;

        var zipComment = data.slice(startIndex, startIndex + zipCommentLength);
        var zipCommentStr = decodeFile(zipComment);
        return zipCommentStr;
    }

    function lastIndexOfSignature(data, sig) {
        const sig0 = sig.charCodeAt(0),
            sig1 = sig.charCodeAt(1),
            sig2 = sig.charCodeAt(2),
            sig3 = sig.charCodeAt(3);

        for (var i = data.length - 4; i >= 0; i--) {
            if (data[i] === sig0 && data[i + 1] === sig1 && data[i + 2] === sig2 && data[i + 3] === sig3) {
                return i;
            }
        }

        return -1;
    }

    /**
     * Get the next number with a given byte size.
     * @param {number} size the number of bytes to read.
     * @return {number} the corresponding number.
     */
    function readInt(data, startIndex, size) {
        var result = 0,
            i;
        for (i = startIndex + size - 1; i >= startIndex; i--) {
            result = (result << 8) + data[i];
        }
        return result;
    }

    // 获取字符编码对应字符的字节长度（比如汉字是 2 个字节，ascii 是 1 个字节）
    var _utf8len = (function() {
        var _utf8len = new Array(256);
        for (var i = 0; i < 256; i++) {
            _utf8len[i] = (i >= 252 ? 6 : i >= 248 ? 5 : i >= 240 ? 4 : i >= 224 ? 3 : i >= 192 ? 2 : 1);
        }
        _utf8len[254] = _utf8len[254] = 1; // Invalid sequence start
        return _utf8len;
    })();

    function decodeFile(buf) {
        var i, out, c, c_len;
        var len = buf.length;

        // Reserve max possible length (2 words per char)
        // NB: by unknown reasons, Array is significantly faster for
        //     String.fromCharCode.apply than Uint16Array.
        var utf16buf = new Array(len * 2);

        for (out = 0, i = 0; i < len;) {
            c = buf[i++];
            // quick process ascii
            if (c < 0x80) { utf16buf[out++] = c; continue; }

            c_len = _utf8len[c];
            // skip 5 & 6 byte codes
            if (c_len > 4) {
                utf16buf[out++] = 0xfffd;
                i += c_len - 1;
                continue;
            }

            // apply mask on first byte
            c &= c_len === 2 ? 0x1f : c_len === 3 ? 0x0f : 0x07;
            // join the rest
            while (c_len > 1 && i < len) {
                c = (c << 6) | (buf[i++] & 0x3f);
                c_len--;
            }

            // terminated by end of string?
            if (c_len > 1) { utf16buf[out++] = 0xfffd; continue; }

            if (c < 0x10000) {
                utf16buf[out++] = c;
            } else {
                c -= 0x10000;
                utf16buf[out++] = 0xd800 | ((c >> 10) & 0x3ff);
                utf16buf[out++] = 0xdc00 | (c & 0x3ff);
            }
        }

        // shrinkBuf(utf16buf, out)
        if (utf16buf.length !== out) { // 含有 utf8 字符
            if (utf16buf.subarray) {
                utf16buf = utf16buf.subarray(0, out);
            } else {
                utf16buf.length = out;
            }
        }

        return String.fromCharCode.apply(null, utf16buf);
    }

    return loadZipAsync;

})));
