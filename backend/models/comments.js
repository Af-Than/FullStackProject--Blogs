module.exports = (sequelize, DataTypes) => {
    const Comments = sequelize.define('Comments', {
        Commentbody: { type: DataTypes.STRING, allowNull: false }
    });

    Comments.associate = (models) => {
        Comments.belongsTo(models.Posts, {
            foreignKey: 'postId',
            as: 'post'
        });

        Comments.belongsTo(models.Users, {
            foreignKey: 'usernameid',
            as: 'user'
        });
    };

    return Comments;
};