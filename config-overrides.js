const path = require("path");
const { override, fixBabelImports, addWebpackAlias, adjustStyleLoaders } = require("customize-cra");
function resolve(dir) {
  return path.join(__dirname, ".", dir);
}
module.exports = override(
  addWebpackAlias({
    "@": resolve("src")
  }),
  fixBabelImports("import", {
    libraryName: "antd-mobile",
    style: "css"
  }),
  adjustStyleLoaders(rule => {
    if (rule.test.toString().includes("scss")) {
      rule.use.push({
        loader: require.resolve("sass-resources-loader"),
        options: {
          resources: "./src/style/mixin.scss" //这里是你自己放公共scss变量的路径
        }
      });
    }
  })
);
