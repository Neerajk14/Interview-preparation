 const interviewReportModel = require("../models/interviewReport.model");
const {generateInterviewReport,generateResumePdf} = require("../services/ai.service");
const generateInterviewReportController = async (req, res) => {
  const resumeContent =  req.file?.buffer.toString("base64");
  
  const { selfDescription, jobDescription } = req.body;

  const interviewReportByAi = await generateInterviewReport({
    resume: resumeContent,
    selfDescription,
    jobDescription,
  });

  const interviewReport = await interviewReportModel.create({
    user: req.user.id,
    resume: resumeContent,
    selfDescription,
    jobDescription,
    ...interviewReportByAi,
  });
  res.status(201).json({
    message: "Interview report generated successfully.",
    interviewReport,
  });
};

const getInterviewReportByIdController = async (req, res) => {
  const { interviewId } = req.params;
  const interviewReport = await interviewReportModel.findOne({
    _id: interviewId,
    user: req.user.id,
  });

  if (!interviewReport) {
    return res.status(404).json({
      message: "Interview report not found",
    });
  }
  res.status(200).json({
    message: "Interview report fetched successfully.",
    interviewReport,
  });
};

const getAllInterviewReportsController = async (req, res) => {
  const interviewReports = await interviewReportModel
    .find({ user: req.user.id })
    .sort({ createdAt: -1 })
    .select(
      "-resume -selfDescription -jobDescription -_v -technicalQuestion -behavioralQuestion -skillGaps -preparationPlan",
    );
    return res.status(200).json({
      message:"Interview reports fetched successfully"
      ,interviewReports
    })
};

async function generateResumePdfController(req,res){
  const {interviewReportId} =req.params;

  const interviewReport =await interviewReportModel.findById(interviewReportId)
  if(!interviewReport){
    return res.status(404).json({
      message:"Interview report not found"
    })
  }
  const {resume,jobDescription,selfDescription}=interviewReport
  const pdfBuffer =await generateResumePdf({resume,jobDescription,selfDescription})
res.set({
  "Content-Type":"application/pdf",
  "Content-Desposition":`attachment;filename=resume_${interviewReportId}.pdf`
})
res.send(pdfBuffer)

}

async function deleteReportById(req,res){
  const {reportId} =req.params;
  const deletedReport = await interviewReportModel.findOneAndDelete({ _id: reportId,
  user: req.user.id});
  if(!deletedReport){
   return res.status(401).json({
      message:"Report not deleted"
    })
  } 
  res.status(200).json({
    message:"Deleted Report Successfully",
    deletedReport
  })
 }
module.exports = {
  generateInterviewReportController,
  getInterviewReportByIdController,
  getAllInterviewReportsController,
  generateResumePdfController,
  deleteReportById
};
