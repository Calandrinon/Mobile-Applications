package com.ilazar.myapp.auth.data

import com.ilazar.myapp.auth.data.remote.AuthDataSource
import com.ilazar.myapp.core.Api

object AuthRepository {
    var user: User? = null
        private set

    val isLoggedIn: Boolean
        get() = user != null

    init {
        user = null
    }

    fun logout() {
        user = null
        Api.tokenInterceptor.token = null
    }

    suspend fun login(username: String, password: String): Result<TokenHolder> {
        val user = User(username, password)
        val result = AuthDataSource.login(user)
        if (result.isSuccess) {
            setLoggedInUser(user, result.getOrThrow())
        }
        return result
    }

    private fun setLoggedInUser(user: User, tokenHolder: TokenHolder) {
        AuthRepository.user = user
        Api.tokenInterceptor.token = tokenHolder.token
    }
}
