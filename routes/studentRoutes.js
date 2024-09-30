const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const authenticateToken = require('../middleware/auth'); // JWT verification middleware

/// Create a new student
router.post('/', authenticateToken, async (req, res) => {
    const { name, age, course } = req.body;
  
    try {
      const newStudent = new Student({ name, age, course });
      await newStudent.save();
      res.status(201).json({ message: 'Student created successfully', student: newStudent });
    } catch (error) {
      console.error('Error creating student:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Get the list of students
  router.get('/', authenticateToken, async (req, res) => {
    try {
      const students = await Student.find();
      res.json(students);
    } catch (error) {
      console.error('Error fetching students:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Get a single student by ID
  router.get('/:id', authenticateToken, async (req, res) => {
    try {
      const student = await Student.findById(req.params.id);
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }
      res.json(student);
    } catch (error) {
      console.error('Error fetching student:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Update a student by ID
  router.put('/:id', authenticateToken, async (req, res) => {
    const { name, age, course } = req.body;
  
    try {
      const student = await Student.findByIdAndUpdate(
        req.params.id,
        { name, age, course },
        { new: true, runValidators: true }
      );
  
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }
  
      res.json({ message: 'Student updated successfully', student });
    } catch (error) {
      console.error('Error updating student:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Delete a student by ID
  router.delete('/:id', authenticateToken, async (req, res) => {
    try {
      const student = await Student.findByIdAndDelete(req.params.id);
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }
  
      res.json({ message: 'Student deleted successfully' });
    } catch (error) {
      console.error('Error deleting student:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

module.exports = router;
