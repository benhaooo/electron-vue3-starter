渲染器的依赖在构建时已经被 Vite 打包进了最终的 JavaScript 文件中，所以运行时不再需要它们。
```
  "devDependencies": {
    "custom-electron-titlebar": "^4.2.8",
    "pinia": "^3.0.3",
    "vite": "^5.0.0",
    "vue": "^3.3.8",
    "vue-router": "^4.2.5",
  }

推荐vscode设置
{
    // 确保 ESLint 扩展能处理格式化
    "eslint.format.enable": true,

    // 将 ESLint 设置为所有文件的默认格式化程序
    "editor.defaultFormatter": "dbaeumer.vscode-eslint",

    "[typescript]": {
        "editor.defaultFormatter": "dbaeumer.vscode-eslint"
    }
}
