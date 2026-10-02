const mongoose = require('mongoose')


const blacklistTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: [true, 'Token is required to blacklist']
    },

    
},{
    timestamps: true
})
const tokenBLacklistModel = mongoose.model("BlacklistToken", blacklistTokenSchema)

module.exports = tokenBLacklistModel

