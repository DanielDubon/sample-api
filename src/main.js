import express from 'express'
import { getAllPosts , createPost, getPostById, updatePost, deletePost} from './db.js'


const app = express()
app.use(express.json())

app.get('/posts', async (req, res) => {
    const posts = await getAllPosts()
    res.json(posts)
})


app.post('/posts', async (req, res) => {
  const { title, content, planet, enemy, urgency } = req.body

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
  const { title, content, planet, enemy, urgency } = req.body 

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


const port = 3000


app.listen(port, () => {
  console.log(`Server listening at http://127.0.0.1:${port}`)
})

