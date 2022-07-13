const Role = require("./models/Role");
const User = require("./models/User");
const bcrypt = require('bcryptjs');
const {validationResult} = require('express-validator')
const jwt = require('jsonwebtoken')
const {secret} = require('./config')

const generateAccessToken = (id, roles) => {
    const payload = {
        id, roles
    }
    return jwt.sign(payload, secret, {expiresIn: '24h'})
}

class authController {

    async registration(req, res) {
        try {

            const errors = validationResult(req)
            if(!errors.isEmpty()) {
                return res.status(400).json({message: 'Ошибка при регистрации', errors})
            }

            const { username, password } = req.body
            const candidate = await User.findOne({ username })

            if(candidate) {
                return res.status(400).json({message: "Пользователь с таким именем уже существует!"})
            }

            const hashPassword = bcrypt.hashSync(password, 7);
            const userRole = await Role.findOne({value: 'USER'})
            const user = new User({username, password: hashPassword, roles: [userRole.value]})

            await user.save()
            return res.json({message: 'Пользователь был успешно зарегистрирован'})


        } catch (error) {
            console.log(error);
            res.status(400).json({ message: 'registration error' })
        }
    }


    async login(req, res) {
        try {
            const { username, password } = req.body
            const user = await User.findOne({ username })

            if (!user) {
                return res.status(400).json({ message: `Пользователь ${username} не найден` })
            }

            const validPassword = bcrypt.compare(password, user.password)
            if (!validPassword) {
                return res.status(400).json({ message: 'Введен неверный пароль' })
            }

            const token = generateAccessToken(user._id,user.roles)

            res.json({token})

        } catch (error) {
            console.log(error);
            res.status(400).json({ message: 'login error' })
        }
    }




    async getUsers(req, res) {
        try {



            
            res.json('server work')
        } catch (error) {
            console.log(error);
        }
    }
}
module.exports = new authController()