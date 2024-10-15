import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true // corrected from `require` to `required`
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true // corrected from `require` to `required`
    },
    type: {
        type: String, // changed to String for notification type
        required: true // corrected from `require` to `required`
    },
    read: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
