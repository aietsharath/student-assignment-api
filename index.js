const fs = require('fs')
const multer = require('multer')
const mongoose = require('mongoose')
const express = require('express')
const bodyParser = require('body-parser')
const schema = require('./model')

const app = express()
const port = 5000

app.use(bodyParser.urlencoded({ extended: true }))

mongoose.connect('mongodb://0.0.0.0:27017/studentAssignment')

let db = mongoose.connection

db.on('error', (err) => {
  console.error('MongoDB connection error:', err)
})

db.once('open', () => {
  console.log('Connected to MongoDB')
})

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname)
  },
})

const upload = multer({ storage: storage })

const Assignment = new mongoose.model('Assignment', schema.userAssignment)

app.post('/upload', upload.single('fieldName'), async (req, res) => {
  const { studentUSN, topicTitle } = req.body

  const filePath = req.file.path

  const fileContent = fs.readFileSync(filePath, 'utf-8')

  const newAssignment = new Assignment({
    studentUSN,
    content: fileContent,
    topicTitle,
  })

  try {
    const savedAssignment = await newAssignment.save()
    console.log('Assignment saved:', savedAssignment)
    res.send('File uploaded and assignment saved successfully')
  } catch (error) {
    console.error('Error saving assignment:', error)
    res.status(500).send('Internal Server Error')
  } finally {
    fs.unlinkSync(filePath)
  }
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
