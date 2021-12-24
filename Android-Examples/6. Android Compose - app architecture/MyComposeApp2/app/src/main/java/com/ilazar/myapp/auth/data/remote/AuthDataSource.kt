package com.ilazar.myapp.auth.data.remote

import com.ilazar.myapp.auth.data.TokenHolder
import com.ilazar.myapp.auth.data.User
import com.ilazar.myapp.core.Api
import retrofit2.http.Body
import retrofit2.http.Headers
import retrofit2.http.POST

object AuthDataSource {
    interface AuthService {
        @Headers("Content-Type: application/json")
        @POST("/api/auth/login")
        suspend fun login(@Body user: User): TokenHolder
    }

    private val authService: AuthService = Api.retrofit.create(AuthService::class.java)

    suspend fun login(user: User): Result<TokenHolder> {
        try {
            return Result.success(authService.login(user))
        } catch (e: Exception) {
            return Result.failure(e)
        }
    }
}

