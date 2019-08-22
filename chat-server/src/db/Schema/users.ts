import { Schema } from 'mongoose'
import * as mongoose from 'mongoose'


const usersSchema = new Schema({
    username: String,
    isActive: Boolean,
    date: Date
});

export const UsersDb = mongoose.model("Users", usersSchema);