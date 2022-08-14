module.exports = (error, req,res,next)=>{
    console.log(error);
    return res.status(error.status).json({message: error.message||"Something went wrong"})
}