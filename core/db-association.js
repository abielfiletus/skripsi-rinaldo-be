const classModel = require('../module/class/class.model')
const userClassModel = require('../module/class/user-class.model')
const classMateriModel = require('../module/class-materi/class-materi.model')
const classQuizModel = require('../module/class-quiz/class-quiz.model')
const quizDetailModel = require('../module/class-quiz/quiz-detail.model')
const roleModel = require('../module/role/role.model')
const userModel = require('../module/user/user.model')
const userClassHistoryModel = require('../module/user-class-history/user-class-history.model')

userModel.belongsTo(roleModel, { foreignKey: 'role_id' })
userClassModel.belongsTo(classModel, { foreignKey: 'class_id' })
userClassModel.belongsTo(userModel, { foreignKey: 'user_id' })
classMateriModel.belongsTo(classModel, { foreignKey: 'class_id' })
classQuizModel.belongsTo(classMateriModel, { foreignKey: 'class_materi_id' })
quizDetailModel.belongsTo(classModel, { foreignKey: 'class_quiz_id' })
userClassHistoryModel.belongsTo(classModel, { foreignKey: 'class_id' })
userClassHistoryModel.belongsTo(userModel, { foreignKey: 'user_id' })
userClassHistoryModel.belongsTo(classMateriModel, { foreignKey: 'class_materi_id' })
userClassHistoryModel.belongsTo(classQuizModel, { foreignKey: 'class_quiz_id' })
