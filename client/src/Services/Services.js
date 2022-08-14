import API from "./API";

export function getSinglePost(id) {
    return API.get('/post/' + id)
}
export function getFeed(offset) {
    return API.get('/post/feed', { params: { offset } })
}
export function getUser(username) {
    return API.get('/user/' + username)
}
export function followUser(id) {
    return API.post(`/user/${id}/follow`)
}
export function likePost(id) {
    return API.post(`/post/${id}/like`)
}
export function createPost(data) {
    return API.post('/post/create', data)
}
export function deletePost(id) {
    return API.delete(`/post/${id}`)
}
export function loginUser(data) {
    return API.post('/auth/login', data)
}
export function signupUser(data) {
    return API.post('/auth/signup', data)
}
export function verifyUser(id, token) {
    return API.post(`/auth/verify/${id}/${token}`)
}
export function getComments(id) {
    // return API.get(`/comment/all`)
    return API.get(`/post/${id}/comments`)
}
export function nestComments(commentList) {
    const commentMap = {};
    commentList.forEach((comment) => (commentMap[comment._id] = comment));
    commentList.forEach((comment) => {
        if (comment.parent !== null) {
            const parent = commentMap[comment.parent];
            (parent.comments = parent.comments || []).push(comment);
        }
    });
    return commentList.filter((comment) => {
        return comment.parent === null;
    });
}