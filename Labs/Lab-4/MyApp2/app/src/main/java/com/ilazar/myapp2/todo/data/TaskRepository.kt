package com.ilazar.myapp2.todo.data

import androidx.lifecycle.LiveData
import com.ilazar.myapp2.core.Result
import com.ilazar.myapp2.todo.data.local.TaskDao
import com.ilazar.myapp2.todo.data.remote.TaskApi

class TaskRepository(private val taskDao: TaskDao) {

    val items = taskDao.getAll()

    suspend fun refresh(): Result<Boolean> {
        try {
            val items = TaskApi.service.find()
            for (item in items) {
                taskDao.insert(item)
            }
            return Result.Success(true)
        } catch(e: Exception) {
            return Result.Error(e)
        }
    }

    fun getById(itemId: String): LiveData<Task> {
        return taskDao.getById(itemId)
    }

    suspend fun save(task: Task): Result<Task> {
        try {
            val createdItem = TaskApi.service.create(task)
            taskDao.insert(createdItem)
            return Result.Success(createdItem)
        } catch(e: Exception) {
            return Result.Error(e)
        }
    }

    suspend fun update(task: Task): Result<Task> {
        try {
            val updatedItem = TaskApi.service.update(task._id, task)
            taskDao.update(updatedItem)
            return Result.Success(updatedItem)
        } catch(e: Exception) {
            return Result.Error(e)
        }
    }
}