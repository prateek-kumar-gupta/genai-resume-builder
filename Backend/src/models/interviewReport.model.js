const mongoose = require('mongoose');



/**
 * - job description : String
 * - resume text   : String
 *  - self description : String
 * 
 * - matchScore : Number
 * 
 * - Technical Questions  :[
 *     {
 *        question : "",
*          intention : "",
*          answer : "",
*        
*         }
* ]
 *  - Behavioral Questions : [
 *   {
 *        question : "",
*          intention : "",
*          answer : "",
*        
*         }
* ]
 *  -  Skill gaps   : [ {
 *                skill : "",
 *                 severity : {
 *                    type : "String",
 *                    enum : ["low" , "medium" , "high"]
 *                 }
 *               }]
 *  - preparation plan : [ {
 *           day : Number,
 *           focus : String ,
 *            task : [String]
 *  } ]
  */

const technicalQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, "Question is required"]
    },
    intention: {
        type: String,
        required: [true, "Intention is required"]
    },
    answer: {
        type: String,
        required: [true, "Answer is required"]
    }

}, {
    _id: false
})

const behavioralQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, "Question is required"]
    },
    intention: {
        type: String,
        required: [true, "Intention is required"]
    },
    answer: {
        type: String,
        required: [true, "Answer is required"]
    }

}, {
    _id: false
})

const skillGapSchema = new mongoose.Schema({
    skill: {
        type: String,
        required: [true, "Skill is required"]
    },
    severity: {
        type: String,
        enum: ["low", "medium", "high"],
        lowercase: true,
        required: [true, "Severity is required"]
    }
}, {
    _id: false
})

const preparationPlanSchema = new mongoose.Schema({
    day: {
        type: Number,
        required: [true, "Day is required"]
    },
    focus: {
        type: String,
        required: [true, "Focus is required"]
    },
    tasks: [{
        type: String,
        required: [true, "Task is required"]
    }]
}, {
    _id: false
})


const interviewReportSchema = new mongoose.Schema({
    jobDescription: {
        type: String,
        required: [true, "Job description is required"]
    },
    resume: {
        type: String,
    },
    selfDescription: {
        type: String,
    },
    title: {
        type: String,
        required: [true, "Job title is required"]
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    matchScore: {
        type: Number,
        min: 0,
        max: 100,
    },
    technicalQuestions: [technicalQuestionSchema],
    behavioralQuestions: [behavioralQuestionSchema],
    skillGaps: [skillGapSchema],
    preparationPlan: [preparationPlanSchema],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
},
{ 
    timestamps: true
})

const interviewReportModel = mongoose.model("InterviewReport", interviewReportSchema)

module.exports = interviewReportModel;