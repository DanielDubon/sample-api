import express from 'express'
import fs from 'fs'
import YAML from 'yamljs'
import swaggerUi from 'swagger-ui-express'
import cors from 'cors'

import {
  getAllPosts, createPost, getPostById, updatePost, deletePost,
} from './db.js'

const app = express()
app.use(cors())
app.use(express.json())

app.use((req, res, next) => {
  const oldWrite = res.write
  const oldEnd = res.end
  const chunks = []
  res.write = function write(...args) {
    chunks.push(args[0])
    return oldWrite.apply(res, args)
  }
  res.end = function write(...args) {
    if (args[0]) {
      chunks.push(args[0])
    }
    const body = Buffer.concat(chunks).toString('utf8')
    const logEntry = `${new Date().toISOString()} - ${req.method} ${req.url} - Request Payload: ${JSON.stringify(req.body)} - Response: ${body}\n`
    fs.appendFile('log.txt', logEntry, (err) => {
      if (err) throw err
    })
    oldEnd.apply(res, args)
  }
  next()
})

const swaggerDocument = YAML.load('./docs/swagger.yaml')
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.get('/posts', async (req, res) => {
  const posts = await getAllPosts()
  res.json(posts)
})

app.post('/posts', async (req, res) => {
  const {
    title, content, planet, enemy, urgency,
  } = req.body
  try {
    const result = await createPost(title, content, planet, enemy, urgency)
    if (result.affectedRows && result.affectedRows > 0) {
      res.status(201).json({ message: 'Post created successfully', postId: result.insertId })
    } else {
      res.status(404).json({ message: 'Failed to create post' })
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error while creating post', error: error.message })
  }
})

app.get('/posts/:postId', async (req, res) => {
  const { postId } = req.params
  try {
    const post = await getPostById(postId)
    if (post) {
      res.json(post)
    } else {
      res.status(400).json({ message: 'Post not found' })
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error while retrieving the post', error: error.message })
  }
})

app.put('/posts/:postId', async (req, res) => {
  const { postId } = req.params
  const {
    title, content, planet, enemy, urgency,
  } = req.body
  try {
    const result = await updatePost(postId, title, content, planet, enemy, urgency)
    if (result.affectedRows && result.affectedRows > 0) {
      res.json({ message: 'Post updated successfully' })
    } else {
      res.status(400).json({ message: 'Post not found' })
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error while updating post', error: error.message })
  }
})

app.delete('/posts/:postId', async (req, res) => {
  const { postId } = req.params
  try {
    const result = await deletePost(postId)
    if (result.affectedRows && result.affectedRows > 0) {
      res.json({ message: 'Post deleted successfully' })
    } else {
      res.status(400).json({ message: 'Post not found' })
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error while deleting post', error: error.message })
  }
})

app.use((req, res) => {
  res.status(501).json({ message: 'Not Implemented' })
})

const port = 22233

app.listen(port, () => {
  console.log(`Server listening at http://127.0.0.1:${port}`)
})
