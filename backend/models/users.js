module.exports = (sequelize, DataTypes) => {
    const Users = sequelize.define('Users', {
        username: { type: DataTypes.STRING, allowNull: false, unique: true },
        password: { type: DataTypes.STRING, allowNull: false },
        email: { type: DataTypes.STRING, allowNull: false, unique: true },
        // 🚀 Add these two new fields for OTP handling:
        resetOtp: { type: DataTypes.STRING, allowNull: true },
        resetOtpExpire: { type: DataTypes.DATE, allowNull: true }
    });

    Users.associate = (models) => {
        Users.hasMany(models.Posts, { foreignKey: 'userId', as: 'posts', onDelete: 'CASCADE' });
        Users.hasMany(models.Comments, { foreignKey: 'usernameid', as: 'comments', onDelete: 'CASCADE' });
        Users.hasMany(models.Likes, { foreignKey: 'usernameid', as: 'likes', onDelete: 'CASCADE' });
    };

    return Users;
};