# Why did you update

## Install

1. `yarn add babel-plugin-why-did-you-update`.
2. add `why-did-you-update` to your babel config file.
```js
// babel.config.js
module.exports = {
  presets: ["@vue/cli-plugin-babel/preset"],
  plugins: ["why-did-you-update"],
};
```
3. Unzip extension and [load it in Chrome](https://developer.chrome.com/docs/extensions/mv3/getstarted/#unpacked). 
4. Build or serve your project.
5. Open your project with Chrome.
6. Open `why did you update` tab in Chrome devtools.
7. Click `Start`
8. Do something in your page.
9. Click `Stop`.
10. Here we go.