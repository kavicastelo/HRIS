export interface ActivityModel{
    id?:any,
    userId:any,
    userName:any,
    postId:any,
    posterName:any, // author of the post
    postCaption:any,
    action:any, //like, comment, share
    timestamp:any // activity trigger time
}