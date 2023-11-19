const express = require("express");
const Notes = require("../model/notes.model");
const router = express.Router();
// const ErrorHandler = require("../utils/Errorhandler");
const sendMail =require("../utils/mailsender");
const catchAsyncErrors=require("../middleware/AsyncErrors");
const sendToken=require("../utils/sendjwttoken");
const {isAuthenticated} = require("../middleware/authentication.js");

//Post notes
router.post("/create-notes",catchAsyncErrors(async (req, res, next) => {
    try {
        // const { _id } = req.params;
        // const senderid = req.userId;
        const {userId,
      notes,
      link,
      filesattached} = req.body;
      const newnote={ userId,
        notes,
        link,
        filesattached};
        const result = await Createnewnote(newnote);
        if (result._id) {
            res.status(200).json({
                success: true,
                message: "New note Created Successfully.",
              });
        }
        // return next(new ErrorHandler("Unable to create new notes try later.", 400));
        res.status(400).json({
            success: false,
          message: "Unable to create new notes try later.",
        });
      }catch (error) {
        res.json({ status: 500,success:false,message: error.message });
      }
  })
);

const Createnewnote = (newnote) => {
        return new Promise((resolve, reject) => {
            try {
                Notes(newnote)
                .save()
                .then((data) => resolve(data))
                .catch((error) => reject(error));
            } catch (error) {
              reject(error);
            }
          });
     
  };

// Get all Notes for a specific user
router.get("/user-notes/:id", async (req, res) => {
  try {
    // const {userId} = req.body;
    const { id } = req.params;
    console.log(id);
    const result = await getNotes(id);
    return  res.status(200).json({
      success: true,
      result
    });
  } catch (error) {
    // res.json({ status: "error", message: error.message });
    res.json({ status: 500 , success:false , message: error.message });
  }
});

const getNotes = (id) => {
  console.log(id);
  return new Promise((resolve, reject) => {
    try {
      Notes.find({ userId :id})
        .then((data) => resolve(data))
        .catch((error) => reject(error));
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = router;