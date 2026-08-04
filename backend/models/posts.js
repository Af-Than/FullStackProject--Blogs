module.exports = (sequelize, DataTypes) => {
    const Posts = sequelize.define('Posts', {
        title: { type: DataTypes.STRING, allowNull: false },
        content: { type: DataTypes.TEXT, allowNull: false },
        authorname: { type: DataTypes.STRING, allowNull: false }
    });

    Posts.associate = (models) => {
        Posts.hasMany(models.Comments, {
            foreignKey: 'postId',
            as: 'comments',
            onDelete: 'CASCADE',
        });
        Posts.hasMany(models.Likes, {
            foreignKey: 'postId',
            as: 'likes',
            onDelete: 'CASCADE',
        });
    };

    return Posts;
};