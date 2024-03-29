import API from "./API";

export function getUsers() {
    return API.get('/admin/users')
}
export function getReports() {
    return API.get('/admin/reports')
}
export function deletePostAdmin(id) {
    return API.delete(`/admin/post/${id}`)
}
export function deleteCommentAdmin(id) {
    return API.delete(`/admin/comment/${id}`)
}
export function banUser(id) {
    return API.post(`/admin/user/${id}/ban`)
}
export function unbanUser(id) {
    return API.post(`/admin/user/${id}/unban`)
}
export function getStats() {
    return API.get('/admin/stats')
}
export function getSinglePost(id) {
    return API.get('/post/' + id)
}
export function getPostByTag(tag) {
    return API.get(`/post/tag/${tag}`)
}
export function getTags() {
    return API.get('/tags')
}
export function getTrandingPosts() {
    return API.get('/post/tranding')
}
export function getFeed(page) {
    return API.get('/post/feed', { params: { page } })
}
export function getUser(username) {
    return API.get(`/user/${username}`)
}
export function getBookmarks() {
    return API.get('/bookmarks/')
}

export function getFollowers(id) {
    return API.get(`/user/${id}/followers`)
}
export function getFollowing(id) {
    return API.get(`/user/${id}/following`)
}
export function bookmarkPost(postId) {
    return API.post(`/post/${postId}/bookmark`)
}
export function getUserPosts(id) {
    return API.get('/user/' + id + '/posts')
}
export function getUserComments(id) {
    return API.get('/user/' + id + '/comments')
}
export function getUserLikes(id) {
    return API.get('/user/' + id + '/likes')
}
export function getNotifications() {
    return API.get('/notifications')
}
export function getNotificationsCount() {
    return API.get('/notifications/count')
}
export function getSearch(q) {
    return API.get(`/search/user?search=${q}`)
}
export function setNotificationsRead() {
    return API.post('/notifications/read')
}
export function followUser(id) {
    return API.post(`/user/${id}/follow`)
}
export function unfollowUser(id) {
    return API.post(`/user/${id}/unfollow`)
}
export function likePost(id) {
    return API.post(`/post/${id}/like`)
}
export function createPost(data) {
    return API.post('/post/create', data, {
        headers: {
            "Content-type": "multipart/form-data",
            'Accept': 'multipart/form-data',
        }
    })
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
export function forgotUser(data) {
    return API.post(`/auth/forgot`, data)
}
export function resetPassworrd(id, token, data) {
    return API.post(`/auth/forgot/verify/${id}/${token}`, data)
}
export function verifyUser(id, token) {
    return API.post(`/auth/verify/${id}/${token}`)
}
export function updateUser(data) {
    return API.patch('/user/profile', data, { headers: { "Content-Type": "multipart/form-data" } })
}
export function createConverstion(data) {
    return API.post('/converstion/create', data)

}
export function createComment(id, data) {
    return API.post(`/post/${id}/comment`, data)
}
export function deleteComment(id) {
    return API.delete(`/comment/${id}/`)
}
export function getComments(id) {
    return API.get(`/post/${id}/comments`)
}
export function getUsername(u) {
    return API.post(`/auth/username/${u}`)
}
export function getEmail(e) {
    return API.post(`/auth/email/${e}`)
}
export function reportPost(post) {
    return API.post(`/post/${post}/report`)
}

export function sortDate(date) {
    let seconds = Math.floor((new Date() - date) / 1000);

    let interval = seconds / 31536000;

    if (interval > 1) {
        return Math.floor(interval) + "y";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
        return Math.floor(interval) + "m";
    }
    interval = seconds / 86400;
    if (interval > 1) {
        return Math.floor(interval) + "d";
    }
    interval = seconds / 3600;
    if (interval > 1) {
        return Math.floor(interval) + "h";
    }
    interval = seconds / 60;
    if (interval > 1) {
        return Math.floor(interval) + "m";
    }
    return Math.floor(seconds) + "s";

}
export function getConverstionName(converstion, _id) {
    if (converstion.users.length !== 2) return "Group";
    return converstion.users.find((u) => u._id !== _id).username;
};
export function getConverstionAvatar(converstion, _id) {
    if (converstion.users.length !== 2) return "Group";
    return converstion.users.find((u) => u._id !== _id).avatar;
};