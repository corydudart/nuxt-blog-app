import Vuex from 'vuex'
import axios from 'axios';


const createStore = () => {
    return new Vuex.Store({
        state: {
            loadedPosts: []
        },
        mutations: {
            setPosts(state, posts) {
                state.loadedPosts = posts
            },
            addPost(state, post) {
                state.loadedPosts.push(post)
            },
            editPost(state, editedPost) {
                const postIndex = state.loadedPosts.findIndex(
                    post => post.id === editedPost.id
                  );
                  state.loadedPosts[postIndex] = editedPost
            },
        },
        actions: {
            nuxtServerInit(vuexContext, context) {
                return axios.get('https://nuxt-blog-a8cb7.firebaseio.com/posts.json')
                    .then(res => {
                        const postArray = []
                        for (const key in res.data) {
                            postArray.push({ ...res.data[key], id: key })
                        }

                        vuexContext.commit('setPosts', postArray)
                    })
                    .catch(e => context.error(e))

            },
            setPosts(vuexContext, posts) {
                vuexContext.commit('setPosts', posts)
            },
            addPost(vuexContext, post) {
                const createdPost = { ...post, updatedDate: new Date() }
                return axios.post('https://nuxt-blog-a8cb7.firebaseio.com/posts.json', createdPost)
                    .then(res => {
                        vuexContext.commit('addPost', { ...createdPost, id: res.data.name })
                        this.$router.push('/admin')
                    })
                    .catch(e => console.log(e))
            },
            editPost(vuexContext, editedPost) {
                axios
                    .put('https://nuxt-blog-a8cb7.firebaseio.com/posts/' + 
                    editedPost.id +
                    ".json", editedPost)
                    .then(res => {
                      vuexContext.commit('editPost', editedPost)
                    })
                    .catch(e => console.log(e))
            }
        },
        getters: {
            loadedPosts(state) {
                return state.loadedPosts
            }
        }
    })
}

export default createStore