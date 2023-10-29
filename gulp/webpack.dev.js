import fs from 'fs';
import FileIncludeWebpackPlugin from 'file-include-webpack-plugin-replace';
import CopyPlugin from "copy-webpack-plugin";

import * as path from 'path';

const srcFolder = "./src";
const buildFolder = "./dist";

let pugPages = fs.readdirSync(srcFolder).filter(fileName => fileName.endsWith('.pug'))
let htmlPages = [];

if (!pugPages.length) {
	htmlPages = [new FileIncludeWebpackPlugin({
		source: srcFolder,
		htmlBeautifyOptions: {
			"indent-with-tabs": true,
			'indent_size': 3
		},
		replace: [
			{ regex: '@img', to: 'img' },
		],
	})];
}


const paths = {
	src: path.resolve(srcFolder),
	build: path.resolve(buildFolder)
}
const config = {
	mode: "development",
	devtool: 'inline-source-map',
	optimization: {
		minimize: false
	},
	entry: [
		`${paths.src}/js/app.js`
	],
	output: {
		filename: 'app.min.js',
	},
	devServer: {
		historyApiFallback: true,
		static: paths.build,
		open: true,
		compress: true,
		port: 8080,
		hot: true,
		watchFiles: [
			`${paths.src}/**/*.html`,
			`${paths.src}/**/*.pug`,
			`${paths.src}/**/*.htm`,
			`${paths.src}/img/**/*.*`
		],
	},
	module: {
		rules: [
			{
				test: /\.(scss|css)$/,
				exclude: `${paths.src}/fonts`,
				use: [
					'style-loader',
					{
						loader: 'string-replace-loader',
						options: {
							search: '@img',
							replace: '../img',
							flags: 'g'
						}
					}, {
						loader: 'css-loader',
						options: {
							sourceMap: true,
							importLoaders: 1,
							modules: false,
							url: {
								filter: (url, resourcePath) => {
									if (url.includes("img/") || url.includes("fonts/")) {
										return false;
									}
									return true;
								},
							},
						},
					}, {
						loader: 'sass-loader',
						options: {
							sourceMap: true,
						}
					}
				],
			},
		],
	},
	plugins: [
		new CopyPlugin({
			patterns: [
				{
					from: `${srcFolder}/img`, to: `img`,
					noErrorOnMissing: true,
					force: true
				}, {
					from: `${srcFolder}/files`, to: `files`,
					noErrorOnMissing: true,
					force: true
				}, {
					from: `${paths.src}/favicon.ico`, to: `./`,
					noErrorOnMissing: true
				}
			],
		}),
	],
	resolve: {
		alias: {
			"@scss": `${paths.src}/scss`,
			"@js": `${paths.src}/js`,
			"@img": `${paths.src}/img`
		},
	},
}
export default config;