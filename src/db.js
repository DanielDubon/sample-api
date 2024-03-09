import conn from './conn.js'

export async function getAllPosts() {
 const [rows] = await conn.query('SELECT * FROM blog_posts')
 return rows
}


export async function createPost(title, content, planet, enemy,urgency) {
    const [result] = await conn.query('INSERT INTO blog_posts (title, content, planet, enemy, urgency) VALUES (?, ? , ? , ? ,?)', [title, content, planet, enemy, urgency])
    return result
 }


 export async function getPostById(postId) {
    const [rows] = await conn.query('SELECT * FROM blog_posts WHERE id = ?', [postId]);
    if (rows.length > 0) {
        return rows[0];
    } else {
        return null;
    }
}



export async function updatePost(id, title, content, planet, enemy, urgency) {
    const [result] = await conn.query('UPDATE blog_posts SET title = ?, content = ?, planet = ?, enemy = ?, urgency = ? WHERE id = ?', [title, content, planet, enemy, urgency, id]);
    return result;
}


export async function deletePost(id) {
    const [result] = await conn.query('DELETE FROM blog_posts WHERE id = ?', [id]);
    return result;
}