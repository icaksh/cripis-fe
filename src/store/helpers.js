import { mapState, mapGetters, mapActions } from 'vuex'

export const authComputed = {
    ...mapState('authsStore', {
        currentUser: (state) => state.currentUser,
    }),
    ...mapGetters('authsStore', ['loggedIn']),
}


export const authMethods = mapActions('authStore', ['login', 'logout', 'edit', 'setCommonProfile'])

export const userMethods = mapActions('account', ['setCommonProfile', 'fetchUser', 'createUser', 'updateUser', 'deleteUser'])
export const notificationMethods = mapActions('notification', ['success', 'error', 'clear'])