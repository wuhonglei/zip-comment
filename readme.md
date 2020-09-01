## 介绍
该库仅用于读取 zip 压缩包中的注释，并不能用于读取 zip 中每个文件的注释

该库的实现参考：[jszip](https://github.com/Stuk/jszip#readme)

## 功能
1. 读取 utf8 注释
2. 读取 utf16 注释
3. 读取加密 zip 包的注释

## 特性
1. 体积小

## TODO
1. webpack 打包
2. 处理 zip64 文件中的注释
3. 处理 zip 压缩包中每个文件的注释

## 安装
```bash
npm i zip-comment
```

## 使用
1. 直接在浏览器使用
```html
<body>
    <input type="file" onchange="selectFile(event)">
    <script src="../dist/bundle.umd.js"></script>
    <script>
        async function selectFile(event) {
            let file = event.target.files[0];
            let comment = await loadZipAsync(file);
            console.info(comment);
        }
    </script>
</body>
```

2. import 导入使用
```javascript
import loadZipAsync from 'zip-comment';
loadZipAsync(file)
    .then(comment => {
        console.info(comment);
    });
```

3. require 导入使用
```javascript
var { loadZipAsync } = require('zip-comment');
loadZipAsync(file)
    .then(comment => {
        console.info(comment);
    });
```