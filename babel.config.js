module.exports = {
    presets: [
        [
            "@babel/preset-env",
            {
                // "modules": false,
                "modules": "auto",  //是否可以转成其他规范,false是不可以
                //是否宽松,true表示转成es5.
                // 移动端需要转成es5.
                // 1. android UC版本不支持es6
                "loose": false,
                // "useBuiltIns": false,
                "useBuiltIns": "usage",
                "corejs": "3", // 声明corejs版本
            }
        ]
    ]
};