module.exports = (sequelize, DataTypes) => {
    const Likes = sequelize.define('Likes', {
    });

    Likes.associate = (models) => {
        Likes.belongsTo(models.Posts, {
            foreignKey: 'postId',
            as: 'post'
        });

        Likes.belongsTo(models.Users, {
            foreignKey: 'usernameid',
            as: 'user'
        });
    };

    return Likes;
};