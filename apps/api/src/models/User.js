import mongoose from 'mongoose';
const { Schema } = mongoose;

const userS = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['student', 'controller', 'admin'], default: 'student' },
    creator: { type: Boolean, default: false },
    schoolId: { type: Schema.Types.ObjectId, ref: 'School' },
    profileImageUrl: String,
    level : {type: Number ,default : 0},
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', userS);