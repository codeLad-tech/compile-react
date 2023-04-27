// 在React17以前，babel转换是老的写法
const babel = require("@babel/core");
const soutceCode = `<h1>hello <span style={{color: "red"}}> world </span></h1>`;

const result = babel.transform(soutceCode, {
  plugins: [["@babel/plugin-transform-react-jsx", { runtime: "classic" }]],
});
console.log(result.code);
React.createElement(
  "h1",
  null,
  "hello ",
  React.createElement(
    "span",
    {
      style: {
        color: "red",
      },
    },
    " world "
  )
);
