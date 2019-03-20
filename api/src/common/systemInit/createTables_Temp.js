//该文件做作用仅仅是同步一些中间加入的表，防止误删createTables.js的内容引起生产环境的错误

const tourismLogo_Model = require('../../models/tourismLogo/tourismLogo_Model')

// ---------- 创建 企业表 表 ----------
tourismLogo_Model.sync({ force: true }).then(() => {
  console.log(`----- 创建 tourismLogo_Model 表成功 -----`)
}).catch((err) => {
  console.error(`----- tourismLogo_Model 表创建失败: ${err} -----`)
})