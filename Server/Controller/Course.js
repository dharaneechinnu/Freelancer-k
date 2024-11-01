const Course = require('../Model/Course'); // Correct the path to match the actual directory
const userModel = require('../Model/User');
const RequestandApprove = require('../Model/RequestandApprove'); // Import the RequestandApprove schema

// Controller to get all courses
const getCourse = async (req, res) => {
  try {
    const courses = await Course.find({});
    res.status(200).json({
      success: true,
      message: 'Courses fetched successfully!',
      courses: courses,
    });
    console.log("data send");
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({
      success: false,
      message: 'Error fetching courses',
      error: error.message,
    });
  }
};

const RequestCourse = async (req, res) => {
  const { userId,name,mobileno, courseId, Bacthno,courseName } = req.body; // Change to 'batchno' to match the schema

  console.log(userId, courseId,name,mobileno, Bacthno,courseName);  // Log for debugging

  if (!userId || !courseId || !Bacthno || !courseName ||!name ||!mobileno) {  // Use 'batchno' consistently here
    return res.status(400).json({ message: 'User ID, Course ID, and Batch number are required' });
  }

  try {
    // Find the user by studentId (not _id)
    const user = await userModel.findOne({ studentId: userId });

    // Check if the user is found
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the same course has already been requested by this user
    const existingRequest = await RequestandApprove.findOne({ studentId: userId, courseId });

    if (existingRequest) {
      return res.status(400).json({ message: 'You have already requested this course.' });
    }

    // Store the course request in the RequestandApprove schema
    const newRequest = new RequestandApprove({
      studentId: userId,
      courseId,
      name,
      mobileno,
      courseName,
      Bacthno,  // Use 'batchno' here to match the schema
      approve: false, // Course is not approved initially
      transactionDate: Date.now() // Current date/time for the request
    });

    // Save the new request to the database
    await newRequest.save();

    return res.status(200).json({ message: 'Course request sent to admin' });
  } catch (error) {
    console.error('Error in request-course endpoint:', error);
    return res.status(500).json({ message: 'Error requesting course', error });
  }
};


// Assuming you are using Express.js for the API
const getUnlockedCourses = async (req, res) => {
  const { userId } = req.params; // userId passed in the request params

  try {
    // Find all approved requests for this user
    const approvedCourses = await RequestandApprove.find({ studentId: userId, approve: true });

    // Extract the approved course IDs
    const unlockedCourses = approvedCourses.map(request => ({
      courseId: request.courseId,    // Assuming courseId is an ObjectId
      courseName: request.courseName, // Assuming Course schema has courseName field
    }));
console.log(unlockedCourses)
    res.status(200).json({unlockedCourses}); // Return an array of unlocked course IDs
  } catch (error) {
    console.error('Error fetching unlocked courses', error);
    res.status(500).json({ message: 'Error fetching unlocked courses' });
  }
};



// Controller to deny a course request
const denyCourseRequest = async (req, res) => {
  const { courseId, userId } = req.body;

  try {
    // Find the course request
    const request = await RequestandApprove.findOne({ courseId, studentId: userId });

    if (!request) {
      return res.status(404).json({ message: 'Course request not found' });
    }

    // Remove the course request from the database (or you could update a 'denied' status if preferred)
    await RequestandApprove.deleteOne({ _id: request._id });

    res.status(200).json({ message: 'Course request denied successfully' });
  } catch (error) {
    console.error('Error denying course request:', error);
    res.status(500).json({ message: 'Error denying course request', error });
  }
};

const getEnrolled = async (req, res) => {
  const { studentId } = req.params;
  console.log("student enrooled id : ",studentId);
  try {
    // Fetch all courses where the student is enrolled
    const enrolledCourses = await RequestandApprove.find({ studentId: studentId });

    // Extract the relevant course information, including `approvedAt`
    const enrolledCoursesWithApprovedAt = enrolledCourses.map(course => ({
      courseId: course.courseId,           // Assuming there's a courseId field
      courseName: course.courseName,       // Assuming there's a courseName field
      approvedAt: course.approvedAt,       // Extract the approvedAt field
 
    }));

    console.log("Enrolled Data with approvedAt: ", enrolledCoursesWithApprovedAt);
    
    // Send the response with the extracted course data
    res.status(200).json(enrolledCoursesWithApprovedAt);
  } catch (error) {
    console.error('Error fetching enrolled courses', error);
    res.status(500).json({ message: 'Error fetching enrolled courses' });
  }
};

const getCompletedCourses = async (req, res) => {
  const { studentId } = req.params;

  try {
   
    const completedCourses = await RequestandApprove.find({ studentId, COurseComplete: true });

    if (!completedCourses.length) {
      return res.status(404).json({ message: 'No completed courses found' });
    }

    res.status(200).json({
      completedCourses,
    });
  } catch (error) {
    console.error('Error fetching completed courses:', error);
    res.status(500).json({ message: 'Error fetching completed courses' });
  }
};


// Export the controller functions
module.exports = {
  getCourse,
  getUnlockedCourses,
  RequestCourse,
  denyCourseRequest,
  getEnrolled,
  getCompletedCourses
};
