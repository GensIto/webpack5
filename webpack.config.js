const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");
const globule = require("globule");
const HtmlWebpackPlugin = require("html-webpack-plugin");

let rules = [
    // {
    //     test: /\.(html)$/,
    //     use: {
    //         loader: "html-loader",
    //     },
    // },
    {
        test: /\.pug$/,
        exclude: /node_modules/,
        use: [{
            loader: "pug-loader",
            options: {
                pretty: true,
            },
        }, ],
    },
    {
        test: /\.(sa|sc|c)ss$/,
        exclude: /node_modules/,
        use: [
            MiniCssExtractPlugin.loader,
            {
                loader: "css-loader",
                options: { url: true },
            },
            "sass-loader",
        ],
    },
    {
        test: /\.(png|jpg|gif)$/i,
        generator: {
            filename: "imgs/[name][ext][query]",
        },
        type: "asset/resource",
    },
];

// es5がtrueならばバベルを適用
if (process.env.es5) {
    rules.push({
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
            loader: "babel-loader",
            options: {
                presets: ["@babel/preset-env"],
            },
        },
    });
}

const buildDefault = {
    //バンドル対象のファイル
    entry: `./src/js/main.js`,

    mode: "development",
    module: {
        rules: rules,
    },
    resolve: {
        extensions: [".js", ".json", ".scss", ".css"],
        alias: {
            "~": path.resolve(__dirname, "src"),
        },
        roots: [path.resolve(__dirname, "src")],
    },
    // ファイルの出力設定
    output: {
        //  出力ファイルのディレクトリ名
        path: `${__dirname}/dist`,
        // 出力ファイル名
        filename: "bundle.js",
    },
    stats: {
        children: true,
    },
    // ローカル開発用環境を立ち上げる
    // 実行時にブラウザが自動的に localhost を開く
    devServer: {
        static: "dist",
        open: true
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "style.css",
        }),
    ],
};

const pugFiles = globule.find('src/pug/page/*', {
    ignore: [ 'src/html/components/*','src/html.layouts/*' ]
});

pugFiles.forEach((pug) => {
    const html = pug.split('/').slice(-1)[0].replace('.pug', '.html');
    buildDefault.plugins.push(
      new HtmlWebpackPlugin({
        filename: `${path.resolve(__dirname, 'dist')}/${html}`,
        inject:'body',
        template: pug,
        minify: false
      })
    )
});

// const htmlFiles = globule.find("src/html/*.html");

// htmlFiles.forEach((htmlsrc) => {
//     // ファイル名を取得 src/html/index.html → index.html
//     const htmlname = htmlsrc.split("/").slice(-1)[0];

//     // webpackの設定にある、pluginsに以下のプラグインインスタンスを入れる。
//     buildDefault.plugins.push(
//         new HtmlWebpackPlugin({
//             // distのファイル名。今回はsrcと同じ。
//             filename: `${path.resolve(__dirname, "dist")}/${htmlname}`,

//             // 自動的にバンドル対象のjs(main.js)とcss(style.css)を入れる。お節介ならfalseにする。
//             inject: "body",

//             // 対象のhtmlファイル
//             template: htmlsrc,

//             // 圧縮するかどうか。defaultはtrue
//             minify: false,
//         })
//     );
// });

module.exports = buildDefault;