    module.exports = (sequelize, DataTypes) => {
        const Users = sequelize.define('Users',//name of table//
        {
            username:{type:DataTypes.STRING, allowNull: false},
            password:{type:DataTypes.STRING, allowNull: false}
        })




         Users.associate = (models) => //making foregin key relationship with comments table//
            {
                Users.hasMany(models.Posts, {
                    foreignKey: 'userId',
                    as: 'posts',
                    onDelete: 'CASCADE',
                });
            }
         Users.associate = (models) => //making foregin key relationship with comments table//
            {
                Users.hasMany(models.Comments, {
                    foreignKey: 'usernameid',
                    as: 'comments',
                    onDelete: 'CASCADE',
                });
            }
         Users.associate = (models) => //making foregin key relationship with comments table//
            {
                Users.hasMany(models.Likes, {
                    foreignKey: 'usernameid',
                    as: 'comments',
                    onDelete: 'CASCADE',
                });
            }

        return Users 

    }
