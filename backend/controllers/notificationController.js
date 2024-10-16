import Notification from "../models/notificationModel.js";

export const getNotifications = async (req,res)=>{
    try{
        const userId = req.user._id;

        const notification = await Notification.find({to : userId}).populate({
            path : "from",
            select : "username profileImg"
        })
        await Notification.updateMany({to :userId}, { read : true});
        res.status(200).json(notification);
    }
    catch(error){
        console.log("error in getnotification functions" , error.message);
        res.status(500).json({error : "internal server error"});
    }
}

export const deleteNotifications = async (req,res)=>{
    try{
        const userId = req.user._id;

        await Notification.deleteMany({to : userId});

        res.status(200).json({message : "Notification deleted successfully"});
        
    }catch(error){
        console.log("error in getnotification functions" , error.message);
        res.status(500).json({error : "internal server error"});
    }
}

// export const deleteNotification = (req,res)=>{
//     try{
//         const notificationId= req.params._id;
//         const userId  = req.user._is;
//         const notification= await Notification.findById(notificationId);

//         if(!notification){
//             return res.json(404).json({error : "Notificatio not found"});
//         }

//         if(notification.to.toString()!== userId.toString()){
//             return res.status(403).json({error : "tou are not allowed to delete this"})
//         }
//         await Notification.findByIdAndDelete(notificationId);
//         res.status(200).json({message : " notification deleted successfully"});

//     }
//     catch(error){
//         console.log("error in getnotification functions" , error.message);
//         res.status(500).json({error : "internal server error"});
//     }
// }