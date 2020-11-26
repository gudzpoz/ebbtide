/*
    Ebbtide - A frontend for lotide
    Copyright (C) 2020  gudzpoz

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

export default {
  install: (app, options) => {
    var logins = {
      username: null,
      id: null,
      token: null
    }
    var apis = {
      instance: '/instance',
      login: '/logins',
      logins: {
        current: '/logins/~current',
      },
      communities: '/communities',
      community: {
        get: '/communities/{id}',
        posts: '/communities/{id}/posts',
        follow: '/communities/{id}/follow',
        unfollow: '/communities/{id}/unfollow',
      },
      posts: {
        all: '/posts',
        following: '/users/~me/following:posts',
      },
      post: {
        get: '/posts/{id}',
        post: '/posts',
        replies: '/posts/{id}/replies',
        like: '/posts/{id}/your_vote',
        unlike: '/posts/{id}/your_vote',
      },
      media: {
        post: '/media',
      },
      users: '/users',
      user: {
        me: '/users/~me',
        get: '/users/{id}',
      },
      comment: {
        reply: '/comments/{id}/replies',
        like: '/comments/{id}/your_vote',
        unlike: '/comments/{id}/your_vote',
      },
      register: '/users',
      lookup: '/actors:lookup/{id}',
    }
    const apiPath = options.apiPath;
    var authorizeHeaders = (headers) => {
      if(logins.token) {
        headers['Authorization'] = 'Bearer ' + logins.token
        return headers
      } else {
        return headers
      }
    }
    var isLoggedIn = () => { return !!logins.token }
    var getJson = (path, expectedStatus) => {
      return fetch(path, {
        method: 'GET',
        headers: authorizeHeaders({})
      }).then((response) => {
        if(response.status === expectedStatus) {
          return response.json()
        } else {
          return null
        }
      })
    }
    var post = (path, body, expectedStatus) => {
      return fetch(path, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: authorizeHeaders({})
      }).then((response) => {
        if(response.status === expectedStatus) {
          return response
        } else {
          return null
        }
      })
    }
    var uploadImage = (imageFile) => {
      return fetch(getPath(apis.media.post), {
        method: 'POST',
        body: imageFile,
        headers: authorizeHeaders({})
      }).then((response) => {
        if(response.status === 200) {
          return response.json()
        } else {
          return null
        }
      }).then((json) => {
        if(json) {
          return json.id
        } else {
          return null
        }
      })
    }
    var put = (path, expectedStatus) => {
      return fetch(path, {
        method: 'PUT',
        headers: authorizeHeaders({})
      }).then((response) => {
        if(response.status === expectedStatus) {
          return response
        } else {
          return null
        }
      })
    }
    var postDelete = (path, expectedStatus) => {
      return fetch(path, {
        method: 'DELETE',
        headers: authorizeHeaders({})
      }).then((response) => {
        if(response.status === expectedStatus) {
          return response
        } else {
          return null
        }
      })
    }
    var getPath = (api, options) => {
      var interpolation = api
      for(var i in options) {
        interpolation = interpolation.replace('{' + i + '}', options[i])
      }
      return apiPath + interpolation
    }
    var pullLocalStorage = () => {
      logins.username = window.localStorage.getItem('username')
      logins.id = window.localStorage.getItem('id')
      logins.token = window.localStorage.getItem('token')
    }
    var pushLocalStorage = () => {
      if(logins.token) {
        window.localStorage.setItem('username', logins.username)
        window.localStorage.setItem('id', logins.id)
        window.localStorage.setItem('token', logins.token)
      } else {
        window.localStorage.removeItem('username')
        window.localStorage.removeItem('id')
        window.localStorage.removeItem('token')
      }
    }
    var login = (username, password) => {
      return post(getPath(apis.login), {
        username: username,
        password: password,
      }, 200).then((response) => {
        if(response) {
          return response.json()
        } else {
          return null
        }
      }).then((json) => {
        if(json) {
          logins.username = json.user.username
          logins.id = json.user.id
          logins.token = json.token
          pushLocalStorage()
          return true
        } else {
          return false
        }
      })
    }
    var logout = () => {
      return postDelete(getPath(apis.logins.current), 204).then((response) => {
        if(response) {
          logins.username = null
          logins.id = null
          logins.token = null
          pushLocalStorage()
          return true
        } else {
          return false
        }
      })
    }
    var getCommunities = () => {
      return getJson(getPath(apis.communities), 200)
    }
    var getCommunity = (id) => {
      var path = getPath(apis.community.get, { id: id })
      if(isLoggedIn()) {
        path += "?include_your=true"
      }
      return getJson(path, 200)
    }
    var createCommunity = (name) => {
      return post(getPath(apis.communities), {
        name: name
      }, 200).then((response) => {
        if(response) {
          return response.json()
        } else {
          return null
        }
      })
    }
    var followCommunity = (id) => {
      post(getPath(apis.community.follow, { id: id }), {}, 200).then((response) => {
        if(response) {
          return response.json()
        } else {
          return null
        }
      })
    }
    var unfollowCommunity = (id) => {
      post(getPath(apis.community.unfollow, { id: id }), {}, 202).then((response) => {
        if(response) {
          return true
        } else {
          return false
        }
      })
    }
    var getCommunityPosts = (id) => {
      return getJson(getPath(apis.community.posts, { id: id }), 200)
    }
    var getUser = (id) => {
      return getJson(getPath(apis.user.get, { id: id }), 200)
    }
    var getPosts = () => {
      return getJson(getPath(apis.posts.all), 200)
    }
    var getFollowingPosts = () => {
      return getJson(getPath(apis.posts.following), 200)
    }
    var getPost = (id) => {
      var path = getPath(apis.post.get, { id: id })
      if(isLoggedIn()) {
        path += '?include_your=true'
      }
      return getJson(path, 200)
    }
    var replyToPost = (content, id) => {
      return post(getPath(apis.post.replies, { id: id }), {
        content_text: content
      }, 200).then((response) => {
        if(response) {
          return response.json()
        } else {
          return null
        }
      })
    }
    var postPost = (title, text, communityId, markdown, href) => {
      var data = {
        community: communityId,
        title: title,
      }

      if(href) {
        data['href'] = href
      }
      
      if(markdown) {
        data['content_markdown'] = text
      } else {
        data['content_text'] = text
      }
      
      return post(getPath(apis.post.post), data, 200).then((response) => {
        if(response) {
          return response.json()
        } else {
          return null
        }
      })
    }
    var likePost = (id) => {
      return put(getPath(apis.post.like, { id: id }), 204).then((response) => {
        if(response) {
          return true
        } else {
          return false
        }
      })
    }
    var unlikePost = (id) => {
      return postDelete(getPath(apis.post.like, { id: id }), 204).then((response) => {
        if(response) {
          return true
        } else {
          return false
        }
      })
    }
    var likeComment = (id) => {
      return put(getPath(apis.comment.like, { id: id }), 204).then((response) => {
        if(response) {
          return true
        } else {
          return false
        }
      })
    }
    var unlikeComment = (id) => {
      return postDelete(getPath(apis.comment.like, { id: id }), 204).then((response) => {
        if(response) {
          return true
        } else {
          return false
        }
      })
    }
    var replyToComment = (text, commentId, markdown) => {
      if(markdown) {
        return post(getPath(apis.comment.reply, { id: commentId }), {
          content_markdown: text
        }, 200).then((response) => {
          if(response) {
            return response.json()
          } else {
            return null
          }
        })
      } else {
        return post(getPath(apis.comment.reply, { id: commentId }), {
          content_text: text
        }, 200).then((response) => {
          if(response) {
            return response.json()
          } else {
            return null
          }
        })
      }
    }
    var register = (username, password, email) => {
      if(email) {
        return post(getPath(apis.register), {
          username: username,
          password: password,
          email_address: email
        }, 200).then((response) => {
          if(response) {
            return response.json()
          } else {
            return null
          }
        })
      } else {
        return post(getPath(apis.register), {
          username: username,
          password: password
        }, 200).then((response) => {
          if(response) {
            return response.json()
          } else {
            return null
          }
        })
      }
    }
    var lookup = (id) => {
      return getJson(getPath(apis.lookup, { id: id }), 200)
    }
    var getName = (type, id) => {
      if(type === 'community') {
        return getCommunity(id).then((json) => {
          if(json) {
            return json.name + '@' + json.host
          } else {
            return null
          }
        })
      } else if(type === 'user') {
        return getUser(id).then((json) => {
          if(json) {
            return json.username + '@' + json.host
          } else {
            return null
          }
        })
      }
    }
    
    app.config.globalProperties.$lotide = {
      getJson: getJson,
      post: post,
      login: login,
      logout: logout,
      isLoggedIn: isLoggedIn,
      getMe: () => { return logins },
      getPosts: getPosts,
      getFollowingPosts: getFollowingPosts,
      getCommunities: getCommunities,
      getCommunityPosts: getCommunityPosts,
      updateLoginStatus: pullLocalStorage,
      getPost: getPost,
      replyToPost: replyToPost,
      postPost: postPost,
      likePost: likePost,
      unlikePost: unlikePost,
      likeComment: likeComment,
      unlikeComment: unlikeComment,
      replyToComment: replyToComment,
      register: register,
      createCommunity: createCommunity,
      getUser: getUser,
      lookup: lookup,
      getName: getName,
      getCommunity: getCommunity,
      followCommunity: followCommunity,
      unfollowCommunity: unfollowCommunity,
      uploadImage: uploadImage,
    }
  }
}
