package com.ilazar.myapp2.todo.data.remote

import com.ilazar.myapp2.core.Api
import com.ilazar.myapp2.todo.data.Task
import retrofit2.http.*

object TaskApi {
    interface Service {
        @GET("/api/item")
        suspend fun find(): List<Task>

        @GET("/api/item/{id}")
        suspend fun read(@Path("id") itemId: String): Task;

        @Headers("Content-Type: application/json")
        @POST("/api/item")
        suspend fun create(@Body task: Task): Task

        @Headers("Content-Type: application/json")
        @PUT("/api/item/{id}")
        suspend fun update(@Path("id") itemId: String, @Body task: Task): Task
    }

    val service: Service = Api.retrofit.create(Service::class.java)
}