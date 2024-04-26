import express from 'express'
import fs from 'fs'
import YAML from 'yamljs'
import swaggerUi from 'swagger-ui-express'
import cors from 'cors'
import jwt from 'jsonwebtoken'

import {
  getAllPosts, createPost, getPostById, updatePost, deletePost, login, checkAuth,
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



app.get('/admin/check-auth', async (req, res) => {
  const token = req.headers.authorization.split(' ')[1]; // Obtener el token del encabezado de autorización
  if (!token) {
    // Si no se proporciona un token, el usuario no está autenticado
    return res.status(401).json({ success: false, message: 'Token not provided' });
  }

  // Verificar la autenticación del usuario utilizando la función checkAuth
  const isAuthenticated = await checkAuth(token);
  if (isAuthenticated) {
    // Si el usuario está autenticado, devolver una respuesta exitosa
    return res.status(200).json({ success: true, message: 'User authenticated' });
  } else {
    // Si el token no es válido o ha expirado, el usuario no está autenticado
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }
});



const swaggerDocument = YAML.load('./docs/swagger.yaml')
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.get('/posts', async (req, res) => {
  const posts = await getAllPosts()
  res.json(posts)
})


app.post('/admin/login', async (req, res) => {
  const { username, password } = req.body;

  try {
   
    const loginResult = await login(username, password);

    
    if (loginResult.success) {
      const token = jwt.sign({ username }, 'HellDiversToken', { expiresIn: '1h' });      
      res.json({ success: true, message: 'Inicio de sesión exitoso', token });
    } else {
      res.status(401).json({ success: false, message: 'Credenciales inválidas' });
    }
  } catch (error) {
    console.error('Error en la función de inicio de sesión:', error);
    res.status(500).json({ success: false, message: 'Error en el servidor' });
  }
});


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
