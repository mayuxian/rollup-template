module.exports = {
    presets: [
        [
            "@babel/preset-env",
            {
                "modules": "auto",  //是否可以转成其他规范,false是不可以
                //是否宽松,true表示转成es5.
                // 移动端可转成es5.
                // 原因:android的UC不支持es6
                "loose": true,
                "useBuiltIns": "usage",
                "corejs": "3", // 声明corejs版本
            }
        ]
    ]
};