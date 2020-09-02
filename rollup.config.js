export default {
    input: 'src/main.js',
    output: [{
        file: './dist/bundle.umd.js',
        format: 'umd',
        name: 'loadZipAsync'
    }, {
        file: './dist/bundle.esm.js',
        format: 'esm'
    }]
};